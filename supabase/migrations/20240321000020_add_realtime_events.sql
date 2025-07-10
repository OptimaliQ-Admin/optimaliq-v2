-- Create events table for real-time event tracking
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(255) NOT NULL,
  event_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for efficient event queries
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_org_id ON events(org_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Create team_activities table
CREATE TABLE IF NOT EXISTS team_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  member_id UUID NOT NULL,
  activity_type VARCHAR(255) NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for team activities
CREATE INDEX IF NOT EXISTS idx_team_activities_org_id ON team_activities(org_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_member_id ON team_activities(member_id);
CREATE INDEX IF NOT EXISTS idx_team_activities_created_at ON team_activities(created_at);

-- Create team_analytics table
CREATE TABLE IF NOT EXISTS team_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID NOT NULL,
  activity_type VARCHAR(255) NOT NULL,
  activity_count INTEGER DEFAULT 1,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(org_id, activity_type)
);

-- Create index for team analytics
CREATE INDEX IF NOT EXISTS idx_team_analytics_org_id ON team_analytics(org_id);

-- Create ai_analytics table
CREATE TABLE IF NOT EXISTS ai_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  duration INTEGER, -- in milliseconds
  tokens_used INTEGER DEFAULT 0,
  cost DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for AI analytics
CREATE INDEX IF NOT EXISTS idx_ai_analytics_user_id ON ai_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_provider ON ai_analytics(provider);
CREATE INDEX IF NOT EXISTS idx_ai_analytics_created_at ON ai_analytics(created_at);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  page VARCHAR(255),
  action_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user actions
CREATE INDEX IF NOT EXISTS idx_user_actions_user_id ON user_actions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_actions_action ON user_actions(action);
CREATE INDEX IF NOT EXISTS idx_user_actions_created_at ON user_actions(created_at);

-- Create user_analytics table
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  page VARCHAR(255),
  action_count INTEGER DEFAULT 1,
  last_action TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, action, page)
);

-- Create index for user analytics
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id VARCHAR(255) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at);

-- Create growth_simulations table
CREATE TABLE IF NOT EXISTS growth_simulations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  simulation_type VARCHAR(255) NOT NULL,
  scenario JSONB NOT NULL,
  results JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  score DECIMAL(5,2),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for growth simulations
CREATE INDEX IF NOT EXISTS idx_growth_simulations_user_id ON growth_simulations(user_id);
CREATE INDEX IF NOT EXISTS idx_growth_simulations_status ON growth_simulations(status);
CREATE INDEX IF NOT EXISTS idx_growth_simulations_created_at ON growth_simulations(created_at);

-- Add new columns to existing growth_levers table (if they don't exist)
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS name VARCHAR(255);
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS effectiveness DECIMAL(5,2) DEFAULT 0;
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active';
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS lever_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE growth_levers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for growth levers (using existing u_id column)
CREATE INDEX IF NOT EXISTS idx_growth_levers_u_id ON growth_levers(u_id);
CREATE INDEX IF NOT EXISTS idx_growth_levers_status ON growth_levers(status);

-- Add new columns to existing growth_insights table (if they don't exist)
ALTER TABLE growth_insights ADD COLUMN IF NOT EXISTS recommendations JSONB DEFAULT '{}'::jsonb;

-- Create index for growth insights (using existing u_id column)
CREATE INDEX IF NOT EXISTS idx_growth_insights_u_id ON growth_insights(u_id);
CREATE INDEX IF NOT EXISTS idx_growth_insights_created_at ON growth_insights(generatedat);

-- Add new columns to existing notifications table (if they don't exist)
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

-- Create index for notifications (using existing u_id column)
CREATE INDEX IF NOT EXISTS idx_notifications_u_id ON notifications(u_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Create function to notify dashboard updates
CREATE OR REPLACE FUNCTION notify_dashboard_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'dashboard_update',
    json_build_object(
      'user_id', NEW.u_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.insight_id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for dashboard insights
DROP TRIGGER IF EXISTS dashboard_update_trigger ON tier2_dashboard_insights;
CREATE TRIGGER dashboard_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tier2_dashboard_insights
  FOR EACH ROW EXECUTE FUNCTION notify_dashboard_update();

-- Create function to notify growth assessment updates
CREATE OR REPLACE FUNCTION notify_growth_assessment_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'growth_assessment_update',
    json_build_object(
      'user_id', NEW.u_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.u_id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for growth assessments
DROP TRIGGER IF EXISTS growth_assessment_update_trigger ON growth_assessment;
CREATE TRIGGER growth_assessment_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON growth_assessment
  FOR EACH ROW EXECUTE FUNCTION notify_growth_assessment_update();

-- Create function to notify AI log updates
CREATE OR REPLACE FUNCTION notify_ai_log_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'ai_log_update',
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

-- Create trigger for AI logs
DROP TRIGGER IF EXISTS ai_log_update_trigger ON ai_log;
CREATE TRIGGER ai_log_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ai_log
  FOR EACH ROW EXECUTE FUNCTION notify_ai_log_update();

-- Create function to notify AI task updates
CREATE OR REPLACE FUNCTION notify_ai_task_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'ai_task_update',
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

-- Create trigger for AI tasks
DROP TRIGGER IF EXISTS ai_task_update_trigger ON ai_tasks;
CREATE TRIGGER ai_task_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON ai_tasks
  FOR EACH ROW EXECUTE FUNCTION notify_ai_task_update();

-- Create function to notify growth simulation updates
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

-- Create trigger for growth simulations
DROP TRIGGER IF EXISTS growth_simulation_update_trigger ON growth_simulations;
CREATE TRIGGER growth_simulation_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON growth_simulations
  FOR EACH ROW EXECUTE FUNCTION notify_growth_simulation_update();

-- Create function to notify growth lever updates
CREATE OR REPLACE FUNCTION notify_growth_lever_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'growth_lever_update',
    json_build_object(
      'user_id', NEW.u_id,
      'table', TG_TABLE_NAME,
      'action', TG_OP,
      'record_id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for growth levers
DROP TRIGGER IF EXISTS growth_lever_update_trigger ON growth_levers;
CREATE TRIGGER growth_lever_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON growth_levers
  FOR EACH ROW EXECUTE FUNCTION notify_growth_lever_update();

-- Create function to notify team activity updates
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

-- Create trigger for team activities
DROP TRIGGER IF EXISTS team_activity_update_trigger ON team_activities;
CREATE TRIGGER team_activity_update_trigger
  AFTER INSERT OR UPDATE OR DELETE ON team_activities
  FOR EACH ROW EXECUTE FUNCTION notify_team_activity_update();

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_levers ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for team_activities
CREATE POLICY "Users can view team activities for their org" ON team_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id = team_activities.member_id
    )
  );

CREATE POLICY "Users can insert team activities for their org" ON team_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members 
      WHERE team_members.owner_u_id = auth.uid() 
      AND team_members.id = team_activities.member_id
    )
  );

-- Create RLS policies for ai_analytics
CREATE POLICY "Users can view their own AI analytics" ON ai_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI analytics" ON ai_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_actions
CREATE POLICY "Users can view their own actions" ON user_actions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own actions" ON user_actions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_analytics
CREATE POLICY "Users can view their own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics" ON user_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for growth_simulations
CREATE POLICY "Users can view their own growth simulations" ON growth_simulations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own growth simulations" ON growth_simulations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for growth_levers (using existing u_id column)
DROP POLICY IF EXISTS "Users can view their own growth levers" ON growth_levers;
CREATE POLICY "Users can view their own growth levers" ON growth_levers
  FOR SELECT USING (auth.uid() = u_id);

DROP POLICY IF EXISTS "Users can insert their own growth levers" ON growth_levers;
CREATE POLICY "Users can insert their own growth levers" ON growth_levers
  FOR INSERT WITH CHECK (auth.uid() = u_id);

-- Create RLS policies for growth_insights (using existing u_id column)
DROP POLICY IF EXISTS "Users can view their own growth insights" ON growth_insights;
CREATE POLICY "Users can view their own growth insights" ON growth_insights
  FOR SELECT USING (auth.uid() = u_id);

DROP POLICY IF EXISTS "Users can insert their own growth insights" ON growth_insights;
CREATE POLICY "Users can insert their own growth insights" ON growth_insights
  FOR INSERT WITH CHECK (auth.uid() = u_id);

-- Create RLS policies for notifications (using existing u_id column)
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = u_id);

DROP POLICY IF EXISTS "Users can insert their own notifications" ON notifications;
CREATE POLICY "Users can insert their own notifications" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = u_id);

DROP POLICY IF EXISTS "Users can update their own notifications" ON notifications;
CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = u_id); 