# Environment Setup Guide

This guide will help you set up the required environment variables to fix the "supabaseKey is required" error.

## 🚨 Current Issue

You're seeing this error because the required environment variables are not set:
```
supabaseKey is required.
```

## 🔧 Required Environment Variables

Create a `.env.local` file in the root directory of your project with the following variables:

```bash
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI Configuration (for AI features)
OPENAI_API_KEY=your-openai-api-key

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Price IDs
STRIPE_PRICE_ACCELERATOR_MONTHLY=your-monthly-price-id
STRIPE_PRICE_ACCELERATOR_ANNUAL=your-annual-price-id

# External API Keys (for market data)
FINNHUB_API_KEY=your-finnhub-api-key
NEWSAPI_KEY=your-newsapi-key

# Security
CRON_SECRET=your-cron-secret
NEXT_PUBLIC_CRON_SECRET=your-public-cron-secret

# reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key

# Feature Flags
NEXT_PUBLIC_DISABLE_SUBSCRIPTION_CHECK=false
```

## 📍 Where to Find These Values

### Supabase Configuration
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy it to `OPENAI_API_KEY`

### Stripe Configuration
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your secret key from Developers → API keys
3. Set up webhooks and get the webhook secret
4. Get your price IDs from Products

## 🚀 Quick Start (Minimal Setup)

If you just want to fix the immediate error and access the admin dashboard, you only need these **3 variables**:

```bash
# Minimum required for admin dashboard
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

## 🔄 After Setting Environment Variables

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Clear browser cache** and refresh the page

3. **Check the console** for any remaining errors

## 🛠️ Troubleshooting

### Still seeing "supabaseKey is required"?
1. Make sure `.env.local` is in the root directory (same level as `package.json`)
2. Restart your development server
3. Check that the file doesn't have any extra spaces or quotes
4. Verify the Supabase URL and keys are correct

### Admin dashboard not working?
1. Ensure you have admin role in the `tier2_users` table
2. Check that all 3 Supabase environment variables are set
3. Look at the browser console for specific error messages

### Other features not working?
- Add the additional environment variables as needed
- Check the console for specific error messages
- Some features may work without all variables (with reduced functionality)

## 🔒 Security Notes

- **Never commit `.env.local` to version control**
- The `.env.local` file is already in `.gitignore`
- Keep your service role key secure - it has full database access
- Use different keys for development and production

## 📞 Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project is active and accessible
3. Ensure you have the correct permissions in your Supabase project 