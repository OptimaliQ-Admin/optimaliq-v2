-- Create caching tables for AI insights with 7-day cache and 1-day refresh limit
-- Tables: market_insights, business_trends, engagement_insights

-- Market Insights Caching Table
CREATE TABLE IF NOT EXISTS market_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    model_version TEXT NOT NULL,
    signal_score DECIMAL(5,2),
    insight_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_refreshed TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT market_insights_user_industry_unique UNIQUE (user_id, industry),
    CONSTRAINT market_insights_signal_score_range CHECK (signal_score >= -100 AND signal_score <= 100)
);

-- Business Trends Caching Table
CREATE TABLE IF NOT EXISTS business_trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    model_version TEXT NOT NULL,
    signal_score DECIMAL(5,2),
    insight_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_refreshed TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT business_trends_user_industry_unique UNIQUE (user_id, industry),
    CONSTRAINT business_trends_signal_score_range CHECK (signal_score >= -100 AND signal_score <= 100)
);

-- Engagement Insights Caching Table
CREATE TABLE IF NOT EXISTS engagement_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    model_version TEXT NOT NULL,
    signal_score DECIMAL(5,2),
    insight_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_refreshed TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT engagement_insights_user_industry_unique UNIQUE (user_id, industry),
    CONSTRAINT engagement_insights_signal_score_range CHECK (signal_score >= -100 AND signal_score <= 100)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_market_insights_user_industry ON market_insights (user_id, industry);
CREATE INDEX IF NOT EXISTS idx_market_insights_created_at ON market_insights (created_at);
CREATE INDEX IF NOT EXISTS idx_market_insights_last_refreshed ON market_insights (last_refreshed);

CREATE INDEX IF NOT EXISTS idx_business_trends_user_industry ON business_trends (user_id, industry);
CREATE INDEX IF NOT EXISTS idx_business_trends_created_at ON business_trends (created_at);
CREATE INDEX IF NOT EXISTS idx_business_trends_last_refreshed ON business_trends (last_refreshed);

CREATE INDEX IF NOT EXISTS idx_engagement_insights_user_industry ON engagement_insights (user_id, industry);
CREATE INDEX IF NOT EXISTS idx_engagement_insights_created_at ON engagement_insights (created_at);
CREATE INDEX IF NOT EXISTS idx_engagement_insights_last_refreshed ON engagement_insights (last_refreshed);

-- Row Level Security (RLS) policies
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for market_insights
CREATE POLICY "Users can view their own market insights" ON market_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own market insights" ON market_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own market insights" ON market_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own market insights" ON market_insights
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for business_trends
CREATE POLICY "Users can view their own business trends" ON business_trends
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own business trends" ON business_trends
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own business trends" ON business_trends
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own business trends" ON business_trends
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for engagement_insights
CREATE POLICY "Users can view their own engagement insights" ON engagement_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagement insights" ON engagement_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engagement insights" ON engagement_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own engagement insights" ON engagement_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Function to clean up old cached insights (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_ai_insights()
RETURNS void AS $$
BEGIN
    -- Clean up market insights older than 30 days
    DELETE FROM market_insights 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up business trends older than 30 days
    DELETE FROM business_trends 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    -- Clean up engagement insights older than 30 days
    DELETE FROM engagement_insights 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Cleaned up old AI insights';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup every week (if using pg_cron)
-- SELECT cron.schedule('cleanup-ai-insights', '0 2 * * 0', 'SELECT cleanup_old_ai_insights();');

-- Comments for documentation
COMMENT ON TABLE market_insights IS 'Caches market intelligence insights with 7-day validity and 1-day refresh limit';
COMMENT ON TABLE business_trends IS 'Caches business trend analysis with 7-day validity and 1-day refresh limit';
COMMENT ON TABLE engagement_insights IS 'Caches engagement intelligence insights with 7-day validity and 1-day refresh limit';

COMMENT ON COLUMN market_insights.signal_score IS 'Real-time signal strength (-100 to 100)';
COMMENT ON COLUMN business_trends.signal_score IS 'Real-time signal strength (-100 to 100)';
COMMENT ON COLUMN engagement_insights.signal_score IS 'Real-time signal strength (-100 to 100)';

COMMENT ON COLUMN market_insights.insight_meta IS 'Additional metadata including signal factors and raw data';
COMMENT ON COLUMN business_trends.insight_meta IS 'Additional metadata including signal factors and raw data';
COMMENT ON COLUMN engagement_insights.insight_meta IS 'Additional metadata including signal factors and raw data'; 