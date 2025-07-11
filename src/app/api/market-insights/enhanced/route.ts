import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { enhancedMarketAnalysis, UserTier } from '@/lib/ai/enhancedMarketAnalysis';

// Helper function to determine user tier
async function getUserTier(supabase: any, userId: string): Promise<UserTier> {
  try {
    // Check if user has premium subscription (active paid subscription only)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('u_id', userId)
      .eq('status', 'active')
      .single();

    if (subscription && subscription.current_period_end > new Date().toISOString()) {
      return 'premium'; // ✅ Active paid subscription
    }

    // Trial users are treated as FREE (not premium)
    // This ensures they get cost-optimized models and basic features
    return 'free'; // ❌ Trial, cancelled, expired, or no subscription
  } catch (error) {
    console.log('Could not determine user tier, defaulting to free:', error);
    return 'free';
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { industry } = await request.json();
    if (!industry) {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
    }

    // Determine user tier for smart model selection
    const userTier = await getUserTier(supabase, user.id);
    console.log(`👤 User ${user.id} tier: ${userTier}`);

    // Check if table exists first
    const { error: tableCheckError } = await supabase
      .from('enhanced_market_insights')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Table does not exist or access denied:', tableCheckError);
      // Generate insight without storing
      const insight = await enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier);
      return NextResponse.json({
        insight,
        cached: false,
        storageError: true,
        message: 'Database table not available, insight generated but not stored',
        userTier
      });
    }

    // Check if user has recent insights for this industry (within 1 hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const { data: existingInsight } = await supabase
      .from('enhanced_market_insights')
      .select('*')
      .eq('u_id', user.id)
      .eq('industry', industry)
      .gte('created_at', oneHourAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Return cached insight if available
    if (existingInsight) {
      return NextResponse.json({
        insight: {
          marketSize: existingInsight.market_size,
          growthRate: existingInsight.growth_rate,
          competition: existingInsight.competition,
          sentiment: existingInsight.sentiment,
          fullInsight: existingInsight.full_insight,
          dataSources: existingInsight.data_sources,
          confidenceScore: existingInsight.confidence_score,
          aiModelVersion: existingInsight.ai_model_version
        },
        cached: true,
        createdAt: existingInsight.created_at,
        userTier
      });
    }

    // Generate new insight using AI with smart model selection
    const insight = await enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier);

    // Store in database
    const { data: storedInsight, error: insertError } = await supabase
      .from('enhanced_market_insights')
      .insert({
        u_id: user.id,
        industry,
        market_size: insight.marketSize,
        growth_rate: insight.growthRate,
        competition: insight.competition,
        sentiment: insight.sentiment,
        full_insight: insight.fullInsight,
        data_sources: insight.dataSources,
        confidence_score: insight.confidenceScore,
        ai_model_version: insight.aiModelVersion
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing market insight:', insertError);
      // Return insight even if storage fails
      return NextResponse.json({
        insight,
        cached: false,
        storageError: true,
        message: 'Insight generated but storage failed',
        userTier
      });
    }

    return NextResponse.json({
      insight,
      cached: false,
      createdAt: storedInsight.created_at,
      userTier
    });

  } catch (error) {
    console.error('Error generating market insight:', error);
    return NextResponse.json(
      { error: 'Failed to generate market insight' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');

    if (!industry) {
      return NextResponse.json({ error: 'Industry parameter is required' }, { status: 400 });
    }

    // Determine user tier for smart model selection
    const userTier = await getUserTier(supabase, user.id);
    console.log(`👤 User ${user.id} tier: ${userTier}`);

    // Check if table exists first
    const { error: tableCheckError } = await supabase
      .from('enhanced_market_insights')
      .select('id')
      .limit(1);

    if (tableCheckError) {
      console.error('Table does not exist or access denied:', tableCheckError);
      return NextResponse.json({ error: 'Market insights not available' }, { status: 503 });
    }

    // Get latest insight for this industry
    const { data: insight, error } = await supabase
      .from('enhanced_market_insights')
      .select('*')
      .eq('u_id', user.id)
      .eq('industry', industry)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // If no insight exists, generate one
    if (error || !insight) {
      console.log('No existing insight found, generating new one for industry:', industry);
      
      // Generate new insight using AI with smart model selection
      const newInsight = await enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier);

      // Store in database
      const { data: storedInsight, error: insertError } = await supabase
        .from('enhanced_market_insights')
        .insert({
          u_id: user.id,
          industry,
          market_size: newInsight.marketSize,
          growth_rate: newInsight.growthRate,
          competition: newInsight.competition,
          sentiment: newInsight.sentiment,
          full_insight: newInsight.fullInsight,
          data_sources: newInsight.dataSources,
          confidence_score: newInsight.confidenceScore,
          ai_model_version: newInsight.aiModelVersion
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error storing market insight:', insertError);
        // Return insight even if storage fails
        return NextResponse.json({
          insight: newInsight,
          cached: false,
          storageError: true,
          message: 'Insight generated but storage failed',
          createdAt: new Date().toISOString(),
          userTier
        });
      }

      return NextResponse.json({
        insight: newInsight,
        cached: false,
        createdAt: storedInsight.created_at,
        userTier
      });
    }

    return NextResponse.json({
      insight: {
        marketSize: insight.market_size,
        growthRate: insight.growth_rate,
        competition: insight.competition,
        sentiment: insight.sentiment,
        fullInsight: insight.full_insight,
        dataSources: insight.data_sources,
        confidenceScore: insight.confidence_score,
        aiModelVersion: insight.ai_model_version
      },
      cached: true,
      createdAt: insight.created_at,
      userTier
    });

  } catch (error) {
    console.error('Error generating market insight:', error);
    return NextResponse.json(
      { error: 'Failed to generate market insight' },
      { status: 500 }
    );
  }
} 