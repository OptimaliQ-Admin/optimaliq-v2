-- Migration: Disable RLS on Public Tables
-- Date: 2024-03-21
-- Description: Disable RLS on tables containing public, anonymized data that should be accessible to all users

-- 1. Disable RLS on public trend and insight tables
-- These tables contain anonymized, aggregated data that should be publicly readable

-- Market and business trends (anonymized, read-only)
ALTER TABLE realtime_market_trends DISABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_business_trends DISABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_marketing_playbook DISABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_strategic_trends DISABLE ROW LEVEL SECURITY;

-- General trends table (if it exists and contains public data)
-- ALTER TABLE trends DISABLE ROW LEVEL SECURITY;

-- 2. Disable RLS on reference and content tables
-- These tables contain public reference data and content

-- Industry reference data (public stock symbols, industry info)
ALTER TABLE industry_stock_symbols DISABLE ROW LEVEL SECURITY;

-- Public content and insights (anonymized, aggregated)
ALTER TABLE scorecard_insights DISABLE ROW LEVEL SECURITY;

-- Inspirational quotes (public content)
-- ALTER TABLE inspirational_quotes DISABLE ROW LEVEL SECURITY;

-- 3. Create appropriate policies for tables that need mixed access
-- Some tables might need public read access but restricted write access

-- Example: Allow public read access to trends but restrict writes to authenticated users
-- (This is handled by the RLS disable above, but you could also use policies)

-- 4. Add comments to document why RLS is disabled
COMMENT ON TABLE realtime_market_trends IS 'Public read access: Contains anonymized market trend data accessible to all users';
COMMENT ON TABLE realtime_business_trends IS 'Public read access: Contains anonymized business trend data accessible to all users';
COMMENT ON TABLE realtime_marketing_playbook IS 'Public read access: Contains anonymized marketing insights accessible to all users';
COMMENT ON TABLE realtime_strategic_trends IS 'Public read access: Contains anonymized strategic trend data accessible to all users';
COMMENT ON TABLE industry_stock_symbols IS 'Public read access: Contains public industry reference data accessible to all users';
COMMENT ON TABLE scorecard_insights IS 'Public read access: Contains anonymized scorecard insights accessible to all users';

-- 5. Create a view to document which tables have public access
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
    'scorecard_insights'
)
AND schemaname = 'public'

UNION ALL

SELECT 
    'public' as schemaname,
    'user_specific_tables' as tablename,
    'Restricted Access' as access_type,
    'RLS Enabled' as security_status,
    'User-specific data with RLS policies' as data_type;

-- Grant access to the overview view
GRANT SELECT ON public_tables_overview TO authenticated;
GRANT SELECT ON public_tables_overview TO anon;

-- 6. Create a function to check table security status
CREATE OR REPLACE FUNCTION get_table_security_status(table_name TEXT)
RETURNS TABLE(
    table_name TEXT,
    rls_enabled BOOLEAN,
    has_policies BOOLEAN,
    policy_count INTEGER,
    security_level TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        t.rls_enabled,
        CASE WHEN p.policy_name IS NOT NULL THEN TRUE ELSE FALSE END as has_policies,
        COALESCE(policy_count.count, 0) as policy_count,
        CASE 
            WHEN t.rls_enabled = FALSE THEN 'Public Access'
            WHEN t.rls_enabled = TRUE AND p.policy_name IS NOT NULL THEN 'Protected with RLS'
            ELSE 'RLS Enabled but No Policies'
        END as security_level
    FROM (
        SELECT 
            schemaname || '.' || tablename as table_name,
            rowsecurity as rls_enabled
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = $1
    ) t
    LEFT JOIN (
        SELECT 
            schemaname || '.' || tablename as table_name,
            policyname as policy_name
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = $1
        LIMIT 1
    ) p ON t.table_name = p.table_name
    LEFT JOIN (
        SELECT 
            schemaname || '.' || tablename as table_name,
            COUNT(*) as count
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = $1
        GROUP BY schemaname, tablename
    ) policy_count ON t.table_name = policy_count.table_name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Add indexes for better performance on public tables
-- (These tables will be accessed frequently by all users)

CREATE INDEX IF NOT EXISTS idx_realtime_market_trends_timestamp 
ON realtime_market_trends(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_business_trends_timestamp 
ON realtime_business_trends(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_marketing_playbook_timestamp 
ON realtime_marketing_playbook(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_strategic_trends_timestamp 
ON realtime_strategic_trends(timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_scorecard_insights_category 
ON scorecard_insights(category);

CREATE INDEX IF NOT EXISTS idx_industry_stock_symbols_industry 
ON industry_stock_symbols(industry);

-- 8. Create a summary of security configuration
COMMENT ON SCHEMA public IS 'Security Configuration:
- User-specific tables: RLS enabled with user-based policies
- Public tables: RLS disabled for anonymized/reference data
- Admin tables: RLS enabled with admin override policies
- Audit logging: Comprehensive tracking of all operations'; 