-- AI Rate Limiting and Monitoring Tables
-- Migration: 20240321000020_add_ai_monitoring_tables.sql

-- AI Rate Limits Table
CREATE TABLE IF NOT EXISTS ai_rate_limits (
    id BIGSERIAL PRIMARY KEY,
    u_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    request_count INTEGER DEFAULT 0,
    last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    allowed BOOLEAN DEFAULT true,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Versions Table
CREATE TABLE IF NOT EXISTS ai_model_versions (
    id VARCHAR(100) PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    release_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    metadata JSONB,
    performance JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Status Updates Table
CREATE TABLE IF NOT EXISTS ai_model_status_updates (
    id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Requests Table
CREATE TABLE IF NOT EXISTS ai_model_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    u_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    response_time INTEGER NOT NULL, -- milliseconds
    tokens_used INTEGER,
    cost DECIMAL(10,4) DEFAULT 0,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Model Rollbacks Table
CREATE TABLE IF NOT EXISTS ai_model_rollbacks (
    id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    target_version VARCHAR(50) NOT NULL,
    previous_version VARCHAR(50),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Log Table (for general AI request logging)
CREATE TABLE IF NOT EXISTS ai_log (
    id BIGSERIAL PRIMARY KEY,
    u_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    response_time INTEGER NOT NULL, -- milliseconds
    success BOOLEAN DEFAULT true,
    tokens_used INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin Audit Log Table
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_user ON ai_rate_limits(u_id);
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_provider ON ai_rate_limits(provider);
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_timestamp ON ai_rate_limits(timestamp);

CREATE INDEX IF NOT EXISTS idx_ai_model_versions_provider_model ON ai_model_versions(provider, model);
CREATE INDEX IF NOT EXISTS idx_ai_model_versions_status ON ai_model_versions(status);

CREATE INDEX IF NOT EXISTS idx_ai_model_requests_user ON ai_model_requests(u_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_requests_provider ON ai_model_requests(provider);
CREATE INDEX IF NOT EXISTS idx_ai_model_requests_timestamp ON ai_model_requests(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_model_requests_success ON ai_model_requests(success);

CREATE INDEX IF NOT EXISTS idx_ai_log_user ON ai_log(u_id);
CREATE INDEX IF NOT EXISTS idx_ai_log_provider ON ai_log(provider);
CREATE INDEX IF NOT EXISTS idx_ai_log_timestamp ON ai_log(timestamp);

-- Create RLS policies
ALTER TABLE ai_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_status_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_rollbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_rate_limits
CREATE POLICY "Users can view their own rate limit data" ON ai_rate_limits
    FOR SELECT USING (auth.uid() = u_id);

CREATE POLICY "Service can insert rate limit data" ON ai_rate_limits
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Service can update rate limit data" ON ai_rate_limits
    FOR UPDATE USING (true);

-- RLS Policies for ai_model_versions
CREATE POLICY "Anyone can view model versions" ON ai_model_versions
    FOR SELECT USING (true);

CREATE POLICY "Service can manage model versions" ON ai_model_versions
    FOR ALL USING (true);

-- RLS Policies for ai_model_status_updates
CREATE POLICY "Anyone can view model status updates" ON ai_model_status_updates
    FOR SELECT USING (true);

CREATE POLICY "Service can insert model status updates" ON ai_model_status_updates
    FOR INSERT WITH CHECK (true);

-- RLS Policies for ai_model_requests
CREATE POLICY "Users can view their own model requests" ON ai_model_requests
    FOR SELECT USING (auth.uid() = u_id);

CREATE POLICY "Service can insert model requests" ON ai_model_requests
    FOR INSERT WITH CHECK (true);

-- RLS Policies for ai_model_rollbacks
CREATE POLICY "Anyone can view model rollbacks" ON ai_model_rollbacks
    FOR SELECT USING (true);

CREATE POLICY "Service can insert model rollbacks" ON ai_model_rollbacks
    FOR INSERT WITH CHECK (true);

-- RLS Policies for ai_log
CREATE POLICY "Users can view their own AI log entries" ON ai_log
    FOR SELECT USING (auth.uid() = u_id);

CREATE POLICY "Service can insert AI log entries" ON ai_log
    FOR INSERT WITH CHECK (true);

-- RLS Policies for admin_audit_log
CREATE POLICY "Only admins can view audit log" ON admin_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE u_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Service can insert audit log entries" ON admin_audit_log
    FOR INSERT WITH CHECK (true);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_ai_model_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ai_model_versions_updated_at
    BEFORE UPDATE ON ai_model_versions
    FOR EACH ROW
    EXECUTE FUNCTION update_ai_model_versions_updated_at();

-- Insert some initial data for testing
INSERT INTO ai_model_versions (id, provider, model, version, release_date, status, metadata, performance) VALUES
('gpt-4-v1', 'openai', 'gpt-4', '1.0', '2024-01-01', 'active', 
 '{"maxTokens": 8192, "temperature": 0.7, "costPer1kTokens": 0.03, "capabilities": ["text-generation", "code-generation", "analysis"], "limitations": ["context-length", "real-time-data"], "trainingData": "Up to April 2023"}',
 '{"averageResponseTime": 2000, "successRate": 0.98, "errorRate": 0.02, "totalRequests": 0, "totalTokens": 0, "totalCost": 0}'),
('gpt-4-turbo-v1', 'openai', 'gpt-4-turbo', '1.0', '2024-01-01', 'active',
 '{"maxTokens": 128000, "temperature": 0.7, "costPer1kTokens": 0.01, "capabilities": ["text-generation", "code-generation", "analysis", "vision"], "limitations": ["real-time-data"], "trainingData": "Up to April 2024"}',
 '{"averageResponseTime": 1500, "successRate": 0.99, "errorRate": 0.01, "totalRequests": 0, "totalTokens": 0, "totalCost": 0}'),
('claude-3-sonnet-v1', 'claude', 'claude-3-sonnet', '1.0', '2024-01-01', 'active',
 '{"maxTokens": 200000, "temperature": 0.7, "costPer1kTokens": 0.015, "capabilities": ["text-generation", "analysis", "reasoning"], "limitations": ["code-generation"], "trainingData": "Up to August 2023"}',
 '{"averageResponseTime": 1800, "successRate": 0.97, "errorRate": 0.03, "totalRequests": 0, "totalTokens": 0, "totalCost": 0}'),
('gemini-pro-v1', 'vertex', 'gemini-pro', '1.0', '2024-01-01', 'active',
 '{"maxTokens": 32768, "temperature": 0.7, "costPer1kTokens": 0.0125, "capabilities": ["text-generation", "code-generation", "analysis"], "limitations": ["context-length"], "trainingData": "Up to February 2024"}',
 '{"averageResponseTime": 1200, "successRate": 0.96, "errorRate": 0.04, "totalRequests": 0, "totalTokens": 0, "totalCost": 0}')
ON CONFLICT (id) DO NOTHING; 