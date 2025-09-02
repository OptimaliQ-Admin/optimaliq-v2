import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const competitiveIntelligenceRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  competitorNames: z.array(z.string()).optional(),
  analysisType: z.enum(['overview', 'strengths', 'weaknesses', 'opportunities', 'threats', 'swot', 'comprehensive']).default('comprehensive'),
  timeRange: z.enum(['1month', '3months', '6months', '1year']).default('3months'),
  includeMarketShare: z.boolean().default(true)
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
      competitorNames: searchParams.get('competitorNames')?.split(','),
      analysisType: searchParams.get('analysisType') || 'comprehensive',
      timeRange: searchParams.get('timeRange') || '3months',
      includeMarketShare: searchParams.get('includeMarketShare') === 'true'
    };

    const validatedQuery = competitiveIntelligenceRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    const targetIndustry = validatedQuery.industry || profile?.industry || 'general';

    // Get competitive intelligence data
    const timeRange = getTimeRange(validatedQuery.timeRange);
    const { data: competitors } = await supabase
      .from('competitive_intelligence')
      .select('*')
      .eq('industry', targetIndustry)
      .gte('updated_at', timeRange)
      .order('market_share', { ascending: false });

    // Get competitor mentions in articles
    const { data: competitorMentions } = await supabase
      .from('competitor_mentions')
      .select('*')
      .eq('industry', targetIndustry)
      .gte('mentioned_at', timeRange)
      .order('mentioned_at', { ascending: false });

    // Get competitor analysis from articles
    const { data: competitorArticles } = await supabase
      .from('market_articles')
      .select('*')
      .eq('industry', targetIndustry)
      .gte('published_date', timeRange)
      .or('content.ilike.%competitor%,title.ilike.%competitor%')
      .order('published_date', { ascending: false });

    // Generate competitive intelligence using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const competitiveAnalysis = await marketIntelligenceAgent.generateCompetitiveIntelligence({
      industry: targetIndustry,
      competitors: competitors || [],
      competitorMentions: competitorMentions || [],
      competitorArticles: competitorArticles || [],
      analysisType: validatedQuery.analysisType,
      includeMarketShare: validatedQuery.includeMarketShare,
      userProfile: profile
    });

    // Store competitive analysis results
    await supabase
      .from('competitive_analysis_results')
      .upsert({
        user_id: validatedQuery.userId,
        industry: targetIndustry,
        analysis_type: validatedQuery.analysisType,
        analysis_data: competitiveAnalysis,
        time_range: validatedQuery.timeRange,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      competitiveAnalysis: competitiveAnalysis,
      summary: {
        industry: targetIndustry,
        analysisType: validatedQuery.analysisType,
        timeRange: validatedQuery.timeRange,
        dataPoints: {
          competitors: competitors?.length || 0,
          mentions: competitorMentions?.length || 0,
          articles: competitorArticles?.length || 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Competitive intelligence API error:', error);
    
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
    const { action, competitiveData } = body;

    switch (action) {
      case 'add_competitor':
        // Add a new competitor to track
        const { error: addError } = await supabase
          .from('competitive_intelligence')
          .insert({
            industry: competitiveData.industry,
            competitor_name: competitiveData.competitorName,
            market_share: competitiveData.marketShare,
            strengths: competitiveData.strengths,
            weaknesses: competitiveData.weaknesses,
            opportunities: competitiveData.opportunities,
            threats: competitiveData.threats,
            created_at: new Date().toISOString()
          });

        if (addError) {
          console.error('Error adding competitor:', addError);
          return NextResponse.json({ error: 'Failed to add competitor' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Competitor added successfully' });

      case 'update_competitor':
        // Update competitor information
        const { error: updateError } = await supabase
          .from('competitive_intelligence')
          .update({
            market_share: competitiveData.marketShare,
            strengths: competitiveData.strengths,
            weaknesses: competitiveData.weaknesses,
            opportunities: competitiveData.opportunities,
            threats: competitiveData.threats,
            updated_at: new Date().toISOString()
          })
          .eq('id', competitiveData.competitorId);

        if (updateError) {
          console.error('Error updating competitor:', updateError);
          return NextResponse.json({ error: 'Failed to update competitor' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Competitor updated successfully' });

      case 'track_competitor_activity':
        // Track competitor activity
        const { error: activityError } = await supabase
          .from('competitor_activity_logs')
          .insert({
            user_id: user.id,
            competitor_id: competitiveData.competitorId,
            activity_type: competitiveData.activityType,
            activity_description: competitiveData.activityDescription,
            impact_level: competitiveData.impactLevel,
            created_at: new Date().toISOString()
          });

        if (activityError) {
          console.error('Error tracking activity:', activityError);
          return NextResponse.json({ error: 'Failed to track activity' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Activity tracked successfully' });

      case 'set_competitor_alerts':
        // Set up competitor monitoring alerts
        const { error: alertError } = await supabase
          .from('competitor_alerts')
          .insert({
            user_id: user.id,
            competitor_id: competitiveData.competitorId,
            alert_type: competitiveData.alertType,
            threshold: competitiveData.threshold,
            notification_method: competitiveData.notificationMethod,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting alert:', alertError);
          return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Competitor alert set successfully' });

      case 'compare_competitors':
        // Compare multiple competitors
        const comparisonResults = await compareCompetitors(competitiveData.competitorIds, competitiveData.industry);
        return NextResponse.json({ comparison: comparisonResults });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Competitive intelligence action error:', error);
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

async function compareCompetitors(competitorIds: string[], industry: string): Promise<any> {
  const comparisonResults = [];

  for (const competitorId of competitorIds) {
    const { data: competitor } = await supabase
      .from('competitive_intelligence')
      .select('*')
      .eq('id', competitorId)
      .single();

    const { data: mentions } = await supabase
      .from('competitor_mentions')
      .select('*')
      .eq('competitor_id', competitorId)
      .order('mentioned_at', { ascending: false })
      .limit(20);

    const { data: activities } = await supabase
      .from('competitor_activity_logs')
      .select('*')
      .eq('competitor_id', competitorId)
      .order('created_at', { ascending: false })
      .limit(10);

    comparisonResults.push({
      competitor: competitor,
      mentions: mentions || [],
      activities: activities || [],
      metrics: {
        mentionCount: mentions?.length || 0,
        activityCount: activities?.length || 0,
        averageSentiment: calculateAverageSentiment(mentions || []),
        marketShare: competitor?.market_share || 0
      }
    });
  }

  return comparisonResults;
}

function calculateAverageSentiment(mentions: any[]): number {
  if (mentions.length === 0) return 0;
  const sentimentScores = mentions.map(m => m.sentiment_score || 0);
  return sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
}

