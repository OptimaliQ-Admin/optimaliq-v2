-- Migration: Add Missing Real-Time Tables
-- Date: 2024-03-21
-- Description: Create the missing real-time tables that weren't created in the previous migration

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  source VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_activities table
CREATE TABLE IF NOT EXISTS team_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  member_id UUID NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_analytics table
CREATE TABLE IF NOT EXISTS team_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_unit VARCHAR(50),
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_analytics table
CREATE TABLE IF NOT EXISTS ai_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  model VARCHAR(100),
  request_count INTEGER DEFAULT 1,
  token_count INTEGER DEFAULT 0,
  latency_ms INTEGER,
  success_rate DECIMAL(5,4) DEFAULT 1.0,
  cost_usd DECIMAL(10,6) DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  page VARCHAR(255),
  session_id VARCHAR(255),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_duration INTEGER,
  page_views INTEGER DEFAULT 1,
  actions_performed INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create growth_simulations table
CREATE TABLE IF NOT EXISTS growth_simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_type VARCHAR(100) NOT NULL,
  input_data JSONB NOT NULL,
  output_data JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'completed',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes for new tables (only if columns exist)
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

CREATE INDEX IF NOT EXISTS idx_team_activities_org_id ON team_activities(org_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created_at ON team_activities(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_analytics_user_id ON ai_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_created_at ON ai_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON user_actions(created_at);

CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);

CREATE INDEX IF NOT EXISTS idx_growth_simulations_user_id ON growth_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_simulations_created_at ON growth_simulations(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_simulations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events
DROP POLICY IF EXISTS "Users can view their own events" ON events;
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own events" ON events;
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for team_activities
DROP POLICY IF EXISTS "Users can view team activities for their org" ON team_activities;
CREATE POLICY "Users can view team activities for their org" ON team_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id = team_activities.member_id
    )
  );

DROP POLICY IF EXISTS "Users can insert team activities for their org" ON team_activities;
CREATE POLICY "Users can insert team activities for their org" ON team_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id = team_activities.member_id
    )
  );

-- Create RLS policies for team_analytics
DROP POLICY IF EXISTS "Users can view team analytics for their org" ON team_analytics;
CREATE POLICY "Users can view team analytics for their org" ON team_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id::text = team_analytics.org_id::text
    )
  );

DROP POLICY IF EXISTS "Users can insert team analytics for their org" ON team_analytics;
CREATE POLICY "Users can insert team analytics for their org" ON team_analytics
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id::text = team_analytics.org_id::text
    )
  );

-- Create RLS policies for ai_analytics
DROP POLICY IF EXISTS "Users can view their own AI analytics" ON ai_analytics;
CREATE POLICY "Users can view their own AI analytics" ON ai_analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own AI analytics" ON ai_analytics;
CREATE POLICY "Users can insert their own AI analytics" ON ai_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_actions
DROP POLICY IF EXISTS "Users can view their own actions" ON user_actions;
CREATE POLICY "Users can view their own actions" ON user_actions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own actions" ON user_actions;
CREATE POLICY "Users can insert their own actions" ON user_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_analytics
DROP POLICY IF EXISTS "Users can view their own analytics" ON user_analytics;
CREATE POLICY "Users can view their own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own analytics" ON user_analytics;
CREATE POLICY "Users can insert their own analytics" ON user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own sessions" ON user_sessions;
CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for growth_simulations
DROP POLICY IF EXISTS "Users can view their own growth simulations" ON growth_simulations;
CREATE POLICY "Users can view their own growth simulations" ON growth_simulations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own growth simulations" ON growth_simulations;
CREATE POLICY "Users can insert their own growth simulations" ON growth_simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger functions for real-time notifications
CREATE OR REPLACE FUNCTION notify_event_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'event_update',
    json_build_object(
      'user_id', NEW.user_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_team_activity_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'team_activity_update',
    json_build_object(
      'org_id', NEW.org_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_ai_analytics_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'ai_analytics_update',
    json_build_object(
      'user_id', NEW.user_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_user_action_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'user_action_update',
    json_build_object(
      'user_id', NEW.user_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_growth_simulation_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'growth_simulation_update',
    json_build_object(
      'user_id', NEW.user_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for real-time notifications
DROP TRIGGER IF EXISTS event_update_trigger ON events;
CREATE TRIGGER event_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON events
  FOR EACH ROW EXECUTE FUNCTION notify_event_update();

DROP TRIGGER IF EXISTS team_activity_update_trigger ON team_activities;
CREATE TRIGGER team_activity_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON team_activities
  FOR EACH ROW EXECUTE FUNCTION notify_team_activity_update();

DROP TRIGGER IF EXISTS ai_analytics_update_trigger ON ai_analytics;
CREATE TRIGGER ai_analytics_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ai_analytics
  FOR EACH ROW EXECUTE FUNCTION notify_ai_analytics_update();

DROP TRIGGER IF EXISTS user_action_update_trigger ON user_actions;
CREATE TRIGGER user_action_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON user_actions
  FOR EACH ROW EXECUTE FUNCTION notify_user_action_update();

DROP TRIGGER IF EXISTS growth_simulation_update_trigger ON growth_simulations;
CREATE TRIGGER growth_simulation_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON growth_simulations
  FOR EACH ROW EXECUTE FUNCTION notify_growth_simulation_update(); 