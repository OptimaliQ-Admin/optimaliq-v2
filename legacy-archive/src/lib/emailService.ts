import { render } from '@react-email/render';
import { resend, EMAIL_SENDERS, EMAIL_TEMPLATES } from './resend';
import WelcomeTrialEmail from '../emails/WelcomeTrialEmail';
import TrialExpiringSoonEmail from '../emails/TrialExpiringSoonEmail';
import TrialConvertedEmail from '../emails/TrialConvertedEmail';
import TrialExpiredEmail from '../emails/TrialExpiredEmail';
import FeedbackAskEmail from '../emails/FeedbackAskEmail';
import AssessmentInvitationEmail from '../emails/AssessmentInvitationEmail';
import QuestionDelegationEmail from '../emails/QuestionDelegationEmail';

export interface EmailData {
  to: string;
  firstName: string;
  [key: string]: any;
}

export interface WelcomeTrialData extends EmailData {
  companyName?: string;
  trialEndDate: string;
  dashboardUrl: string;
}

export interface TrialExpiringSoonData extends EmailData {
  daysRemaining: number;
  trialEndDate: string;
  upgradeUrl: string;
  dashboardUrl: string;
}

export interface TrialConvertedData extends EmailData {
  planName: string;
  planPrice: string;
  dashboardUrl: string;
  supportUrl: string;
}

export interface TrialExpiredData extends EmailData {
  upgradeUrl: string;
  supportUrl: string;
}

export interface FeedbackAskData extends EmailData {
  feedbackUrl: string;
  dashboardUrl: string;
}

export interface AssessmentInvitationData extends EmailData {
  inviterName: string;
  inviterCompany: string;
  assessmentTitle: string;
  assessmentDescription: string;
  invitationUrl: string;
  expiresAt: string;
  customMessage?: string;
}

export interface QuestionDelegationData extends EmailData {
  delegatorName: string;
  assessmentTitle: string;
  questionCount: number;
  delegationUrl: string;
  expiresAt: string;
  customMessage?: string;
}

export interface PulseDelegationData {
  to: string;
  delegateName: string;
  pulseTitle: string;
  delegationUrl: string;
}

export interface PulseResponseData {
  to: string;
  respondentName: string;
  pulseTitle: string;
  responseUrl: string;
}

class EmailService {
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
    from: string = EMAIL_SENDERS.SUPPORT
  ) {
    if (!resend) {
      throw new Error('Resend client not available. Please set RESEND_API_KEY environment variable.');
    }

    try {
      const result = await resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendWelcomeTrialEmail(data: WelcomeTrialData) {
    const html = await render(
      WelcomeTrialEmail({
        firstName: data.firstName,
        email: data.to,
        companyName: data.companyName,
        trialEndDate: data.trialEndDate,
        dashboardUrl: data.dashboardUrl,
      })
    );

    return this.sendEmail(
      data.to,
      '🎉 Welcome to your 30-Day Trial',
      html,
      EMAIL_SENDERS.TRIALS
    );
  }

  async sendTrialExpiringSoonEmail(data: TrialExpiringSoonData) {
    const html = await render(
      TrialExpiringSoonEmail({
        firstName: data.firstName,
        daysRemaining: data.daysRemaining,
        trialEndDate: data.trialEndDate,
        upgradeUrl: data.upgradeUrl,
        dashboardUrl: data.dashboardUrl,
      })
    );

    const isUrgent = data.daysRemaining <= 3;
    const subject = isUrgent 
      ? '⚠️ Trial Expires Soon - Action Required'
      : '⏰ Your trial ends soon - Don\'t lose access';

    return this.sendEmail(
      data.to,
      subject,
      html,
      EMAIL_SENDERS.SUPPORT
    );
  }

  async sendTrialConvertedEmail(data: TrialConvertedData) {
    const html = await render(
      TrialConvertedEmail({
        firstName: data.firstName,
        planName: data.planName,
        planPrice: data.planPrice,
        dashboardUrl: data.dashboardUrl,
        supportUrl: data.supportUrl,
      })
    );

    return this.sendEmail(
      data.to,
      '🚀 You\'re all set — what\'s next?',
      html,
      EMAIL_SENDERS.SUCCESS
    );
  }

  async sendTrialExpiredEmail(data: TrialExpiredData) {
    const html = await render(
      TrialExpiredEmail({
        firstName: data.firstName,
        upgradeUrl: data.upgradeUrl,
        supportUrl: data.supportUrl,
      })
    );

    return this.sendEmail(
      data.to,
      '⏰ Your trial has expired - Reactivate now',
      html,
      EMAIL_SENDERS.SUPPORT
    );
  }

  async sendFeedbackAskEmail(data: FeedbackAskData) {
    const html = await render(
      FeedbackAskEmail({
        firstName: data.firstName,
        feedbackUrl: data.feedbackUrl,
        dashboardUrl: data.dashboardUrl,
      })
    );

    return this.sendEmail(
      data.to,
      'Can we get your quick thoughts?',
      html,
      EMAIL_SENDERS.FOUNDER
    );
  }

  async sendAssessmentInvitationEmail(data: AssessmentInvitationData) {
    const html = await render(
      AssessmentInvitationEmail({
        inviterName: data.inviterName,
        inviterCompany: data.inviterCompany,
        assessmentTitle: data.assessmentTitle,
        assessmentDescription: data.assessmentDescription,
        invitationUrl: data.invitationUrl,
        expiresAt: data.expiresAt,
        customMessage: data.customMessage,
      })
    );

    return this.sendEmail(
      data.to,
      `You've been invited to complete a ${data.assessmentTitle} assessment`,
      html,
      'assessments@e.optimaliq.ai'
    );
  }

  async sendQuestionDelegationEmail(data: QuestionDelegationData) {
    const html = await render(
      QuestionDelegationEmail({
        delegatorName: data.delegatorName,
        assessmentTitle: data.assessmentTitle,
        questionCount: data.questionCount,
        delegationUrl: data.delegationUrl,
        expiresAt: data.expiresAt,
        customMessage: data.customMessage,
      })
    );

    return this.sendEmail(
      data.to,
      `You've been assigned ${data.questionCount} questions for ${data.assessmentTitle}`,
      html,
      'assessments@e.optimaliq.ai'
    );
  }

  async sendPulseDelegationEmail(data: PulseDelegationData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Strategic Pulse Check Assignment</h2>
        <p>Hi ${data.delegateName},</p>
        <p>You've been assigned to manage a strategic pulse check for your team:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.pulseTitle}</h3>
        </div>
        <p>Please click the link below to review the questions and assign them to your team members:</p>
        <a href="${data.delegationUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Review & Assign Questions</a>
        <p>This link will expire in 7 days.</p>
        <p>Best regards,<br>The OptimalIQ Team</p>
      </div>
    `;

    return this.sendEmail(
      data.to,
      `Strategic Pulse Check: ${data.pulseTitle}`,
      html,
      'pulse@e.optimaliq.ai'
    );
  }

  async sendPulseResponseEmail(data: PulseResponseData) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Strategic Pulse Check - Your Response Needed</h2>
        <p>Hi ${data.respondentName},</p>
        <p>You've been invited to participate in a strategic pulse check:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #2563eb;">${data.pulseTitle}</h3>
        </div>
        <p>This is a quick 5-question survey that will take about 2-3 minutes to complete. Your responses are anonymous and will help leadership understand team sentiment and identify areas for improvement.</p>
        <a href="${data.responseUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Take Pulse Check</a>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">
          <strong>What to expect:</strong><br>
          • 5 quick questions (mix of ratings and open-ended)<br>
          • Anonymous responses<br>
          • Results shared with leadership only<br>
          • Takes 2-3 minutes to complete
        </p>
        <p>Best regards,<br>The OptimalIQ Team</p>
      </div>
    `;

    return this.sendEmail(
      data.to,
      `Pulse Check: ${data.pulseTitle}`,
      html,
      'pulse@e.optimaliq.ai'
    );
  }

  // Utility method to get base URLs
  getBaseUrls() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://optimaliq.ai';
    return {
      dashboard: `${baseUrl}/premium/dashboard`,
      upgrade: `${baseUrl}/premium/account/billing`,
      support: `${baseUrl}/support`,
      feedback: `${baseUrl}/feedback`,
    };
  }

  // Helper method to format trial end date
  formatTrialEndDate(endDate: Date): string {
    return endDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Helper method to calculate days remaining
  calculateDaysRemaining(endDate: Date): number {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}

export const emailService = new EmailService(); 