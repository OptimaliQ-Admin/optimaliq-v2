-- Create growth and intelligence tables
-- Migration: 20240829000004_create_growth_tables.sql

-- Growth levers (actionable recommendations)
CREATE TABLE IF NOT EXISTS growth_levers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  impact NUMERIC(3,2) CHECK (impact >= 0 AND impact <= 10),
  effort NUMERIC(3,2) CHECK (effort >= 0 AND effort <= 10),
  priority NUMERIC(3,2) CHECK (priority >= 0 AND priority <= 10),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth lever progress tracking
CREATE TABLE IF NOT EXISTS growth_lever_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  lever_text TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  toggled_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth quadrant data (positioning analytics)
CREATE TABLE IF NOT EXISTS growth_quadrant_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL,
  x NUMERIC(10,4) NOT NULL,
  y NUMERIC(10,4) NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  color TEXT,
  size NUMERIC(5,2) DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Market snapshots (cached insights with TTL)
CREATE TABLE IF NOT EXISTS market_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  card_json JSONB NOT NULL,
  citations JSONB DEFAULT '[]',
  ttl_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Real-time business trends (industry-specific insights)
CREATE TABLE IF NOT EXISTS realtime_business_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  preview TEXT NOT NULL,
  detail TEXT,
  insights JSONB DEFAULT '[]',
  sources JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benchmark data for industry comparisons
CREATE TABLE IF NOT EXISTS benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  industry_average NUMERIC(10,4),
  top_performers NUMERIC(10,4),
  bottom_quartile NUMERIC(10,4),
  sample_size INTEGER,
  data_source TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Growth metrics and KPI tracking
CREATE TABLE IF NOT EXISTS growth_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(15,4),
  metric_type TEXT CHECK (metric_type IN ('revenue', 'growth_rate', 'efficiency', 'satisfaction', 'other')),
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  target_value NUMERIC(15,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forecast models and scenarios
CREATE TABLE IF NOT EXISTS forecast_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  model_type TEXT CHECK (model_type IN ('linear', 'exponential', 'polynomial', 'seasonal', 'ai_generated')),
  parameters JSONB DEFAULT '{}',
  predictions JSONB DEFAULT '[]',
  confidence_score NUMERIC(3,2),
  time_horizon_months INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impact calculations and ROI metrics
CREATE TABLE IF NOT EXISTS impact_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  calculation_name TEXT NOT NULL,
  baseline_value NUMERIC(15,4),
  projected_value NUMERIC(15,4),
  impact_value NUMERIC(15,4),
  roi_percentage NUMERIC(8,4),
  time_to_impact_months INTEGER,
  assumptions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_growth_levers_user ON growth_levers(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_levers_priority ON growth_levers(priority DESC);
CREATE INDEX IF NOT EXISTS idx_growth_lever_progress_user ON growth_lever_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_quadrant_segment ON growth_quadrant_data(segment);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_industry ON market_snapshots(industry);
CREATE INDEX IF NOT EXISTS idx_market_snapshots_ttl ON market_snapshots(ttl_expires_at);
CREATE INDEX IF NOT EXISTS idx_business_trends_industry ON realtime_business_trends(industry);
CREATE INDEX IF NOT EXISTS idx_business_trends_generated ON realtime_business_trends(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_benchmark_industry_category ON benchmark_data(industry, category);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_user ON growth_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_metrics_type ON growth_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_forecast_models_user ON forecast_models(user_id);
CREATE INDEX IF NOT EXISTS idx_impact_calculations_user ON impact_calculations(user_id);

-- Enable RLS on all tables
ALTER TABLE growth_levers ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_lever_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_quadrant_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_business_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_calculations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user-specific data
CREATE POLICY "users_own_growth_levers" ON growth_levers
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_lever_progress" ON growth_lever_progress
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_growth_metrics" ON growth_metrics
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_forecast_models" ON forecast_models
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_impact_calculations" ON impact_calculations
FOR ALL USING (auth.uid() = user_id);

-- Public read policies for shared data
CREATE POLICY "growth_quadrant_public_read" ON growth_quadrant_data
FOR SELECT USING (true);

CREATE POLICY "market_snapshots_public_read" ON market_snapshots
FOR SELECT USING (ttl_expires_at > NOW());

CREATE POLICY "business_trends_public_read" ON realtime_business_trends
FOR SELECT USING (true);

CREATE POLICY "benchmark_data_public_read" ON benchmark_data
FOR SELECT USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_forecast_models_updated_at BEFORE UPDATE ON forecast_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE growth_levers IS 'AI-generated actionable recommendations for business growth';
COMMENT ON TABLE growth_lever_progress IS 'User progress tracking for growth lever completion';
COMMENT ON TABLE growth_quadrant_data IS 'Positioning data for growth quadrant visualization';
COMMENT ON TABLE market_snapshots IS 'Cached market intelligence with TTL expiration';
COMMENT ON TABLE realtime_business_trends IS 'Industry-specific business trends and insights';
COMMENT ON TABLE benchmark_data IS 'Industry benchmark data for performance comparison';
COMMENT ON TABLE growth_metrics IS 'User-specific KPIs and performance metrics';
COMMENT ON TABLE forecast_models IS 'Predictive models for growth forecasting';
COMMENT ON TABLE impact_calculations IS 'ROI and impact analysis for growth initiatives';

-- Create function to clean expired market snapshots
CREATE OR REPLACE FUNCTION clean_expired_snapshots()
RETURNS void AS $$
BEGIN
  DELETE FROM market_snapshots WHERE ttl_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to regenerate growth levers (called every 31 days)
CREATE OR REPLACE FUNCTION should_regenerate_growth_levers(user_uuid UUID)
RETURNS boolean AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM growth_levers 
    WHERE user_id = user_uuid 
    AND generated_at > NOW() - INTERVAL '31 days'
  );
END;
$$ LANGUAGE plpgsql;
