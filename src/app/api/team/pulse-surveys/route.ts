/**
 * Pulse Survey API
 * Provides team pulse survey creation, distribution, and response collection
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

// Request schemas
const CreatePulseSurveySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  questions: z.array(z.object({
    id: z.string().uuid().optional(),
    text: z.string().min(1).max(500),
    type: z.enum(['multiple_choice', 'rating', 'text', 'yes_no', 'scale']),
    options: z.array(z.string()).optional(),
    required: z.boolean().default(false),
    category: z.enum(['engagement', 'culture', 'performance', 'communication', 'wellbeing']).optional()
  })).min(1).max(20),
  settings: z.object({
    anonymous: z.boolean().default(true),
    allowMultipleResponses: z.boolean().default(false),
    responseDeadline: z.string().datetime().optional(),
    reminderFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    autoClose: z.boolean().default(true),
    closeAfterDays: z.number().finite().min(1).max(90).optional()
  }).optional(),
  targetAudience: z.object({
    allMembers: z.boolean().default(true),
    specificRoles: z.array(z.string()).optional(),
    specificDepartments: z.array(z.string()).optional(),
    specificMembers: z.array(z.string().uuid()).optional()
  }).optional()
});

const SubmitPulseResponseSchema = z.object({
  surveyId: z.string().uuid(),
  responses: z.array(z.object({
    questionId: z.string().uuid(),
    answer: z.union([z.string(), z.number().finite(), z.boolean(), z.array(z.string())]),
    confidence: z.number().finite().min(1).max(5).optional(),
    additionalComments: z.string().optional()
  })),
  metadata: z.object({
    completionTime: z.number().finite().optional(),
    deviceType: z.string().optional(),
    location: z.string().optional()
  }).optional()
});

// Response schemas
const PulseSurveyResponseSchema = z.object({
  success: z.boolean(),
  survey: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['draft', 'active', 'paused', 'closed']),
    createdAt: z.string(),
    updatedAt: z.string(),
    responseCount: z.number().finite(),
    completionRate: z.number().finite(),
    averageScore: z.number().finite().optional(),
    questions: z.array(z.object({
      id: z.string(),
      text: z.string(),
      type: z.string(),
      options: z.array(z.string()).optional(),
      required: z.boolean(),
      category: z.string().optional(),
      responseCount: z.number().finite(),
      averageScore: z.number().finite().optional()
    })),
    settings: z.object({
      anonymous: z.boolean(),
      allowMultipleResponses: z.boolean(),
      responseDeadline: z.string().optional(),
      reminderFrequency: z.string().optional(),
      autoClose: z.boolean(),
      closeAfterDays: z.number().finite().optional()
    }).optional(),
    targetAudience: z.object({
      allMembers: z.boolean(),
      specificRoles: z.array(z.string()).optional(),
      specificDepartments: z.array(z.string()).optional(),
      specificMembers: z.array(z.string()).optional()
    }).optional()
  }).optional(),
  message: z.string().optional()
});

const PulseSurveyListResponseSchema = z.object({
  success: z.boolean(),
  surveys: z.array(z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    createdAt: z.string(),
    responseCount: z.number().finite(),
    completionRate: z.number().finite(),
    averageScore: z.number().finite().optional()
  })),
  pagination: z.object({
    page: z.number().finite(),
    limit: z.number().finite(),
    total: z.number().finite(),
    totalPages: z.number().finite()
  }).optional(),
  message: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreatePulseSurveySchema.parse(body);

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

    // Get user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Create pulse survey
    const { data: survey, error: surveyError } = await supabase
      .from('pulse_topics')
      .insert({
        organization_id: userProfile.organization_id,
        title: validatedData.title,
        description: validatedData.description,
        status: 'active',
        settings: validatedData.settings || {},
        target_audience: validatedData.targetAudience || { allMembers: true },
        created_by: user.id
      })
      .select()
      .single();

    if (surveyError) {
      console.error('Failed to create pulse survey:', surveyError);
      return NextResponse.json(
        { success: false, message: 'Failed to create pulse survey' },
        { status: 500 }
      );
    }

    // Create questions
    const questions = validatedData.questions.map(q => ({
      pulse_topic_id: survey.id,
      text: q.text,
      type: q.type,
      options: q.options || [],
      required: q.required,
      category: q.category,
      order_index: validatedData.questions.indexOf(q)
    }));

    const { data: createdQuestions, error: questionsError } = await supabase
      .from('pulse_questions')
      .insert(questions)
      .select();

    if (questionsError) {
      console.error('Failed to create pulse questions:', questionsError);
      return NextResponse.json(
        { success: false, message: 'Failed to create survey questions' },
        { status: 500 }
      );
    }

    // Send invitations if target audience is specified
    if (validatedData.targetAudience && !validatedData.targetAudience.allMembers) {
      await sendPulseInvitations(survey.id, validatedData.targetAudience, userProfile.organization_id);
    }

    const response = PulseSurveyResponseSchema.parse({
      success: true,
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        status: survey.status,
        createdAt: survey.created_at,
        updatedAt: survey.updated_at,
        responseCount: 0,
        completionRate: 0,
        questions: createdQuestions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options,
          required: q.required,
          category: q.category,
          responseCount: 0,
          averageScore: undefined
        })),
        settings: survey.settings,
        targetAudience: survey.target_audience
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation error',
          errors: error.errors
        },
        { status: 400 }
      );
    }

    console.error('Create pulse survey error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create pulse survey' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');

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

    // Get user's organization
    const { data: userProfile, error: profileError } = await supabase
      .from('tier2_profiles')
      .select('organization_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found' },
        { status: 404 }
      );
    }

    // Build query
    let query = supabase
      .from('pulse_topics')
      .select(`
        id,
        title,
        status,
        created_at,
        updated_at,
        pulse_questions(id),
        pulse_responses(id)
      `)
      .eq('organization_id', userProfile.organization_id);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('pulse_topics')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', userProfile.organization_id);

    if (countError) {
      console.error('Failed to get survey count:', countError);
      return NextResponse.json(
        { success: false, message: 'Failed to get survey count' },
        { status: 500 }
      );
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);
    query = query.order('created_at', { ascending: false });

    // Execute query
    const { data: surveys, error: surveyError } = await query;

    if (surveyError) {
      console.error('Failed to fetch pulse surveys:', surveyError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch pulse surveys' },
        { status: 500 }
      );
    }

    // Process survey data
    const processedSurveys = surveys.map(survey => {
      const questionCount = survey.pulse_questions?.length || 0;
      const responseCount = survey.pulse_responses?.length || 0;
      
      // Calculate completion rate (mock calculation)
      const targetMembers = 50; // Mock target audience size
      const completionRate = targetMembers > 0 ? (responseCount / targetMembers) * 100 : 0;
      
      // Calculate average score (mock calculation)
      const averageScore = responseCount > 0 ? 7.5 + Math.random() * 2 : undefined;

      return {
        id: survey.id,
        title: survey.title,
        status: survey.status,
        createdAt: survey.created_at,
        responseCount,
        completionRate: Math.round(completionRate * 10) / 10,
        averageScore: averageScore ? Math.round(averageScore * 10) / 10 : undefined
      };
    });

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const response = PulseSurveyListResponseSchema.parse({
      success: true,
      surveys: processedSurveys,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Get pulse surveys error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch pulse surveys' },
      { status: 500 }
    );
  }
}

// Helper function to send pulse invitations
async function sendPulseInvitations(surveyId: string, targetAudience: any, organizationId: string) {
  try {
    // Build query to get target members
    let memberQuery = supabase
      .from('tier2_profiles')
      .select('user_id, email, first_name, last_name')
      .eq('organization_id', organizationId);

    if (targetAudience.specificRoles && targetAudience.specificRoles.length > 0) {
      memberQuery = memberQuery.in('role', targetAudience.specificRoles);
    }

    if (targetAudience.specificDepartments && targetAudience.specificDepartments.length > 0) {
      memberQuery = memberQuery.in('department', targetAudience.specificDepartments);
    }

    const { data: members, error: memberError } = await memberQuery;

    if (memberError || !members) {
      console.error('Failed to fetch target members:', memberError);
      return;
    }

    // Create invitations
    const invitations = members.map(member => ({
      pulse_topic_id: surveyId,
      user_id: member.user_id,
      email: member.email,
      status: 'pending',
      sent_at: new Date().toISOString()
    }));

    const { error: inviteError } = await supabase
      .from('pulse_invites')
      .insert(invitations);

    if (inviteError) {
      console.error('Failed to create pulse invitations:', inviteError);
    }

    // TODO: Send actual email invitations
    console.log(`Created ${invitations.length} pulse survey invitations`);

  } catch (error) {
    console.error('Error sending pulse invitations:', error);
  }
}
