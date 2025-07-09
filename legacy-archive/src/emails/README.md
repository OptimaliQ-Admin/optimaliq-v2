# Email System Documentation

This directory contains the email templates and service for OptimaliQ's trial flow communications.

## Setup

### 1. Environment Variables
Make sure you have the following environment variables set:
```env
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_BASE_URL=https://optimaliq.ai
```

### 2. Email Sender Addresses
The system uses the following sender addresses:
- `trials@e.optimaliq.ai` - Trial welcome emails
- `support@e.optimaliq.ai` - Trial expiration and support emails
- `success@e.optimaliq.ai` - Trial conversion emails
- `founder@e.optimaliq.ai` - Feedback request emails

## Email Templates

### 1. WelcomeTrialEmail
**Trigger:** When a trial user is activated
**Subject:** "🎉 Welcome to your 30-Day Trial"
**Sender:** trials@e.optimaliq.ai

**Props:**
- `firstName` (string) - User's first name
- `companyName` (string, optional) - User's company name
- `trialEndDate` (string) - Formatted trial end date
- `dashboardUrl` (string) - Link to user's dashboard

### 2. TrialExpiringSoonEmail
**Trigger:** 7 days, 3 days, and 1 day before trial expiration
**Subject:** "⏰ Your trial ends soon - Don't lose access" or "⚠️ Trial Expires Soon - Action Required"
**Sender:** support@e.optimaliq.ai

**Props:**
- `firstName` (string) - User's first name
- `daysRemaining` (number) - Days until trial expires
- `trialEndDate` (string) - Formatted trial end date
- `upgradeUrl` (string) - Link to upgrade page
- `dashboardUrl` (string) - Link to user's dashboard

### 3. TrialConvertedEmail
**Trigger:** When a trial user upgrades to a paid plan
**Subject:** "🚀 You're all set — what's next?"
**Sender:** success@e.optimaliq.ai

**Props:**
- `firstName` (string) - User's first name
- `planName` (string) - Name of the plan they upgraded to
- `planPrice` (string) - Price of the plan
- `dashboardUrl` (string) - Link to user's dashboard
- `supportUrl` (string) - Link to support page

### 4. TrialExpiredEmail
**Trigger:** When a trial expires
**Subject:** "⏰ Your trial has expired - Reactivate now"
**Sender:** support@e.optimaliq.ai

**Props:**
- `firstName` (string) - User's first name
- `upgradeUrl` (string) - Link to upgrade page
- `supportUrl` (string) - Link to support page

### 5. FeedbackAskEmail
**Trigger:** 15 days into trial (optional)
**Subject:** "Can we get your quick thoughts?"
**Sender:** founder@e.optimaliq.ai

**Props:**
- `firstName` (string) - User's first name
- `feedbackUrl` (string) - Link to feedback form
- `dashboardUrl` (string) - Link to user's dashboard

## Usage

### Sending Emails
```typescript
import { emailService } from '@/lib/emailService';

// Send welcome trial email
await emailService.sendWelcomeTrialEmail({
  to: 'user@example.com',
  firstName: 'John',
  companyName: 'Acme Corp',
  trialEndDate: 'Friday, February 28, 2025',
  dashboardUrl: 'https://optimaliq.ai/premium/dashboard',
});

// Send trial expiring soon email
await emailService.sendTrialExpiringSoonEmail({
  to: 'user@example.com',
  firstName: 'John',
  daysRemaining: 3,
  trialEndDate: 'Friday, February 28, 2025',
  upgradeUrl: 'https://optimaliq.ai/premium/account/billing',
  dashboardUrl: 'https://optimaliq.ai/premium/dashboard',
});
```

### Utility Methods
```typescript
// Get base URLs for the application
const urls = emailService.getBaseUrls();

// Format a trial end date
const formattedDate = emailService.formatTrialEndDate(new Date());

// Calculate days remaining until trial expires
const daysRemaining = emailService.calculateDaysRemaining(trialEndDate);
```

## Testing

### Test API Endpoint
Use the test endpoint to verify email templates:

```bash
POST /api/test-email
Content-Type: application/json

{
  "email": "test@example.com",
  "template": "welcome-trial",
  "firstName": "John"
}
```

Valid templates:
- `welcome-trial`
- `trial-expiring-soon`
- `trial-converted`
- `trial-expired`
- `feedback-ask`

## Styling

All email templates use:
- **Font:** Inter (with system font fallbacks)
- **Colors:** Tailwind CSS color palette
- **Layout:** Responsive design with max-width of 600px
- **Branding:** OptimaliQ colors and styling

## Error Handling

The email service includes comprehensive error handling:
- Invalid email addresses
- Missing required fields
- Resend API errors
- Template rendering errors

All errors are logged to the console and thrown to be handled by the calling code.

## Best Practices

1. **Always await email sending** - The service methods are async
2. **Handle errors gracefully** - Wrap email sending in try-catch blocks
3. **Validate data** - Ensure all required fields are present
4. **Test templates** - Use the test endpoint to verify email appearance
5. **Monitor delivery** - Check Resend dashboard for delivery status 