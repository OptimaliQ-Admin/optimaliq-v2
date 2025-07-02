import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check subscription level (Strategic plan required)
    const { data: profile } = await supabase
      .from('tier2_profiles')
      .select('subscription_tier')
      .eq('u_id', user.id)
      .single();

    if (!profile || profile.subscription_tier !== 'strategic') {
      return NextResponse.json(
        { error: 'Assessment delegation requires Strategic plan subscription' },
        { status: 403 }
      );
    }

    // Get invitations
    const { data: invitations, error: fetchError } = await supabase
      .from('assessment_invitations')
      .select('*')
      .eq('inviter_u_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching invitations:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invitations: invitations || []
    });

  } catch (error) {
    console.error('Error getting invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 