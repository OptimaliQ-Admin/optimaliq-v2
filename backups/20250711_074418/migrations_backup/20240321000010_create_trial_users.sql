-- Migration: Create Trial Users Table
-- Date: 2024-03-21
-- Description: Create table to store trial user information

-- Create trial_users table
CREATE TABLE IF NOT EXISTS trial_users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT,
    company TEXT,
    title TEXT,
    trial_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'converted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE trial_users IS 'Stores trial user information for 30-day free trials';
COMMENT ON COLUMN trial_users.email IS 'Unique email address of the trial user';
COMMENT ON COLUMN trial_users.trial_start_date IS 'When the trial period began';
COMMENT ON COLUMN trial_users.trial_end_date IS 'When the trial period ends (30 days from start)';
COMMENT ON COLUMN trial_users.status IS 'Current trial status: active, expired, or converted';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trial_users_email ON trial_users(email);
CREATE INDEX IF NOT EXISTS idx_trial_users_status ON trial_users(status);
CREATE INDEX IF NOT EXISTS idx_trial_users_trial_end_date ON trial_users(trial_end_date);
CREATE INDEX IF NOT EXISTS idx_trial_users_created_at ON trial_users(created_at);

-- Enable RLS on trial_users table
ALTER TABLE trial_users ENABLE ROW LEVEL SECURITY;

-- Policy for trial_users - allow admins to access all trial users
CREATE POLICY "Admins can access all trial users" ON trial_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policy for trial_users - allow trial users to view their own record
CREATE POLICY "Trial users can view own record" ON trial_users
    FOR SELECT USING (email = current_setting('request.headers', true)::json->>'x-user-email');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_trial_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_trial_users_updated_at_trigger
    BEFORE UPDATE ON trial_users
    FOR EACH ROW
    EXECUTE FUNCTION update_trial_users_updated_at();

-- Create view for trial analytics
CREATE OR REPLACE VIEW trial_user_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as signup_date,
    COUNT(*) as new_trials,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_trials,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_trials,
    COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_trials,
    ROUND(
        COUNT(CASE WHEN status = 'converted' THEN 1 END)::DECIMAL / COUNT(*)::DECIMAL * 100, 2
    ) as conversion_rate
FROM trial_users
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;

-- Grant access to trial analytics view
GRANT SELECT ON trial_user_analytics TO authenticated; 