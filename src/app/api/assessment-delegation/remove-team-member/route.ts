import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: NextRequest) {
  try {
    const { u_id, memberId } = await request.json();

    if (!u_id || !memberId) {
      return NextResponse.json(
        { error: 'User ID and member ID are required' },
        { status: 400 }
      );
    }

    // Check if user has Strategic subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("u_id", u_id)
      .eq("status", "active")
      .single();

    if (!subscription || subscription.plan !== 'strategic') {
      return NextResponse.json(
        { error: 'Assessment delegation requires Strategic plan subscription' },
        { status: 403 }
      );
    }

    // Verify the team member belongs to the user
    const { data: teamMember, error: teamMemberError } = await supabase
      .from('team_members')
      .select('id')
      .eq('id', memberId)
      .eq('owner_u_id', u_id)
      .single();

    if (!teamMember) {
      return NextResponse.json(
        { error: 'Team member not found or access denied' },
        { status: 404 }
      );
    }

    // Delete team member
    const { error: deleteError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId)
      .eq('owner_u_id', u_id);

    if (deleteError) {
      console.error('Error deleting team member:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully'
    });

  } catch (error: any) {
    console.error('Error removing team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 