import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AssessmentAgent } from '@/lib/ai/agents/assessment-agent';
import { z } from 'zod';

const scoringRequestSchema = z.object({
  assessmentId: z.string().uuid(),
  responses: z.record(z.any()),
  userId: z.string().uuid(),
  assessmentType: z.enum(['onboarding', 'bpm', 'sales_performance']).optional()
});

const scoringResponseSchema = z.object({
  score: z.number().finite().min(0).max(100),
  categoryScores: z.record(z.number().finite().min(0).max(100)),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  nextSteps: z.array(z.string()),
  benchmarkComparison: z.object({
    industry: z.string(),
    percentile: z.number().finite().min(0).max(100),
    averageScore: z.number().finite()
  }).optional()
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = scoringRequestSchema.parse(body);

    // Verify user owns the assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from('onboarding_assessments')
      .select('*')
      .eq('id', validatedData.assessmentId)
      .eq('user_id', validatedData.userId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Initialize Assessment Agent
    const assessmentAgent = new AssessmentAgent();
    
    // Process assessment scoring
    const scoringResult = await assessmentAgent.processAssessment({
      assessmentId: validatedData.assessmentId,
      responses: validatedData.responses,
      assessmentType: validatedData.assessmentType || 'onboarding',
      userId: validatedData.userId
    });

    // Validate the response
    const validatedResponse = scoringResponseSchema.parse(scoringResult);

    // Update assessment with scoring results
    const { error: updateError } = await supabase
      .from('onboarding_assessments')
      .update({
        score: validatedResponse.score,
        category_scores: validatedResponse.categoryScores,
        insights: validatedResponse.insights,
        recommendations: validatedResponse.recommendations,
        next_steps: validatedResponse.nextSteps,
        benchmark_comparison: validatedResponse.benchmarkComparison,
        completed_at: new Date().toISOString(),
        status: 'completed'
      })
      .eq('id', validatedData.assessmentId);

    if (updateError) {
      console.error('Error updating assessment:', updateError);
      return NextResponse.json({ error: 'Failed to update assessment' }, { status: 500 });
    }

    // Create dashboard insights entry
    const { error: insightError } = await supabase
      .from('tier2_dashboard_insights')
      .insert({
        user_id: validatedData.userId,
        insight_type: 'assessment_score',
        insight_data: {
          assessmentId: validatedData.assessmentId,
          score: validatedResponse.score,
          categoryScores: validatedResponse.categoryScores,
          insights: validatedResponse.insights,
          recommendations: validatedResponse.recommendations
        },
        created_at: new Date().toISOString()
      });

    if (insightError) {
      console.error('Error creating insight:', insightError);
    }

    return NextResponse.json(validatedResponse);

  } catch (error) {
    console.error('Assessment scoring error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');

    if (!assessmentId) {
      return NextResponse.json({ error: 'Assessment ID required' }, { status: 400 });
    }

    // Get assessment scoring results
    const { data: assessment, error } = await supabase
      .from('onboarding_assessments')
      .select(`
        id,
        score,
        category_scores,
        insights,
        recommendations,
        next_steps,
        benchmark_comparison,
        completed_at,
        status
      `)
      .eq('id', assessmentId)
      .eq('user_id', user.id)
      .single();

    if (error || !assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({
      score: assessment.score,
      categoryScores: assessment.category_scores,
      insights: assessment.insights,
      recommendations: assessment.recommendations,
      nextSteps: assessment.next_steps,
      benchmarkComparison: assessment.benchmark_comparison,
      completedAt: assessment.completed_at,
      status: assessment.status
    });

  } catch (error) {
    console.error('Get assessment scoring error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

