-- Database Optimization Script for OptimaliQ
-- This script will clean up unused tables and optimize the database structure

-- 1. Drop unused assessment tables (0 rows)
DROP TABLE IF EXISTS assessment_sessions CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS unified_assessment_sessions CASCADE;

-- 2. Drop other unused tables with 0 rows
DROP TABLE IF EXISTS assessment_analytics CASCADE;
DROP TABLE IF EXISTS assessment_assignments CASCADE;
DROP TABLE IF EXISTS assessment_delegations CASCADE;
DROP TABLE IF EXISTS assessment_insights CASCADE;
DROP TABLE IF EXISTS assessment_invitations CASCADE;
DROP TABLE IF EXISTS assessment_scores CASCADE;
DROP TABLE IF EXISTS assessment_scoring_results CASCADE;
DROP TABLE IF EXISTS assessment_templates CASCADE;
DROP TABLE IF EXISTS unified_assessment_analytics CASCADE;
DROP TABLE IF EXISTS unified_assessment_context CASCADE;
DROP TABLE IF EXISTS unified_assessment_delegations CASCADE;
DROP TABLE IF EXISTS unified_assessment_progress CASCADE;
DROP TABLE IF EXISTS unified_assessment_templates CASCADE;

-- 3. Drop legacy assessment tables (replaced by new system)
DROP TABLE IF EXISTS ai_assessment_context CASCADE;
DROP TABLE IF EXISTS ai_readiness_assessment CASCADE;
DROP TABLE IF EXISTS bpm_assessment CASCADE;
DROP TABLE IF EXISTS business_reassessment CASCADE;
DROP TABLE IF EXISTS competitive_benchmarking_assessment CASCADE;
DROP TABLE IF EXISTS customer_experience_assessment CASCADE;
DROP TABLE IF EXISTS digital_transformation_assessment CASCADE;
DROP TABLE IF EXISTS leadership_assessment CASCADE;
DROP TABLE IF EXISTS marketing_effectiveness_assessment CASCADE;
DROP TABLE IF EXISTS reassessment_assessment CASCADE;
DROP TABLE IF EXISTS reassessment_prompts CASCADE;
DROP TABLE IF EXISTS sales_performance_assessment CASCADE;
DROP TABLE IF EXISTS score_reassessment CASCADE;
DROP TABLE IF EXISTS strategic_maturity_assessment CASCADE;
DROP TABLE IF EXISTS tech_stack_assessment CASCADE;

-- 4. Create optimized indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_user_id_status ON onboarding_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_completed_at ON onboarding_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_tier2_dashboard_insights_u_id ON tier2_dashboard_insights(u_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_tier2_users_u_id ON tier2_users(u_id);

-- 5. Add constraints to ensure data integrity
ALTER TABLE onboarding_sessions 
ADD CONSTRAINT IF NOT EXISTS check_metadata_has_ai_scores 
CHECK (metadata->>'has_ai_scores' IS NOT NULL);

ALTER TABLE onboarding_sessions 
ADD CONSTRAINT IF NOT EXISTS check_metadata_score 
CHECK (metadata->>'score' IS NOT NULL);

-- 6. Create a view for easy access to onboarding results
CREATE OR REPLACE VIEW onboarding_results AS
SELECT 
    os.id as session_id,
    os.user_id,
    os.session_type,
    os.status,
    os.completed_at,
    os.metadata->>'score' as score,
    os.metadata->>'strategy_score' as strategy_score,
    os.metadata->>'process_score' as process_score,
    os.metadata->>'technology_score' as technology_score,
    os.metadata->>'industryAvgScore' as industry_avg_score,
    os.metadata->>'topPerformerScore' as top_performer_score,
    os.metadata->>'has_ai_scores' as has_ai_scores,
    os.metadata->>'ai_scores_generated_at' as ai_scores_generated_at
FROM onboarding_sessions os
WHERE os.status = 'completed' 
AND os.metadata->>'has_ai_scores' = 'true';

-- 7. Create a materialized view for dashboard performance (refresh daily)
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_performance_cache AS
SELECT 
    u.id as user_id,
    u.email,
    u.industry,
    os.metadata->>'score' as current_score,
    os.metadata->>'strategy_score' as strategy_score,
    os.metadata->>'process_score' as process_score,
    os.metadata->>'technology_score' as technology_score,
    os.completed_at as last_assessment_date,
    tdi.updated_at as last_dashboard_update
FROM users u
LEFT JOIN onboarding_sessions os ON u.id = os.user_id 
    AND os.status = 'completed' 
    AND os.metadata->>'has_ai_scores' = 'true'
LEFT JOIN tier2_dashboard_insights tdi ON u.id = tdi.u_id
WHERE u.id IS NOT NULL;

-- 8. Create index on the materialized view
CREATE INDEX IF NOT EXISTS idx_dashboard_performance_cache_user_id ON dashboard_performance_cache(user_id);

-- 9. Add comments for documentation
COMMENT ON TABLE onboarding_sessions IS 'Stores onboarding session data with AI-generated scores for dashboard compatibility';
COMMENT ON TABLE tier2_dashboard_insights IS 'Stores dashboard insights derived from onboarding sessions';
COMMENT ON VIEW onboarding_results IS 'Provides easy access to completed onboarding results with AI scores';
COMMENT ON MATERIALIZED VIEW dashboard_performance_cache IS 'Cached dashboard performance data for faster queries';

-- 10. Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard_cache()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW dashboard_performance_cache;
END;
$$ LANGUAGE plpgsql;

-- 11. Create a cron job to refresh the cache daily (if pg_cron extension is available)
-- SELECT cron.schedule('refresh-dashboard-cache', '0 2 * * *', 'SELECT refresh_dashboard_cache();');

-- 12. Create function to get user dashboard data efficiently
CREATE OR REPLACE FUNCTION get_user_dashboard_data(user_uuid UUID)
RETURNS TABLE (
    user_id UUID,
    email TEXT,
    industry TEXT,
    score NUMERIC,
    strategy_score NUMERIC,
    process_score NUMERIC,
    technology_score NUMERIC,
    industry_avg_score NUMERIC,
    top_performer_score NUMERIC,
    last_assessment_date TIMESTAMP,
    has_ai_scores BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.email,
        u.industry,
        (os.metadata->>'score')::NUMERIC as score,
        (os.metadata->>'strategy_score')::NUMERIC as strategy_score,
        (os.metadata->>'process_score')::NUMERIC as process_score,
        (os.metadata->>'technology_score')::NUMERIC as technology_score,
        (os.metadata->>'industryAvgScore')::NUMERIC as industry_avg_score,
        (os.metadata->>'topPerformerScore')::NUMERIC as top_performer_score,
        os.completed_at as last_assessment_date,
        (os.metadata->>'has_ai_scores')::BOOLEAN as has_ai_scores
    FROM users u
    LEFT JOIN onboarding_sessions os ON u.id = os.user_id 
        AND os.status = 'completed' 
        AND os.metadata->>'has_ai_scores' = 'true'
    WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- 13. Grant necessary permissions
GRANT SELECT ON onboarding_results TO authenticated;
GRANT SELECT ON dashboard_performance_cache TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_dashboard_data(UUID) TO authenticated;

-- 14. Create a summary of the optimization
DO $$
BEGIN
    RAISE NOTICE 'Database optimization completed successfully!';
    RAISE NOTICE 'Removed unused assessment tables';
    RAISE NOTICE 'Created performance indexes';
    RAISE NOTICE 'Added data integrity constraints';
    RAISE NOTICE 'Created optimized views and functions';
    RAISE NOTICE 'Database is now optimized for World Class SaaS performance!';
END $$;

