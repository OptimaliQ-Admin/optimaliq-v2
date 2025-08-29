-- Migration: Create Stripe events tracking table
-- Description: Tracks Stripe webhook events for idempotency and debugging

-- Create stripe_events table for webhook event tracking
CREATE TABLE IF NOT EXISTS stripe_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    stripe_event_id TEXT UNIQUE NOT NULL,
    event_type TEXT NOT NULL,
    data JSONB NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT stripe_events_valid_data CHECK (jsonb_typeof(data) = 'object')
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_stripe_events_stripe_id 
    ON stripe_events(stripe_event_id);

CREATE INDEX IF NOT EXISTS idx_stripe_events_type_created 
    ON stripe_events(event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stripe_events_status 
    ON stripe_events(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_stripe_events_unprocessed 
    ON stripe_events(created_at) WHERE status = 'pending';

-- Enable Row Level Security
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (only service role can access)
CREATE POLICY "Service role can manage stripe events" ON stripe_events
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Add helpful comments
COMMENT ON TABLE stripe_events IS 'Tracks Stripe webhook events for idempotency and debugging';
COMMENT ON COLUMN stripe_events.stripe_event_id IS 'Unique Stripe event ID for idempotency';
COMMENT ON COLUMN stripe_events.event_type IS 'Type of Stripe webhook event';
COMMENT ON COLUMN stripe_events.data IS 'Full event data from Stripe';
COMMENT ON COLUMN stripe_events.status IS 'Processing status of the event';

-- Add Stripe customer ID to organizations table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' 
        AND column_name = 'stripe_customer_id'
    ) THEN
        ALTER TABLE organizations 
        ADD COLUMN stripe_customer_id TEXT UNIQUE;
        
        CREATE INDEX IF NOT EXISTS idx_organizations_stripe_customer 
            ON organizations(stripe_customer_id);
            
        COMMENT ON COLUMN organizations.stripe_customer_id IS 'Stripe customer ID for billing';
    END IF;
END $$;

-- Add subscription fields to organizations table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'organizations' 
        AND column_name = 'stripe_subscription_id'
    ) THEN
        ALTER TABLE organizations 
        ADD COLUMN stripe_subscription_id TEXT,
        ADD COLUMN subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN (
            'free', 'active', 'past_due', 'canceled', 'unpaid', 'trialing'
        )),
        ADD COLUMN current_plan TEXT DEFAULT 'free' CHECK (current_plan IN (
            'free', 'accelerator', 'enterprise'
        )),
        ADD COLUMN subscription_current_period_start TIMESTAMPTZ,
        ADD COLUMN subscription_current_period_end TIMESTAMPTZ;
        
        CREATE INDEX IF NOT EXISTS idx_organizations_subscription_status 
            ON organizations(subscription_status);
            
        CREATE INDEX IF NOT EXISTS idx_organizations_current_plan 
            ON organizations(current_plan);
            
        COMMENT ON COLUMN organizations.stripe_subscription_id IS 'Active Stripe subscription ID';
        COMMENT ON COLUMN organizations.subscription_status IS 'Current subscription status';
        COMMENT ON COLUMN organizations.current_plan IS 'Current subscription plan';
    END IF;
END $$;

-- Create a function to update subscription status
CREATE OR REPLACE FUNCTION update_organization_subscription(
    p_stripe_customer_id TEXT,
    p_subscription_id TEXT,
    p_status TEXT,
    p_plan TEXT,
    p_current_period_start TIMESTAMPTZ,
    p_current_period_end TIMESTAMPTZ
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE organizations 
    SET 
        stripe_subscription_id = p_subscription_id,
        subscription_status = p_status,
        current_plan = p_plan,
        subscription_current_period_start = p_current_period_start,
        subscription_current_period_end = p_current_period_end,
        updated_at = NOW()
    WHERE stripe_customer_id = p_stripe_customer_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Organization with Stripe customer ID % not found', p_stripe_customer_id;
    END IF;
END;
$$;

-- Create a function to clean up old Stripe events
CREATE OR REPLACE FUNCTION cleanup_old_stripe_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete processed events older than 90 days
    DELETE FROM stripe_events 
    WHERE status = 'processed' 
    AND created_at < NOW() - INTERVAL '90 days';
    
    -- Delete failed events older than 30 days
    DELETE FROM stripe_events 
    WHERE status = 'failed' 
    AND created_at < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Cleaned up old Stripe events';
END;
$$;

-- Grant necessary permissions
GRANT ALL ON stripe_events TO service_role;
GRANT EXECUTE ON FUNCTION update_organization_subscription(TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION cleanup_old_stripe_events() TO service_role;
