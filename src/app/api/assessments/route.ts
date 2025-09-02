import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { agents } from '@/lib/ai/agents';
import { 
  CreateAssessmentRequestSchema, 
  GetAssessmentRequestSchema,
  CreateAssessmentResponseSchema,
  AssessmentListResponseSchema
} from './schema';
import { ErrorResponseSchema } from '../auth/schema';
import { AppError, handleError } from '@/utils';

// POST /api/assessments - Create new assessment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateAssessmentRequestSchema.parse(body);
    
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('tier2_users')
      .select('industry, company_size, revenue_range')
      .eq('id', user.id)
      .single();

    // Store raw assessment data
    const { data: assessment, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .insert({
        user_id: user.id,
        type: validatedData.type,
        payload_json: validatedData.responses,
        status: 'completed'
      })
      .select()
      .single();

    if (assessmentError) {
      throw new AppError('Failed to save assessment', 'ASSESSMENT_SAVE_FAILED', 500);
    }

    // Process assessment with enhanced AI agent using new router
    const aiResult = await agents.processAssessmentEnhanced(
      validatedData.responses,
      validatedData.type,
      user.id,
      userProfile?.industry || 'Technology',
      {
        useRAG: true,
        useMultiProvider: true,
        includeMarketContext: true
      }
    );

    if (!aiResult.success) {
      console.error('AI processing failed:', aiResult.errors);
      // Continue with basic scoring if AI fails
    }

    // Update assessment with score
    const score = aiResult.success ? aiResult.data.overallScore : 0;
    await supabase
      .from('onboarding_assessments')
      .update({
        score,
        breakdown: aiResult.success ? aiResult.data.breakdown : null,
        completed_at: new Date().toISOString()
      })
      .eq('id', assessment.id);

    // Update user profile scores
    if (aiResult.success) {
      await supabase
        .from('tier2_profiles')
        .upsert({
          user_id: user.id,
          score_overall: aiResult.data.overallScore,
          score_strategy: aiResult.data.strategyScore,
          score_process: aiResult.data.processScore,
          score_technology: aiResult.data.technologyScore,
          updated_at: new Date().toISOString()
        });

      // Create dashboard insights
      await supabase
        .from('tier2_dashboard_insights')
        .insert({
          user_id: user.id,
          score: aiResult.data.overallScore,
          strategy: aiResult.data.strategyScore,
          process: aiResult.data.processScore,
          technology: aiResult.data.technologyScore,
          roadmap: aiResult.data.roadmap || [],
          benchmarks: aiResult.data.benchmarks || []
        });
    }

    const response = CreateAssessmentResponseSchema.parse({
      success: true,
      data: {
        id: assessment.id,
        type: assessment.type,
        status: 'completed',
        score: score,
        breakdown: aiResult.success ? aiResult.data.breakdown : undefined,
        roadmap: aiResult.success ? aiResult.data.roadmap : undefined,
        benchmarks: aiResult.success ? aiResult.data.benchmarks : undefined,
        createdAt: assessment.created_at,
        completedAt: new Date().toISOString()
      },
      message: 'Assessment completed successfully'
    });

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Create assessment error:', error);
    
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
        message: 'Failed to create assessment',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}

// GET /api/assessments - Get user assessments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      type: searchParams.get('type') || undefined,
      limit: parseInt(searchParams.get('limit') || '10'),
      offset: parseInt(searchParams.get('offset') || '0')
    };

    // Validate query parameters
    const validatedParams = GetAssessmentRequestSchema.parse(queryParams);
    
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Build query
    let query = supabase
      .from('onboarding_assessments')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(validatedParams.offset, validatedParams.offset + validatedParams.limit - 1);

    if (validatedParams.type) {
      query = query.eq('type', validatedParams.type);
    }

    const { data: assessments, error: fetchError, count } = await query;

    if (fetchError) {
      throw new AppError('Failed to fetch assessments', 'ASSESSMENTS_FETCH_FAILED', 500);
    }

    const formattedAssessments = (assessments || []).map(assessment => ({
      id: assessment.id,
      type: assessment.type,
      status: assessment.status,
      score: assessment.score,
      breakdown: assessment.breakdown,
      createdAt: assessment.created_at,
      completedAt: assessment.completed_at
    }));

    const totalPages = Math.ceil((count || 0) / validatedParams.limit);

    const response = AssessmentListResponseSchema.parse({
      success: true,
      data: formattedAssessments,
      pagination: {
        page: Math.floor(validatedParams.offset / validatedParams.limit) + 1,
        limit: validatedParams.limit,
        total: count || 0,
        totalPages
      }
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Get assessments error:', error);
    
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
        message: 'Failed to fetch assessments',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
