import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { businessTrendAnalysis, UserTier } from '@/lib/ai/businessTrendAnalysis';

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

    // Generate business trends using AI with smart model selection
    const trends = await businessTrendAnalysis.generateBusinessTrends(user.id, industry, userTier);

    return NextResponse.json({
      trends,
      userTier,
      industry,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating business trends:', error);
    return NextResponse.json(
      { error: 'Failed to generate business trends' },
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

    // Generate business trends using AI with smart model selection
    const trends = await businessTrendAnalysis.generateBusinessTrends(user.id, industry, userTier);

    return NextResponse.json({
      trends,
      userTier,
      industry,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating business trends:', error);
    return NextResponse.json(
      { error: 'Failed to generate business trends' },
      { status: 500 }
    );
  }
} 