// Email Templates
export { default as WelcomeTrialEmail } from './WelcomeTrialEmail';
export { default as TrialExpiringSoonEmail } from './TrialExpiringSoonEmail';
export { default as TrialConvertedEmail } from './TrialConvertedEmail';
export { default as TrialExpiredEmail } from './TrialExpiredEmail';
export { default as FeedbackAskEmail } from './FeedbackAskEmail';

// Email Service
export { emailService } from '../lib/emailService';
export type {
  EmailData,
  WelcomeTrialData,
  TrialExpiringSoonData,
  TrialConvertedData,
  TrialExpiredData,
  FeedbackAskData,
} from '../lib/emailService';

// Resend Configuration
export { resend, EMAIL_SENDERS, EMAIL_TEMPLATES } from '../lib/resend'; 