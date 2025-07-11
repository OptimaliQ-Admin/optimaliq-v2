-- Create engagement_insights table for caching engagement intelligence data
CREATE TABLE IF NOT EXISTS public.engagement_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    industry TEXT NOT NULL,
    insight_data JSONB NOT NULL,
    model_version TEXT,
    signal_score NUMERIC(-100, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_engagement_insights_user_id ON public.engagement_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_insights_industry ON public.engagement_insights(industry);
CREATE INDEX IF NOT EXISTS idx_engagement_insights_created_at ON public.engagement_insights(created_at);
CREATE INDEX IF NOT EXISTS idx_engagement_insights_user_industry ON public.engagement_insights(user_id, industry);

-- Create unique constraint to prevent duplicate insights per user/industry
CREATE UNIQUE INDEX IF NOT EXISTS idx_engagement_insights_unique_user_industry 
ON public.engagement_insights(user_id, industry);

-- Enable Row Level Security
ALTER TABLE public.engagement_insights ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own engagement insights" ON public.engagement_insights
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own engagement insights" ON public.engagement_insights
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own engagement insights" ON public.engagement_insights
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own engagement insights" ON public.engagement_insights
    FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_engagement_insights_updated_at 
    BEFORE UPDATE ON public.engagement_insights 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE public.engagement_insights IS 'Cached engagement intelligence insights for users with 30-day expiration';
COMMENT ON COLUMN public.engagement_insights.insight_data IS 'JSONB containing full EngagementIntelligenceInsight object';
COMMENT ON COLUMN public.engagement_insights.signal_score IS 'Real-time signal score from -100 to 100';
COMMENT ON COLUMN public.engagement_insights.model_version IS 'AI model version used for generation'; 