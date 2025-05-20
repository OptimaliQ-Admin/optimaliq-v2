-- Create notification types enum
CREATE TYPE notification_type AS ENUM (
  'assessment_reminder',
  'system_update',
  'subscription',
  'profile_update',
  'general'
);

-- Create notification priority enum
CREATE TYPE notification_priority AS ENUM (
  'high',
  'medium',
  'low'
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES tier2_users(u_id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  action_url TEXT,
  priority notification_priority DEFAULT 'medium',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX notifications_user_id_idx ON notifications(user_id);
CREATE INDEX notifications_created_at_idx ON notifications(created_at);
CREATE INDEX notifications_read_idx ON notifications(read);

-- Create notification preferences table
CREATE TABLE notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES tier2_users(u_id) ON DELETE CASCADE,
  assessment_reminders BOOLEAN DEFAULT true,
  system_updates BOOLEAN DEFAULT true,
  subscription_updates BOOLEAN DEFAULT true,
  profile_updates BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for notification_preferences
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 