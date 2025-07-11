import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { businessTrendAnalysis, UserTier } from '@/lib/ai/businessTrendAnalysis';
import { getErrorMessage } from '@/utils/errorHandler';
import { SharedCaching } from '@/lib/ai/sharedCaching';

// Helper function to determine user tier
async function getUserTier(supabase: any, userId: string): Promise<UserTier> {
  try {
    // Check if user has premium subscription (active paid subscription only)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (subscription && new Date(subscription.current_period_end) > new Date()) {
      return 'premium';
    }
  } catch (error) {
    console.log('No active premium subscription found, using free tier');
  }
  return 'free';
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

    console.log(`🎯 Business Trends API called for ${industry} (${userTier} user)`);

    // Use shared caching system
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'business_trends';

    let trends;

    if (forceRefresh) {
      // Force refresh
      trends = await sharedCache.forceRefreshInsight(
        user.id,
        industry,
        tableName,
        () => businessTrendAnalysis.generateBusinessTrends(user.id, industry, userTier),
        '2.0',
        undefined,
        { userTier }
      );
    } else {
      // Normal flow with caching
      trends = await sharedCache.generateInsightWithCache(
        user.id,
        industry,
        tableName,
        () => businessTrendAnalysis.generateBusinessTrends(user.id, industry, userTier),
        '2.0',
        false,
        undefined,
        { userTier }
      );
    }

    console.log(`✅ Business Trends generated successfully`);
    console.log(`   Trends: ${trends.length}`);

    return NextResponse.json({
      success: true,
      data: {
        trends,
        userTier,
        industry,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Business Trends API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate business trends',
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

    console.log(`🔄 Force refresh business trends for ${industry} (${userTier} user)`);

    // Use shared caching system for force refresh
    const sharedCache = SharedCaching.getInstance();
    const tableName = 'business_trends';

    const trends = await sharedCache.forceRefreshInsight(
      user.id,
      industry,
      tableName,
      () => businessTrendAnalysis.generateBusinessTrends(user.id, industry, userTier),
      '2.0',
      undefined,
      { userTier }
    );

    console.log(`✅ Business Trends force refresh completed`);
    console.log(`   Trends: ${trends.length}`);

    return NextResponse.json({
      success: true,
      data: {
        trends,
        userTier,
        industry,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Business Trends Force Refresh Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to refresh business trends',
        details: getErrorMessage(error)
      },
      { status: 500 }
    );
  }
} 