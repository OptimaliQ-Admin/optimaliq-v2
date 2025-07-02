import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/emailService';

// Use service role key to bypass RLS policies
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { u_id, inviteeEmail, inviteeName, assessmentType, customMessage } = await req.json();

    if (!u_id || !inviteeEmail || !inviteeName || !assessmentType) {
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

    // Get inviter information for email
    const { data: inviterInfo } = await supabase
      .from('tier2_users')
      .select('first_name, last_name, company')
      .eq('u_id', u_id)
      .single();

    // Generate invitation token
    const invitationToken = crypto.randomUUID();

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

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

    if (insertError) {
      console.error('Error creating invitation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Send invitation email
    try {
      const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/assessment-invitation/${invitationToken}`;
      
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 