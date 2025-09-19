import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { ErrorResponseSchema } from '../../auth/schema';
import { AppError, handleError } from '@/utils';

// Team member schemas
const AddTeamMemberRequestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  department: z.string().min(1, 'Department is required'),
  title: z.string().min(1, 'Title is required'),
  role: z.enum(['owner', 'admin', 'manager', 'member', 'viewer']).default('member')
});

const TeamMemberSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  department: z.string(),
  title: z.string(),
  role: z.string(),
  isActive: z.boolean(),
  invitedAt: z.string(),
  joinedAt: z.string().optional()
});

const TeamMembersResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(TeamMemberSchema),
  metadata: z.object({
    totalMembers: z.number().finite(),
    activeMembers: z.number().finite(),
    departmentBreakdown: z.record(z.number().finite()),
    roleBreakdown: z.record(z.number().finite())
  }),
  message: z.string().optional()
});

// GET /api/team/members - Get team members
export async function GET(_request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get user's organization
    const { data: userProfile } = await supabase
      .from('tier2_users')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    if (!userProfile?.organization_id) {
      // User doesn't have an organization yet - return empty team
      return NextResponse.json(TeamMembersResponseSchema.parse({
        success: true,
        data: [],
        metadata: {
          totalMembers: 0,
          activeMembers: 0,
          departmentBreakdown: {},
          roleBreakdown: {}
        },
        message: 'No organization found. Create your organization to manage team members.'
      }), { status: 200 });
    }

    // Get team members
    const { data: teamMembers, error: membersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', userProfile.organization_id)
      .order('created_at', { ascending: true });

    if (membersError) {
      throw new AppError('Failed to fetch team members', 'TEAM_FETCH_FAILED', 500);
    }

    const formattedMembers = (teamMembers || []).map(member => ({
      id: member.id,
      firstName: member.first_name,
      lastName: member.last_name,
      email: member.email,
      department: member.department,
      title: member.title,
      role: member.role,
      isActive: member.is_active,
      invitedAt: member.invited_at,
      joinedAt: member.joined_at
    }));

    // Calculate metadata
    const activeMembers = formattedMembers.filter(m => m.isActive);
    const departmentBreakdown = formattedMembers.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roleBreakdown = formattedMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const response = TeamMembersResponseSchema.parse({
      success: true,
      data: formattedMembers,
      metadata: {
        totalMembers: formattedMembers.length,
        activeMembers: activeMembers.length,
        departmentBreakdown,
        roleBreakdown
      }
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Get team members error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to fetch team members',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}

// POST /api/team/members - Add team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = AddTeamMemberRequestSchema.parse(body);
    
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get or create user's organization
    let { data: userProfile } = await supabase
      .from('tier2_users')
      .select('organization_id, company, industry')
      .eq('id', user.id)
      .single();

    let organizationId = userProfile?.organization_id;

    // Create organization if it doesn't exist
    if (!organizationId && userProfile) {
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: userProfile.company || 'My Organization',
          industry: userProfile.industry || 'Technology'
        })
        .select()
        .single();

      if (orgError) {
        throw new AppError('Failed to create organization', 'ORG_CREATION_FAILED', 500);
      }

      organizationId = newOrg.id;

      // Update user with organization ID
      await supabase
        .from('tier2_users')
        .update({ organization_id: organizationId })
        .eq('id', user.id);
    }

    if (!organizationId) {
      throw new AppError('Organization setup failed', 'ORG_SETUP_FAILED', 500);
    }

    // Check if email already exists in organization
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('organization_id', organizationId)
      .eq('email', validatedData.email)
      .single();

    if (existingMember) {
      throw new AppError('Team member with this email already exists', 'MEMBER_EXISTS', 409);
    }

    // Add team member
    const { data: newMember, error: memberError } = await supabase
      .from('team_members')
      .insert({
        organization_id: organizationId,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        department: validatedData.department,
        title: validatedData.title,
        role: validatedData.role
      })
      .select()
      .single();

    if (memberError) {
      throw new AppError('Failed to add team member', 'MEMBER_ADD_FAILED', 500);
    }

    // TODO: Send invitation email
    // await sendInvitationEmail(newMember);

    const response = {
      success: true,
      data: {
        id: newMember.id,
        firstName: newMember.first_name,
        lastName: newMember.last_name,
        email: newMember.email,
        department: newMember.department,
        title: newMember.title,
        role: newMember.role,
        isActive: newMember.is_active,
        invitedAt: newMember.invited_at,
        joinedAt: newMember.joined_at
      },
      message: 'Team member added successfully'
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Add team member error:', error);
    
    const handledError = handleError(error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        ErrorResponseSchema.parse({
          success: false,
          error: 'Validation failed',
          message: error.errors.map(e => e.message).join(', '),
          code: 'VALIDATION_ERROR',
          details: error.errors,
          timestamp: new Date().toISOString()
        }),
        { status: 400 }
      );
    }

    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to add team member',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
