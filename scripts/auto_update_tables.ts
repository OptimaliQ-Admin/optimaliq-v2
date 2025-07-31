#!/usr/bin/env tsx

/**
 * Auto-generated script to update table references
 * Run this script to automatically update all table references
 */

import fs from 'fs';
import path from 'path';

async function updateFiles() {
  const updates = [
    {
      file: 'src/middleware.ts',
      replacements: [
        {
          from: "// Get user's subscription status from new subscriptions table",
          to: "// Get user's subscription status from new subscriptions table"
        },
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/hooks/useRealtimeDashboard.ts',
      replacements: [
        {
          from: "import { RealtimeManager } from '@/lib/realtime/subscriptions'",
          to: "import { RealtimeManager } from '@/lib/realtime/subscriptions'"
        },
      ]
    },
    {
      file: 'src/context/PremiumUserContext.tsx',
      replacements: [
        {
          from: "// Types from your tier2_users table",
          to: "// Types from your users table"
        },
      ]
    },
    {
      file: 'src/lib/utils/subscriptionCheck.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/lib/utils/auditLogger.ts',
      replacements: [
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/lib/types/database.ts',
      replacements: [
        {
          from: "subscriptions: {",
          to: "subscriptions: {"
        },
        {
          from: "onboarding_assessments: {",
          to: "onboarding_sessions: {"
        },
        {
          from: "export type OnboardingAssessment = Database['public']['Tables']['onboarding_assessments']['Row']",
          to: "export type OnboardingAssessment = Database['public']['Tables']['onboarding_sessions']['Row']"
        },
        {
          from: "export type OnboardingAssessmentInsert = Database['public']['Tables']['onboarding_assessments']['Insert']",
          to: "export type OnboardingAssessmentInsert = Database['public']['Tables']['onboarding_sessions']['Insert']"
        },
        {
          from: "export type OnboardingAssessmentUpdate = Database['public']['Tables']['onboarding_assessments']['Update']",
          to: "export type OnboardingAssessmentUpdate = Database['public']['Tables']['onboarding_sessions']['Update']"
        },
      ]
    },
    {
      file: 'src/lib/realtime/subscriptions.ts',
      replacements: [
        {
          from: "private subscriptions: Map<string, RealtimeChannel> = new Map()",
          to: "private subscriptions: Map<string, RealtimeChannel> = new Map()"
        },
        {
          from: "if (this.subscriptions.has(channelId)) {",
          to: "if (this.subscriptions.has(channelId)) {"
        },
        {
          from: "return this.subscriptions.get(channelId)!",
          to: "return this.subscriptions.get(channelId)!"
        },
        {
          from: "this.subscriptions.set(channelId, channel)",
          to: "this.subscriptions.set(channelId, channel)"
        },
        {
          from: "if (this.subscriptions.has(channelId)) {",
          to: "if (this.subscriptions.has(channelId)) {"
        },
        {
          from: "return this.subscriptions.get(channelId)!",
          to: "return this.subscriptions.get(channelId)!"
        },
        {
          from: "this.subscriptions.set(channelId, channel)",
          to: "this.subscriptions.set(channelId, channel)"
        },
        {
          from: "if (this.subscriptions.has(channelId)) {",
          to: "if (this.subscriptions.has(channelId)) {"
        },
        {
          from: "return this.subscriptions.get(channelId)!",
          to: "return this.subscriptions.get(channelId)!"
        },
        {
          from: "this.subscriptions.set(channelId, channel)",
          to: "this.subscriptions.set(channelId, channel)"
        },
        {
          from: "if (this.subscriptions.has(channelId)) {",
          to: "if (this.subscriptions.has(channelId)) {"
        },
        {
          from: "return this.subscriptions.get(channelId)!",
          to: "return this.subscriptions.get(channelId)!"
        },
        {
          from: "this.subscriptions.set(channelId, channel)",
          to: "this.subscriptions.set(channelId, channel)"
        },
        {
          from: "if (this.subscriptions.has(channelId)) {",
          to: "if (this.subscriptions.has(channelId)) {"
        },
        {
          from: "return this.subscriptions.get(channelId)!",
          to: "return this.subscriptions.get(channelId)!"
        },
        {
          from: "this.subscriptions.set(channelId, channel)",
          to: "this.subscriptions.set(channelId, channel)"
        },
        {
          from: "this.subscriptions.forEach((channel, channelId) => {",
          to: "this.subscriptions.forEach((channel, channelId) => {"
        },
        {
          from: "this.subscriptions.clear()",
          to: "this.subscriptions.clear()"
        },
        {
          from: "const channel = this.subscriptions.get(channelId)",
          to: "const channel = this.subscriptions.get(channelId)"
        },
        {
          from: "this.subscriptions.delete(channelId)",
          to: "this.subscriptions.delete(channelId)"
        },
        {
          from: "connected: this.subscriptions.size > 0,",
          to: "connected: this.subscriptions.size > 0,"
        },
        {
          from: "channels: Array.from(this.subscriptions.keys())",
          to: "channels: Array.from(this.subscriptions.keys())"
        },
        {
          from: "const channel = channelId ? this.subscriptions.get(channelId) : null",
          to: "const channel = channelId ? this.subscriptions.get(channelId) : null"
        },
      ]
    },
    {
      file: 'src/lib/ai/realtime.ts',
      replacements: [
        {
          from: "private subscriptions: Map<string, any> = new Map()",
          to: "private subscriptions: Map<string, any> = new Map()"
        },
        {
          from: "this.subscriptions.set('event_broadcast', subscription)",
          to: "this.subscriptions.set('event_broadcast', subscription)"
        },
        {
          from: "for (const [name, subscription] of this.subscriptions) {",
          to: "for (const [name, subscription] of this.subscriptions) {"
        },
        {
          from: "this.subscriptions.clear()",
          to: "this.subscriptions.clear()"
        },
      ]
    },
    {
      file: 'src/components/subscribe/SubscribeForm.tsx',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/components/admin/EmailSubscriptionsManager.tsx',
      replacements: [
        {
          from: "const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);",
          to: "const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);"
        },
        {
          from: ".from(\"email_subscriptions\")",
          to: ".from(\"email_subscriptions\")"
        },
        {
          from: "console.error(\"Error fetching subscriptions:\", error);",
          to: "console.error(\"Error fetching subscriptions:\", error);"
        },
        {
          from: "showToast.error(\"Failed to fetch subscriptions\");",
          to: "showToast.error(\"Failed to fetch subscriptions\");"
        },
        {
          from: "console.error(\"Error fetching subscriptions:\", error);",
          to: "console.error(\"Error fetching subscriptions:\", error);"
        },
        {
          from: "showToast.error(\"Failed to fetch subscriptions\");",
          to: "showToast.error(\"Failed to fetch subscriptions\");"
        },
        {
          from: ".from(\"email_subscriptions\")",
          to: ".from(\"email_subscriptions\")"
        },
        {
          from: "...subscriptions.map(sub => [",
          to: "...subscriptions.map(sub => ["
        },
        {
          from: "a.download = `email_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;",
          to: "a.download = `email_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;"
        },
        {
          from: "{subscriptions.map((subscription) => (",
          to: "{subscriptions.map((subscription) => ("
        },
        {
          from: "{subscriptions.length === 0 && (",
          to: "{subscriptions.length === 0 && ("
        },
        {
          from: "<p className=\"text-gray-500\">No email subscriptions found.</p>",
          to: "<p className=\"text-gray-500\">No email subscriptions found.</p>"
        },
      ]
    },
    {
      file: 'src/components/admin/AdminDashboard.tsx',
      replacements: [
        {
          from: "type TabType = 'overview' | 'audit-logs' | 'email-subscriptions' | 'trial-users';",
          to: "type TabType = 'overview' | 'audit-logs' | 'email-subscriptions' | 'trial-users';"
        },
        {
          from: "{ id: 'email-subscriptions', label: 'Email Subscriptions', icon: '📧' },",
          to: "{ id: 'email-subscriptions', label: 'Email Subscriptions', icon: '📧' },"
        },
        {
          from: "onClick={() => setActiveTab('email-subscriptions')}",
          to: "onClick={() => setActiveTab('email-subscriptions')}"
        },
        {
          from: "placeholder=\"e.g., tier2_users\"",
          to: "placeholder=\"e.g., users\""
        },
        {
          from: "case 'email-subscriptions':",
          to: "case 'email-subscriptions':"
        },
      ]
    },
    {
      file: 'src/app/subscribe/page.tsx',
      replacements: [
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/refund/page.tsx',
      replacements: [
        {
          from: "All monthly subscriptions are final and non-refundable. You may cancel your subscription at any time to avoid future charges, but no partial or prorated refunds will be issued for the current billing cycle.",
          to: "All monthly subscriptions are final and non-refundable. You may cancel your subscription at any time to avoid future charges, but no partial or prorated refunds will be issued for the current billing cycle."
        },
      ]
    },
    {
      file: 'src/lib/database/migrations/migrate_to_world_class_schema.ts',
      replacements: [
        {
          from: "// Get existing tier2_users",
          to: "// Get existing users"
        },
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
        {
          from: "// Get existing onboarding_assessments",
          to: "// Get existing onboarding_sessions"
        },
        {
          from: ".from('onboarding_assessments')",
          to: ".from('onboarding_sessions')"
        },
        {
          from: ".from('onboarding_assessments')",
          to: ".from('onboarding_sessions')"
        },
        {
          from: "source: 'legacy_onboarding_assessments',",
          to: "source: 'legacy_onboarding_sessions',"
        },
        {
          from: "this.supabase.from('onboarding_assessments').select('*', { count: 'exact', head: true }),",
          to: "this.supabase.from('onboarding_sessions').select('*', { count: 'exact', head: true }),"
        },
      ]
    },
    {
      file: 'src/app/subscribe/trial-signup/TrialSignupForm.tsx',
      replacements: [
        {
          from: "// Create tier2_users record",
          to: "// Create users record"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "console.error(\"Error creating tier2_users record:\", tier2Error);",
          to: "console.error(\"Error creating users record:\", tier2Error);"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/subscribe/thank-you/page.tsx',
      replacements: [
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/subscribe/recover-create-account/RecoverCreateAccountForm.tsx',
      replacements: [
        {
          from: "// If UUID exists in tier2_users, it will be updated with Auth user ID",
          to: "// If UUID exists in users, it will be updated with Auth user ID"
        },
      ]
    },
    {
      file: 'src/app/question-delegation/[token]/page.tsx',
      replacements: [
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/assessment-invitation/[token]/page.tsx',
      replacements: [
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/api/dashboard/route.ts',
      replacements: [
        {
          from: "// Fetch latest onboarding session (replaces onboarding_assessments)",
          to: "// Fetch latest onboarding session (replaces onboarding_sessions)"
        },
      ]
    },
    {
      file: 'src/app/premium/assessment/[slug]/client.tsx',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/profile/update/route.ts',
      replacements: [
        {
          from: ".from(\"onboarding_assessments\")",
          to: ".from(\"onboarding_sessions\")"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/stripe/webhook/route.ts',
      replacements: [
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: "// First, get the user ID from the subscriptions table",
          to: "// First, get the user ID from the subscriptions table"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/api/newsletter/subscribe/route.ts',
      replacements: [
        {
          from: ".from(\"email_subscriptions\")",
          to: ".from(\"email_subscriptions\")"
        },
        {
          from: ".from(\"email_subscriptions\")",
          to: ".from(\"email_subscriptions\")"
        },
        {
          from: ".from(\"email_subscriptions\")",
          to: ".from(\"email_subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/api/market-insights/enhanced/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/growth_studio/levers/route.ts',
      replacements: [
        {
          from: "// Fetch user's industry from tier2_users",
          to: "// Fetch user's industry from users"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/dashboard/welcome_message/route.ts',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/cron/send-trial-expiring-notifications/route.ts',
      replacements: [
        {
          from: "tier2_users!inner(email, first_name)",
          to: "users!inner(email, first_name)"
        },
        {
          from: "to: trial.tier2_users.email,",
          to: "to: trial.users.email,"
        },
        {
          from: "firstName: trial.tier2_users.first_name,",
          to: "firstName: trial.users.first_name,"
        },
        {
          from: "console.log(`Sent ${daysRemaining}-day expiring notification for trial: ${trial.id} for user: ${trial.tier2_users.email}`);",
          to: "console.log(`Sent ${daysRemaining}-day expiring notification for trial: ${trial.id} for user: ${trial.users.email}`);"
        },
      ]
    },
    {
      file: 'src/app/api/cron/cleanup-trial-records/route.ts',
      replacements: [
        {
          from: "// 2. Clean up orphaned trial records (trials without corresponding tier2_users)",
          to: "// 2. Clean up orphaned trial records (trials without corresponding users)"
        },
        {
          from: "subscriptions!inner(status)",
          to: "subscriptions!inner(status)"
        },
        {
          from: "if (trial.subscriptions && trial.subscriptions.length > 0) {",
          to: "if (trial.subscriptions && trial.subscriptions.length > 0) {"
        },
        {
          from: "const subscription = trial.subscriptions[0];",
          to: "const subscription = trial.subscriptions[0];"
        },
      ]
    },
    {
      file: 'src/app/api/cron/check-trial-expiration/route.ts',
      replacements: [
        {
          from: "tier2_users!inner(email, first_name)",
          to: "users!inner(email, first_name)"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: "to: trial.tier2_users.email,",
          to: "to: trial.users.email,"
        },
        {
          from: "firstName: trial.tier2_users.first_name,",
          to: "firstName: trial.users.first_name,"
        },
        {
          from: "console.log(`Processed expired trial: ${trial.id} for user: ${trial.tier2_users.email}`);",
          to: "console.log(`Processed expired trial: ${trial.id} for user: ${trial.users.email}`);"
        },
      ]
    },
    {
      file: 'src/app/api/auth/check-email-status/route.ts',
      replacements: [
        {
          from: "// ✅ 1. Check if user exists in tier2_users",
          to: "// ✅ 1. Check if user exists in users"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "console.error(\"Error checking tier2_users:\", tier2Error);",
          to: "console.error(\"Error checking users:\", tier2Error);"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: "// User has both tier2_users record and Auth account",
          to: "// User has both users record and Auth account"
        },
      ]
    },
    {
      file: 'src/app/api/business-trends/enhanced/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/send-delegation/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/send-invitation/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/get-team-members/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/get-invitations/route.ts',
      replacements: [
        {
          from: "inviter:tier2_users!inviter_u_id(first_name, last_name, company)",
          to: "inviter:users!inviter_id(first_name, last_name, company)"
        },
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/remove-team-member/route.ts',
      replacements: [
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/api/assessment-delegation/add-team-member/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/admin/updateProfileAfterSignup/route.ts',
      replacements: [
        {
          from: "// ✅ 2. Update tier2_users with new data",
          to: "// ✅ 2. Update users with new data"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "console.error(\"❌ Error updating tier2_users:\", updateError);",
          to: "console.error(\"❌ Error updating users:\", updateError);"
        },
        {
          from: "return NextResponse.json({ error: \"Failed to update tier2_users\" }, { status: 500 });",
          to: "return NextResponse.json({ error: \"Failed to update users\" }, { status: 500 });"
        },
      ]
    },
    {
      file: 'src/app/api/admin/recoverIncompleteUser/route.ts',
      replacements: [
        {
          from: "// ✅ 1. Check if user exists in tier2_users",
          to: "// ✅ 1. Check if user exists in users"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "// User doesn't exist in tier2_users - normal case",
          to: "// User doesn't exist in users - normal case"
        },
        {
          from: "// ✅ 3. If user exists in tier2_users but not in Auth, they need to complete account creation",
          to: "// ✅ 3. If user exists in users but not in Auth, they need to complete account creation"
        },
      ]
    },
    {
      file: 'src/app/api/admin/finalizeSignup/route.ts',
      replacements: [
        {
          from: "// If UUID exists in tier2_users, it will be updated with Auth user ID",
          to: "// If UUID exists in users, it will be updated with Auth user ID"
        },
        {
          from: "// ✅ 1. Check user in tier2_users",
          to: "// ✅ 1. Check user in users"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "console.error(\"❌ User not found in tier2_users:\", tier2Error);",
          to: "console.error(\"❌ User not found in users:\", tier2Error);"
        },
        {
          from: "return NextResponse.json({ error: \"User not found in tier2_users\" }, { status: 404 });",
          to: "return NextResponse.json({ error: \"User not found in users\" }, { status: 404 });"
        },
        {
          from: "// ✅ 4. Update tier2_users with user ID and new data",
          to: "// ✅ 4. Update users with user ID and new data"
        },
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
        {
          from: "console.error(\"❌ Error updating tier2_users:\", updateTier2Error);",
          to: "console.error(\"❌ Error updating users:\", updateTier2Error);"
        },
        {
          from: "return NextResponse.json({ error: \"Failed to update tier2_users\" }, { status: 500 });",
          to: "return NextResponse.json({ error: \"Failed to update users\" }, { status: 500 });"
        },
      ]
    },
    {
      file: 'src/app/api/admin/dashboard/route.ts',
      replacements: [
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/api/admin/check-status/route.ts',
      replacements: [
        {
          from: ".from('tier2_users')",
          to: ".from('users')"
        },
      ]
    },
    {
      file: 'src/app/api/engagement-intelligence/enhanced/route.ts',
      replacements: [
        {
          from: ".from('subscriptions')",
          to: ".from('subscriptions')"
        },
      ]
    },
    {
      file: 'src/app/api/premium/auth/checkUserStatus/route.ts',
      replacements: [
        {
          from: "// Fetch subscription from new subscriptions table",
          to: "// Fetch subscription from new subscriptions table"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/api/premium/assessment/invite/route.ts',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/premium/auth/checkStrategicAccess/route.ts',
      replacements: [
        {
          from: "// Query subscriptions using service role key (bypasses RLS)",
          to: "// Query subscriptions using service role key (bypasses RLS)"
        },
        {
          from: "const { data: subscriptions, error: subscriptionError } = await supabase",
          to: "const { data: subscriptions, error: subscriptionError } = await supabase"
        },
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
        {
          from: "console.log(\"📊 Service role query result:\", { subscriptions, subscriptionError });",
          to: "console.log(\"📊 Service role query result:\", { subscriptions, subscriptionError });"
        },
        {
          from: "// Check if any of the user's active subscriptions are strategic",
          to: "// Check if any of the user's active subscriptions are strategic"
        },
        {
          from: "const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;",
          to: "const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;"
        },
        {
          from: "subscriptions: subscriptions,",
          to: "subscriptions: subscriptions,"
        },
        {
          from: "subscriptions: subscriptions || []",
          to: "subscriptions: subscriptions || []"
        },
      ]
    },
    {
      file: 'src/app/api/premium/assessment/delegate-questions/route.ts',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
    {
      file: 'src/app/api/premium/account/subscription/route.ts',
      replacements: [
        {
          from: ".from(\"subscriptions\")",
          to: ".from(\"subscriptions\")"
        },
      ]
    },
    {
      file: 'src/app/api/premium/account/update/route.ts',
      replacements: [
        {
          from: ".from(\"tier2_users\")",
          to: ".from(\"users\")"
        },
      ]
    },
  ];

  for (const update of updates) {
    try {
      const content = fs.readFileSync(update.file, 'utf-8');
      let newContent = content;

      for (const replacement of update.replacements) {
        newContent = newContent.replace(replacement.from, replacement.to);
      }

      if (newContent !== content) {
        fs.writeFileSync(update.file, newContent, 'utf-8');
        console.log(`✅ Updated ${update.file}`);
      } else {
        console.log(`⏭️  No changes needed for ${update.file}`);
      }
    } catch (error) {
      console.error(`❌ Error updating ${update.file}:`, error);
    }
  }
}

updateFiles().catch(console.error);
