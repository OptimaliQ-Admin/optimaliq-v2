import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { u_id, memberEmail, memberName, memberRole, memberDepartment } = await req.json();

    if (!u_id || !memberEmail || !memberName || !memberRole || !memberDepartment) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Check if team member already exists
    const { data: existingMember, error: checkError } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_u_id', u_id)
      .eq('member_email', memberEmail)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'Team member with this email already exists' },
        { status: 400 }
      );
    }

    // Add team member
    const { data: newMember, error: insertError } = await supabase
      .from('team_members')
      .insert({
        owner_u_id: u_id,
        member_email: memberEmail,
        member_name: memberName,
        role: memberRole,
        department: memberDepartment
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding team member:', insertError);
      return NextResponse.json(
        { error: 'Failed to add team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      teamMember: newMember
    });

  } catch (error: any) {
    console.error('Error in add-team-member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 