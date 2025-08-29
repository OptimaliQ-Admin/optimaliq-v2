import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, auth } from '@/lib/supabase';
import { agents } from '@/lib/ai/agents';
import { ErrorResponseSchema } from '../auth/schema';
import { AppError, handleError } from '@/utils';

// Dashboard response schema
const DashboardResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    scores: z.object({
      overall: z.number(),
      strategy: z.number(),
      process: z.number(),
      technology: z.number(),
      bmpScore: z.number().optional(),
      salesScore: z.number().optional(),
      aiReadinessScore: z.number().optional()
    }),
    insights: z.object({
      roadmap: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        category: z.string(),
        priority: z.number(),
        effort: z.number(),
        timeline: z.number(),
        dependencies: z.array(z.string()),
        isCompleted: z.boolean()
      })),
      benchmarks: z.array(z.object({
        category: z.string(),
        userScore: z.number(),
        industryAverage: z.number(),
        topPerformers: z.number(),
        percentile: z.number()
      })),
      trends: z.array(z.object({
        category: z.string(),
        direction: z.enum(['up', 'down', 'stable']),
        magnitude: z.number(),
        confidence: z.number(),
        description: z.string()
      }))
    }),
    lastAssessment: z.object({
      date: z.string(),
      type: z.string(),
      score: z.number(),
      daysAgo: z.number()
    }).optional(),
    needsReassessment: z.boolean()
  }),
  message: z.string().optional()
});

// GET /api/dashboard - Get dashboard data
export async function GET(_request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get user profile and scores
    const { data: userProfile } = await supabase
      .from('tier2_users')
      .select('industry, company_size, revenue_range')
      .eq('id', user.id)
      .single();

    const { data: userScores } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get latest dashboard insights
    const { data: latestInsights } = await supabase
      .from('tier2_dashboard_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Get latest assessment
    const { data: latestAssessment } = await supabase
      .from('onboarding_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Check if insights are older than 30 days
    const needsReassessment = !latestInsights || 
      new Date(latestInsights.created_at).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000);

    // If insights are stale, generate new ones
    let insights = latestInsights;
    if (needsReassessment && latestAssessment) {
      console.log('Generating fresh dashboard insights...');
      
      try {
        const aiResult = await agents.processAssessment(
          latestAssessment.payload_json,
          latestAssessment.type,
          user.id,
          userProfile?.industry || 'Technology'
        );

        if (aiResult.success) {
          // Save new insights
          const { data: newInsights } = await supabase
            .from('tier2_dashboard_insights')
            .insert({
              user_id: user.id,
              score: aiResult.data.overallScore,
              strategy: aiResult.data.strategyScore,
              process: aiResult.data.processScore,
              technology: aiResult.data.technologyScore,
              roadmap: aiResult.data.roadmap || [],
              benchmarks: aiResult.data.benchmarks || []
            })
            .select()
            .single();

          insights = newInsights;
        }
      } catch (aiError) {
        console.error('AI insights generation failed:', aiError);
        // Continue with existing insights
      }
    }

    // Calculate days since last assessment
    const daysAgo = latestAssessment 
      ? Math.floor((Date.now() - new Date(latestAssessment.created_at).getTime()) / (24 * 60 * 60 * 1000))
      : 0;

    const response = DashboardResponseSchema.parse({
      success: true,
      data: {
        scores: {
          overall: userScores?.score_overall || 0,
          strategy: userScores?.score_strategy || 0,
          process: userScores?.score_process || 0,
          technology: userScores?.score_technology || 0,
          bmpScore: userScores?.bmp_score,
          salesScore: userScores?.sales_score,
          aiReadinessScore: userScores?.ai_readiness_score
        },
        insights: {
          roadmap: insights?.roadmap || [],
          benchmarks: insights?.benchmarks || [],
          trends: insights?.trends || []
        },
        lastAssessment: latestAssessment ? {
          date: latestAssessment.created_at,
          type: latestAssessment.type,
          score: latestAssessment.score || 0,
          daysAgo
        } : undefined,
        needsReassessment
      },
      message: needsReassessment ? 'Consider retaking your assessment for updated insights' : undefined
    });

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Dashboard error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to fetch dashboard data',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}

// POST /api/dashboard/recompute - Force recompute insights (admin only)
export async function POST(_request: NextRequest) {
  try {
    // Get current user
    const user = await auth.getCurrentUser();
    if (!user) {
      throw new AppError('Not authenticated', 'NOT_AUTHENTICATED', 401);
    }

    // Get user profile to check admin status
    const { data: userProfile } = await supabase
      .from('tier2_users')
      .select('title, industry, company_size, revenue_range')
      .eq('id', user.id)
      .single();

    // Simple admin check - in production this would be more sophisticated
    const isAdmin = userProfile?.title?.toLowerCase().includes('admin') || 
                   userProfile?.title?.toLowerCase().includes('owner');

    if (!isAdmin) {
      throw new AppError('Admin access required', 'ADMIN_ACCESS_REQUIRED', 403);
    }

    // Get latest assessment
    const { data: latestAssessment } = await supabase
      .from('onboarding_assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!latestAssessment) {
      throw new AppError('No assessment data found', 'NO_ASSESSMENT_DATA', 404);
    }

    // Force regenerate insights
    const aiResult = await agents.processAssessment(
      latestAssessment.payload_json,
      latestAssessment.type,
      user.id,
      userProfile?.industry || 'Technology'
    );

    if (!aiResult.success) {
      throw new AppError('AI insights generation failed', 'AI_GENERATION_FAILED', 500);
    }

    // Save new insights
    const { data: newInsights, error: insightsError } = await supabase
      .from('tier2_dashboard_insights')
      .insert({
        user_id: user.id,
        score: aiResult.data.overallScore,
        strategy: aiResult.data.strategyScore,
        process: aiResult.data.processScore,
        technology: aiResult.data.technologyScore,
        roadmap: aiResult.data.roadmap || [],
        benchmarks: aiResult.data.benchmarks || []
      })
      .select()
      .single();

    if (insightsError) {
      throw new AppError('Failed to save insights', 'INSIGHTS_SAVE_FAILED', 500);
    }

    return NextResponse.json({
      success: true,
      data: newInsights,
      message: 'Dashboard insights recomputed successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Recompute insights error:', error);
    
    const handledError = handleError(error);
    
    return NextResponse.json(
      ErrorResponseSchema.parse({
        success: false,
        error: handledError.message,
        message: 'Failed to recompute insights',
        code: handledError.code,
        timestamp: new Date().toISOString()
      }),
      { status: handledError.statusCode }
    );
  }
}
