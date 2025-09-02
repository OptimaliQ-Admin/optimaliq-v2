import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MarketIntelligenceAgent } from '@/lib/ai/agents/market-intelligence-agent';
import { z } from 'zod';

const forecastingRequestSchema = z.object({
  userId: z.string().uuid(),
  industry: z.string().optional(),
  forecastType: z.enum(['market_size', 'growth_rate', 'trend_prediction', 'demand_forecast', 'comprehensive']).default('comprehensive'),
  timeHorizon: z.enum(['3months', '6months', '1year', '2years', '5years']).default('1year'),
  includeScenarios: z.boolean().default(true)
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
      forecastType: searchParams.get('forecastType') || 'comprehensive',
      timeHorizon: searchParams.get('timeHorizon') || '1year',
      includeScenarios: searchParams.get('includeScenarios') === 'true'
    };

    const validatedQuery = forecastingRequestSchema.parse(queryData);

    // Get user profile for context
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('*')
      .eq('user_id', validatedQuery.userId)
      .single();

    const targetIndustry = validatedQuery.industry || profile?.industry || 'general';

    // Get historical market data
    const { data: historicalData } = await supabase
      .from('market_forecasting_data')
      .select('*')
      .eq('industry', targetIndustry)
      .order('date', { ascending: false })
      .limit(100);

    // Get market trends for forecasting
    const { data: trends } = await supabase
      .from('market_trends')
      .select('*')
      .eq('industry', targetIndustry)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get economic indicators
    const { data: economicIndicators } = await supabase
      .from('economic_indicators')
      .select('*')
      .order('date', { ascending: false })
      .limit(50);

    // Generate market forecast using Market Intelligence Agent
    const marketIntelligenceAgent = new MarketIntelligenceAgent();
    
    const forecast = await marketIntelligenceAgent.generateMarketForecast({
      industry: targetIndustry,
      historicalData: historicalData || [],
      trends: trends || [],
      economicIndicators: economicIndicators || [],
      forecastType: validatedQuery.forecastType,
      timeHorizon: validatedQuery.timeHorizon,
      includeScenarios: validatedQuery.includeScenarios,
      userProfile: profile
    });

    // Store forecast results
    await supabase
      .from('market_forecasts')
      .upsert({
        user_id: validatedQuery.userId,
        industry: targetIndustry,
        forecast_type: validatedQuery.forecastType,
        time_horizon: validatedQuery.timeHorizon,
        forecast_data: forecast,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({
      success: true,
      forecast: forecast,
      summary: {
        industry: targetIndustry,
        forecastType: validatedQuery.forecastType,
        timeHorizon: validatedQuery.timeHorizon,
        dataPoints: {
          historicalData: historicalData?.length || 0,
          trends: trends?.length || 0,
          economicIndicators: economicIndicators?.length || 0
        },
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Market forecasting API error:', error);
    
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
    const { action, forecastData } = body;

    switch (action) {
      case 'save_forecast':
        // Save custom forecast
        const { error: saveError } = await supabase
          .from('saved_forecasts')
          .insert({
            user_id: user.id,
            industry: forecastData.industry,
            forecast_name: forecastData.forecastName,
            forecast_data: forecastData.forecastData,
            notes: forecastData.notes,
            created_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving forecast:', saveError);
          return NextResponse.json({ error: 'Failed to save forecast' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Forecast saved successfully' });

      case 'compare_forecasts':
        // Compare multiple forecasts
        const comparisonResults = await compareForecasts(forecastData.forecastIds);
        return NextResponse.json({ comparison: comparisonResults });

      case 'set_forecast_alerts':
        // Set up forecast monitoring alerts
        const { error: alertError } = await supabase
          .from('forecast_alerts')
          .insert({
            user_id: user.id,
            industry: forecastData.industry,
            alert_type: forecastData.alertType,
            threshold: forecastData.threshold,
            notification_method: forecastData.notificationMethod,
            created_at: new Date().toISOString()
          });

        if (alertError) {
          console.error('Error setting alert:', alertError);
          return NextResponse.json({ error: 'Failed to set alert' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Forecast alert set successfully' });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Forecast action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function compareForecasts(forecastIds: string[]): Promise<any> {
  const comparisonResults = [];

  for (const forecastId of forecastIds) {
    const { data: forecast } = await supabase
      .from('market_forecasts')
      .select('*')
      .eq('id', forecastId)
      .single();

    comparisonResults.push({
      forecast: forecast,
      metrics: {
        confidence: forecast?.forecast_data?.confidence || 0,
        accuracy: forecast?.forecast_data?.accuracy || 0,
        timeHorizon: forecast?.time_horizon || '1year'
      }
    });
  }

  return comparisonResults;
}

