import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { engagementIntelligenceAnalysis, EngagementIntelligenceInsight, UserTier } from '@/lib/ai/engagementIntelligenceAnalysis';
import { getErrorMessage } from '@/utils/errorHandler';
import { SharedCaching } from '@/lib/ai/sharedCaching';

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

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const industry = searchParams.get('industry') || 'general';
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    console.log(`🎯 Engagement Intelligence Request:`, { 
      userId: user.id, 
      industry, 
      forceRefresh 
    });

    // Use shared caching system
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'engagement_insights';

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedInsight = await sharedCache.getCachedInsight<EngagementIntelligenceInsight>(
        user.id,
        industry,
        tableName
      );
      
      if (cachedInsight) {
        console.log(`✅ Returning cached engagement insight for ${industry}`);
        return NextResponse.json({
          insight: cachedInsight,
          cached: true,
          createdAt: cachedInsight.lastUpdated,
          userTier: 'free' // For cached responses, default to free (trial users)
        });
      }
    }

    // Determine user tier for smart model selection
    const userTier = await getUserTier(supabase, user.id);
    console.log(`👤 User ${user.id} tier: ${userTier}`);

    // Generate new insight
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      user.id,
      industry,
      userTier
    );

    // Save to shared cache
    await sharedCache.saveInsightToCache(
      user.id,
      industry,
      insight,
      tableName,
      insight.aiModelVersion || 'gpt-4o',
      insight.signalScore,
      { userTier, confidenceScore: insight.confidenceScore }
    );

    console.log(`✅ Generated new engagement insight for ${industry}`);

    return NextResponse.json({
      insight,
      cached: false,
      createdAt: insight.lastUpdated,
      userTier
    });

  } catch (error) {
    console.error('❌ Engagement Intelligence API Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { industry, forceRefresh = false } = await req.json();

    if (!industry) {
      return NextResponse.json({ error: 'Industry is required' }, { status: 400 });
    }

    console.log(`🔄 Engagement Intelligence POST Request:`, { 
      userId: user.id, 
      industry, 
      forceRefresh 
    });

    // Use shared caching system
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'engagement_insights';

    // Check refresh limit
    const refreshLimit = await sharedCache.checkRefreshLimit(user.id, industry, tableName);
    if (!refreshLimit.allowed) {
      return NextResponse.json(
        { error: `Refresh limit exceeded. Please try again in ${refreshLimit.retryAfter} seconds.` },
        { status: 429 }
      );
    }

    // Delete cached insight if force refresh
    if (forceRefresh) {
      await sharedCache.deleteCachedInsight(user.id, industry, tableName);
      console.log(`🗑️ Deleted cached engagement insight for ${industry}`);
    }

    // Determine user tier for smart model selection
    const userTier = await getUserTier(supabase, user.id);
    console.log(`👤 User ${user.id} tier: ${userTier}`);

    // Generate new insight
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      user.id,
      industry,
      userTier
    );

    // Save to shared cache
    await sharedCache.saveInsightToCache(
      user.id,
      industry,
      insight,
      tableName,
      insight.aiModelVersion || 'gpt-4o',
      insight.signalScore,
      { userTier, confidenceScore: insight.confidenceScore }
    );

    // Update refresh timestamp
    await sharedCache.updateRefreshTimestamp(user.id, industry, tableName);

    console.log(`✅ Generated new engagement insight for ${industry} (force refresh: ${forceRefresh})`);

    return NextResponse.json({
      insight,
      cached: false,
      createdAt: insight.lastUpdated,
      forceRefreshed: forceRefresh,
      userTier
    });

  } catch (error) {
    console.error('❌ Engagement Intelligence POST Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
} 