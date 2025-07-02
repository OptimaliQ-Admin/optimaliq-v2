import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/emailService';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { inviteeEmail, inviteeName, assessmentType, customMessage } = await request.json();

    // Validate input
    if (!inviteeEmail || !inviteeName || !assessmentType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get authenticated user
    const authHeader = request.headers.get('authorization');
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader) {
      console.log('No authorization header found');
      return NextResponse.json(
        { error: 'Unauthorized - No authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token ? 'Present' : 'Missing');
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    console.log('Auth result:', { user: !!user, error: authError });

    if (authError || !user) {
      console.log('Authentication failed:', { authError, user: !!user });
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

    // Generate secure token
    const { data: tokenData } = await supabase.rpc('generate_secure_token');
    const invitationToken = tokenData || Math.random().toString(36).substring(2);

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create invitation record
    const { data: invitation, error: insertError } = await supabase
      .from('assessment_invitations')
      .insert({
        inviter_u_id: user.id,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        assessment_type: assessmentType,
        invitation_token: invitationToken,
        expires_at: expiresAt.toISOString(),
        custom_message: customMessage || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Get inviter information for email
    const { data: inviterInfo } = await supabase
      .from('tier2_users')
      .select('first_name, last_name, company_name')
      .eq('u_id', user.id)
      .single();

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assessment-invitation/${invitationToken}`;
    
    await emailService.sendAssessmentInvitationEmail({
      to: inviteeEmail,
      firstName: inviteeName,
      inviterName: `${inviterInfo?.first_name || ''} ${inviterInfo?.last_name || ''}`.trim(),
      inviterCompany: inviterInfo?.company_name || '',
      assessmentTitle: assessmentType.replace('_', ' '),
      assessmentDescription: `Complete this assessment to help improve your organization's ${assessmentType.replace('_', ' ')} capabilities.`,
      invitationUrl,
      expiresAt: expiresAt.toLocaleDateString(),
      customMessage
    });

    return NextResponse.json({
      success: true,
      invitation: {
        id: invitation.id,
        inviteeEmail,
        inviteeName,
        assessmentType,
        status: 'pending',
        expiresAt
      }
    });

  } catch (error) {
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 