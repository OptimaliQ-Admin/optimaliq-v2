/**
 * User search and filtering API
 * Provides advanced search capabilities for team members and users
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schema for search parameters
const UserSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  organizationId: z.string().uuid().optional(),
  role: z.enum(['Owner', 'Admin', 'Manager', 'Member', 'Viewer']).optional(),
  department: z.string().max(50).optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().max(100).optional(),
  joinedAfter: z.string().datetime().optional(),
  joinedBefore: z.string().datetime().optional(),
  lastActiveAfter: z.string().datetime().optional(),
  lastActiveBefore: z.string().datetime().optional(),
  sortBy: z.enum(['name', 'email', 'role', 'department', 'joinedDate', 'lastActive']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// Response schema
const UserSearchResponseSchema = z.object({
  success: z.boolean(),
  users: z.array(z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string(),
    role: z.string(),
    department: z.string().optional(),
    status: z.string(),
    avatarUrl: z.string().optional(),
    location: z.string().optional(),
    skills: z.array(z.string()).optional(),
    joinedDate: z.string(),
    lastActive: z.string().optional(),
    organizationName: z.string().optional(),
    assessmentCount: z.number(),
    averageScore: z.number().optional()
  })),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean()
  }),
  filters: z.object({
    availableRoles: z.array(z.string()),
    availableDepartments: z.array(z.string()),
    availableSkills: z.array(z.string()),
    availableLocations: z.array(z.string())
  }).optional(),
  message: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);
    
    // Parse arrays from query params
    if (queryParams.skills && typeof queryParams.skills === 'string') {
      queryParams.skills = queryParams.skills.split(',');
    }

    const validatedParams = UserSearchSchema.parse(queryParams);

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Invalid authentication' },
        { status: 401 }
      );
    }

    // Get user's organization access
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Build base query
    let query = supabase
      .from('tier2_profiles')
      .select(`
        user_id,
        first_name,
        last_name,
        role,
        department,
        location,
        skills,
        created_at,
        updated_at,
        tier2_users!inner(
          id,
          email,
          email_confirmed_at,
          last_sign_in_at
        ),
        organizations!inner(
          id,
          name
        )
      `);

    // Apply organization filter (users can only search within their org unless they're super admin)
    const searchOrgId = validatedParams.organizationId || userProfile.organization_id;
    query = query.eq('organization_id', searchOrgId);

    // Apply text search filter
    if (validatedParams.query) {
      query = query.or(`first_name.ilike.%${validatedParams.query}%,last_name.ilike.%${validatedParams.query}%,tier2_users.email.ilike.%${validatedParams.query}%`);
    }

    // Apply role filter
    if (validatedParams.role) {
      query = query.eq('role', validatedParams.role);
    }

    // Apply department filter
    if (validatedParams.department) {
      query = query.eq('department', validatedParams.department);
    }

    // Apply date filters
    if (validatedParams.joinedAfter) {
      query = query.gte('created_at', validatedParams.joinedAfter);
    }
    if (validatedParams.joinedBefore) {
      query = query.lte('created_at', validatedParams.joinedBefore);
    }

    // Apply last active filters
    if (validatedParams.lastActiveAfter) {
      query = query.gte('tier2_users.last_sign_in_at', validatedParams.lastActiveAfter);
    }
    if (validatedParams.lastActiveBefore) {
      query = query.lte('tier2_users.last_sign_in_at', validatedParams.lastActiveBefore);
    }

    // Apply skills filter (array contains)
    if (validatedParams.skills && validatedParams.skills.length > 0) {
      query = query.contains('skills', validatedParams.skills);
    }

    // Apply location filter
    if (validatedParams.location) {
      query = query.ilike('location', `%${validatedParams.location}%`);
    }

    // Apply sorting
    let orderColumn = validatedParams.sortBy;
    if (orderColumn === 'name') {
      orderColumn = 'first_name';
    } else if (orderColumn === 'email') {
      orderColumn = 'tier2_users.email';
    } else if (orderColumn === 'joinedDate') {
      orderColumn = 'created_at';
    } else if (orderColumn === 'lastActive') {
      orderColumn = 'tier2_users.last_sign_in_at';
    }

    query = query.order(orderColumn, { ascending: validatedParams.sortOrder === 'asc' });

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('tier2_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', searchOrgId);

    if (countError) {
      console.error('Failed to get user count:', countError);
      return NextResponse.json(
        { success: false, message: 'Failed to get user count' },
        { status: 500 }
      );
    }

    // Apply pagination
    const offset = (validatedParams.page - 1) * validatedParams.limit;
    query = query.range(offset, offset + validatedParams.limit - 1);

    // Execute query
    const { data: users, error: searchError } = await query;

    if (searchError) {
      console.error('User search error:', searchError);
      return NextResponse.json(
        { success: false, message: 'Search failed' },
        { status: 500 }
      );
    }

    // Get assessment counts for each user
    const userIds = users.map(u => u.user_id);
    const { data: assessmentCounts } = await supabase
      .from('onboarding_assessments')
      .select('user_id, score')
      .in('user_id', userIds);

    // Process results
    const processedUsers = users.map(profile => {
      const userAssessments = assessmentCounts?.filter(a => a.user_id === profile.user_id) || [];
      const averageScore = userAssessments.length > 0 
        ? userAssessments.reduce((sum, a) => sum + (a.score || 0), 0) / userAssessments.length 
        : undefined;

      // Determine status
      let status = 'active';
      if (!profile.tier2_users.email_confirmed_at) {
        status = 'pending';
      } else if (!profile.tier2_users.last_sign_in_at || 
                 new Date(profile.tier2_users.last_sign_in_at) < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
        status = 'inactive';
      }

      return {
        id: profile.user_id,
        email: profile.tier2_users.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        fullName: `${profile.first_name} ${profile.last_name}`,
        role: profile.role,
        department: profile.department,
        status,
        location: profile.location,
        skills: profile.skills || [],
        joinedDate: profile.created_at,
        lastActive: profile.tier2_users.last_sign_in_at,
        organizationName: profile.organizations.name,
        assessmentCount: userAssessments.length,
        averageScore: averageScore ? Math.round(averageScore * 10) / 10 : undefined
      };
    });

    // Calculate pagination
    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / validatedParams.limit);
    const hasNext = validatedParams.page < totalPages;
    const hasPrevious = validatedParams.page > 1;

    // Get filter options (if requested)
    let filters;
    if (searchParams.get('includeFilters') === 'true') {
      const { data: filterData } = await supabase
        .from('tier2_profiles')
        .select('role, department, location, skills')
        .eq('organization_id', searchOrgId);

      const roles = [...new Set(filterData?.map(p => p.role).filter(Boolean) || [])];
      const departments = [...new Set(filterData?.map(p => p.department).filter(Boolean) || [])];
      const locations = [...new Set(filterData?.map(p => p.location).filter(Boolean) || [])];
      const skills = [...new Set(filterData?.flatMap(p => p.skills || []) || [])];

      filters = {
        availableRoles: roles,
        availableDepartments: departments,
        availableLocations: locations,
        availableSkills: skills
      };
    }

    const response = UserSearchResponseSchema.parse({
      success: true,
      users: processedUsers,
      pagination: {
        page: validatedParams.page,
        limit: validatedParams.limit,
        total: totalCount,
        totalPages,
        hasNext,
        hasPrevious
      },
      filters
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid search parameters',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('User search error:', error);
    return NextResponse.json(
      { success: false, message: 'Search failed' },
      { status: 500 }
    );
  }
}
