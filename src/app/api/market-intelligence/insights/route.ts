import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const insightsRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  companySize: z.string().optional(),
  insightTypes: z.array(z.enum(['trend', 'opportunity', 'threat', 'competitive', 'regulatory'])).optional(),
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  includePredictions: z.boolean().default(true)
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
      industry: searchParams.get('industry'),
      companySize: searchParams.get('companySize'),
      insightTypes: searchParams.get('insightTypes')?.split(','),
      timeRange: searchParams.get('timeRange') || '30d',
      includePredictions: searchParams.get('includePredictions') === 'true'
    };

    const validatedQuery = insightsRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get market articles for analysis
    const { data: marketArticles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .gte('published_date', getDateFromTimeRange(validatedQuery.timeRange))
      .order('published_date', { ascending: false })
      .limit(100);

    // Get existing insights from database
    const { data: existingInsights } = await supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .eq('insight_type', 'market_intelligence')
      .gte('created_at', getDateFromTimeRange(validatedQuery.timeRange))
      .order('created_at', { ascending: false });

    // Generate new insights using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const newInsights = await marketIntelligenceAgent.generateInsights({
      articles: marketArticles || [],
      industry: validatedQuery.industry || profile?.industry,
      companySize: validatedQuery.companySize || profile?.company_size,
      timeRange: validatedQuery.timeRange,
      includePredictions: validatedQuery.includePredictions
    });

    // Combine existing and new insights
    const allInsights = [
      ...(existingInsights || []).map(insight => ({
        id: insight.id,
        type: insight.insight_type,
        title: insight.title,
        description: insight.description,
        category: insight.category,
        priority: insight.priority,
        confidence: insight.confidence,
        impact: insight.impact_score,
        timeframe: insight.timeframe,
        recommendations: insight.recommendations,
        sources: insight.sources,
        createdAt: insight.created_at,
        actionable: insight.actionable
      })),
      ...(newInsights || [])
    ];

    // Filter by insight types if specified
    const filteredInsights = validatedQuery.insightTypes 
      ? allInsights.filter(insight => validatedQuery.insightTypes!.includes(insight.category as any))
      : allInsights;

    // Sort by priority and impact
    const sortedInsights = filteredInsights.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 2;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 2;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return (b.impact || 0) - (a.impact || 0);
    });

    // Calculate insights summary
    const insightsSummary = {
      total: sortedInsights.length,
      byCategory: sortedInsights.reduce((acc, insight) => {
        acc[insight.category] = (acc[insight.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: sortedInsights.reduce((acc, insight) => {
        acc[insight.priority] = (acc[insight.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      actionable: sortedInsights.filter(insight => insight.actionable).length,
      critical: sortedInsights.filter(insight => insight.priority === 'critical').length,
      averageImpact: sortedInsights.reduce((sum, insight) => sum + (insight.impact || 0), 0) / sortedInsights.length
    };

    // Store new insights in database
    for (const insight of newInsights || []) {
      await supabase
        .from('ai_insights')
        .insert({
          user_id: validatedQuery.userId,
          insight_type: 'market_intelligence',
          title: insight.title,
          description: insight.description,
          category: insight.category,
          priority: insight.priority,
          confidence: insight.confidence,
          impact_score: insight.impact,
          timeframe: insight.timeframe,
          recommendations: insight.recommendations,
          sources: insight.sources,
          actionable: insight.actionable,
          created_at: insight.createdAt || new Date().toISOString()
        });
    }

    return NextResponse.json({
      insights: sortedInsights,
      summary: insightsSummary,
      marketContext: {
        industry: validatedQuery.industry || profile?.industry,
        companySize: validatedQuery.companySize || profile?.company_size,
        timeRange: validatedQuery.timeRange,
        articlesAnalyzed: marketArticles?.length || 0
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Business insights API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getDateFromTimeRange(timeRange: string): string {
  const now = new Date();
  const timeRangeMap = {
    '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
    '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  };
  return timeRangeMap[timeRange as keyof typeof timeRangeMap].toISOString();
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
    const { action, insightId, feedback } = body;

    switch (action) {
      case 'mark_actionable':
        // Mark insight as actionable
        const { error: actionableError } = await supabase
          .from('ai_insights')
          .update({ 
            actionable: true,
            action_taken_at: new Date().toISOString()
          })
          .eq('id', insightId)
          .eq('user_id', user.id);

        if (actionableError) {
          console.error('Error marking insight actionable:', actionableError);
          return NextResponse.json({ error: 'Failed to mark insight actionable' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Insight marked as actionable' });

      case 'provide_feedback':
        // Provide feedback on insight
        const { error: feedbackError } = await supabase
          .from('insight_feedback')
          .insert({
            insight_id: insightId,
            user_id: user.id,
            feedback_type: feedback.type,
            feedback_text: feedback.text,
            rating: feedback.rating,
            created_at: new Date().toISOString()
          });

        if (feedbackError) {
          console.error('Error saving feedback:', feedbackError);
          return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Feedback saved successfully' });

      case 'dismiss_insight':
        // Dismiss an insight
        const { error: dismissError } = await supabase
          .from('ai_insights')
          .update({ 
            dismissed: true,
            dismissed_at: new Date().toISOString()
          })
          .eq('id', insightId)
          .eq('user_id', user.id);

        if (dismissError) {
          console.error('Error dismissing insight:', dismissError);
          return NextResponse.json({ error: 'Failed to dismiss insight' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Insight dismissed successfully' });

      case 'share_insight':
        // Share insight with team members
        const { error: shareError } = await supabase
          .from('insight_shares')
          .insert({
            insight_id: insightId,
            shared_by: user.id,
            shared_with: feedback.teamMembers,
            share_message: feedback.message,
            created_at: new Date().toISOString()
          });

        if (shareError) {
          console.error('Error sharing insight:', shareError);
          return NextResponse.json({ error: 'Failed to share insight' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Insight shared successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Insight action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

