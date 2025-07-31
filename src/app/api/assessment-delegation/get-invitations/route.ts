import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  // Use service role key to bypass RLS policies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { u_id, invitationToken } = await req.json();

    // Handle single invitation lookup (for invited assessments)
    if (invitationToken) {
      const { data: invitation, error: invitationError } = await supabase
        .from('assessment_invitations')
        .select(`
          *,
          inviter:users!inviter_id(first_name, last_name, company)
        `)
        .eq('invitation_token', invitationToken)
        .single();

      if (invitationError) {
        console.error('Error fetching invitation:', invitationError);
        return NextResponse.json(
          { error: 'Invitation not found or expired' },
          { status: 404 }
        );
      }

      // Add inviter name to the response
      const inviterName = invitation.inviter 
        ? `${invitation.inviter.first_name || ''} ${invitation.inviter.last_name || ''}`.trim()
        : 'Team Member';

      return NextResponse.json({
        invitation: {
          ...invitation,
          inviter_name: inviterName
        }
      });
    }

    // Handle user invitations (existing functionality)
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

    // Get user's invitations
    const { data: invitations, error: invitationsError } = await supabase
      .from('assessment_invitations')
      .select('*')
      .eq('inviter_u_id', u_id)
      .order('created_at', { ascending: false });

    if (invitationsError) {
      console.error('Error fetching invitations:', invitationsError);
      return NextResponse.json(
        { error: 'Failed to fetch invitations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      invitations: invitations || []
    });

  } catch (error: any) {
    console.error('Error in get-invitations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 