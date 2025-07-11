import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { enhancedMarketAnalysis, UserTier } from '@/lib/ai/enhancedMarketAnalysis';
import { SharedCaching } from '@/lib/ai/sharedCaching';
import { getErrorMessage } from '@/utils/errorHandler';

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

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get industry from query params
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry') || 'technology';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // Determine user tier
    const userTier = await getUserTier(supabase, user.id);

    console.log(`🎯 Market Insights API called for ${industry} (${userTier} user)`);

    // Use shared caching system
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'market_insights';

    let insight;

    if (forceRefresh) {
      // Force refresh
      insight = await sharedCache.forceRefreshInsight(
        user.id,
        industry,
        tableName,
        () => enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier),
        '2.0',
        undefined,
        { userTier }
      );
    } else {
      // Normal flow with caching
      insight = await sharedCache.generateInsightWithCache(
        user.id,
        industry,
        tableName,
        () => enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier),
        '2.0',
        false,
        undefined,
        { userTier }
      );
    }

    console.log(`✅ Market Insights generated successfully`);
    console.log(`   Market Size: ${insight.marketSize?.value || 'N/A'}`);
    console.log(`   Growth Rate: ${insight.growthRate?.value || 'N/A'}`);
    console.log(`   Confidence Score: ${insight.confidenceScore || 'N/A'}`);

    return NextResponse.json({
      success: true,
      insight,
      cached: !forceRefresh,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Market Insights API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate market insights',
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
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

    const { industry } = await request.json();
    if (!industry) {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
    }

    // Determine user tier
    const userTier = await getUserTier(supabase, user.id);

    console.log(`🔄 Force refresh market insights for ${industry} (${userTier} user)`);

    // Use shared caching system for force refresh
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'market_insights';

    const insight = await sharedCache.forceRefreshInsight(
      user.id,
      industry,
      tableName,
      () => enhancedMarketAnalysis.generateMarketInsight(user.id, industry, userTier),
      '2.0',
      undefined,
      { userTier }
    );

    console.log(`✅ Market Insights force refresh completed`);
    console.log(`   Market Size: ${insight.marketSize?.value || 'N/A'}`);
    console.log(`   Growth Rate: ${insight.growthRate?.value || 'N/A'}`);
    console.log(`   Confidence Score: ${insight.confidenceScore || 'N/A'}`);

    return NextResponse.json({
      success: true,
      insight,
      cached: false,
      createdAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Market Insights Force Refresh Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to refresh market insights',
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
  }
} 