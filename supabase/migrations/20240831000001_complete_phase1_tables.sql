-- Complete Phase 1 Database Schema
-- Adding all missing tables to achieve 100% completion

-- User Management Tables
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '[]',
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(20) NOT NULL,
    scope VARCHAR(20) DEFAULT 'own',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment & Scoring Tables
CREATE TABLE IF NOT EXISTS score_bpm (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES bmp_assessment(id) ON DELETE CASCADE,
    overall_score DECIMAL(5,2),
    process_maturity_score DECIMAL(5,2),
    automation_score DECIMAL(5,2),
    efficiency_score DECIMAL(5,2),
    breakdown JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bmp_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'draft',
    payload JSONB,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_banks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    industry VARCHAR(50),
    questions JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES tier2_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Growth & Intelligence Tables
CREATE TABLE IF NOT EXISTS kpi_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_category VARCHAR(50),
    current_value DECIMAL(15,2),
    target_value DECIMAL(15,2),
    unit VARCHAR(20),
    frequency VARCHAR(20) DEFAULT 'monthly',
    trend_data JSONB,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    scenario_type VARCHAR(50),
    assumptions JSONB,
    projections JSONB,
    confidence_level DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roi_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    initiative_name VARCHAR(100) NOT NULL,
    investment_amount DECIMAL(15,2),
    expected_return DECIMAL(15,2),
    actual_return DECIMAL(15,2),
    roi_percentage DECIMAL(5,2),
    payback_period_months INTEGER,
    risk_level VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team & Delegation Tables
CREATE TABLE IF NOT EXISTS pulse_surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    frequency VARCHAR(20) DEFAULT 'weekly',
    is_active BOOLEAN DEFAULT true,
    anonymous_responses BOOLEAN DEFAULT false,
    created_by UUID REFERENCES tier2_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pulse_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pulse_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID,
    invite_id UUID,
    user_id UUID REFERENCES tier2_users(id) ON DELETE SET NULL,
    responses JSONB NOT NULL,
    sentiment_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collaboration_spaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    space_type VARCHAR(50),
    settings JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES tier2_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workflow_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    workflow_type VARCHAR(50),
    steps JSONB NOT NULL,
    triggers JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES tier2_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2),
    metric_unit VARCHAR(20),
    period_start DATE,
    period_end DATE,
    target_value DECIMAL(15,2),
    performance_rating VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI & Intelligence Tables
CREATE TABLE IF NOT EXISTS ai_model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    provider VARCHAR(50),
    capabilities JSONB,
    performance_metrics JSONB,
    is_active BOOLEAN DEFAULT true,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS performance_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID REFERENCES ai_model_versions(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    context JSONB
);

CREATE TABLE IF NOT EXISTS content_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_name VARCHAR(100) NOT NULL,
    cluster_type VARCHAR(50),
    keywords TEXT[],
    content_ids UUID[],
    similarity_threshold DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semantic_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name VARCHAR(100) NOT NULL,
    semantic_meaning TEXT,
    related_concepts TEXT[],
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    insight_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    confidence_score DECIMAL(3,2),
    source_data JSONB,
    actionable BOOLEAN DEFAULT true,
    priority VARCHAR(20) DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS recommendation_engine (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES tier2_users(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    action_items JSONB,
    priority_score DECIMAL(3,2),
    category VARCHAR(50),
    is_implemented BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID REFERENCES ai_model_versions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES tier2_users(id) ON DELETE SET NULL,
    feedback_type VARCHAR(50) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    context JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS improvement_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_version_id UUID REFERENCES ai_model_versions(id) ON DELETE CASCADE,
    improvement_type VARCHAR(50) NOT NULL,
    description TEXT,
    impact_score DECIMAL(3,2),
    implementation_status VARCHAR(20) DEFAULT 'planned',
    implemented_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Generation & Marketing Tables
CREATE TABLE IF NOT EXISTS attribution_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    touchpoint_type VARCHAR(50) NOT NULL,
    touchpoint_value TEXT,
    attribution_weight DECIMAL(3,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversion_funnels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_name VARCHAR(100) NOT NULL,
    funnel_type VARCHAR(50),
    stages JSONB NOT NULL,
    conversion_rates JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lead_scoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL,
    scoring_factors JSONB,
    qualification_status VARCHAR(20),
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qualification_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50),
    conditions JSONB NOT NULL,
    actions JSONB,
    priority INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trial_signups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(200),
    trial_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    conversion_status VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS nurture_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(100) NOT NULL,
    target_audience JSONB,
    email_sequence JSONB,
    triggers JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS funnel_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_id UUID REFERENCES conversion_funnels(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    visitors_count INTEGER DEFAULT 0,
    conversions_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS affiliate_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id VARCHAR(100) NOT NULL,
    campaign_name VARCHAR(100),
    clicks_count INTEGER DEFAULT 0,
    conversions_count INTEGER DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    commission_earned DECIMAL(10,2) DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resource_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50),
    file_url TEXT,
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    created_by UUID REFERENCES tier2_users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonial_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(200) NOT NULL,
    company VARCHAR(200),
    testimonial_text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    testimonial_type VARCHAR(50),
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_name ON user_roles(name);
CREATE INDEX IF NOT EXISTS idx_permissions_resource_action ON permissions(resource, action);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_user_id ON user_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_action ON user_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log(created_at);
CREATE INDEX IF NOT EXISTS idx_score_bmp_user_id ON score_bmp(user_id);
CREATE INDEX IF NOT EXISTS idx_bmp_assessment_user_id ON bmp_assessment(user_id);
CREATE INDEX IF NOT EXISTS idx_question_banks_category ON question_banks(category);
CREATE INDEX IF NOT EXISTS idx_kpi_tracking_user_id ON kpi_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_roi_metrics_user_id ON roi_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_pulse_surveys_org_id ON pulse_surveys(organization_id);
CREATE INDEX IF NOT EXISTS idx_pulse_invites_token ON pulse_invites(token);
-- CREATE INDEX IF NOT EXISTS idx_pulse_responses_survey_id ON pulse_responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_spaces_org_id ON collaboration_spaces(organization_id);
CREATE INDEX IF NOT EXISTS idx_workflow_definitions_org_id ON workflow_definitions(organization_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_user_id ON performance_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_model_versions_name ON ai_model_versions(model_name);
CREATE INDEX IF NOT EXISTS idx_performance_tracking_model_id ON performance_tracking(model_version_id);
CREATE INDEX IF NOT EXISTS idx_content_clusters_type ON content_clusters(cluster_type);
CREATE INDEX IF NOT EXISTS idx_semantic_groups_name ON semantic_groups(group_name);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON ai_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_type ON ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_recommendation_engine_user_id ON recommendation_engine(user_id);
CREATE INDEX IF NOT EXISTS idx_model_feedback_model_id ON model_feedback(model_version_id);
CREATE INDEX IF NOT EXISTS idx_improvement_tracking_model_id ON improvement_tracking(model_version_id);
CREATE INDEX IF NOT EXISTS idx_attribution_tracking_lead_id ON attribution_tracking(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_name ON conversion_funnels(funnel_name);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_lead_id ON lead_scoring(lead_id);
CREATE INDEX IF NOT EXISTS idx_qualification_rules_type ON qualification_rules(rule_type);
CREATE INDEX IF NOT EXISTS idx_trial_signups_email ON trial_signups(email);
CREATE INDEX IF NOT EXISTS idx_nurture_campaigns_name ON nurture_campaigns(campaign_name);
CREATE INDEX IF NOT EXISTS idx_funnel_analytics_funnel_id ON funnel_analytics(funnel_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_tracking_affiliate_id ON affiliate_tracking(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_resource_library_type ON resource_library(resource_type);
CREATE INDEX IF NOT EXISTS idx_testimonial_management_approved ON testimonial_management(is_approved);

-- Add RLS policies for new tables
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE score_bmp ENABLE ROW LEVEL SECURITY;
ALTER TABLE bmp_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE roi_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulse_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE semantic_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_engine ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribution_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE qualification_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE trial_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurture_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE funnel_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonial_management ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables (with error handling)
DO $$
BEGIN
    -- User roles and permissions
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'users_can_read_own_roles') THEN
        CREATE POLICY "users_can_read_own_roles" ON user_roles FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'permissions' AND policyname = 'users_can_read_permissions') THEN
        CREATE POLICY "users_can_read_permissions" ON permissions FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_sessions' AND policyname = 'users_can_manage_own_sessions') THEN
        CREATE POLICY "users_can_manage_own_sessions" ON user_sessions FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_activity_log' AND policyname = 'users_can_read_own_activity') THEN
        CREATE POLICY "users_can_read_own_activity" ON user_activity_log FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'score_bmp' AND policyname = 'users_can_read_own_bmp_scores') THEN
        CREATE POLICY "users_can_read_own_bmp_scores" ON score_bmp FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bmp_assessment' AND policyname = 'users_can_manage_own_bmp_assessments') THEN
        CREATE POLICY "users_can_manage_own_bmp_assessments" ON bmp_assessment FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_banks' AND policyname = 'question_banks_public_read') THEN
        CREATE POLICY "question_banks_public_read" ON question_banks FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'kpi_tracking' AND policyname = 'users_can_manage_own_kpis') THEN
        CREATE POLICY "users_can_manage_own_kpis" ON kpi_tracking FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'scenarios' AND policyname = 'users_can_manage_own_scenarios') THEN
        CREATE POLICY "users_can_manage_own_scenarios" ON scenarios FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'roi_metrics' AND policyname = 'users_can_manage_own_roi') THEN
        CREATE POLICY "users_can_manage_own_roi" ON roi_metrics FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pulse_surveys' AND policyname = 'org_members_can_read_pulse_surveys') THEN
        CREATE POLICY "org_members_can_read_pulse_surveys" ON pulse_surveys FOR SELECT USING (organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pulse_invites' AND policyname = 'pulse_invites_token_access') THEN
        CREATE POLICY "pulse_invites_token_access" ON pulse_invites FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pulse_responses' AND policyname = 'pulse_anonymous_responses') THEN
        CREATE POLICY "pulse_anonymous_responses" ON pulse_responses FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'collaboration_spaces' AND policyname = 'org_members_can_read_collaboration') THEN
        CREATE POLICY "org_members_can_read_collaboration" ON collaboration_spaces FOR SELECT USING (organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workflow_definitions' AND policyname = 'org_members_can_read_workflows') THEN
        CREATE POLICY "org_members_can_read_workflows" ON workflow_definitions FOR SELECT USING (organization_id IN (SELECT organization_id FROM team_members WHERE user_id = auth.uid()));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'performance_metrics' AND policyname = 'users_can_manage_own_performance') THEN
        CREATE POLICY "users_can_manage_own_performance" ON performance_metrics FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_model_versions' AND policyname = 'ai_models_public_read') THEN
        CREATE POLICY "ai_models_public_read" ON ai_model_versions FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'performance_tracking' AND policyname = 'performance_tracking_read') THEN
        CREATE POLICY "performance_tracking_read" ON performance_tracking FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content_clusters' AND policyname = 'content_clusters_public_read') THEN
        CREATE POLICY "content_clusters_public_read" ON content_clusters FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'semantic_groups' AND policyname = 'semantic_groups_public_read') THEN
        CREATE POLICY "semantic_groups_public_read" ON semantic_groups FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_insights' AND policyname = 'users_can_read_own_insights') THEN
        CREATE POLICY "users_can_read_own_insights" ON ai_insights FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'recommendation_engine' AND policyname = 'users_can_manage_own_recommendations') THEN
        CREATE POLICY "users_can_manage_own_recommendations" ON recommendation_engine FOR ALL USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'model_feedback' AND policyname = 'model_feedback_public') THEN
        CREATE POLICY "model_feedback_public" ON model_feedback FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'improvement_tracking' AND policyname = 'improvement_tracking_read') THEN
        CREATE POLICY "improvement_tracking_read" ON improvement_tracking FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'attribution_tracking' AND policyname = 'attribution_tracking_read') THEN
        CREATE POLICY "attribution_tracking_read" ON attribution_tracking FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversion_funnels' AND policyname = 'conversion_funnels_public_read') THEN
        CREATE POLICY "conversion_funnels_public_read" ON conversion_funnels FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'lead_scoring' AND policyname = 'lead_scoring_read') THEN
        CREATE POLICY "lead_scoring_read" ON lead_scoring FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'qualification_rules' AND policyname = 'qualification_rules_read') THEN
        CREATE POLICY "qualification_rules_read" ON qualification_rules FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trial_signups' AND policyname = 'trial_signups_public') THEN
        CREATE POLICY "trial_signups_public" ON trial_signups FOR ALL USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'nurture_campaigns' AND policyname = 'nurture_campaigns_read') THEN
        CREATE POLICY "nurture_campaigns_read" ON nurture_campaigns FOR SELECT USING (is_active = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'funnel_analytics' AND policyname = 'funnel_analytics_read') THEN
        CREATE POLICY "funnel_analytics_read" ON funnel_analytics FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'affiliate_tracking' AND policyname = 'affiliate_tracking_read') THEN
        CREATE POLICY "affiliate_tracking_read" ON affiliate_tracking FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'resource_library' AND policyname = 'resource_library_public_read') THEN
        CREATE POLICY "resource_library_public_read" ON resource_library FOR SELECT USING (is_public = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonial_management' AND policyname = 'testimonial_management_public_read') THEN
        CREATE POLICY "testimonial_management_public_read" ON testimonial_management FOR SELECT USING (is_approved = true);
    END IF;
END $$;

-- Add foreign key constraints (commented out for now to avoid dependency issues)
-- ALTER TABLE score_bmp ADD CONSTRAINT fk_score_bmp_assessment FOREIGN KEY (assessment_id) REFERENCES bmp_assessment(id) ON DELETE CASCADE;
-- ALTER TABLE pulse_invites ADD CONSTRAINT fk_pulse_invites_survey FOREIGN KEY (survey_id) REFERENCES pulse_surveys(id) ON DELETE CASCADE;
-- ALTER TABLE pulse_responses ADD CONSTRAINT fk_pulse_responses_survey FOREIGN KEY (survey_id) REFERENCES pulse_surveys(id) ON DELETE CASCADE;
-- ALTER TABLE pulse_responses ADD CONSTRAINT fk_pulse_responses_invite FOREIGN KEY (invite_id) REFERENCES pulse_invites(id) ON DELETE SET NULL;
-- ALTER TABLE performance_tracking ADD CONSTRAINT fk_performance_tracking_model FOREIGN KEY (model_version_id) REFERENCES ai_model_versions(id) ON DELETE CASCADE;
-- ALTER TABLE ai_insights ADD CONSTRAINT fk_ai_insights_user FOREIGN KEY (user_id) REFERENCES tier2_users(id) ON DELETE CASCADE;
-- ALTER TABLE recommendation_engine ADD CONSTRAINT fk_recommendation_engine_user FOREIGN KEY (user_id) REFERENCES tier2_users(id) ON DELETE CASCADE;
-- ALTER TABLE model_feedback ADD CONSTRAINT fk_model_feedback_model FOREIGN KEY (model_version_id) REFERENCES ai_model_versions(id) ON DELETE CASCADE;
-- ALTER TABLE improvement_tracking ADD CONSTRAINT fk_improvement_tracking_model FOREIGN KEY (model_version_id) REFERENCES ai_model_versions(id) ON DELETE CASCADE;
-- ALTER TABLE funnel_analytics ADD CONSTRAINT fk_funnel_analytics_funnel FOREIGN KEY (funnel_id) REFERENCES conversion_funnels(id) ON DELETE CASCADE;
