-- Migration: Create Email Subscriptions Table
-- Date: 2024-03-21
-- Description: Create table to store email newsletter subscriptions for "Stay Ahead of the Curve"

-- Create email_subscriptions table
CREATE TABLE IF NOT EXISTS email_subscriptions (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    title TEXT,
    industry TEXT,
    company_size TEXT,
    revenue_range TEXT,
    linkedin_url TEXT,
    source TEXT DEFAULT 'blog_newsletter',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    last_email_sent_at TIMESTAMP WITH TIME ZONE,
    email_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE email_subscriptions IS 'Stores email newsletter subscriptions for "Stay Ahead of the Curve"';
COMMENT ON COLUMN email_subscriptions.email IS 'Unique email address of the subscriber';
COMMENT ON COLUMN email_subscriptions.source IS 'Where the subscription came from (blog_newsletter, homepage, etc.)';
COMMENT ON COLUMN email_subscriptions.status IS 'Current subscription status';
COMMENT ON COLUMN email_subscriptions.email_count IS 'Number of emails sent to this subscriber';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_status ON email_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_subscribed_at ON email_subscriptions(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_source ON email_subscriptions(source);

-- Enable RLS on email_subscriptions table
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy for email_subscriptions - allow public inserts (for newsletter signups)
CREATE POLICY "Allow public newsletter signups" ON email_subscriptions
    FOR INSERT WITH CHECK (true);

-- Policy for email_subscriptions - allow users to view their own subscription
CREATE POLICY "Users can view own subscription" ON email_subscriptions
    FOR SELECT USING (email = current_setting('request.headers', true)::json->>'x-user-email' OR auth.uid() IS NOT NULL);

-- Policy for email_subscriptions - allow users to update their own subscription
CREATE POLICY "Users can update own subscription" ON email_subscriptions
    FOR UPDATE USING (email = current_setting('request.headers', true)::json->>'x-user-email' OR auth.uid() IS NOT NULL);

-- Policy for email_subscriptions - allow admins to access all subscriptions
CREATE POLICY "Admins can access all email subscriptions" ON email_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_email_subscriptions_updated_at_trigger
    BEFORE UPDATE ON email_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_email_subscriptions_updated_at();

-- Create view for subscription analytics
CREATE OR REPLACE VIEW email_subscription_analytics AS
SELECT 
    DATE_TRUNC('day', subscribed_at) as signup_date,
    COUNT(*) as new_subscribers,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscribers,
    COUNT(CASE WHEN status = 'unsubscribed' THEN 1 END) as unsubscribed_count,
    COUNT(CASE WHEN status = 'bounced' THEN 1 END) as bounced_count
FROM email_subscriptions
GROUP BY DATE_TRUNC('day', subscribed_at)
ORDER BY signup_date DESC;

-- Grant access to analytics view
GRANT SELECT ON email_subscription_analytics TO authenticated;

-- Create function to get subscription count
CREATE OR REPLACE FUNCTION get_email_subscription_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM email_subscriptions 
        WHERE status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_email_subscription_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_email_subscription_count() TO anon; 