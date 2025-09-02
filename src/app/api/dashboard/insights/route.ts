import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AssessmentAgent } from '@/lib/ai/agents/assessment-agent';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const insightsRequestSchema = z.object({
  userId: z.string().uuid(),
  insightTypes: z.array(z.enum(['assessment', 'market', 'growth', 'performance', 'trends'])).optional(),
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  includeBenchmarks: z.boolean().default(true),
  includeRecommendations: z.boolean().default(true)
});

const insightSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  description: z.string(),
  data: z.record(z.any()),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  createdAt: z.string(),
  expiresAt: z.string().optional(),
  actionable: z.boolean(),
  recommendations: z.array(z.string()).optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      insightTypes: searchParams.get('insightTypes')?.split(','),
      timeRange: searchParams.get('timeRange') || '30d',
      includeBenchmarks: searchParams.get('includeBenchmarks') === 'true',
      includeRecommendations: searchParams.get('includeRecommendations') === 'true'
    };

    const validatedQuery = insightsRequestSchema.parse(queryData);

    // Calculate date range
    const now = new Date();
    const timeRangeMap = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };
    const startDate = timeRangeMap[validatedQuery.timeRange as keyof typeof timeRangeMap];

    // Get existing insights from database
    const { data: existingInsights, error: insightsError } = await supabase
      .from('tier2_dashboard_insights')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (insightsError) {
      console.error('Error fetching existing insights:', insightsError);
    }

    // Generate new insights using AI agents
    const newInsights = await generateAIInsights(validatedQuery, supabase);

    // Combine existing and new insights
    const allInsights = [
      ...(existingInsights || []).map(insight => ({
        id: insight.id,
        type: insight.insight_type,
        title: insight.insight_data?.title || 'Dashboard Insight',
        description: insight.insight_data?.description || '',
        data: insight.insight_data || {},
        priority: insight.insight_data?.priority || 'medium',
        category: insight.insight_data?.category || 'general',
        createdAt: insight.created_at,
        expiresAt: insight.insight_data?.expiresAt,
        actionable: insight.insight_data?.actionable || false,
        recommendations: insight.insight_data?.recommendations || []
      })),
      ...newInsights
    ];

    // Filter by insight types if specified
    const filteredInsights = validatedQuery.insightTypes 
      ? allInsights.filter(insight => validatedQuery.insightTypes!.includes(insight.type as any))
      : allInsights;

    // Sort by priority and recency
    const sortedInsights = filteredInsights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Calculate insights summary
    const insightsSummary = {
      total: sortedInsights.length,
      byType: sortedInsights.reduce((acc, insight) => {
        acc[insight.type] = (acc[insight.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: sortedInsights.reduce((acc, insight) => {
        acc[insight.priority] = (acc[insight.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      actionable: sortedInsights.filter(insight => insight.actionable).length,
      critical: sortedInsights.filter(insight => insight.priority === 'critical').length
    };

    return NextResponse.json({
      insights: sortedInsights,
      summary: insightsSummary,
      generatedAt: new Date().toISOString(),
      timeRange: validatedQuery.timeRange
    });

  } catch (error) {
    console.error('Dashboard insights error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateAIInsights(query: any, supabase: any) {
  const insights: any[] = [];
  
  try {
    // Get user's recent assessments
    const { data: assessments } = await supabase
      .from('onboarding_assessments')
      .select('*')
      .eq('user_id', query.userId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', query.userId)
      .single();

    // Generate assessment insights
    if (assessments && assessments.length > 0) {
      const assessmentAgent = new AssessmentAgent();
      
      const assessmentInsight = await assessmentAgent.generateInsights({
        assessments,
        profile,
        includeBenchmarks: query.includeBenchmarks,
        includeRecommendations: query.includeRecommendations
      });

      if (assessmentInsight) {
        insights.push({
          id: `assessment-${Date.now()}`,
          type: 'assessment',
          title: 'Assessment Performance Analysis',
          description: assessmentInsight.summary,
          data: assessmentInsight,
          priority: assessmentInsight.priority || 'medium',
          category: 'performance',
          createdAt: new Date().toISOString(),
          actionable: true,
          recommendations: assessmentInsight.recommendations || []
        });
      }
    }

    // Generate market intelligence insights
    if (profile?.industry) {
      const marketAgent = new MarketIntelligenceAgent();
      
      const marketInsight = await marketAgent.generateInsights({
        industry: profile.industry,
        companySize: profile.company_size,
        timeRange: query.timeRange
      });

      if (marketInsight) {
        insights.push({
          id: `market-${Date.now()}`,
          type: 'market',
          title: 'Market Intelligence Update',
          description: marketInsight.summary,
          data: marketInsight,
          priority: marketInsight.priority || 'medium',
          category: 'market',
          createdAt: new Date().toISOString(),
          actionable: true,
          recommendations: marketInsight.recommendations || []
        });
      }
    }

    // Store new insights in database
    for (const insight of insights) {
      await supabase
        .from('tier2_dashboard_insights')
        .insert({
          user_id: query.userId,
          insight_type: insight.type,
          insight_data: {
            title: insight.title,
            description: insight.description,
            priority: insight.priority,
            category: insight.category,
            actionable: insight.actionable,
            recommendations: insight.recommendations,
            ...insight.data
          },
          created_at: insight.createdAt
        });
    }

  } catch (error) {
    console.error('Error generating AI insights:', error);
  }

  return insights;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { insightId, action } = body;

    if (!insightId || !action) {
      return NextResponse.json({ error: 'Insight ID and action required' }, { status: 400 });
    }

    switch (action) {
      case 'dismiss':
        // Mark insight as dismissed
        const { error: dismissError } = await supabase
          .from('tier2_dashboard_insights')
          .update({ 
            insight_data: { dismissed: true, dismissed_at: new Date().toISOString() }
          })
          .eq('id', insightId)
          .eq('user_id', user.id);

        if (dismissError) {
          console.error('Error dismissing insight:', dismissError);
          return NextResponse.json({ error: 'Failed to dismiss insight' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Insight dismissed successfully' });

      case 'action_taken':
        // Mark insight action as taken
        const { error: actionError } = await supabase
          .from('tier2_dashboard_insights')
          .update({ 
            insight_data: { action_taken: true, action_taken_at: new Date().toISOString() }
          })
          .eq('id', insightId)
          .eq('user_id', user.id);

        if (actionError) {
          console.error('Error marking action taken:', actionError);
          return NextResponse.json({ error: 'Failed to mark action taken' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Action marked as taken' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Insight action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

