import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const industryAnalysisRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  analysisType: z.enum(['overview', 'trends', 'competition', 'opportunities', 'risks', 'comprehensive']).default('comprehensive'),
  timeRange: z.enum(['1month', '3months', '6months', '1year']).default('3months'),
  includeBenchmarks: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryData = {
      userId: searchParams.get('userId') || user.id,
      industry: searchParams.get('industry'),
      analysisType: searchParams.get('analysisType') || 'comprehensive',
      timeRange: searchParams.get('timeRange') || '3months',
      includeBenchmarks: searchParams.get('includeBenchmarks') === 'true'
    };

    const validatedQuery = industryAnalysisRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    const targetIndustry = validatedQuery.industry || profile?.industry || 'general';

    // Get industry data
    const { data: industryData } = await supabase
      .from('industry_analysis')
      .select('*')
      .eq('industry', targetIndustry)
      .single();

    // Get market trends for the industry
    const timeRange = getTimeRange(validatedQuery.timeRange);
    const { data: trends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('industry', targetIndustry)
      .gte('created_at', timeRange)
      .order('created_at', { ascending: false });

    // Get market articles for the industry
    const { data: articles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', targetIndustry)
      .gte('published_date', timeRange)
      .order('published_date', { ascending: false });

    // Get competitive data
    const { data: competitors } = await supabase
      .from('competitive_intelligence')
      .select('*')
      .eq('industry', targetIndustry)
      .order('market_share', { ascending: false });

    // Generate industry analysis using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const analysis = await marketIntelligenceAgent.generateIndustryAnalysis({
      industry: targetIndustry,
      trends: trends || [],
      articles: articles || [],
      competitors: competitors || [],
      analysisType: validatedQuery.analysisType,
      includeBenchmarks: validatedQuery.includeBenchmarks,
      userProfile: profile
    });

    // Store analysis results
    await supabase
      .from('industry_analysis_results')
      .upsert({
        user_id: validatedQuery.userId,
        industry: targetIndustry,
        analysis_type: validatedQuery.analysisType,
        analysis_data: analysis,
        time_range: validatedQuery.timeRange,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      analysis: analysis,
      summary: {
        industry: targetIndustry,
        analysisType: validatedQuery.analysisType,
        timeRange: validatedQuery.timeRange,
        dataPoints: {
          trends: trends?.length || 0,
          articles: articles?.length || 0,
          competitors: competitors?.length || 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Industry analysis API error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, analysisData } = body;

    switch (action) {
      case 'save_analysis':
        // Save custom industry analysis
        const { error: saveError } = await supabase
          .from('saved_industry_analyses')
          .insert({
            user_id: user.id,
            industry: analysisData.industry,
            analysis_name: analysisData.analysisName,
            analysis_data: analysisData.analysisData,
            notes: analysisData.notes,
            created_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving analysis:', saveError);
          return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Analysis saved successfully' });

      case 'compare_industries':
        // Compare multiple industries
        const comparisonResults = await compareIndustries(analysisData.industries, user.id);
        return NextResponse.json({ comparison: comparisonResults });

      case 'set_industry_alerts':
        // Set up industry monitoring alerts
        const { error: alertError } = await supabase
          .from('industry_alerts')
          .insert({
            user_id: user.id,
            industry: analysisData.industry,
            alert_type: analysisData.alertType,
            threshold: analysisData.threshold,
            notification_method: analysisData.notificationMethod,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting alert:', alertError);
          return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Industry alert set successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Industry analysis action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getTimeRange(timeRange: string): string {
  const now = new Date();
  switch (timeRange) {
    case '1month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    case '3months':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
    case '6months':
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString();
    case '1year':
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
    default:
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
  }
}

async function compareIndustries(industries: string[], userId: string): Promise<any> {
  const comparisonResults = [];

  for (const industry of industries) {
    const { data: trends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('industry', industry)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: articles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', industry)
      .order('published_date', { ascending: false })
      .limit(10);

    comparisonResults.push({
      industry,
      trends: trends || [],
      articles: articles || [],
      metrics: {
        trendCount: trends?.length || 0,
        articleCount: articles?.length || 0,
        averageSentiment: calculateAverageSentiment(articles || []),
        growthRate: calculateGrowthRate(trends || [])
      }
    });
  }

  return comparisonResults;
}

function calculateAverageSentiment(articles: any[]): number {
  if (articles.length === 0) return 0;
  const sentimentScores = articles.map(a => a.sentiment_score || 0);
  return sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
}

function calculateGrowthRate(trends: any[]): number {
  if (trends.length === 0) return 0;
  const positiveTrends = trends.filter(t => t.direction === 'up').length;
  return positiveTrends / trends.length;
}

