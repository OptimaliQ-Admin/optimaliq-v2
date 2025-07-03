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