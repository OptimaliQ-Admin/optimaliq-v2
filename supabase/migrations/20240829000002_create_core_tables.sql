-- Create core user and organization tables
-- Migration: 20240829000002_create_core_tables.sql

-- Organizations table (multi-tenant support)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tier2 Users table (enhanced user profiles)
CREATE TABLE IF NOT EXISTS tier2_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  title TEXT,
  company TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  industry TEXT,
  timezone TEXT DEFAULT 'UTC',
  linkedin_url TEXT,
  agreed_terms BOOLEAN DEFAULT false,
  agreed_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tier2 Profiles table (assessment scores and metrics)
CREATE TABLE IF NOT EXISTS tier2_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES tier2_users(id) ON DELETE CASCADE,
  score_overall NUMERIC(5,2) DEFAULT 0,
  score_strategy NUMERIC(5,2) DEFAULT 0,
  score_process NUMERIC(5,2) DEFAULT 0,
  score_technology NUMERIC(5,2) DEFAULT 0,
  bmp_score NUMERIC(5,2),
  sales_score NUMERIC(5,2),
  ai_readiness_score NUMERIC(5,2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table (billing and plan management)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'accelerator', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid', 'trial')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tier2_users_org ON tier2_users(organization_id);
CREATE INDEX IF NOT EXISTS idx_tier2_users_email ON tier2_users(email);
CREATE INDEX IF NOT EXISTS idx_tier2_profiles_user ON tier2_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier2_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier2_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizations
CREATE POLICY "users_can_read_own_org" ON organizations
FOR SELECT USING (
  id IN (
    SELECT organization_id 
    FROM tier2_users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "users_can_update_own_org" ON organizations
FOR UPDATE USING (
  id IN (
    SELECT organization_id 
    FROM tier2_users 
    WHERE id = auth.uid()
  )
);

-- RLS Policies for tier2_users
CREATE POLICY "users_can_read_own_profile" ON tier2_users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_can_update_own_profile" ON tier2_users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_can_insert_own_profile" ON tier2_users
FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for tier2_profiles
CREATE POLICY "users_can_read_own_scores" ON tier2_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_scores" ON tier2_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_scores" ON tier2_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for subscriptions
CREATE POLICY "users_can_read_own_subscription" ON subscriptions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_can_update_own_subscription" ON subscriptions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "users_can_insert_own_subscription" ON subscriptions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Add comments for documentation
COMMENT ON TABLE organizations IS 'Multi-tenant organization data';
COMMENT ON TABLE tier2_users IS 'Enhanced user profiles with business context';
COMMENT ON TABLE tier2_profiles IS 'Assessment scores and performance metrics';
COMMENT ON TABLE subscriptions IS 'Stripe subscription and billing data';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tier2_users_updated_at BEFORE UPDATE ON tier2_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tier2_profiles_updated_at BEFORE UPDATE ON tier2_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
