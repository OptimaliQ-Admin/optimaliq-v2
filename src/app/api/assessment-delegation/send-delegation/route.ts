import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/emailService';

const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }

    const { delegateEmail, delegateName, assessmentType, questionKeys, customMessage } = await request.json();

    // Validate input
    if (!delegateEmail || !delegateName || !assessmentType || !questionKeys || questionKeys.length === 0) {
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
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan, status')
      .eq('u_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription || subscription.plan !== 'strategic') {
      return NextResponse.json(
        { error: 'Question delegation requires Strategic plan subscription' },
        { status: 403 }
      );
    }

    // Generate secure token
    const { data: tokenData } = await supabase.rpc('generate_secure_token');
    const delegationToken = tokenData || Math.random().toString(36).substring(2);

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create delegation record
    const { data: delegation, error: insertError } = await supabase
      .from('question_delegations')
      .insert({
        delegator_u_id: user.id,
        delegate_email: delegateEmail,
        delegate_name: delegateName,
        assessment_type: assessmentType,
        question_keys: questionKeys,
        delegation_token: delegationToken,
        expires_at: expiresAt.toISOString(),
        custom_message: customMessage || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating delegation:', insertError);
      return NextResponse.json(
        { error: 'Failed to create delegation' },
        { status: 500 }
      );
    }

    // Get delegator information for email
    const { data: delegatorInfo } = await supabase
      .from('users')
      .select('first_name, last_name, company')
      .eq('u_id', user.id)
      .single();

    // Send delegation email
    const delegationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai'}/question-delegation/${delegationToken}`;
    
    await emailService.sendQuestionDelegationEmail({
      to: delegateEmail,
      firstName: delegateName,
      delegatorName: `${delegatorInfo?.first_name || ''} ${delegatorInfo?.last_name || ''}`.trim(),
      assessmentTitle: assessmentType.replace('_', ' '),
      questionCount: questionKeys.length,
      delegationUrl,
      expiresAt: expiresAt.toLocaleDateString(),
      customMessage
    });

    return NextResponse.json({
      success: true,
      delegation: {
        id: delegation.id,
        delegateEmail,
        delegateName,
        assessmentType,
        questionKeys,
        status: 'pending',
        expiresAt
      }
    });

  } catch (error) {
    console.error('Error sending delegation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 