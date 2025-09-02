import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const trendsRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  timeRange: z.enum(['7d', '30d', '90d', '1y']).default('30d'),
  trendTypes: z.array(z.enum(['market', 'performance', 'growth', 'competitive'])).optional(),
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
      timeRange: searchParams.get('timeRange') || '30d',
      trendTypes: searchParams.get('trendTypes')?.split(','),
      includePredictions: searchParams.get('includePredictions') === 'true'
    };

    const validatedQuery = trendsRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    // Get user's historical performance data
    const { data: assessments } = await supabase
      .from('onboarding_assessments')
      .select('score, category_scores, assessment_type, completed_at')
      .eq('user_id', validatedQuery.userId)
      .eq('status', 'completed')
      .not('score', 'is', null)
      .order('completed_at', { ascending: true });

    // Get market intelligence data
    const { data: marketArticles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', validatedQuery.industry || profile?.industry || 'general')
      .gte('published_date', getDateFromTimeRange(validatedQuery.timeRange))
      .order('published_date', { ascending: false })
      .limit(50);

    // Generate trend analysis
    const trendAnalysis = await generateTrendAnalysis(
      validatedQuery,
      assessments || [],
      marketArticles || [],
      profile
    );

    // Get performance trends
    const performanceTrends = calculatePerformanceTrends(assessments || []);

    // Get growth trends
    const growthTrends = await calculateGrowthTrends(validatedQuery.userId, supabase);

    // Get competitive trends
    const competitiveTrends = await getCompetitiveTrends(
      validatedQuery.industry || profile?.industry,
      validatedQuery.timeRange
    );

    return NextResponse.json({
      marketTrends: trendAnalysis.marketTrends,
      performanceTrends,
      growthTrends,
      competitiveTrends,
      predictions: validatedQuery.includePredictions ? trendAnalysis.predictions : null,
      summary: {
        totalTrends: trendAnalysis.marketTrends.length + performanceTrends.length + growthTrends.length + competitiveTrends.length,
        positiveTrends: countPositiveTrends(trendAnalysis.marketTrends, performanceTrends, growthTrends, competitiveTrends),
        negativeTrends: countNegativeTrends(trendAnalysis.marketTrends, performanceTrends, growthTrends, competitiveTrends),
        trendStrength: calculateTrendStrength(trendAnalysis.marketTrends, performanceTrends, growthTrends, competitiveTrends)
      },
      generatedAt: new Date().toISOString(),
      timeRange: validatedQuery.timeRange
    });

  } catch (error) {
    console.error('Dashboard trends error:', error);
    
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

async function generateTrendAnalysis(query: any, assessments: any[], marketArticles: any[], profile: any) {
  const marketIntelligenceAgent = new MarketIntelligenceAgent();
  
  // Analyze market trends from articles
  const marketTrends = await marketIntelligenceAgent.analyzeTrends({
    articles: marketArticles,
    industry: query.industry || profile?.industry,
    timeRange: query.timeRange
  });

  // Generate predictions
  const predictions = await marketIntelligenceAgent.generatePredictions({
    currentTrends: marketTrends,
    industry: query.industry || profile?.industry,
    companySize: profile?.company_size,
    timeHorizon: '3months'
  });

  return {
    marketTrends,
    predictions
  };
}

function calculatePerformanceTrends(assessments: any[]) {
  if (assessments.length < 2) {
    return [];
  }

  const trends = [];
  
  // Overall performance trend
  const scores = assessments.map(a => ({ score: a.score, date: new Date(a.completed_at) }));
  const overallTrend = calculateLinearTrend(scores.map(s => s.score));
  
  trends.push({
    type: 'performance',
    metric: 'overall_score',
    direction: overallTrend.slope > 0 ? 'up' : overallTrend.slope < 0 ? 'down' : 'stable',
    strength: Math.abs(overallTrend.slope),
    confidence: overallTrend.r2,
    change: overallTrend.slope,
    period: 'assessment_history'
  });

  // Category performance trends
  const categoryScores: Record<string, Array<{ score: number; date: Date }>> = {};
  assessments.forEach(assessment => {
    if (assessment.category_scores && typeof assessment.category_scores === 'object') {
      Object.entries(assessment.category_scores).forEach(([category, score]) => {
        if (!categoryScores[category]) {
          categoryScores[category] = [];
        }
        categoryScores[category].push({
          score: score as number,
          date: new Date(assessment.completed_at)
        });
      });
    }
  });

  Object.entries(categoryScores).forEach(([category, scores]) => {
    if (scores.length >= 2) {
      const trend = calculateLinearTrend(scores.map(s => s.score));
      trends.push({
        type: 'performance',
        metric: `${category}_score`,
        direction: trend.slope > 0 ? 'up' : trend.slope < 0 ? 'down' : 'stable',
        strength: Math.abs(trend.slope),
        confidence: trend.r2,
        change: trend.slope,
        period: 'assessment_history'
      });
    }
  });

  return trends;
}

function calculateLinearTrend(values: number[]) {
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const meanY = sumY / n;
  const ssRes = values.reduce((sum, yi, i) => {
    const predicted = slope * x[i] + intercept;
    return sum + Math.pow(yi - predicted, 2);
  }, 0);
  const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
  const r2 = 1 - (ssRes / ssTot);
  
  return { slope, intercept, r2 };
}

async function calculateGrowthTrends(userId: string, supabase: any) {
  const trends = [];
  
  // Get growth lever progress
  const { data: growthLevers } = await supabase
    .from('growth_levers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (growthLevers && growthLevers.length > 0) {
    // Calculate growth momentum
    const recentLevers = growthLevers.slice(-5);
    const activeLevers = recentLevers.filter(l => l.status === 'active');
    const completedLevers = recentLevers.filter(l => l.status === 'completed');
    
    trends.push({
      type: 'growth',
      metric: 'lever_activation',
      direction: activeLevers.length > completedLevers.length ? 'up' : 'down',
      strength: activeLevers.length / recentLevers.length,
      confidence: 0.8,
      change: activeLevers.length - completedLevers.length,
      period: 'recent_activity'
    });
  }

  // Get KPI tracking data
  const { data: kpiData } = await supabase
    .from('kpi_tracking')
    .select('*')
    .eq('user_id', userId)
    .order('tracked_date', { ascending: true })
    .limit(20);

  if (kpiData && kpiData.length >= 2) {
    const revenueTrend = calculateLinearTrend(kpiData.map(k => k.revenue || 0));
    trends.push({
      type: 'growth',
      metric: 'revenue_growth',
      direction: revenueTrend.slope > 0 ? 'up' : revenueTrend.slope < 0 ? 'down' : 'stable',
      strength: Math.abs(revenueTrend.slope),
      confidence: revenueTrend.r2,
      change: revenueTrend.slope,
      period: 'kpi_tracking'
    });
  }

  return trends;
}

async function getCompetitiveTrends(industry?: string, timeRange?: string) {
  const supabase = createClient();
  
  const { data: competitiveData } = await supabase
    .from('market_articles')
    .select('*')
    .eq('category', 'competitive_analysis')
    .eq('industry', industry || 'general')
    .gte('published_date', getDateFromTimeRange(timeRange || '30d'))
    .order('published_date', { ascending: false })
    .limit(20);

  if (!competitiveData || competitiveData.length === 0) {
    return [];
  }

  // Analyze competitive landscape changes
  const trends = [];
  
  // Market share shifts
  const marketShareArticles = competitiveData.filter(a => 
    a.title.toLowerCase().includes('market share') || 
    a.content.toLowerCase().includes('market share')
  );
  
  if (marketShareArticles.length > 0) {
    trends.push({
      type: 'competitive',
      metric: 'market_share_volatility',
      direction: 'up', // Assuming increased volatility
      strength: marketShareArticles.length / competitiveData.length,
      confidence: 0.7,
      change: marketShareArticles.length,
      period: timeRange || '30d'
    });
  }

  // New entrants
  const newEntrantArticles = competitiveData.filter(a => 
    a.title.toLowerCase().includes('new') && 
    (a.title.toLowerCase().includes('company') || a.title.toLowerCase().includes('startup'))
  );
  
  if (newEntrantArticles.length > 0) {
    trends.push({
      type: 'competitive',
      metric: 'new_entrants',
      direction: 'up',
      strength: newEntrantArticles.length / competitiveData.length,
      confidence: 0.8,
      change: newEntrantArticles.length,
      period: timeRange || '30d'
    });
  }

  return trends;
}

function countPositiveTrends(...trendArrays: any[][]) {
  return trendArrays.flat().filter(trend => trend.direction === 'up').length;
}

function countNegativeTrends(...trendArrays: any[][]) {
  return trendArrays.flat().filter(trend => trend.direction === 'down').length;
}

function calculateTrendStrength(...trendArrays: any[][]) {
  const allTrends = trendArrays.flat();
  if (allTrends.length === 0) return 0;
  
  const averageStrength = allTrends.reduce((sum, trend) => sum + trend.strength, 0) / allTrends.length;
  return Math.min(1, averageStrength);
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
    const { action, trendId, alert } = body;

    switch (action) {
      case 'set_alert':
        // Set up trend alert
        const { error: alertError } = await supabase
          .from('trend_alerts')
          .insert({
            user_id: user.id,
            trend_id: trendId,
            alert_type: alert.type,
            threshold: alert.threshold,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting trend alert:', alertError);
          return NextResponse.json({ error: 'Failed to set trend alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Trend alert set successfully' });

      case 'track_trend':
        // Track trend for user
        const { error: trackError } = await supabase
          .from('user_trends')
          .insert({
            user_id: user.id,
            trend_id: trendId,
            tracked_at: new Date().toISOString()
          });

        if (trackError) {
          console.error('Error tracking trend:', trackError);
          return NextResponse.json({ error: 'Failed to track trend' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Trend tracked successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Trend action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

