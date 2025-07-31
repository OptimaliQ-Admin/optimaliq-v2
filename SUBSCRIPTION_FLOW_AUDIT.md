# 🔍 SUBSCRIPTION FLOW AUDIT & MIGRATION GUIDE

## 📊 CURRENT STATE ANALYSIS

### **Legacy Tables (Being Replaced):**
- `tier2_users` → `users` (new structure)
- `subscriptions` (old structure with `u_id`) → `subscriptions` (new structure with `user_id`)
- `onboarding_assessments` → `onboarding_sessions` (World Class Onboarding)

### **New World Class Architecture Tables:**
- `users` - Core user profiles
- `subscriptions` - Subscription management
- `onboarding_sessions` - World Class Onboarding sessions
- `conversation_messages` - AI conversation tracking
- `real_time_insights` - Live insights during onboarding
- `business_model_canvas` - Visual business model data
- `gamification_achievements` - Achievement system

## 🔄 ALL POSSIBLE LOGIN SCENARIOS

### **Scenario 1: New User (No Account)**
**Flow:**
1. User visits `/subscribe`
2. Enters email → Check email status
3. Email not found → Create account flow
4. Complete payment → Create user in `users` table
5. Create subscription in `subscriptions` table
6. Redirect to World Class Onboarding (`/premium/onboarding/world-class`)

### **Scenario 2: Paid User, Incomplete Account**
**Flow:**
1. User tries to login with email
2. Email found in `users` table but no Auth account
3. Redirect to `/subscribe/recover-create-account`
4. Complete account creation
5. Check onboarding status
6. If no onboarding → Redirect to World Class Onboarding
7. If onboarding complete → Redirect to dashboard

### **Scenario 3: Active User, No Onboarding**
**Flow:**
1. User logs in successfully
2. Check subscription status → Active
3. Check onboarding status → No completed session
4. Redirect to World Class Onboarding (`/premium/onboarding/world-class`)

### **Scenario 4: Active User, Completed Onboarding**
**Flow:**
1. User logs in successfully
2. Check subscription status → Active
3. Check onboarding status → Completed session exists
4. Redirect to dashboard (`/premium/dashboard`)

### **Scenario 5: Inactive Subscription**
**Flow:**
1. User logs in successfully
2. Check subscription status → Inactive/Expired
3. Redirect to pricing page (`/Pricing`)

### **Scenario 6: Trial User**
**Flow:**
1. User logs in successfully
2. Check subscription status → Trial
3. Check onboarding status
4. If no onboarding → Redirect to World Class Onboarding
5. If onboarding complete → Redirect to dashboard

## 🛠️ REQUIRED CODE UPDATES

### **1. Field Name Mapping:**
```typescript
// OLD (Legacy)
tier2_users.u_id → users.id
subscriptions.u_id → subscriptions.user_id
onboarding_assessments.u_id → onboarding_sessions.user_id

// NEW (World Class)
users.id (UUID)
subscriptions.user_id (UUID)
onboarding_sessions.user_id (UUID)
```

### **2. Onboarding Status Check:**
```typescript
// OLD (Legacy)
const hasCompletedOnboarding = Boolean(onboarding_assessments record);

// NEW (World Class)
const hasCompletedOnboarding = Boolean(
  onboarding_sessions record with status = 'completed'
);
```

### **3. Subscription Status Check:**
```typescript
// OLD (Legacy)
subscriptions.u_id = user_id AND status IN ('active', 'trial')

// NEW (World Class)
subscriptions.user_id = user_id AND status IN ('active', 'trial')
```

## 📋 MIGRATION CHECKLIST

### **Phase 1: Database Migration ✅**
- [x] Create new World Class Onboarding schema
- [x] Migrate existing data from legacy tables
- [x] Update field mappings

### **Phase 2: API Updates**
- [x] Update `checkUserStatus` API
- [x] Update middleware subscription check
- [ ] Update all remaining APIs using legacy tables
- [ ] Update subscription webhook handlers
- [ ] Update user profile APIs

### **Phase 3: Frontend Updates**
- [x] Update login flow redirects
- [ ] Update user context providers
- [ ] Update dashboard data fetching
- [ ] Update profile management

### **Phase 4: Cleanup**
- [ ] Remove legacy table references
- [ ] Delete legacy onboarding code
- [ ] Update TypeScript types
- [ ] Remove unused imports

## 🚨 CRITICAL FLOW POINTS

### **1. Login Flow (`/subscribe/login`)**
```typescript
// Current flow (UPDATED):
1. Authenticate user
2. Check user status via /api/premium/auth/checkUserStatus
3. If no subscription → Redirect to /Pricing
4. If subscription active but no onboarding → Redirect to /premium/onboarding/world-class
5. If subscription active and onboarding complete → Redirect to /premium/dashboard
```

### **2. Middleware Protection**
```typescript
// Current middleware (UPDATED):
1. Check authentication
2. If no session → Redirect to /subscribe/login
3. If session exists → Check subscription status
4. If subscription inactive → Redirect to /subscribe
5. Allow access to premium routes
```

### **3. Onboarding Completion**
```typescript
// World Class Onboarding completion:
1. User completes onboarding session
2. Update onboarding_sessions.status = 'completed'
3. Set onboarding_sessions.completed_at = NOW()
4. Redirect to /premium/dashboard
```

## 🔧 IMMEDIATE ACTIONS REQUIRED

### **1. Update All API Routes**
All APIs currently using `tier2_users` and `u_id` need to be updated to use `users` and `user_id`.

### **2. Update Subscription References**
All subscription checks need to use `user_id` instead of `u_id`.

### **3. Update Onboarding Checks**
All onboarding status checks need to use `onboarding_sessions` instead of `onboarding_assessments`.

### **4. Test All Scenarios**
Each scenario above needs to be tested to ensure proper flow.

## 📈 SUCCESS METRICS

### **Flow Completion Rates:**
- New user signup → Onboarding completion: Target 85%
- Returning user → Dashboard access: Target 95%
- Onboarding completion → Dashboard access: Target 100%

### **Error Reduction:**
- Login errors: Target < 1%
- Redirect loops: Target 0%
- Missing data errors: Target 0%

## 🎯 NEXT STEPS

1. **Complete API Updates**: Update all remaining APIs to use new table structure
2. **Frontend Testing**: Test all user flows end-to-end
3. **Data Validation**: Ensure all existing users are properly migrated
4. **Performance Monitoring**: Monitor query performance with new structure
5. **Cleanup**: Remove all legacy code and tables 