-- Create lead generation and marketing tables
-- Migration: 20240829000006_create_marketing_tables.sql

-- Leads table (prospect tracking)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  title TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  lead_source TEXT,
  lead_score NUMERIC(5,2) DEFAULT 0,
  qualification_status TEXT DEFAULT 'unqualified' CHECK (qualification_status IN ('unqualified', 'marketing_qualified', 'sales_qualified', 'customer', 'churned')),
  notes TEXT,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead sources and attribution tracking
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT UNIQUE NOT NULL,
  source_type TEXT CHECK (source_type IN ('organic', 'paid', 'social', 'email', 'referral', 'direct', 'content')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketing campaigns and conversion funnels
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  campaign_type TEXT CHECK (campaign_type IN ('email', 'social', 'content', 'paid', 'webinar', 'demo')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  target_audience JSONB DEFAULT '{}',
  budget NUMERIC(10,2),
  spent NUMERIC(10,2) DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead scoring and qualification rules
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  rule_type TEXT CHECK (rule_type IN ('demographic', 'behavioral', 'engagement', 'firmographic')),
  criteria JSONB NOT NULL,
  score_value NUMERIC(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo requests and trial signups
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  message TEXT,
  preferred_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'no_show', 'canceled')),
  demo_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email sequences and nurture campaigns
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_name TEXT NOT NULL,
  sequence_type TEXT CHECK (sequence_type IN ('onboarding', 'nurture', 'trial', 'retention', 'win_back')),
  trigger_event TEXT NOT NULL,
  emails JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion events and funnel analytics
CREATE TABLE IF NOT EXISTS conversion_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_type TEXT CHECK (event_type IN ('page_view', 'form_submit', 'email_open', 'email_click', 'demo_request', 'trial_signup', 'purchase')),
  event_data JSONB DEFAULT '{}',
  conversion_value NUMERIC(10,2),
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referral programs and affiliate tracking
CREATE TABLE IF NOT EXISTS referral_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  program_type TEXT DEFAULT 'standard' CHECK (program_type IN ('standard', 'affiliate', 'partner')),
  commission_rate NUMERIC(5,4),
  total_referrals INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  total_commission NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content assets and resource library
CREATE TABLE IF NOT EXISTS content_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  asset_type TEXT CHECK (asset_type IN ('blog_post', 'whitepaper', 'case_study', 'video', 'webinar', 'template', 'guide')),
  content_url TEXT,
  download_url TEXT,
  thumbnail_url TEXT,
  description TEXT,
  tags TEXT[],
  view_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  is_gated BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social proof and testimonial management
CREATE TABLE IF NOT EXISTS social_proof (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proof_type TEXT CHECK (proof_type IN ('testimonial', 'case_study', 'review', 'logo', 'metric')),
  customer_name TEXT,
  customer_title TEXT,
  customer_company TEXT,
  content TEXT,
  rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
  metrics JSONB DEFAULT '{}',
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(lead_source);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(qualification_status);
CREATE INDEX IF NOT EXISTS idx_lead_sources_type ON lead_sources(source_type);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_type ON marketing_campaigns(campaign_type);
CREATE INDEX IF NOT EXISTS idx_demo_requests_status ON demo_requests(status);
CREATE INDEX IF NOT EXISTS idx_demo_requests_date ON demo_requests(demo_date);
CREATE INDEX IF NOT EXISTS idx_conversion_events_lead ON conversion_events(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversion_events_type ON conversion_events(event_type);
CREATE INDEX IF NOT EXISTS idx_conversion_events_created ON conversion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_programs_code ON referral_programs(referral_code);
CREATE INDEX IF NOT EXISTS idx_content_assets_type ON content_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_content_assets_published ON content_assets(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_proof_type ON social_proof(proof_type);
CREATE INDEX IF NOT EXISTS idx_social_proof_featured ON social_proof(is_featured, display_order);

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_proof ENABLE ROW LEVEL SECURITY;

-- Public read policies for marketing content
CREATE POLICY "public_read_lead_sources" ON lead_sources
FOR SELECT USING (is_active = true);

CREATE POLICY "public_read_content_assets" ON content_assets
FOR SELECT USING (is_published = true);

CREATE POLICY "public_read_social_proof" ON social_proof
FOR SELECT USING (is_approved = true);

-- Admin-only policies for marketing management
CREATE POLICY "admin_manage_campaigns" ON marketing_campaigns
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM tier2_users 
    WHERE id = auth.uid() 
    AND (title ILIKE '%admin%' OR title ILIKE '%marketing%')
  )
);

-- User-specific policies
CREATE POLICY "users_own_demo_requests" ON demo_requests
FOR ALL USING (
  email IN (SELECT email FROM tier2_users WHERE id = auth.uid())
);

CREATE POLICY "users_own_referral_programs" ON referral_programs
FOR ALL USING (auth.uid() = referrer_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marketing_campaigns_updated_at BEFORE UPDATE ON marketing_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_demo_requests_updated_at BEFORE UPDATE ON demo_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON email_sequences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referral_programs_updated_at BEFORE UPDATE ON referral_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_assets_updated_at BEFORE UPDATE ON content_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_proof_updated_at BEFORE UPDATE ON social_proof FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE leads IS 'Lead generation and prospect tracking';
COMMENT ON TABLE lead_sources IS 'Attribution tracking for lead sources';
COMMENT ON TABLE marketing_campaigns IS 'Marketing campaign management and analytics';
COMMENT ON TABLE lead_scoring_rules IS 'Configurable lead scoring algorithms';
COMMENT ON TABLE demo_requests IS 'Demo scheduling and management';
COMMENT ON TABLE email_sequences IS 'Automated email nurture campaigns';
COMMENT ON TABLE conversion_events IS 'Conversion tracking and funnel analytics';
COMMENT ON TABLE referral_programs IS 'Referral and affiliate program management';
COMMENT ON TABLE content_assets IS 'Marketing content and resource library';
COMMENT ON TABLE social_proof IS 'Customer testimonials and social proof management';

-- Create function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_uuid UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_score NUMERIC := 0;
  rule_record RECORD;
BEGIN
  FOR rule_record IN 
    SELECT score_value, criteria 
    FROM lead_scoring_rules 
    WHERE is_active = true
  LOOP
    -- This would contain logic to evaluate criteria against lead data
    -- For now, we'll return a placeholder
    total_score := total_score + rule_record.score_value;
  END LOOP;
  
  RETURN LEAST(total_score, 100); -- Cap at 100
END;
$$ LANGUAGE plpgsql;
