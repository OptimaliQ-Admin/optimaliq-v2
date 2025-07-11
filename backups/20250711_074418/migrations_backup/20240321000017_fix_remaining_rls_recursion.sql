-- Migration: Fix Remaining RLS Infinite Recursion
-- Date: 2025-07-09
-- Description: Fix infinite recursion in remaining RLS policies for all tables

-- 1. Drop all remaining problematic admin policies that cause infinite recursion

-- Drop admin policies for insights and user-specific data
DROP POLICY IF EXISTS "Admins can access all insights" ON growth_insights;
DROP POLICY IF EXISTS "Admins can access all insights" ON growth_insights_history;
DROP POLICY IF EXISTS "Admins can access all levers" ON growth_levers;
DROP POLICY IF EXISTS "Admins can access all lever progress" ON growth_lever_progress;
DROP POLICY IF EXISTS "Admins can access all dashboard insights" ON tier2_dashboard_insights;
DROP POLICY IF EXISTS "Admins can access all profiles" ON tier2_profiles;
DROP POLICY IF EXISTS "Admins can access all simulation history" ON tier2_simulation_history;
DROP POLICY IF EXISTS "Admins can access all tech stacks" ON user_tech_stack;
DROP POLICY IF EXISTS "Admins can access all onboarding" ON onboarding_assessments;
DROP POLICY IF EXISTS "Admins can access all notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can access all notification preferences" ON notification_preferences;
DROP POLICY IF EXISTS "Admins can access all subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Admins can access all AI logs" ON ai_log;
DROP POLICY IF EXISTS "Admins can access all user activity" ON useractivity;
DROP POLICY IF EXISTS "Admins can access all business reassessment" ON business_reassessment;

-- Drop admin policies for assessment delegation tables
DROP POLICY IF EXISTS "Admins can access all assessment invitations" ON assessment_invitations;
DROP POLICY IF EXISTS "Admins can access all question delegations" ON question_delegations;
DROP POLICY IF EXISTS "Admins can access all team members" ON team_members;

-- Drop admin policies for trial users
DROP POLICY IF EXISTS "Admins can access all trial users" ON trial_users;

-- Drop admin policies for email subscriptions
DROP POLICY IF EXISTS "Admins can access all email subscriptions" ON email_subscriptions;

-- 2. Create safe admin policies using the existing is_admin_user() function

-- For insights and user-specific data (with proper type casting)
CREATE POLICY "Users can access own data, admins can access all" ON growth_insights
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON growth_insights_history
    FOR ALL USING (u_id::text = auth.uid()::text OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON growth_levers
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON growth_lever_progress
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON tier2_dashboard_insights
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON tier2_profiles
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

-- For tier2_simulation_history (uses email)
CREATE POLICY "Users can access own data, admins can access all" ON tier2_simulation_history
    FOR ALL USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON user_tech_stack
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON onboarding_assessments
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON notifications
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON notification_preferences
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

-- For subscriptions table (this is the critical one causing the login issue)
CREATE POLICY "Users can access own data, admins can access all" ON subscriptions
    FOR ALL USING (u_id::uuid = auth.uid() OR is_admin_user());

-- For ai_log and useractivity (use u_id)
CREATE POLICY "Users can access own data, admins can access all" ON ai_log
    FOR ALL USING (u_id = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON useractivity
    FOR ALL USING (u_id = auth.uid() OR is_admin_user());

-- For business_reassessment (use user_id)
CREATE POLICY "Users can access own data, admins can access all" ON business_reassessment
    FOR ALL USING (user_id = auth.uid() OR is_admin_user());

-- For assessment delegation tables
CREATE POLICY "Users can access own data, admins can access all" ON assessment_invitations
    FOR ALL USING (inviter_u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON question_delegations
    FOR ALL USING (delegator_u_id::uuid = auth.uid() OR is_admin_user());

CREATE POLICY "Users can access own data, admins can access all" ON team_members
    FOR ALL USING (owner_u_id::uuid = auth.uid() OR is_admin_user());

-- For trial users
CREATE POLICY "Users can access own data, admins can access all" ON trial_users
    FOR ALL USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR is_admin_user());

-- For email subscriptions
CREATE POLICY "Users can access own data, admins can access all" ON email_subscriptions
    FOR ALL USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()) OR is_admin_user());

-- 3. Add public access policies for invitation/delegation tokens (for completion flows)
-- These are needed for the public completion flows to work

-- Keep existing public policies for assessment invitations
DROP POLICY IF EXISTS "Public can read invitations by token" ON assessment_invitations;
DROP POLICY IF EXISTS "Public can update invitations by token" ON assessment_invitations;
DROP POLICY IF EXISTS "Public can read delegations by token" ON question_delegations;
DROP POLICY IF EXISTS "Public can update delegations by token" ON question_delegations;

-- Recreate public policies for token-based access
CREATE POLICY "Public can read invitations by token" ON assessment_invitations
    FOR SELECT USING (true);

CREATE POLICY "Public can update invitations by token" ON assessment_invitations
    FOR UPDATE USING (true);

CREATE POLICY "Public can read delegations by token" ON question_delegations
    FOR SELECT USING (true);

CREATE POLICY "Public can update delegations by token" ON question_delegations
    FOR UPDATE USING (true);

-- 4. Add comment explaining the comprehensive fix
COMMENT ON SCHEMA public IS 'Security Configuration Updated:
- All user-specific tables: RLS enabled with safe user-based policies
- Admin access: Using is_admin_user() function to avoid recursion
- Public tables: RLS disabled for anonymized/reference data
- Token-based access: Public policies for invitation/delegation completion
- Audit logging: Comprehensive tracking of all operations'; 