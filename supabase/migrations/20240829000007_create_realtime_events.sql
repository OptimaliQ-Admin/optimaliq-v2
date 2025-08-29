-- Migration: Create realtime events table for WebSocket integration
-- Description: Enables real-time updates for dashboard, team activity, and market intelligence

-- Create realtime_events table
CREATE TABLE IF NOT EXISTS realtime_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type TEXT NOT NULL CHECK (event_type IN (
        'dashboard_update',
        'team_activity', 
        'market_intelligence',
        'assessment_completed',
        'growth_lever_updated',
        'notification'
    )),
    user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT realtime_events_valid_payload CHECK (jsonb_typeof(payload) = 'object'),
    CONSTRAINT realtime_events_org_or_user CHECK (
        organization_id IS NOT NULL OR user_id IS NOT NULL
    )
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_realtime_events_org_type_created 
    ON realtime_events(organization_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_events_user_type_created 
    ON realtime_events(user_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_events_created_at 
    ON realtime_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_events_processed 
    ON realtime_events(processed_at) WHERE processed_at IS NULL;

-- Enable Row Level Security
ALTER TABLE realtime_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can only see events for their organization or directed to them
CREATE POLICY "Users can view organization and personal events" ON realtime_events
    FOR SELECT
    USING (
        auth.uid() = user_id OR
        organization_id IN (
            SELECT organization_id 
            FROM tier2_profiles 
            WHERE user_id = auth.uid()
        )
    );

-- Users can insert events for their organization
CREATE POLICY "Users can insert organization events" ON realtime_events
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM tier2_profiles 
            WHERE user_id = auth.uid()
        ) OR
        user_id = auth.uid()
    );

-- Only system can update events (for processing status)
CREATE POLICY "System can update events" ON realtime_events
    FOR UPDATE
    USING (false) -- No direct updates allowed
    WITH CHECK (false);

-- Add helpful comments
COMMENT ON TABLE realtime_events IS 'Real-time events for WebSocket integration across dashboard, team, and market intelligence';
COMMENT ON COLUMN realtime_events.event_type IS 'Type of real-time event being published';
COMMENT ON COLUMN realtime_events.payload IS 'JSON payload containing event-specific data';
COMMENT ON COLUMN realtime_events.processed_at IS 'Timestamp when event was processed by consumers';

-- Create a function to clean up old events (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_old_realtime_events()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete events older than 30 days
    DELETE FROM realtime_events 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    RAISE NOTICE 'Cleaned up old realtime events';
END;
$$;

-- Create a function to publish dashboard updates
CREATE OR REPLACE FUNCTION publish_dashboard_update(
    p_user_id UUID,
    p_organization_id UUID,
    p_metrics JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO realtime_events (
        event_type,
        user_id,
        organization_id,
        payload
    ) VALUES (
        'dashboard_update',
        p_user_id,
        p_organization_id,
        jsonb_build_object(
            'type', 'dashboard_update',
            'userId', p_user_id,
            'organizationId', p_organization_id,
            'metrics', p_metrics,
            'timestamp', NOW()
        )
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$;

-- Create a function to publish team activity
CREATE OR REPLACE FUNCTION publish_team_activity(
    p_user_id UUID,
    p_organization_id UUID,
    p_activity JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO realtime_events (
        event_type,
        user_id,
        organization_id,
        payload
    ) VALUES (
        'team_activity',
        p_user_id,
        p_organization_id,
        jsonb_build_object(
            'type', 'team_activity',
            'userId', p_user_id,
            'organizationId', p_organization_id,
            'activity', p_activity,
            'timestamp', NOW()
        )
    ) RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$;

-- Grant necessary permissions
GRANT SELECT, INSERT ON realtime_events TO authenticated;
GRANT EXECUTE ON FUNCTION publish_dashboard_update(UUID, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION publish_team_activity(UUID, UUID, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_realtime_events() TO service_role;
