-- Create leads table for lead tracking and conversion metrics
-- Migration: 20241219000001_create_leads_table.sql

-- Leads table for tracking lead data and conversion metrics
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  industry TEXT,
  role TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('<$100K', '$100K-$500K', '$500K-$1M', '$1M-$10M', '$10M-$50M', '$50M+')),
  source TEXT NOT NULL DEFAULT 'growth_assessment',
  utm_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'converted', 'lost')),
  user_id UUID REFERENCES tier2_users(id) ON DELETE SET NULL,
  assessment_completed BOOLEAN DEFAULT false,
  assessment_score NUMERIC(5,2),
  conversion_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();

-- Add RLS policies for leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Users can only see their own leads
CREATE POLICY "users_can_view_own_leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own leads
CREATE POLICY "users_can_update_own_leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can manage all leads
CREATE POLICY "service_role_manages_leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');
