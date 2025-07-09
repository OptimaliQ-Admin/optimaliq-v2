import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, template, firstName } = await request.json();

    if (!email || !template || !firstName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, template, firstName' },
        { status: 400 }
      );
    }

    const baseUrls = emailService.getBaseUrls();
    const trialEndDate = emailService.formatTrialEndDate(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    );

    let result;

    switch (template) {
      case 'welcome-trial':
        result = await emailService.sendWelcomeTrialEmail({
          to: email,
          firstName,
          trialEndDate,
          dashboardUrl: baseUrls.dashboard,
        });
        break;

      case 'trial-expiring-soon':
        result = await emailService.sendTrialExpiringSoonEmail({
          to: email,
          firstName,
          daysRemaining: 3,
          trialEndDate,
          upgradeUrl: baseUrls.upgrade,
          dashboardUrl: baseUrls.dashboard,
        });
        break;

      case 'trial-converted':
        result = await emailService.sendTrialConvertedEmail({
          to: email,
          firstName,
          planName: 'Accelerator Plan',
          planPrice: '$97/month',
          dashboardUrl: baseUrls.dashboard,
          supportUrl: baseUrls.support,
        });
        break;

      case 'trial-expired':
        result = await emailService.sendTrialExpiredEmail({
          to: email,
          firstName,
          upgradeUrl: baseUrls.upgrade,
          supportUrl: baseUrls.support,
        });
        break;

      case 'feedback-ask':
        result = await emailService.sendFeedbackAskEmail({
          to: email,
          firstName,
          feedbackUrl: baseUrls.feedback,
          dashboardUrl: baseUrls.dashboard,
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid template. Valid templates: welcome-trial, trial-expiring-soon, trial-converted, trial-expired, feedback-ask' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully using ${template} template`,
      result,
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 