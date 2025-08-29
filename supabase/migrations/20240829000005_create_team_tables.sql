-- Create team and collaboration tables
-- Migration: 20240829000005_create_team_tables.sql

-- Team members (workspace participants)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES tier2_users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT,
  title TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment campaigns (delegation workflows)
CREATE TABLE IF NOT EXISTS assessment_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('onboarding', 'bpm', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment assignments (individual assignments within campaigns)
CREATE TABLE IF NOT EXISTS assessment_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES assessment_campaigns(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  assignee_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'in_progress', 'completed', 'expired')),
  assessment_token TEXT UNIQUE,
  assessment_data JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pulse survey topics (strategic priority tracking)
CREATE TABLE IF NOT EXISTS pulse_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  quarter TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pulse survey questions
CREATE TABLE IF NOT EXISTS pulse_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES pulse_topics(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'scale' CHECK (question_type IN ('scale', 'multiple_choice', 'text', 'boolean')),
  options JSONB,
  weight NUMERIC(3,2) DEFAULT 1.0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pulse survey invitations (anonymous tokenized invites)
CREATE TABLE IF NOT EXISTS pulse_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES pulse_topics(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  department TEXT,
  title TEXT,
  sent_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pulse survey responses (anonymous responses)
CREATE TABLE IF NOT EXISTS pulse_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES pulse_topics(id) ON DELETE CASCADE,
  response_token TEXT NOT NULL, -- Links to pulse_invites.token for anonymity
  answers JSONB NOT NULL DEFAULT '{}',
  department TEXT, -- Denormalized for aggregation
  title TEXT, -- Denormalized for aggregation
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team workspaces (collaboration spaces)
CREATE TABLE IF NOT EXISTS team_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  workspace_type TEXT DEFAULT 'general' CHECK (workspace_type IN ('general', 'project', 'department', 'assessment')),
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assignment templates (reusable workflow definitions)
CREATE TABLE IF NOT EXISTS assignment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('assessment', 'survey', 'review', 'training')),
  configuration JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team analytics and performance metrics
CREATE TABLE IF NOT EXISTS team_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC(15,4),
  metric_type TEXT CHECK (metric_type IN ('completion_rate', 'response_time', 'engagement', 'satisfaction', 'performance')),
  department TEXT,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  assessment_reminders BOOLEAN DEFAULT true,
  campaign_updates BOOLEAN DEFAULT true,
  pulse_invitations BOOLEAN DEFAULT true,
  weekly_summaries BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communication logs
CREATE TABLE IF NOT EXISTS communication_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('assessment_invite', 'pulse_invite', 'reminder', 'completion', 'summary')),
  subject TEXT,
  content TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_org ON team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);
CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_org ON assessment_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_owner ON assessment_campaigns(owner_id);
CREATE INDEX IF NOT EXISTS idx_assessment_campaigns_status ON assessment_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_campaign ON assessment_assignments(campaign_id);
CREATE INDEX IF NOT EXISTS idx_assessment_assignments_token ON assessment_assignments(assessment_token);
CREATE INDEX IF NOT EXISTS idx_pulse_topics_org ON pulse_topics(organization_id);
CREATE INDEX IF NOT EXISTS idx_pulse_questions_topic ON pulse_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_pulse_invites_token ON pulse_invites(token);
CREATE INDEX IF NOT EXISTS idx_pulse_responses_topic ON pulse_responses(topic_id);
CREATE INDEX IF NOT EXISTS idx_team_workspaces_org ON team_workspaces(organization_id);
CREATE INDEX IF NOT EXISTS idx_assignment_templates_org ON assignment_templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_team_analytics_org ON team_analytics(organization_id);
CREATE INDEX IF NOT EXISTS idx_notification_prefs_user ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_org ON communication_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_communication_logs_email ON communication_logs(recipient_email);

-- Enable RLS on all tables
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organization-scoped data
CREATE POLICY "org_members_can_read_team" ON team_members
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM tier2_users WHERE id = auth.uid()
  )
);

CREATE POLICY "org_admins_can_manage_team" ON team_members
FOR ALL USING (
  organization_id IN (
    SELECT tm.organization_id 
    FROM tier2_users u 
    JOIN team_members tm ON u.organization_id = tm.organization_id 
    WHERE u.id = auth.uid() AND tm.role IN ('owner', 'admin')
  )
);

CREATE POLICY "org_members_can_read_campaigns" ON assessment_campaigns
FOR SELECT USING (
  organization_id IN (
    SELECT organization_id FROM tier2_users WHERE id = auth.uid()
  )
);

CREATE POLICY "campaign_owners_can_manage" ON assessment_campaigns
FOR ALL USING (auth.uid() = owner_id);

-- Token-based access for anonymous assessment assignments
CREATE POLICY "token_based_assignment_access" ON assessment_assignments
FOR SELECT USING (assessment_token IS NOT NULL);

CREATE POLICY "token_based_assignment_update" ON assessment_assignments
FOR UPDATE USING (assessment_token IS NOT NULL);

-- Anonymous pulse survey access via token
CREATE POLICY "pulse_token_access" ON pulse_invites
FOR SELECT USING (token IS NOT NULL);

CREATE POLICY "pulse_anonymous_responses" ON pulse_responses
FOR INSERT WITH CHECK (response_token IS NOT NULL);

CREATE POLICY "pulse_topic_responses_read" ON pulse_responses
FOR SELECT USING (
  topic_id IN (
    SELECT pt.id FROM pulse_topics pt
    JOIN tier2_users u ON pt.owner_id = u.id
    WHERE u.id = auth.uid()
  )
);

-- User-specific notification preferences
CREATE POLICY "users_own_notification_prefs" ON notification_preferences
FOR ALL USING (auth.uid() = user_id);

-- Add triggers for updated_at columns
CREATE TRIGGER update_assessment_campaigns_updated_at BEFORE UPDATE ON assessment_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_workspaces_updated_at BEFORE UPDATE ON team_workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_templates_updated_at BEFORE UPDATE ON assignment_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE team_members IS 'Team members within organizations with role-based access';
COMMENT ON TABLE assessment_campaigns IS 'Assessment delegation campaigns for team collaboration';
COMMENT ON TABLE assessment_assignments IS 'Individual assessment assignments with email-based access';
COMMENT ON TABLE pulse_topics IS 'Strategic priority pulse survey topics';
COMMENT ON TABLE pulse_questions IS 'Questions for pulse surveys';
COMMENT ON TABLE pulse_invites IS 'Anonymous tokenized pulse survey invitations';
COMMENT ON TABLE pulse_responses IS 'Anonymous pulse survey responses';
COMMENT ON TABLE team_workspaces IS 'Collaboration spaces for team work';
COMMENT ON TABLE assignment_templates IS 'Reusable templates for common workflows';
COMMENT ON TABLE team_analytics IS 'Team performance metrics and analytics';
COMMENT ON TABLE notification_preferences IS 'User notification preferences and settings';
COMMENT ON TABLE communication_logs IS 'Email and communication tracking logs';

-- Create function to generate assessment tokens
CREATE OR REPLACE FUNCTION generate_assessment_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate pulse survey tokens
CREATE OR REPLACE FUNCTION generate_pulse_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(24), 'base64url');
END;
$$ LANGUAGE plpgsql;
