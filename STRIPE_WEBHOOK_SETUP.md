# Stripe Webhook Setup Guide

This guide explains how to set up Stripe webhooks to handle subscription status changes and ensure premium access control.

## 🎯 Overview

The webhook system automatically updates user subscription status in Supabase when Stripe events occur, ensuring that canceled or expired users cannot access premium features.

## 🔧 Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_... # Webhook endpoint secret (see setup below)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # Your app URL

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key # Required for webhook operations
```

## 📡 Webhook Setup in Stripe Dashboard

### 1. Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
   - `invoice.payment_succeeded`

### 2. Get Webhook Secret

1. After creating the webhook, click on it
2. Copy the "Signing secret" (starts with `whsec_`)
3. Add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

## 🗄️ Database Schema Requirements

Ensure your Supabase database has these tables:

### `subscriptions` table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  u_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive',
  plan TEXT,
  billingCycle TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP,
  stripe_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `profiles` table
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 How It Works

### 1. Webhook Processing
- Stripe sends events to `/api/stripe/webhook`
- Webhook verifies signature using `STRIPE_WEBHOOK_SECRET`
- Updates subscription status in Supabase based on event type

### 2. Subscription Status Updates
- **Active**: User has premium access
- **Canceled**: Subscription ended, no premium access
- **Past Due**: Payment failed, no premium access
- **Incomplete**: Payment setup incomplete, no premium access

### 3. Access Control
- Middleware checks subscription status on premium routes
- Users with inactive subscriptions are redirected to `/subscribe`
- Subscription status banner shows warnings for inactive subscriptions

## 🛡️ Security Features

- **Signature Verification**: All webhook requests are verified using Stripe's signature
- **Authentication**: Webhook handlers require valid Supabase authentication
- **Error Handling**: Comprehensive error handling and logging
- **Fallback Logic**: Graceful degradation if Stripe is temporarily unavailable

## 🧪 Testing

### Test Webhook Locally
1. Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
2. This will give you a webhook secret to use locally

### Test Events
You can trigger test events in the Stripe Dashboard:
1. Go to Webhooks → Your endpoint → "Send test webhook"
2. Select event types to test
3. Verify database updates

## 📊 Monitoring

### Logs to Monitor
- Webhook signature verification failures
- Database update errors
- Subscription status changes
- User premium status updates

### Key Metrics
- Webhook delivery success rate
- Subscription status distribution
- Premium access denials

## 🚨 Troubleshooting

### Common Issues

1. **Webhook signature verification fails**
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook URL is accessible

2. **Database updates fail**
   - Verify `SUPABASE_SERVICE_ROLE_KEY` has write permissions
   - Check database schema matches requirements

3. **Users still accessing premium features**
   - Clear browser cache and localStorage
   - Check middleware is properly configured
   - Verify subscription status in database

### Debug Steps
1. Check webhook logs in Stripe Dashboard
2. Monitor application logs for errors
3. Verify database records are updated
4. Test subscription status checks manually

## 🔄 Manual Subscription Status Check

You can manually check a user's subscription status:

```typescript
import { checkSubscriptionStatus } from '@/lib/utils/subscriptionCheck';

const result = await checkSubscriptionStatus(userId);
console.log('Has active subscription:', result.hasActiveSubscription);
console.log('Status:', result.subscriptionStatus);
```

## 📝 API Endpoints

### Webhook Endpoint
- **URL**: `/api/stripe/webhook`
- **Method**: POST
- **Purpose**: Handle Stripe webhook events

### Subscription Status
- **URL**: `/api/premium/account/subscription`
- **Method**: POST
- **Purpose**: Get user's subscription data

### Next Billing Date
- **URL**: `/api/premium/account/next-billing-date`
- **Method**: POST
- **Purpose**: Get accurate next billing date from Stripe

## 🎉 Success Criteria

✅ Webhook receives and processes Stripe events  
✅ Database is updated with correct subscription status  
✅ Users with inactive subscriptions are blocked from premium features  
✅ Subscription status banner displays appropriate warnings  
✅ Middleware redirects inactive users to subscribe page  
✅ All error scenarios are handled gracefully 