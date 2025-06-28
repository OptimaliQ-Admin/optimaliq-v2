import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender addresses
export const EMAIL_SENDERS = {
  TRIALS: 'trials@e.optimaliq.ai',
  SUPPORT: 'support@e.optimaliq.ai',
  SUCCESS: 'success@e.optimaliq.ai',
  FOUNDER: 'founder@e.optimaliq.ai',
} as const;

// Email template types
export const EMAIL_TEMPLATES = {
  TRIAL_STARTED: 'trial-started',
  TRIAL_EXPIRING_SOON: 'trial-expiring-soon',
  TRIAL_CONVERTED: 'trial-converted',
  TRIAL_EXPIRED: 'trial-expired',
  FEEDBACK_ASK: 'feedback-ask',
} as const;

export type EmailSender = typeof EMAIL_SENDERS[keyof typeof EMAIL_SENDERS];
export type EmailTemplate = typeof EMAIL_TEMPLATES[keyof typeof EMAIL_TEMPLATES]; 