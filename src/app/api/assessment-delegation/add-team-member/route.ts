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
    console.log('Auth header received (add team member):', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('No authorization header found (add team member)');
      return NextResponse.json(
        { error: 'Unauthorized - No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted (add team member):', token ? 'Present' : 'Missing');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('Auth result (add team member):', { user: !!user, error: authError });

    if (authError || !user) {
      console.log('Authentication failed (add team member):', { authError, user: !!user });
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check subscription level (Strategic plan required)
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('u_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription || subscription.plan !== 'Strategic') {
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