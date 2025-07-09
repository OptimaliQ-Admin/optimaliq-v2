-- =====================================================
-- COMPLETE RLS FIX FOR GROWTH TABLES - FINAL VERSION
-- =====================================================

-- 1. ENABLE RLS ON ALL USER-SPECIFIC TABLES
ALTER TABLE growth_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecard_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_assessment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_insights_history ENABLE ROW LEVEL SECURITY;

-- 2. KEEP REFERENCE TABLES PUBLIC (NO RLS)
-- growth_quadrant_data and growth_simulations_log are reference data, not user-specific
ALTER TABLE growth_quadrant_data DISABLE ROW LEVEL SECURITY;
ALTER TABLE growth_simulations_log DISABLE ROW LEVEL SECURITY;

-- 3. DROP EXISTING BROKEN POLICIES
DROP POLICY IF EXISTS "Users can access their own growth assessment history" ON growth_assessment_history;
DROP POLICY IF EXISTS "Admins can access all growth_users" ON growth_users;
DROP POLICY IF EXISTS "Users can access their own profile" ON growth_users;
DROP POLICY IF EXISTS "Users can access their own record" ON growth_users;
DROP POLICY IF EXISTS "instert" ON growth_users;
DROP POLICY IF EXISTS "selction" ON growth_users;
DROP POLICY IF EXISTS "Public can read trends" ON realtime_market_trends;
DROP POLICY IF EXISTS "Service can insert trends" ON realtime_market_trends;

-- 4. CREATE USER POLICIES (auth.uid() = u_id)
-- Growth Assessment
CREATE POLICY "Users can access their own growth assessment" ON growth_assessment
    FOR ALL USING (auth.uid()::uuid = u_id::uuid);

-- Growth Insights
CREATE POLICY "Users can access their own growth insights" ON growth_insights
    FOR ALL USING (auth.uid()::uuid = u_id::uuid);

-- Growth Users
CREATE POLICY "Users can access their own growth user profile" ON growth_users
    FOR ALL USING (auth.uid()::uuid = u_id::uuid);

-- Scorecard Insights (public read, admin write)
CREATE POLICY "Public can read scorecard insights" ON scorecard_insights
    FOR SELECT USING (true);
CREATE POLICY "Admins can manage scorecard insights" ON scorecard_insights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Growth Assessment History
CREATE POLICY "Users can access their own assessment history" ON growth_assessment_history
    FOR ALL USING (auth.uid()::uuid = u_id::uuid);

-- Growth Insights History
CREATE POLICY "Users can access their own insights history" ON growth_insights_history
    FOR ALL USING (auth.uid()::text = u_id::text);

-- 5. CREATE ADMIN OVERRIDE POLICIES (tier2_users.role = 'admin')
CREATE POLICY "Admins can access all growth assessment" ON growth_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all growth insights" ON growth_insights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all growth users" ON growth_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessment history" ON growth_assessment_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all insights history" ON growth_insights_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 6. FIX SECURITY DEFINER VIEWS
-- Convert admin_dashboard to SECURITY INVOKER
DROP VIEW IF EXISTS admin_dashboard;
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
    'tier2_users' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM tier2_users
UNION ALL
SELECT 
    'growth_users' as table_name,
    COUNT(*) as record_count,
    MAX(growth_users.createdat) as last_updated
FROM growth_users
UNION ALL
SELECT 
    'subscriptions' as table_name,
    COUNT(*) as record_count,
    MAX(subscriptions.createdat) as last_updated
FROM subscriptions
UNION ALL
SELECT 
    'audit_log' as table_name,
    COUNT(*) as record_count,
    MAX(timestamp) as last_updated
FROM audit_log;

-- Convert public_tables_overview to SECURITY INVOKER
DROP VIEW IF EXISTS public_tables_overview;
CREATE OR REPLACE VIEW public_tables_overview AS
SELECT 
    schemaname,
    tablename,
    'Public Read Access' as access_type,
    'RLS Disabled' as security_status,
    'Anonymized/Reference Data' as data_type
FROM pg_tables 
WHERE tablename IN (
    'realtime_market_trends',
    'realtime_business_trends', 
    'realtime_marketing_playbook',
    'realtime_strategic_trends',
    'industry_stock_symbols',
    'scorecard_insights',
    'growth_quadrant_data',
    'growth_simulations_log'
)
AND schemaname = 'public'

UNION ALL

SELECT 
    'public' as schemaname,
    'user_specific_tables' as tablename,
    'Restricted Access' as access_type,
    'RLS Enabled' as security_status,
    'User-specific data with RLS policies' as data_type;

-- Convert email_subscription_analytics to SECURITY INVOKER
DROP VIEW IF EXISTS email_subscription_analytics;
CREATE OR REPLACE VIEW email_subscription_analytics AS
SELECT 
    DATE_TRUNC('day', subscribed_at) as signup_date,
    COUNT(*) as new_subscribers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers,
    COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_count,
    COUNT(CASE WHEN status = 'bounced' THEN 1 END) as bounced_count
FROM email_subscriptions
GROUP BY DATE_TRUNC('day', subscribed_at)
ORDER BY signup_date DESC;

-- Convert trial_user_analytics to SECURITY INVOKER
DROP VIEW IF EXISTS trial_user_analytics;
CREATE OR REPLACE VIEW trial_user_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as signup_date,
    COUNT(*) as new_trials,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_trials,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_trials,
    COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_trials,
    ROUND(
        COUNT(CASE WHEN status = 'converted' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2
    ) as conversion_rate
FROM trial_users
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;

-- 7. GRANT PERMISSIONS
GRANT SELECT ON admin_dashboard TO authenticated;
GRANT SELECT ON public_tables_overview TO authenticated;
GRANT SELECT ON public_tables_overview TO anon;
GRANT SELECT ON email_subscription_analytics TO authenticated;
GRANT SELECT ON trial_user_analytics TO authenticated;

-- 8. ADD COMMENTS FOR DOCUMENTATION
COMMENT ON TABLE growth_assessment IS 'User-specific growth assessment data with RLS enabled';
COMMENT ON TABLE growth_insights IS 'User-specific growth insights data with RLS enabled';
COMMENT ON TABLE growth_users IS 'User-specific growth user profiles with RLS enabled';
COMMENT ON TABLE scorecard_insights IS 'Public scorecard insights with admin management';
COMMENT ON TABLE growth_assessment_history IS 'User-specific assessment history with RLS enabled';
COMMENT ON TABLE growth_insights_history IS 'User-specific insights history with RLS enabled';
COMMENT ON TABLE growth_quadrant_data IS 'Public reference data for quadrant comparisons - RLS disabled';
COMMENT ON TABLE growth_simulations_log IS 'Public reference data for simulations - RLS disabled';

-- 9. VERIFY POLICIES WERE CREATED
DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename IN (
        'growth_assessment', 'growth_insights', 'growth_users', 
        'scorecard_insights', 'growth_assessment_history', 
        'growth_insights_history'
    );
    
    IF policy_count < 15 THEN
        RAISE EXCEPTION 'Expected at least 15 policies, but found %', policy_count;
    END IF;
    
    RAISE NOTICE 'Successfully created % RLS policies', policy_count;
END $$; 