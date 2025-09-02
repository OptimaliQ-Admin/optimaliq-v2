import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const opportunityIdentificationRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  opportunityType: z.enum(['market', 'product', 'service', 'partnership', 'expansion', 'comprehensive']).default('comprehensive'),
  timeHorizon: z.enum(['3months', '6months', '1year', '2years', '5years']).default('1year'),
  includeFeasibility: z.boolean().default(true)
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
      opportunityType: searchParams.get('opportunityType') || 'comprehensive',
      timeHorizon: searchParams.get('timeHorizon') || '1year',
      includeFeasibility: searchParams.get('includeFeasibility') === 'true'
    };

    const validatedQuery = opportunityIdentificationRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    const targetIndustry = validatedQuery.industry || profile?.industry || 'general';

    // Get market opportunities data
    const { data: opportunitiesData } = await supabase
      .from('market_opportunities')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(100);

    // Get market trends for opportunity analysis
    const { data: trends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get market gaps
    const { data: marketGaps } = await supabase
      .from('market_gaps')
      .select('*')
      .eq('industry', targetIndustry)
      .order('identified_at', { ascending: false })
      .limit(30);

    // Get customer needs and pain points
    const { data: customerNeeds } = await supabase
      .from('customer_needs_analysis')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(40);

    // Generate opportunity identification using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const opportunities = await marketIntelligenceAgent.generateOpportunityIdentification({
      industry: targetIndustry,
      opportunitiesData: opportunitiesData || [],
      trends: trends || [],
      marketGaps: marketGaps || [],
      customerNeeds: customerNeeds || [],
      opportunityType: validatedQuery.opportunityType,
      timeHorizon: validatedQuery.timeHorizon,
      includeFeasibility: validatedQuery.includeFeasibility,
      userProfile: profile
    });

    // Store opportunity identification results
    await supabase
      .from('opportunity_identification_results')
      .upsert({
        user_id: validatedQuery.userId,
        industry: targetIndustry,
        opportunity_type: validatedQuery.opportunityType,
        time_horizon: validatedQuery.timeHorizon,
        opportunities_data: opportunities,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      opportunities: opportunities,
      summary: {
        industry: targetIndustry,
        opportunityType: validatedQuery.opportunityType,
        timeHorizon: validatedQuery.timeHorizon,
        dataPoints: {
          opportunitiesData: opportunitiesData?.length || 0,
          trends: trends?.length || 0,
          marketGaps: marketGaps?.length || 0,
          customerNeeds: customerNeeds?.length || 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Opportunity identification API error:', error);
    
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
    const { action, opportunityData } = body;

    switch (action) {
      case 'save_opportunity':
        // Save custom opportunity
        const { error: saveError } = await supabase
          .from('saved_opportunities')
          .insert({
            user_id: user.id,
            industry: opportunityData.industry,
            opportunity_name: opportunityData.opportunityName,
            opportunity_description: opportunityData.opportunityDescription,
            opportunity_type: opportunityData.opportunityType,
            feasibility_score: opportunityData.feasibilityScore,
            market_size: opportunityData.marketSize,
            time_to_market: opportunityData.timeToMarket,
            investment_required: opportunityData.investmentRequired,
            notes: opportunityData.notes,
            created_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving opportunity:', saveError);
          return NextResponse.json({ error: 'Failed to save opportunity' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Opportunity saved successfully' });

      case 'track_opportunity':
        // Track opportunity progress
        const { error: trackError } = await supabase
          .from('opportunity_tracking')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityData.opportunityId,
            opportunity_name: opportunityData.opportunityName,
            status: opportunityData.status,
            progress_percentage: opportunityData.progressPercentage,
            next_steps: opportunityData.nextSteps,
            timeline: opportunityData.timeline,
            created_at: new Date().toISOString()
          });

        if (trackError) {
          console.error('Error tracking opportunity:', trackError);
          return NextResponse.json({ error: 'Failed to track opportunity' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Opportunity tracked successfully' });

      case 'evaluate_opportunity':
        // Evaluate opportunity feasibility
        const { error: evalError } = await supabase
          .from('opportunity_evaluations')
          .insert({
            user_id: user.id,
            opportunity_id: opportunityData.opportunityId,
            market_analysis: opportunityData.marketAnalysis,
            competitive_analysis: opportunityData.competitiveAnalysis,
            financial_analysis: opportunityData.financialAnalysis,
            risk_assessment: opportunityData.riskAssessment,
            feasibility_score: opportunityData.feasibilityScore,
            recommendation: opportunityData.recommendation,
            created_at: new Date().toISOString()
          });

        if (evalError) {
          console.error('Error evaluating opportunity:', evalError);
          return NextResponse.json({ error: 'Failed to evaluate opportunity' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Opportunity evaluated successfully' });

      case 'set_opportunity_alerts':
        // Set up opportunity monitoring alerts
        const { error: alertError } = await supabase
          .from('opportunity_alerts')
          .insert({
            user_id: user.id,
            industry: opportunityData.industry,
            opportunity_type: opportunityData.opportunityType,
            alert_criteria: opportunityData.alertCriteria,
            notification_method: opportunityData.notificationMethod,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting alert:', alertError);
          return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Opportunity alert set successfully' });

      case 'compare_opportunities':
        // Compare multiple opportunities
        const comparisonResults = await compareOpportunities(opportunityData.opportunityIds);
        return NextResponse.json({ comparison: comparisonResults });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Opportunity identification action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function compareOpportunities(opportunityIds: string[]): Promise<any> {
  const comparisonResults = [];

  for (const opportunityId of opportunityIds) {
    const { data: opportunity } = await supabase
      .from('market_opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    const { data: evaluation } = await supabase
      .from('opportunity_evaluations')
      .select('*')
      .eq('opportunity_id', opportunityId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    comparisonResults.push({
      opportunity: opportunity,
      evaluation: evaluation,
      metrics: {
        feasibilityScore: evaluation?.feasibility_score || 0,
        marketSize: opportunity?.market_size || 0,
        timeToMarket: opportunity?.time_to_market || 0,
        investmentRequired: opportunity?.investment_required || 0
      }
    });
  }

  return comparisonResults;
}

