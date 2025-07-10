-- Enhanced Market Insights Migration
-- Migration: 20240321000021_enhanced_market_insights.sql

-- Enhanced market insights table with structured data
CREATE TABLE IF NOT EXISTS enhanced_market_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    u_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    industry VARCHAR(100) NOT NULL,
    
    -- Market Size Data
    market_size JSONB, -- {value: "2.4T", growth: 12, currency: "USD", description: "Global market opportunity"}
    
    -- Growth Rate Data
    growth_rate JSONB, -- {value: 8.2, trend: 0.5, period: "annual", description: "Annual growth projection"}
    
    -- Competition Data
    competition JSONB, -- {level: "High", trend: "Stable", description: "Competitive landscape", details: "..."}
    
    -- Market Sentiment Data
    sentiment JSONB, -- {score: 75, trend: "positive", factors: ["news", "analyst", "investor"], description: "Market sentiment"}
    
    -- Full AI-generated insight
    full_insight TEXT,
    
    -- Metadata
    data_sources JSONB, -- {finnhub: true, alpha_vantage: true, news_api: true}
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    ai_model_version VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_market_insights_user ON enhanced_market_insights(u_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_market_insights_industry ON enhanced_market_insights(industry);
CREATE INDEX IF NOT EXISTS idx_enhanced_market_insights_created_at ON enhanced_market_insights(created_at);

-- Enable RLS
ALTER TABLE enhanced_market_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own market insights" ON enhanced_market_insights
    FOR SELECT USING (auth.uid() = u_id);

CREATE POLICY "Service can insert market insights" ON enhanced_market_insights
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update market insights" ON enhanced_market_insights
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_enhanced_market_insights_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
CREATE TRIGGER trigger_update_enhanced_market_insights_updated_at
    BEFORE UPDATE ON enhanced_market_insights
    FOR EACH ROW
    EXECUTE FUNCTION update_enhanced_market_insights_updated_at();

-- Insert sample data for testing
INSERT INTO enhanced_market_insights (
    u_id,
    industry,
    market_size,
    growth_rate,
    competition,
    sentiment,
    full_insight,
    data_sources,
    confidence_score,
    ai_model_version
) VALUES 
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'technology',
    '{"value": "2.4T", "growth": 12, "currency": "USD", "description": "Global market opportunity"}',
    '{"value": 8.2, "trend": 0.5, "period": "annual", "description": "Annual growth projection"}',
    '{"level": "High", "trend": "Stable", "description": "Competitive landscape", "details": "Major players include established tech giants and emerging startups"}',
    '{"score": 75, "trend": "positive", "factors": ["news", "analyst", "investor"], "description": "Market sentiment"}',
    '📊 Market Summary\nThe technology sector continues to show robust growth with AI and cloud computing driving innovation. Market sentiment remains positive despite competitive pressures.\n\n🎯 Strategic Outlook for Growth Companies\n• Focus on AI integration and cloud-first strategies\n• Monitor competitive landscape for partnership opportunities\n• Leverage positive market sentiment for strategic investments\n• Consider emerging technologies for competitive advantage',
    '{"finnhub": true, "alpha_vantage": true, "news_api": true}',
    0.85,
    'gpt-4.1-mini-v1'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'retail',
    '{"value": "1.8T", "growth": 8, "currency": "USD", "description": "Global retail market"}',
    '{"value": 5.5, "trend": -0.2, "period": "annual", "description": "Annual growth projection"}',
    '{"level": "Medium", "trend": "Increasing", "description": "Competitive landscape", "details": "E-commerce disruption continues to reshape traditional retail"}',
    '{"score": 62, "trend": "neutral", "factors": ["news", "analyst", "investor"], "description": "Market sentiment"}',
    '📊 Market Summary\nThe retail sector faces ongoing transformation with e-commerce growth and changing consumer preferences. Market sentiment is neutral as companies adapt to digital transformation.\n\n🎯 Strategic Outlook for Growth Companies\n• Prioritize omnichannel strategies and digital transformation\n• Focus on customer experience and personalization\n• Monitor e-commerce trends and competitive responses\n• Consider sustainability and ESG factors in strategy',
    '{"finnhub": true, "alpha_vantage": true, "news_api": true}',
    0.82,
    'gpt-4.1-mini-v1'
),
(
    '00000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'healthcare',
    '{"value": "3.2T", "growth": 15, "currency": "USD", "description": "Global healthcare market"}',
    '{"value": 6.8, "trend": 1.2, "period": "annual", "description": "Annual growth projection"}',
    '{"level": "High", "trend": "Stable", "description": "Competitive landscape", "details": "Regulatory environment and innovation drive competition"}',
    '{"score": 78, "trend": "positive", "factors": ["news", "analyst", "investor"], "description": "Market sentiment"}',
    '📊 Market Summary\nThe healthcare sector shows strong growth driven by innovation, aging populations, and increased healthcare spending. Market sentiment is positive with regulatory support.\n\n🎯 Strategic Outlook for Growth Companies\n• Focus on digital health and telemedicine solutions\n• Monitor regulatory changes and compliance requirements\n• Leverage AI and data analytics for competitive advantage\n• Consider partnerships with established healthcare providers',
    '{"finnhub": true, "alpha_vantage": true, "news_api": true}',
    0.88,
    'gpt-4.1-mini-v1'
)
ON CONFLICT DO NOTHING; 