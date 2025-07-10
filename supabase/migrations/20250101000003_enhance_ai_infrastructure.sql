-- Enhanced AI logging with provider metadata
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS provider text;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS model text;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS latency integer;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS error_message text;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS fallback_used boolean DEFAULT false;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS model_version text;
ALTER TABLE ai_log ADD COLUMN IF NOT EXISTS request_id text;

-- AI rate limiting table
CREATE TABLE IF NOT EXISTS ai_rate_limits (
    u_id uuid REFERENCES tier2_profiles(u_id) ON DELETE CASCADE,
    provider text NOT NULL,
    request_count integer DEFAULT 1,
    last_request timestamp with time zone DEFAULT now(),
    PRIMARY KEY (u_id, provider)
);

-- AI tasks queue
CREATE TABLE IF NOT EXISTS ai_tasks (
    task_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type text NOT NULL,
    task_data jsonb NOT NULL,
    priority text DEFAULT 'normal',
    status text DEFAULT 'queued',
    created_at timestamp with time zone DEFAULT now(),
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    error_message text
);

-- Event broadcast table
CREATE TABLE IF NOT EXISTS event_broadcast (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type text NOT NULL,
    event_data jsonb NOT NULL,
    timestamp timestamp with time zone DEFAULT now(),
    instance_id text NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_log_provider_createdat ON ai_log(provider, createdat);
CREATE INDEX IF NOT EXISTS idx_ai_log_u_id_createdat ON ai_log(u_id, createdat);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_status_priority ON ai_tasks(status, priority);
CREATE INDEX IF NOT EXISTS idx_event_broadcast_timestamp ON event_broadcast(timestamp);

-- Row Level Security for new tables
ALTER TABLE ai_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_broadcast ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_rate_limits
CREATE POLICY "Users can view their own rate limits" ON ai_rate_limits
    FOR SELECT USING (auth.uid()::text = u_id::text);

CREATE POLICY "Users can update their own rate limits" ON ai_rate_limits
    FOR UPDATE USING (auth.uid()::text = u_id::text);

CREATE POLICY "Users can insert their own rate limits" ON ai_rate_limits
    FOR INSERT WITH CHECK (auth.uid()::text = u_id::text);

-- RLS Policies for ai_tasks (admin only for now)
CREATE POLICY "Admins can manage ai_tasks" ON ai_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- RLS Policies for event_broadcast (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read events" ON event_broadcast
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert events" ON event_broadcast
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id::text = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Function to clean up old events
CREATE OR REPLACE FUNCTION cleanup_old_events()
RETURNS void AS $$
BEGIN
    DELETE FROM event_broadcast 
    WHERE timestamp < now() - interval '24 hours';
END;
$$ LANGUAGE plpgsql;

-- Function to get AI provider statistics
CREATE OR REPLACE FUNCTION get_ai_provider_stats(
    provider_name text,
    days_back integer DEFAULT 7
)
RETURNS TABLE (
    total_requests bigint,
    successful_requests bigint,
    failed_requests bigint,
    average_latency numeric,
    total_tokens bigint,
    error_rate numeric
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_requests,
        COUNT(*) FILTER (WHERE error_message IS NULL) as successful_requests,
        COUNT(*) FILTER (WHERE error_message IS NOT NULL) as failed_requests,
        AVG(latency) as average_latency,
        SUM(tokensused) as total_tokens,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                COUNT(*) FILTER (WHERE error_message IS NOT NULL)::numeric / COUNT(*)::numeric
            ELSE 0 
        END as error_rate
    FROM ai_log
    WHERE provider = provider_name
    AND createdat >= now() - (days_back || ' days')::interval;
END;
$$ LANGUAGE plpgsql;

-- Function to get user AI usage statistics
CREATE OR REPLACE FUNCTION get_user_ai_stats(
    user_id uuid,
    days_back integer DEFAULT 7
)
RETURNS TABLE (
    total_requests bigint,
    total_tokens bigint,
    average_latency numeric,
    providers_used text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_requests,
        SUM(tokensused) as total_tokens,
        AVG(latency) as average_latency,
        ARRAY_AGG(DISTINCT provider) as providers_used
    FROM ai_log
    WHERE u_id = user_id
    AND createdat >= now() - (days_back || ' days')::interval;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically clean up old events
CREATE OR REPLACE FUNCTION trigger_cleanup_old_events()
RETURNS trigger AS $$
BEGIN
    -- Clean up events older than 24 hours
    PERFORM cleanup_old_events();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cleanup_old_events_trigger
    AFTER INSERT ON event_broadcast
    EXECUTE FUNCTION trigger_cleanup_old_events();

-- Comments for documentation
COMMENT ON TABLE ai_rate_limits IS 'Tracks AI API rate limits per user and provider';
COMMENT ON TABLE ai_tasks IS 'Queue for AI processing tasks';
COMMENT ON TABLE event_broadcast IS 'Cross-instance event broadcasting for real-time updates';
COMMENT ON FUNCTION get_ai_provider_stats IS 'Get statistics for a specific AI provider';
COMMENT ON FUNCTION get_user_ai_stats IS 'Get AI usage statistics for a specific user'; 