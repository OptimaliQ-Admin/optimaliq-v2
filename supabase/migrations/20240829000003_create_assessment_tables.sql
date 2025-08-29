-- Create assessment and scoring tables
-- Migration: 20240829000003_create_assessment_tables.sql

-- Assessment templates for different industries and types
CREATE TABLE IF NOT EXISTS assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('onboarding', 'bpm', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology')),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  scoring_rules JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Onboarding assessments (raw assessment data)
CREATE TABLE IF NOT EXISTS onboarding_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'onboarding',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  payload_json JSONB NOT NULL DEFAULT '{}',
  score NUMERIC(5,2),
  breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Dashboard insights (processed insights and roadmaps)
CREATE TABLE IF NOT EXISTS tier2_dashboard_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  strategy NUMERIC(5,2) NOT NULL DEFAULT 0,
  process NUMERIC(5,2) NOT NULL DEFAULT 0,
  technology NUMERIC(5,2) NOT NULL DEFAULT 0,
  roadmap JSONB DEFAULT '[]',
  benchmarks JSONB DEFAULT '[]',
  trends JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BPM assessment scores
CREATE TABLE IF NOT EXISTS score_bmp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BPM assessment raw data
CREATE TABLE IF NOT EXISTS bmp_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  -- BPM specific fields will be added based on assessment requirements
  process_maturity INTEGER CHECK (process_maturity >= 1 AND process_maturity <= 5),
  automation_level INTEGER CHECK (automation_level >= 1 AND automation_level <= 5),
  documentation_quality INTEGER CHECK (documentation_quality >= 1 AND documentation_quality <= 5),
  performance_monitoring INTEGER CHECK (performance_monitoring >= 1 AND performance_monitoring <= 5),
  continuous_improvement INTEGER CHECK (continuous_improvement >= 1 AND continuous_improvement <= 5),
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales performance assessment scores
CREATE TABLE IF NOT EXISTS score_sales_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  breakdown JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales performance assessment raw data
CREATE TABLE IF NOT EXISTS sales_performance_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  -- Sales specific fields
  pipeline_management INTEGER CHECK (pipeline_management >= 1 AND pipeline_management <= 5),
  lead_generation INTEGER CHECK (lead_generation >= 1 AND lead_generation <= 5),
  conversion_rate INTEGER CHECK (conversion_rate >= 1 AND conversion_rate <= 5),
  customer_retention INTEGER CHECK (customer_retention >= 1 AND customer_retention <= 5),
  sales_tools INTEGER CHECK (sales_tools >= 1 AND sales_tools <= 5),
  team_performance INTEGER CHECK (team_performance >= 1 AND team_performance <= 5),
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment questions bank
CREATE TABLE IF NOT EXISTS assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type TEXT NOT NULL,
  category TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'scale', 'text', 'boolean', 'ranking')),
  options JSONB,
  weight NUMERIC(3,2) DEFAULT 1.0,
  required BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment scoring rules
CREATE TABLE IF NOT EXISTS assessment_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_type TEXT NOT NULL,
  category TEXT NOT NULL,
  weight NUMERIC(3,2) DEFAULT 1.0,
  algorithm TEXT NOT NULL DEFAULT 'weighted_average',
  parameters JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assessment_templates_type ON assessment_templates(type);
CREATE INDEX IF NOT EXISTS idx_assessment_templates_industry ON assessment_templates(industry);
CREATE INDEX IF NOT EXISTS idx_onboarding_assessments_user ON onboarding_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_assessments_type ON onboarding_assessments(type);
CREATE INDEX IF NOT EXISTS idx_dashboard_insights_user ON tier2_dashboard_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_score_bmp_user ON score_bmp(user_id);
CREATE INDEX IF NOT EXISTS idx_bmp_assessment_user ON bmp_assessment(user_id);
CREATE INDEX IF NOT EXISTS idx_score_sales_user ON score_sales_performance(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_assessment_user ON sales_performance_assessment(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON assessment_questions(assessment_type);
CREATE INDEX IF NOT EXISTS idx_scoring_rules_type ON assessment_scoring_rules(assessment_type);

-- Enable RLS on all tables
ALTER TABLE assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier2_dashboard_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_bmp ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmp_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_sales_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_performance_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scoring_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_templates (public read)
CREATE POLICY "assessment_templates_public_read" ON assessment_templates
FOR SELECT USING (is_active = true);

-- RLS Policies for user-specific assessment data
CREATE POLICY "users_own_assessments" ON onboarding_assessments
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_dashboard_insights" ON tier2_dashboard_insights
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_bmp_scores" ON score_bmp
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_bmp_assessments" ON bmp_assessment
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_sales_scores" ON score_sales_performance
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "users_own_sales_assessments" ON sales_performance_assessment
FOR ALL USING (auth.uid() = user_id);

-- Public read for questions and scoring rules
CREATE POLICY "questions_public_read" ON assessment_questions
FOR SELECT USING (is_active = true);

CREATE POLICY "scoring_rules_public_read" ON assessment_scoring_rules
FOR SELECT USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_assessment_templates_updated_at BEFORE UPDATE ON assessment_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dashboard_insights_updated_at BEFORE UPDATE ON tier2_dashboard_insights FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE assessment_templates IS 'Configurable assessment templates for different industries and types';
COMMENT ON TABLE onboarding_assessments IS 'Raw assessment data from user submissions';
COMMENT ON TABLE tier2_dashboard_insights IS 'Processed insights, roadmaps, and benchmarks';
COMMENT ON TABLE score_bmp IS 'Business Process Management assessment scores';
COMMENT ON TABLE bmp_assessment IS 'Raw BPM assessment responses';
COMMENT ON TABLE score_sales_performance IS 'Sales performance assessment scores';
COMMENT ON TABLE sales_performance_assessment IS 'Raw sales performance assessment responses';
COMMENT ON TABLE assessment_questions IS 'Question bank for dynamic assessment generation';
COMMENT ON TABLE assessment_scoring_rules IS 'Configurable scoring algorithms and weights';
