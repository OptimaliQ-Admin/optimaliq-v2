-- Create market_insights table for caching enhanced market analysis data
-- This table stores market insights with real-time signal scores for 30-day caching

CREATE TABLE IF NOT EXISTS market_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL, -- Full EnhancedMarketInsight object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version TEXT NOT NULL, -- OpenAI model used
    signal_score NUMERIC(5,2), -- Score from real-time signal engine (-100 to 100)
    
    -- Add indexes for performance
    CONSTRAINT valid_signal_score CHECK (signal_score >= -100 AND signal_score <= 100)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_market_insights_user_industry ON market_insights(user_id, industry);
CREATE INDEX IF NOT EXISTS idx_market_insights_created_at ON market_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_market_insights_signal_score ON market_insights(signal_score);

-- Create a unique constraint to ensure one insight per user per industry
-- This allows for easy upsert operations
CREATE UNIQUE INDEX IF NOT EXISTS idx_market_insights_user_industry_unique 
ON market_insights(user_id, industry);

-- Add RLS (Row Level Security) policies
ALTER TABLE market_insights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own market insights
CREATE POLICY "Users can view own market insights" ON market_insights
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own market insights
CREATE POLICY "Users can insert own market insights" ON market_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own market insights
CREATE POLICY "Users can update own market insights" ON market_insights
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own market insights
CREATE POLICY "Users can delete own market insights" ON market_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically clean up old insights (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_market_insights()
RETURNS void AS $$
BEGIN
    DELETE FROM market_insights 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run cleanup daily (if using pg_cron extension)
-- Uncomment the following line if pg_cron is available:
-- SELECT cron.schedule('cleanup-market-insights', '0 2 * * *', 'SELECT cleanup_old_market_insights();');

-- Add comments for documentation
COMMENT ON TABLE market_insights IS 'Stores cached market insights with real-time signal scores for 30-day caching';
COMMENT ON COLUMN market_insights.insight_data IS 'Full EnhancedMarketInsight JSON object containing market analysis';
COMMENT ON COLUMN market_insights.signal_score IS 'Real-time signal score from -100 to 100 indicating market sentiment and momentum';
COMMENT ON COLUMN market_insights.model_version IS 'AI model version used to generate the insight'; 