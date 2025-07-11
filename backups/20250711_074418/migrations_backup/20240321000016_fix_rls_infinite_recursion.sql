-- Migration: Fix RLS Infinite Recursion
-- Date: 2025-07-09
-- Description: Fix infinite recursion in RLS policies by using session variables instead of recursive queries

-- 1. Drop the problematic admin policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can access all tier2_users" ON tier2_users;
DROP POLICY IF EXISTS "Admins can access all growth_users" ON growth_users;
DROP POLICY IF EXISTS "Admins can access all assessments" ON growth_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON ai_readiness_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON bpm_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON competitive_benchmarking_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON customer_experience_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON digital_transformation_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON leadership_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON marketing_effectiveness_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON sales_performance_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON strategic_maturity_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON tech_stack_assessment;
DROP POLICY IF EXISTS "Admins can access all assessments" ON reassessment_assessment;

-- Drop admin policies for score tables
DROP POLICY IF EXISTS "Admins can access all scores" ON score_ai_readiness;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_bpm;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_competitive_benchmarking;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_customer_experience;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_digital_transformation;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_leadership;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_marketing_effectiveness;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_sales_performance;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_strategic_maturity;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_tech_stack;
DROP POLICY IF EXISTS "Admins can access all scores" ON score_reassessment;

-- 2. Create a function to check admin status without causing recursion
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Use a direct query with auth.uid() to avoid recursion
    -- This function will be called from policies
    SELECT role INTO user_role
    FROM tier2_users
    WHERE u_id = auth.uid()
    LIMIT 1;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        -- If there's any error, assume not admin
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create safe admin policies using the function
-- For tier2_users - allow users to access their own data, admins to access all
CREATE POLICY "Users can access own data, admins can access all" ON tier2_users
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

-- For growth_users - allow users to access their own data, admins to access all
CREATE POLICY "Users can access own data, admins can access all" ON growth_users
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

-- For assessment tables - allow users to access their own data, admins to access all
CREATE POLICY "Users can access own data, admins can access all" ON growth_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON ai_readiness_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON bpm_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON competitive_benchmarking_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON customer_experience_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON digital_transformation_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON leadership_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON marketing_effectiveness_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON sales_performance_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON strategic_maturity_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON tech_stack_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON reassessment_assessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

-- For score tables - allow users to access their own data, admins to access all
CREATE POLICY "Users can access own data, admins can access all" ON score_ai_readiness
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_bpm
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_competitive_benchmarking
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_customer_experience
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_digital_transformation
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_leadership
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_marketing_effectiveness
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_sales_performance
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_strategic_maturity
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_tech_stack
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

CREATE POLICY "Users can access own data, admins can access all" ON score_reassessment
    FOR ALL USING (
        u_id = auth.uid() OR is_admin_user()
    );

-- 4. Update the audit_log policy to use the new function
DROP POLICY IF EXISTS "Only admins can read audit logs" ON audit_log;
CREATE POLICY "Only admins can read audit logs" ON audit_log
    FOR SELECT USING (is_admin_user());

-- 5. Add comment explaining the fix
COMMENT ON FUNCTION is_admin_user() IS 'Safe admin check function that avoids RLS recursion by using SECURITY DEFINER'; 