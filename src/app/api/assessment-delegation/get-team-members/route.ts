import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { u_id } = await req.json();

    if (!u_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user has Strategic subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('u_id', u_id)
      .eq('status', 'active')
      .single();

    if (!subscription || subscription.plan !== 'strategic') {
      return NextResponse.json(
        { error: 'Assessment delegation requires Strategic plan subscription' },
        { status: 403 }
      );
    }

    // Get user's team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('team_members')
      .select('*')
      .eq('owner_u_id', u_id)
      .order('created_at', { ascending: false });

    if (teamMembersError) {
      console.error('Error fetching team members:', teamMembersError);
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      teamMembers: teamMembers || []
    });

  } catch (error: any) {
    console.error('Error in get-team-members:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 