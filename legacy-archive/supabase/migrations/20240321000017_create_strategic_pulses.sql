-- Migration: Create Strategic Pulses MVP
-- Date: 2024-03-21
-- Description: Create tables for strategic pulse checks MVP

-- Strategic Pulse Checks
CREATE TABLE strategic_pulses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_u_id UUID NOT NULL REFERENCES tier2_users(u_id),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  areas_of_focus TEXT[] NOT NULL,
  questions JSONB NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pulse Delegations
CREATE TABLE pulse_delegations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pulse_id UUID REFERENCES strategic_pulses(id) ON DELETE CASCADE,
  delegate_email TEXT NOT NULL,
  delegate_name TEXT,
  delegation_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Pulse Responses (Anonymous)
CREATE TABLE pulse_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delegation_id UUID REFERENCES pulse_delegations(id) ON DELETE CASCADE,
  respondent_email TEXT,
  respondent_name TEXT,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE strategic_pulses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own pulses" ON strategic_pulses
  FOR ALL USING (auth.uid() = owner_u_id);

CREATE POLICY "Admins can access all pulses" ON strategic_pulses
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM tier2_users 
      WHERE u_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Public can read delegations by token" ON pulse_delegations
  FOR SELECT USING (true);

CREATE POLICY "Public can update delegations by token" ON pulse_delegations
  FOR UPDATE USING (true);

CREATE POLICY "System can insert responses" ON pulse_responses
  FOR INSERT WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_strategic_pulses_owner ON strategic_pulses(owner_u_id);
CREATE INDEX idx_pulse_delegations_token ON pulse_delegations(delegation_token);
CREATE INDEX idx_pulse_delegations_pulse_id ON pulse_delegations(pulse_id);
CREATE INDEX idx_pulse_responses_delegation_id ON pulse_responses(delegation_id); 