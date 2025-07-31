# 🔄 TABLE MIGRATION REPORT

## 📊 Summary
- Total files to update: 50
- Total references found: 157

## 🔄 subscriptions → subscriptions

### 📁 src/middleware.ts

**Line 64:**
```typescript
// Get user's subscription status from new subscriptions table
```
**Needs to become:**
```typescript
// Get user's subscription status from new subscriptions table
```

**Line 66:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/hooks/useRealtimeDashboard.ts

**Line 2:**
```typescript
import { RealtimeManager } from '@/lib/realtime/subscriptions'
```
**Needs to become:**
```typescript
import { RealtimeManager } from '@/lib/realtime/subscriptions'
```

### 📁 src/lib/utils/subscriptionCheck.ts

**Line 23:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/lib/types/database.ts

**Line 148:**
```typescript
subscriptions: {
```
**Needs to become:**
```typescript
subscriptions: {
```

### 📁 src/lib/realtime/subscriptions.ts

**Line 35:**
```typescript
private subscriptions: Map<string, RealtimeChannel> = new Map()
```
**Needs to become:**
```typescript
private subscriptions: Map<string, RealtimeChannel> = new Map()
```

**Line 44:**
```typescript
if (this.subscriptions.has(channelId)) {
```
**Needs to become:**
```typescript
if (this.subscriptions.has(channelId)) {
```

**Line 45:**
```typescript
return this.subscriptions.get(channelId)!
```
**Needs to become:**
```typescript
return this.subscriptions.get(channelId)!
```

**Line 76:**
```typescript
this.subscriptions.set(channelId, channel)
```
**Needs to become:**
```typescript
this.subscriptions.set(channelId, channel)
```

**Line 86:**
```typescript
if (this.subscriptions.has(channelId)) {
```
**Needs to become:**
```typescript
if (this.subscriptions.has(channelId)) {
```

**Line 87:**
```typescript
return this.subscriptions.get(channelId)!
```
**Needs to become:**
```typescript
return this.subscriptions.get(channelId)!
```

**Line 118:**
```typescript
this.subscriptions.set(channelId, channel)
```
**Needs to become:**
```typescript
this.subscriptions.set(channelId, channel)
```

**Line 128:**
```typescript
if (this.subscriptions.has(channelId)) {
```
**Needs to become:**
```typescript
if (this.subscriptions.has(channelId)) {
```

**Line 129:**
```typescript
return this.subscriptions.get(channelId)!
```
**Needs to become:**
```typescript
return this.subscriptions.get(channelId)!
```

**Line 152:**
```typescript
this.subscriptions.set(channelId, channel)
```
**Needs to become:**
```typescript
this.subscriptions.set(channelId, channel)
```

**Line 162:**
```typescript
if (this.subscriptions.has(channelId)) {
```
**Needs to become:**
```typescript
if (this.subscriptions.has(channelId)) {
```

**Line 163:**
```typescript
return this.subscriptions.get(channelId)!
```
**Needs to become:**
```typescript
return this.subscriptions.get(channelId)!
```

**Line 186:**
```typescript
this.subscriptions.set(channelId, channel)
```
**Needs to become:**
```typescript
this.subscriptions.set(channelId, channel)
```

**Line 196:**
```typescript
if (this.subscriptions.has(channelId)) {
```
**Needs to become:**
```typescript
if (this.subscriptions.has(channelId)) {
```

**Line 197:**
```typescript
return this.subscriptions.get(channelId)!
```
**Needs to become:**
```typescript
return this.subscriptions.get(channelId)!
```

**Line 207:**
```typescript
this.subscriptions.set(channelId, channel)
```
**Needs to become:**
```typescript
this.subscriptions.set(channelId, channel)
```

**Line 407:**
```typescript
this.subscriptions.forEach((channel, channelId) => {
```
**Needs to become:**
```typescript
this.subscriptions.forEach((channel, channelId) => {
```

**Line 411:**
```typescript
this.subscriptions.clear()
```
**Needs to become:**
```typescript
this.subscriptions.clear()
```

**Line 419:**
```typescript
const channel = this.subscriptions.get(channelId)
```
**Needs to become:**
```typescript
const channel = this.subscriptions.get(channelId)
```

**Line 422:**
```typescript
this.subscriptions.delete(channelId)
```
**Needs to become:**
```typescript
this.subscriptions.delete(channelId)
```

**Line 432:**
```typescript
connected: this.subscriptions.size > 0,
```
**Needs to become:**
```typescript
connected: this.subscriptions.size > 0,
```

**Line 433:**
```typescript
channels: Array.from(this.subscriptions.keys())
```
**Needs to become:**
```typescript
channels: Array.from(this.subscriptions.keys())
```

**Line 441:**
```typescript
const channel = channelId ? this.subscriptions.get(channelId) : null
```
**Needs to become:**
```typescript
const channel = channelId ? this.subscriptions.get(channelId) : null
```

### 📁 src/lib/ai/realtime.ts

**Line 33:**
```typescript
private subscriptions: Map<string, any> = new Map()
```
**Needs to become:**
```typescript
private subscriptions: Map<string, any> = new Map()
```

**Line 82:**
```typescript
this.subscriptions.set('event_broadcast', subscription)
```
**Needs to become:**
```typescript
this.subscriptions.set('event_broadcast', subscription)
```

**Line 242:**
```typescript
for (const [name, subscription] of this.subscriptions) {
```
**Needs to become:**
```typescript
for (const [name, subscription] of this.subscriptions) {
```

**Line 251:**
```typescript
this.subscriptions.clear()
```
**Needs to become:**
```typescript
this.subscriptions.clear()
```

### 📁 src/components/subscribe/SubscribeForm.tsx

**Line 194:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/components/admin/EmailSubscriptionsManager.tsx

**Line 30:**
```typescript
const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);
```
**Needs to become:**
```typescript
const [subscriptions, setSubscriptions] = useState<EmailSubscription[]>([]);
```

**Line 48:**
```typescript
.from("email_subscriptions")
```
**Needs to become:**
```typescript
.from("email_subscriptions")
```

**Line 53:**
```typescript
console.error("Error fetching subscriptions:", error);
```
**Needs to become:**
```typescript
console.error("Error fetching subscriptions:", error);
```

**Line 54:**
```typescript
showToast.error("Failed to fetch subscriptions");
```
**Needs to become:**
```typescript
showToast.error("Failed to fetch subscriptions");
```

**Line 69:**
```typescript
console.error("Error fetching subscriptions:", error);
```
**Needs to become:**
```typescript
console.error("Error fetching subscriptions:", error);
```

**Line 70:**
```typescript
showToast.error("Failed to fetch subscriptions");
```
**Needs to become:**
```typescript
showToast.error("Failed to fetch subscriptions");
```

**Line 79:**
```typescript
.from("email_subscriptions")
```
**Needs to become:**
```typescript
.from("email_subscriptions")
```

**Line 107:**
```typescript
...subscriptions.map(sub => [
```
**Needs to become:**
```typescript
...subscriptions.map(sub => [
```

**Line 128:**
```typescript
a.download = `email_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
```
**Needs to become:**
```typescript
a.download = `email_subscriptions_${new Date().toISOString().split('T')[0]}.csv`;
```

**Line 229:**
```typescript
{subscriptions.map((subscription) => (
```
**Needs to become:**
```typescript
{subscriptions.map((subscription) => (
```

**Line 280:**
```typescript
{subscriptions.length === 0 && (
```
**Needs to become:**
```typescript
{subscriptions.length === 0 && (
```

**Line 282:**
```typescript
<p className="text-gray-500">No email subscriptions found.</p>
```
**Needs to become:**
```typescript
<p className="text-gray-500">No email subscriptions found.</p>
```

### 📁 src/components/admin/AdminDashboard.tsx

**Line 25:**
```typescript
type TabType = 'overview' | 'audit-logs' | 'email-subscriptions' | 'trial-users';
```
**Needs to become:**
```typescript
type TabType = 'overview' | 'audit-logs' | 'email-subscriptions' | 'trial-users';
```

**Line 118:**
```typescript
{ id: 'email-subscriptions', label: 'Email Subscriptions', icon: '📧' },
```
**Needs to become:**
```typescript
{ id: 'email-subscriptions', label: 'Email Subscriptions', icon: '📧' },
```

**Line 192:**
```typescript
onClick={() => setActiveTab('email-subscriptions')}
```
**Needs to become:**
```typescript
onClick={() => setActiveTab('email-subscriptions')}
```

**Line 351:**
```typescript
case 'email-subscriptions':
```
**Needs to become:**
```typescript
case 'email-subscriptions':
```

### 📁 src/app/subscribe/page.tsx

**Line 31:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/refund/page.tsx

**Line 29:**
```typescript
All monthly subscriptions are final and non-refundable. You may cancel your subscription at any time to avoid future charges, but no partial or prorated refunds will be issued for the current billing cycle.
```
**Needs to become:**
```typescript
All monthly subscriptions are final and non-refundable. You may cancel your subscription at any time to avoid future charges, but no partial or prorated refunds will be issued for the current billing cycle.
```

### 📁 src/app/subscribe/trial-signup/TrialSignupForm.tsx

**Line 276:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/subscribe/thank-you/page.tsx

**Line 26:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 39:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/stripe/webhook/route.ts

**Line 88:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 115:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 139:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 164:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 189:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 205:**
```typescript
// First, get the user ID from the subscriptions table
```
**Needs to become:**
```typescript
// First, get the user ID from the subscriptions table
```

**Line 207:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/newsletter/subscribe/route.ts

**Line 41:**
```typescript
.from("email_subscriptions")
```
**Needs to become:**
```typescript
.from("email_subscriptions")
```

**Line 63:**
```typescript
.from("email_subscriptions")
```
**Needs to become:**
```typescript
.from("email_subscriptions")
```

**Line 88:**
```typescript
.from("email_subscriptions")
```
**Needs to become:**
```typescript
.from("email_subscriptions")
```

### 📁 src/app/api/market-insights/enhanced/route.ts

**Line 13:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/cron/cleanup-trial-records/route.ts

**Line 95:**
```typescript
subscriptions!inner(status)
```
**Needs to become:**
```typescript
subscriptions!inner(status)
```

**Line 107:**
```typescript
if (trial.subscriptions && trial.subscriptions.length > 0) {
```
**Needs to become:**
```typescript
if (trial.subscriptions && trial.subscriptions.length > 0) {
```

**Line 108:**
```typescript
const subscription = trial.subscriptions[0];
```
**Needs to become:**
```typescript
const subscription = trial.subscriptions[0];
```

### 📁 src/app/api/cron/check-trial-expiration/route.ts

**Line 59:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/auth/check-email-status/route.ts

**Line 46:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/business-trends/enhanced/route.ts

**Line 13:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/assessment-delegation/send-delegation/route.ts

**Line 53:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/assessment-delegation/send-invitation/route.ts

**Line 26:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/assessment-delegation/get-team-members/route.ts

**Line 22:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/assessment-delegation/get-invitations/route.ts

**Line 55:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/assessment-delegation/remove-team-member/route.ts

**Line 22:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/assessment-delegation/add-team-member/route.ts

**Line 22:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/engagement-intelligence/enhanced/route.ts

**Line 13:**
```typescript
.from('subscriptions')
```
**Needs to become:**
```typescript
.from('subscriptions')
```

### 📁 src/app/api/premium/auth/checkUserStatus/route.ts

**Line 31:**
```typescript
// Fetch subscription from new subscriptions table
```
**Needs to become:**
```typescript
// Fetch subscription from new subscriptions table
```

**Line 33:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

### 📁 src/app/api/premium/auth/checkStrategicAccess/route.ts

**Line 22:**
```typescript
// Query subscriptions using service role key (bypasses RLS)
```
**Needs to become:**
```typescript
// Query subscriptions using service role key (bypasses RLS)
```

**Line 23:**
```typescript
const { data: subscriptions, error: subscriptionError } = await supabase
```
**Needs to become:**
```typescript
const { data: subscriptions, error: subscriptionError } = await supabase
```

**Line 24:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

**Line 29:**
```typescript
console.log("📊 Service role query result:", { subscriptions, subscriptionError });
```
**Needs to become:**
```typescript
console.log("📊 Service role query result:", { subscriptions, subscriptionError });
```

**Line 39:**
```typescript
// Check if any of the user's active subscriptions are strategic
```
**Needs to become:**
```typescript
// Check if any of the user's active subscriptions are strategic
```

**Line 40:**
```typescript
const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;
```
**Needs to become:**
```typescript
const hasStrategicAccess = subscriptions?.some(sub => sub.plan === 'strategic') || false;
```

**Line 43:**
```typescript
subscriptions: subscriptions,
```
**Needs to become:**
```typescript
subscriptions: subscriptions,
```

**Line 49:**
```typescript
subscriptions: subscriptions || []
```
**Needs to become:**
```typescript
subscriptions: subscriptions || []
```

### 📁 src/app/api/premium/account/subscription/route.ts

**Line 27:**
```typescript
.from("subscriptions")
```
**Needs to become:**
```typescript
.from("subscriptions")
```

## 🔄 tier2_users → users

### 📁 src/context/PremiumUserContext.tsx

**Line 7:**
```typescript
// Types from your tier2_users table
```
**Needs to become:**
```typescript
// Types from your users table
```

### 📁 src/lib/utils/auditLogger.ts

**Line 58:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/components/subscribe/SubscribeForm.tsx

**Line 126:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 145:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 169:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/components/admin/AdminDashboard.tsx

**Line 226:**
```typescript
placeholder="e.g., tier2_users"
```
**Needs to become:**
```typescript
placeholder="e.g., users"
```

### 📁 src/lib/database/migrations/migrate_to_world_class_schema.ts

**Line 47:**
```typescript
// Get existing tier2_users
```
**Needs to become:**
```typescript
// Get existing users
```

**Line 49:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/subscribe/trial-signup/TrialSignupForm.tsx

**Line 250:**
```typescript
// Create tier2_users record
```
**Needs to become:**
```typescript
// Create users record
```

**Line 252:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 268:**
```typescript
console.error("Error creating tier2_users record:", tier2Error);
```
**Needs to become:**
```typescript
console.error("Error creating users record:", tier2Error);
```

### 📁 src/app/subscribe/recover-create-account/RecoverCreateAccountForm.tsx

**Line 110:**
```typescript
// If UUID exists in tier2_users, it will be updated with Auth user ID
```
**Needs to become:**
```typescript
// If UUID exists in users, it will be updated with Auth user ID
```

### 📁 src/app/question-delegation/[token]/page.tsx

**Line 83:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/assessment-invitation/[token]/page.tsx

**Line 84:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/premium/assessment/[slug]/client.tsx

**Line 149:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/profile/update/route.ts

**Line 33:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/growth_studio/levers/route.ts

**Line 41:**
```typescript
// Fetch user's industry from tier2_users
```
**Needs to become:**
```typescript
// Fetch user's industry from users
```

**Line 43:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/dashboard/welcome_message/route.ts

**Line 19:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/cron/send-trial-expiring-notifications/route.ts

**Line 28:**
```typescript
tier2_users!inner(email, first_name)
```
**Needs to become:**
```typescript
users!inner(email, first_name)
```

**Line 72:**
```typescript
to: trial.tier2_users.email,
```
**Needs to become:**
```typescript
to: trial.users.email,
```

**Line 73:**
```typescript
firstName: trial.tier2_users.first_name,
```
**Needs to become:**
```typescript
firstName: trial.users.first_name,
```

**Line 95:**
```typescript
console.log(`Sent ${daysRemaining}-day expiring notification for trial: ${trial.id} for user: ${trial.tier2_users.email}`);
```
**Needs to become:**
```typescript
console.log(`Sent ${daysRemaining}-day expiring notification for trial: ${trial.id} for user: ${trial.users.email}`);
```

### 📁 src/app/api/cron/cleanup-trial-records/route.ts

**Line 57:**
```typescript
// 2. Clean up orphaned trial records (trials without corresponding tier2_users)
```
**Needs to become:**
```typescript
// 2. Clean up orphaned trial records (trials without corresponding users)
```

### 📁 src/app/api/cron/check-trial-expiration/route.ts

**Line 23:**
```typescript
tier2_users!inner(email, first_name)
```
**Needs to become:**
```typescript
users!inner(email, first_name)
```

**Line 73:**
```typescript
to: trial.tier2_users.email,
```
**Needs to become:**
```typescript
to: trial.users.email,
```

**Line 74:**
```typescript
firstName: trial.tier2_users.first_name,
```
**Needs to become:**
```typescript
firstName: trial.users.first_name,
```

**Line 84:**
```typescript
console.log(`Processed expired trial: ${trial.id} for user: ${trial.tier2_users.email}`);
```
**Needs to become:**
```typescript
console.log(`Processed expired trial: ${trial.id} for user: ${trial.users.email}`);
```

### 📁 src/app/api/auth/check-email-status/route.ts

**Line 19:**
```typescript
// ✅ 1. Check if user exists in tier2_users
```
**Needs to become:**
```typescript
// ✅ 1. Check if user exists in users
```

**Line 21:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 27:**
```typescript
console.error("Error checking tier2_users:", tier2Error);
```
**Needs to become:**
```typescript
console.error("Error checking users:", tier2Error);
```

**Line 68:**
```typescript
// User has both tier2_users record and Auth account
```
**Needs to become:**
```typescript
// User has both users record and Auth account
```

### 📁 src/app/api/assessment-delegation/send-delegation/route.ts

**Line 100:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/api/assessment-delegation/send-invitation/route.ts

**Line 44:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/api/assessment-delegation/get-invitations/route.ts

**Line 19:**
```typescript
inviter:tier2_users!inviter_u_id(first_name, last_name, company)
```
**Needs to become:**
```typescript
inviter:users!inviter_id(first_name, last_name, company)
```

### 📁 src/app/api/admin/updateProfileAfterSignup/route.ts

**Line 33:**
```typescript
// ✅ 2. Update tier2_users with new data
```
**Needs to become:**
```typescript
// ✅ 2. Update users with new data
```

**Line 35:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 45:**
```typescript
console.error("❌ Error updating tier2_users:", updateError);
```
**Needs to become:**
```typescript
console.error("❌ Error updating users:", updateError);
```

**Line 46:**
```typescript
return NextResponse.json({ error: "Failed to update tier2_users" }, { status: 500 });
```
**Needs to become:**
```typescript
return NextResponse.json({ error: "Failed to update users" }, { status: 500 });
```

### 📁 src/app/api/admin/recoverIncompleteUser/route.ts

**Line 19:**
```typescript
// ✅ 1. Check if user exists in tier2_users
```
**Needs to become:**
```typescript
// ✅ 1. Check if user exists in users
```

**Line 21:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 27:**
```typescript
// User doesn't exist in tier2_users - normal case
```
**Needs to become:**
```typescript
// User doesn't exist in users - normal case
```

**Line 42:**
```typescript
// ✅ 3. If user exists in tier2_users but not in Auth, they need to complete account creation
```
**Needs to become:**
```typescript
// ✅ 3. If user exists in users but not in Auth, they need to complete account creation
```

### 📁 src/app/api/admin/finalizeSignup/route.ts

**Line 20:**
```typescript
// If UUID exists in tier2_users, it will be updated with Auth user ID
```
**Needs to become:**
```typescript
// If UUID exists in users, it will be updated with Auth user ID
```

**Line 21:**
```typescript
// ✅ 1. Check user in tier2_users
```
**Needs to become:**
```typescript
// ✅ 1. Check user in users
```

**Line 23:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 29:**
```typescript
console.error("❌ User not found in tier2_users:", tier2Error);
```
**Needs to become:**
```typescript
console.error("❌ User not found in users:", tier2Error);
```

**Line 30:**
```typescript
return NextResponse.json({ error: "User not found in tier2_users" }, { status: 404 });
```
**Needs to become:**
```typescript
return NextResponse.json({ error: "User not found in users" }, { status: 404 });
```

**Line 69:**
```typescript
// ✅ 4. Update tier2_users with user ID and new data
```
**Needs to become:**
```typescript
// ✅ 4. Update users with user ID and new data
```

**Line 71:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

**Line 82:**
```typescript
console.error("❌ Error updating tier2_users:", updateTier2Error);
```
**Needs to become:**
```typescript
console.error("❌ Error updating users:", updateTier2Error);
```

**Line 83:**
```typescript
return NextResponse.json({ error: "Failed to update tier2_users" }, { status: 500 });
```
**Needs to become:**
```typescript
return NextResponse.json({ error: "Failed to update users" }, { status: 500 });
```

### 📁 src/app/api/admin/dashboard/route.ts

**Line 27:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/api/admin/check-status/route.ts

**Line 26:**
```typescript
.from('tier2_users')
```
**Needs to become:**
```typescript
.from('users')
```

### 📁 src/app/api/premium/assessment/invite/route.ts

**Line 84:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/premium/assessment/delegate-questions/route.ts

**Line 129:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

### 📁 src/app/api/premium/account/update/route.ts

**Line 39:**
```typescript
.from("tier2_users")
```
**Needs to become:**
```typescript
.from("users")
```

## 🔄 onboarding_assessments → onboarding_sessions

### 📁 src/lib/types/database.ts

**Line 401:**
```typescript
onboarding_assessments: {
```
**Needs to become:**
```typescript
onboarding_sessions: {
```

**Line 1006:**
```typescript
export type OnboardingAssessment = Database['public']['Tables']['onboarding_assessments']['Row']
```
**Needs to become:**
```typescript
export type OnboardingAssessment = Database['public']['Tables']['onboarding_sessions']['Row']
```

**Line 1028:**
```typescript
export type OnboardingAssessmentInsert = Database['public']['Tables']['onboarding_assessments']['Insert']
```
**Needs to become:**
```typescript
export type OnboardingAssessmentInsert = Database['public']['Tables']['onboarding_sessions']['Insert']
```

**Line 1050:**
```typescript
export type OnboardingAssessmentUpdate = Database['public']['Tables']['onboarding_assessments']['Update']
```
**Needs to become:**
```typescript
export type OnboardingAssessmentUpdate = Database['public']['Tables']['onboarding_sessions']['Update']
```

### 📁 src/lib/database/migrations/migrate_to_world_class_schema.ts

**Line 147:**
```typescript
// Get existing onboarding_assessments
```
**Needs to become:**
```typescript
// Get existing onboarding_sessions
```

**Line 149:**
```typescript
.from('onboarding_assessments')
```
**Needs to become:**
```typescript
.from('onboarding_sessions')
```

**Line 186:**
```typescript
.from('onboarding_assessments')
```
**Needs to become:**
```typescript
.from('onboarding_sessions')
```

**Line 214:**
```typescript
source: 'legacy_onboarding_assessments',
```
**Needs to become:**
```typescript
source: 'legacy_onboarding_sessions',
```

**Line 405:**
```typescript
this.supabase.from('onboarding_assessments').select('*', { count: 'exact', head: true }),
```
**Needs to become:**
```typescript
this.supabase.from('onboarding_sessions').select('*', { count: 'exact', head: true }),
```

### 📁 src/app/api/dashboard/route.ts

**Line 38:**
```typescript
// Fetch latest onboarding session (replaces onboarding_assessments)
```
**Needs to become:**
```typescript
// Fetch latest onboarding session (replaces onboarding_sessions)
```

### 📁 src/app/api/profile/update/route.ts

**Line 20:**
```typescript
.from("onboarding_assessments")
```
**Needs to become:**
```typescript
.from("onboarding_sessions")
```

