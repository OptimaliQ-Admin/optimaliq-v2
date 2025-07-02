import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { memberEmail, memberName, memberRole } = await request.json();

    // Validate input
    if (!memberEmail || !memberName || !memberRole) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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

    // Check if team member already exists
    const { data: existingMember } = await supabase
      .from('team_members')
      .select('id')
      .eq('owner_u_id', user.id)
      .eq('member_email', memberEmail)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: 'Team member with this email already exists' },
        { status: 409 }
      );
    }

    // Create team member record
    const { data: teamMember, error: insertError } = await supabase
      .from('team_members')
      .insert({
        owner_u_id: user.id,
        member_email: memberEmail,
        member_name: memberName,
        role: memberRole
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating team member:', insertError);
      return NextResponse.json(
        { error: 'Failed to create team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      teamMember: {
        id: teamMember.id,
        memberEmail,
        memberName,
        memberRole,
        createdAt: teamMember.created_at
      }
    });

  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 