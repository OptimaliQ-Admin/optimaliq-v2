import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/emailService';

export async function POST(req: NextRequest) {
  // Use service role key to bypass RLS policies
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const { u_id, inviteeEmail, inviteeName, assessmentType, customMessage } = await req.json();

    console.log('Send invitation request:', { u_id, inviteeEmail, inviteeName, assessmentType });

    if (!u_id || !inviteeEmail || !inviteeName || !assessmentType) {
      console.error('Missing required fields:', { u_id, inviteeEmail, inviteeName, assessmentType });
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

    console.log('Subscription check:', { subscription, subscriptionError });

    if (!subscription || subscription.plan !== 'strategic') {
      console.error('Subscription check failed:', { subscription, subscriptionError });
      return NextResponse.json(
        { error: 'Assessment delegation requires Strategic plan subscription' },
        { status: 403 }
      );
    }

    // Get inviter information for email
    const { data: inviterInfo, error: inviterError } = await supabase
      .from('users')
      .select('first_name, last_name, company')
      .eq('u_id', u_id)
      .single();

    console.log('Inviter info:', { inviterInfo, inviterError });

    // Generate invitation token
    const invitationToken = crypto.randomUUID();

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    console.log('Creating invitation with token:', invitationToken);

    // Create invitation record
    const { data: invitation, error: insertError } = await supabase
      .from('assessment_invitations')
      .insert({
        inviter_u_id: u_id,
        invitee_email: inviteeEmail,
        invitee_name: inviteeName,
        assessment_type: assessmentType,
        invitation_token: invitationToken,
        expires_at: expiresAt.toISOString(),
        custom_message: customMessage || null
      })
      .select()
      .single();

    console.log('Invitation creation result:', { invitation, insertError });

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invitation: ' + insertError.message },
        { status: 500 }
      );
    }

    // Send invitation email
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
      const invitationUrl = `${baseUrl}/premium/assessment/${assessmentType}?invitation=${invitationToken}`;
      
      console.log('Sending email to:', inviteeEmail, 'with URL:', invitationUrl);
      
      await emailService.sendAssessmentInvitationEmail({
        to: inviteeEmail,
        firstName: inviteeName,
        inviterName: `${inviterInfo?.first_name || ''} ${inviterInfo?.last_name || ''}`.trim(),
        inviterCompany: inviterInfo?.company || '',
        assessmentTitle: assessmentType.replace('_', ' '),
        assessmentDescription: `Complete this assessment to help improve your organization's ${assessmentType.replace('_', ' ')} capabilities.`,
        invitationUrl,
        expiresAt: expiresAt.toLocaleDateString(),
        customMessage
      });

      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({
      success: true,
      invitation: invitation
    });

  } catch (error: any) {
    console.error('Error in send-invitation:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
} 