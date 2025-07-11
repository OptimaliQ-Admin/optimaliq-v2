import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { engagementIntelligenceAnalysis, EngagementIntelligenceInsight } from '@/lib/ai/engagementIntelligenceAnalysis';
import { getErrorMessage } from '@/utils/errorHandler';

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

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedInsight = await checkCachedEngagementInsight(supabase, user.id, industry);
      if (cachedInsight) {
        console.log(`✅ Returning cached engagement insight for ${industry}`);
        return NextResponse.json({
          insight: cachedInsight,
          cached: true,
          createdAt: cachedInsight.lastUpdated
        });
      }
    }

    // Generate new insight
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      user.id,
      industry,
      'premium' // Default to premium for now
    );

    // Cache the insight
    await saveEngagementInsightToCache(supabase, user.id, industry, insight);

    console.log(`✅ Generated new engagement insight for ${industry}`);

    return NextResponse.json({
      insight,
      cached: false,
      createdAt: insight.lastUpdated
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

    // Delete cached insight if force refresh
    if (forceRefresh) {
      await deleteCachedEngagementInsight(supabase, user.id, industry);
      console.log(`🗑️ Deleted cached engagement insight for ${industry}`);
    }

    // Generate new insight
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      user.id,
      industry,
      'premium'
    );

    // Cache the insight
    await saveEngagementInsightToCache(supabase, user.id, industry, insight);

    console.log(`✅ Generated new engagement insight for ${industry} (force refresh: ${forceRefresh})`);

    return NextResponse.json({
      insight,
      cached: false,
      createdAt: insight.lastUpdated,
      forceRefreshed: forceRefresh
    });

  } catch (error) {
    console.error('❌ Engagement Intelligence POST Error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

/**
 * Check for cached engagement insight
 */
async function checkCachedEngagementInsight(
  supabase: any, 
  userId: string, 
  industry: string
): Promise<EngagementIntelligenceInsight | null> {
  try {
    const { data, error } = await supabase
      .from('engagement_insights')
      .select('*')
      .eq('user_id', userId)
      .eq('industry', industry)
      .single();

    if (error || !data) {
      return null;
    }

    // Check if cache is still valid (30 days)
    const cacheAge = Date.now() - new Date(data.created_at).getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    if (cacheAge > maxAge) {
      console.log(`⏰ Cached engagement insight expired for ${industry}`);
      return null;
    }

    // Parse the insight data
    const insight: EngagementIntelligenceInsight = {
      ...data.insight_data,
      lastUpdated: new Date(data.created_at)
    };

    return insight;
  } catch (error) {
    console.error('Error checking cached engagement insight:', error);
    return null;
  }
}

/**
 * Save engagement insight to cache
 */
async function saveEngagementInsightToCache(
  supabase: any,
  userId: string,
  industry: string,
  insight: EngagementIntelligenceInsight
): Promise<void> {
  try {
    const { error } = await supabase
      .from('engagement_insights')
      .upsert({
        user_id: userId,
        industry,
        insight_data: insight,
        model_version: insight.aiModelVersion,
        signal_score: insight.signalScore,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,industry'
      });

    if (error) {
      console.error('Error saving engagement insight to cache:', error);
    } else {
      console.log(`💾 Cached engagement insight for ${industry}`);
    }
  } catch (error) {
    console.error('Error saving engagement insight to cache:', error);
  }
}

/**
 * Delete cached engagement insight
 */
async function deleteCachedEngagementInsight(
  supabase: any,
  userId: string,
  industry: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('engagement_insights')
      .delete()
      .eq('user_id', userId)
      .eq('industry', industry);

    if (error) {
      console.error('Error deleting cached engagement insight:', error);
    }
  } catch (error) {
    console.error('Error deleting cached engagement insight:', error);
  }
} 