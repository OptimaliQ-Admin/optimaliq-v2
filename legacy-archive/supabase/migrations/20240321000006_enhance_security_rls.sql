-- Migration: Enhance RLS Security with Admin Policies and Audit Trail
-- Date: 2024-03-21
-- Description: Add admin override policies and audit logging for better security management

-- 1. Create audit_log table for tracking sensitive operations
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('SELECT', 'INSERT', 'UPDATE', 'DELETE')),
    user_id UUID,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW(),
    session_id UUID
);

-- Enable RLS on audit_log table
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Policy for audit_log - only admins can read audit logs
CREATE POLICY "Only admins can read audit logs" ON audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Policy for audit_log - system can insert audit logs
CREATE POLICY "System can insert audit logs" ON audit_log
    FOR INSERT WITH CHECK (true);

-- 2. Add admin override policies for all user-specific tables
-- These policies allow admins to access all data while regular users can only access their own

-- Admin policy for tier2_users
CREATE POLICY "Admins can access all tier2_users" ON tier2_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin policy for growth_users
CREATE POLICY "Admins can access all growth_users" ON growth_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin policy for assessment tables
CREATE POLICY "Admins can access all assessments" ON growth_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON ai_readiness_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON bpm_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON competitive_benchmarking_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON customer_experience_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON digital_transformation_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON leadership_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON marketing_effectiveness_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON sales_performance_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON strategic_maturity_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON tech_stack_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all assessments" ON reassessment_assessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin policy for score tables
CREATE POLICY "Admins can access all scores" ON score_ai_readiness
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_bpm
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_competitive_benchmarking
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_customer_experience
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_digital_transformation
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_leadership
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_marketing_effectiveness
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_sales_performance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_strategic_maturity
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_tech_stack
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all scores" ON score_reassessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admin policy for insights and user-specific data
CREATE POLICY "Admins can access all insights" ON growth_insights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all insights" ON growth_insights_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all levers" ON growth_levers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all lever progress" ON growth_lever_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all dashboard insights" ON tier2_dashboard_insights
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all profiles" ON tier2_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all simulation history" ON tier2_simulation_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all tech stacks" ON user_tech_stack
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all onboarding" ON onboarding_assessments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all notification preferences" ON notification_preferences
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all subscriptions" ON subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all AI logs" ON ai_log
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all user activity" ON useractivity
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all business reassessment" ON business_reassessment
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 3. Create function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_table_name TEXT,
    p_operation TEXT,
    p_record_id UUID DEFAULT NULL,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_log (
        table_name,
        operation,
        user_id,
        record_id,
        old_values,
        new_values,
        ip_address,
        user_agent,
        session_id
    ) VALUES (
        p_table_name,
        p_operation,
        auth.uid(),
        p_record_id,
        p_old_values,
        p_new_values,
        inet_client_addr(),
        current_setting('request.headers', true)::json->>'user-agent',
        auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create triggers for automatic audit logging on sensitive tables
-- Example trigger for tier2_users table
CREATE OR REPLACE FUNCTION audit_tier2_users() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event('tier2_users', 'INSERT', NEW.u_id, NULL, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event('tier2_users', 'UPDATE', NEW.u_id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event('tier2_users', 'DELETE', OLD.u_id, to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on tier2_users
DROP TRIGGER IF EXISTS audit_tier2_users_trigger ON tier2_users;
CREATE TRIGGER audit_tier2_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tier2_users
    FOR EACH ROW EXECUTE FUNCTION audit_tier2_users();

-- 5. Create indexes for better audit log performance
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_log_operation ON audit_log(operation);

-- 6. Add role column to tier2_users if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tier2_users' AND column_name = 'role'
    ) THEN
        ALTER TABLE tier2_users ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'support'));
    END IF;
END $$;

-- 7. Create view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard AS
SELECT 
    'tier2_users' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM tier2_users
UNION ALL
SELECT 
    'growth_users' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM growth_users
UNION ALL
SELECT 
    'subscriptions' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_updated
FROM subscriptions
UNION ALL
SELECT 
    'audit_log' as table_name,
    COUNT(*) as record_count,
    MAX(timestamp) as last_updated
FROM audit_log;

-- Grant access to admin dashboard view
GRANT SELECT ON admin_dashboard TO authenticated; 