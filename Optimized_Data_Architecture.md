# Optimized Data Architecture: Complete Redesign

## Executive Summary

This redesigned architecture reduces complexity from **114 tables to 25 core tables**, implements modern patterns, and provides a clear migration path. The new design focuses on **efficiency**, **maintainability**, and **scalability** while preserving all current functionality.

---

## 1. Core Design Principles

### 1.1. Architectural Patterns
- **Event Sourcing**: All changes tracked as events
- **CQRS**: Separate read/write models for performance
- **Domain-Driven Design**: Business-focused table structure
- **Single Responsibility**: Each table has one clear purpose

### 1.2. Data Strategy
- **Unified Assessment System**: One table for all assessment types
- **Consistent Naming**: Standardized field names across all tables
- **JSONB for Flexibility**: Complex data stored as JSONB
- **Partitioning**: Large tables partitioned by date

---

## 2. Core Tables (25 Tables)

### 2.1. User & Organization Management (4 Tables)

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    title TEXT,
    company TEXT,
    company_size TEXT,
    revenue_range TEXT,
    industry TEXT,
    timezone TEXT,
    linkedin_url TEXT,
    profile_pic_url TEXT,
    agreed_terms BOOLEAN DEFAULT false,
    agreed_marketing BOOLEAN DEFAULT false,
    role TEXT DEFAULT 'user',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company ON users(company);
CREATE INDEX idx_users_industry ON users(industry);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

#### organizations
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    owner_id UUID REFERENCES users(id),
    sso_config JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_organizations_slug ON organizations(slug);
```

#### organization_members
```sql
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    permissions JSONB DEFAULT '{}',
    department TEXT,
    status TEXT DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
```

#### subscriptions
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    plan TEXT DEFAULT 'free',
    status TEXT DEFAULT 'trial',
    billing_cycle TEXT,
    next_billing_date DATE,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    stripe_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_plan ON subscriptions(plan);
```

### 2.2. Assessment System (3 Tables)

#### assessments
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    assessment_type TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    responses JSONB NOT NULL DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    status TEXT DEFAULT 'in_progress',
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessments_user ON assessments(user_id);
CREATE INDEX idx_assessments_org ON assessments(organization_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_created ON assessments(created_at DESC);
CREATE INDEX idx_assessments_responses_gin ON assessments USING GIN (responses);
```

#### assessment_scores
```sql
CREATE TABLE assessment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    overall_score NUMERIC(3,2),
    bracket TEXT,
    category_scores JSONB DEFAULT '{}',
    recommendations TEXT[],
    next_steps TEXT[],
    ai_insights TEXT,
    confidence_score NUMERIC(3,2),
    swot_analysis JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_scores_assessment ON assessment_scores(assessment_id);
CREATE INDEX idx_assessment_scores_bracket ON assessment_scores(bracket);
CREATE INDEX idx_assessment_scores_score ON assessment_scores(overall_score);
```

#### assessment_invitations
```sql
CREATE TABLE assessment_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    invitee_email TEXT NOT NULL,
    invitee_name TEXT,
    assessment_type TEXT NOT NULL,
    invitation_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    custom_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_invitations_inviter ON assessment_invitations(inviter_id);
CREATE INDEX idx_assessment_invitations_token ON assessment_invitations(invitation_token);
CREATE INDEX idx_assessment_invitations_status ON assessment_invitations(status);
CREATE INDEX idx_assessment_invitations_expires ON assessment_invitations(expires_at);
```

### 2.3. Intelligence & Analytics (4 Tables)

#### market_insights
```sql
CREATE TABLE market_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    industry TEXT NOT NULL,
    market_size JSONB DEFAULT '{}',
    growth_rate JSONB DEFAULT '{}',
    competition JSONB DEFAULT '{}',
    sentiment JSONB DEFAULT '{}',
    full_insight TEXT,
    data_sources JSONB DEFAULT '{}',
    confidence_score NUMERIC(3,2),
    ai_model_version TEXT,
    source TEXT DEFAULT 'ai_generated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_market_insights_user ON market_insights(user_id);
CREATE INDEX idx_market_insights_industry ON market_insights(industry);
CREATE INDEX idx_market_insights_created ON market_insights(created_at DESC);
CREATE INDEX idx_market_insights_sentiment_gin ON market_insights USING GIN (sentiment);
```

#### business_trends
```sql
CREATE TABLE business_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    insight TEXT NOT NULL,
    industry TEXT,
    trend_type TEXT DEFAULT 'business',
    source TEXT DEFAULT 'ai_generated',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_trends_industry ON business_trends(industry);
CREATE INDEX idx_business_trends_type ON business_trends(trend_type);
CREATE INDEX idx_business_trends_created ON business_trends(created_at DESC);
```

#### engagement_intelligence
```sql
CREATE TABLE engagement_intelligence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    signal_score NUMERIC(3,2),
    engagement_metrics JSONB DEFAULT '{}',
    customer_sentiment JSONB DEFAULT '{}',
    recommendations TEXT[],
    insights TEXT,
    source TEXT DEFAULT 'ai_generated',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_engagement_intelligence_user ON engagement_intelligence(user_id);
CREATE INDEX idx_engagement_intelligence_org ON engagement_intelligence(organization_id);
CREATE INDEX idx_engagement_intelligence_score ON engagement_intelligence(signal_score);
```

#### news_feed
```sql
CREATE TABLE news_feed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT,
    source TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    category TEXT,
    relevance_score NUMERIC(3,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_news_feed_source ON news_feed(source);
CREATE INDEX idx_news_feed_category ON news_feed(category);
CREATE INDEX idx_news_feed_published ON news_feed(published_at DESC);
CREATE INDEX idx_news_feed_relevance ON news_feed(relevance_score DESC);
```

### 2.4. Growth & Simulation (3 Tables)

#### growth_levers
```sql
CREATE TABLE growth_levers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    levers TEXT[] NOT NULL,
    priority_scores JSONB DEFAULT '{}',
    implementation_plan JSONB DEFAULT '{}',
    roi_estimates JSONB DEFAULT '{}',
    status TEXT DEFAULT 'suggested',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_growth_levers_user ON growth_levers(user_id);
CREATE INDEX idx_growth_levers_org ON growth_levers(organization_id);
CREATE INDEX idx_growth_levers_status ON growth_levers(status);
```

#### simulations
```sql
CREATE TABLE simulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    simulation_type TEXT NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    status TEXT DEFAULT 'running',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_simulations_user ON simulations(user_id);
CREATE INDEX idx_simulations_type ON simulations(simulation_type);
CREATE INDEX idx_simulations_status ON simulations(status);
CREATE INDEX idx_simulations_created ON simulations(created_at DESC);
```

#### growth_progress
```sql
CREATE TABLE growth_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    lever_id UUID REFERENCES growth_levers(id),
    milestone TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_growth_progress_user ON growth_progress(user_id);
CREATE INDEX idx_growth_progress_lever ON growth_progress(lever_id);
CREATE INDEX idx_growth_progress_status ON growth_progress(status);
```

### 2.5. Event Sourcing & Audit (3 Tables)

#### events
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    aggregate_type TEXT NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    version INTEGER NOT NULL,
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_aggregate ON events(aggregate_id, aggregate_type);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_user ON events(user_id);
CREATE INDEX idx_events_created ON events(created_at DESC);
CREATE INDEX idx_events_data_gin ON events USING GIN (event_data);
```

#### snapshots
```sql
CREATE TABLE snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aggregate_id UUID NOT NULL,
    aggregate_type TEXT NOT NULL,
    state JSONB NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(aggregate_id, aggregate_type, version)
);

-- Indexes
CREATE INDEX idx_snapshots_aggregate ON snapshots(aggregate_id, aggregate_type);
CREATE INDEX idx_snapshots_version ON snapshots(version);
```

#### audit_log
```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_log_2024_01 PARTITION OF audit_log
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_operation ON audit_log(operation);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
```

### 2.6. Dashboard & Analytics (3 Tables)

#### dashboard_widgets
```sql
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    widget_type TEXT NOT NULL,
    widget_config JSONB DEFAULT '{}',
    position JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_dashboard_widgets_user ON dashboard_widgets(user_id);
CREATE INDEX idx_dashboard_widgets_type ON dashboard_widgets(widget_type);
CREATE INDEX idx_dashboard_widgets_active ON dashboard_widgets(is_active);
```

#### analytics_events
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}',
    session_id UUID,
    source TEXT DEFAULT 'web',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);
```

#### user_sessions
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    session_token TEXT UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Indexes
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active);
```

### 2.7. Notifications & Communication (3 Tables)

#### notifications
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

#### team_messages
```sql
CREATE TABLE team_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    sender_id UUID REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    message_type TEXT DEFAULT 'text',
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_team_messages_org ON team_messages(organization_id);
CREATE INDEX idx_team_messages_sender ON team_messages(sender_id);
CREATE INDEX idx_team_messages_recipient ON team_messages(recipient_id);
CREATE INDEX idx_team_messages_read ON team_messages(is_read);
```

#### email_subscriptions
```sql
CREATE TABLE email_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    email_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, email_type)
);

-- Indexes
CREATE INDEX idx_email_subscriptions_user ON email_subscriptions(user_id);
CREATE INDEX idx_email_subscriptions_type ON email_subscriptions(email_type);
CREATE INDEX idx_email_subscriptions_active ON email_subscriptions(is_active);
```

---

## 3. Database Views & Materialized Views

### 3.1. User Dashboard View
```sql
CREATE VIEW user_dashboard_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.company,
    u.industry,
    s.plan,
    s.status as subscription_status,
    COUNT(DISTINCT a.id) as total_assessments,
    AVG(as2.overall_score) as avg_assessment_score,
    COUNT(DISTINCT gl.id) as total_growth_levers,
    COUNT(DISTINCT sim.id) as total_simulations,
    MAX(a.created_at) as last_assessment_date,
    MAX(ae.created_at) as last_activity_date
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
LEFT JOIN assessments a ON u.id = a.user_id
LEFT JOIN assessment_scores as2 ON a.id = as2.assessment_id
LEFT JOIN growth_levers gl ON u.id = gl.user_id
LEFT JOIN simulations sim ON u.id = sim.user_id
LEFT JOIN analytics_events ae ON u.id = ae.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, u.company, u.industry, s.plan, s.status;
```

### 3.2. Organization Analytics View
```sql
CREATE VIEW organization_analytics AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    COUNT(DISTINCT om.user_id) as member_count,
    COUNT(DISTINCT a.id) as total_assessments,
    AVG(as2.overall_score) as avg_assessment_score,
    COUNT(DISTINCT gl.id) as total_growth_levers,
    COUNT(DISTINCT sim.id) as total_simulations,
    MAX(a.created_at) as last_assessment_date,
    MAX(ae.created_at) as last_activity_date
FROM organizations o
LEFT JOIN organization_members om ON o.id = om.organization_id
LEFT JOIN assessments a ON om.user_id = a.user_id
LEFT JOIN assessment_scores as2 ON a.id = as2.assessment_id
LEFT JOIN growth_levers gl ON om.user_id = gl.user_id
LEFT JOIN simulations sim ON om.user_id = sim.user_id
LEFT JOIN analytics_events ae ON om.user_id = ae.user_id
GROUP BY o.id, o.name;
```

### 3.3. Assessment Analytics Materialized View
```sql
CREATE MATERIALIZED VIEW assessment_analytics_summary AS
SELECT 
    assessment_type,
    COUNT(*) as total_assessments,
    AVG(overall_score) as avg_score,
    COUNT(CASE WHEN overall_score >= 4.0 THEN 1 END) as high_performers,
    COUNT(CASE WHEN overall_score < 2.0 THEN 1 END) as low_performers,
    AVG(confidence_score) as avg_confidence,
    DATE_TRUNC('month', created_at) as month
FROM assessments a
JOIN assessment_scores as2 ON a.id = as2.assessment_id
GROUP BY assessment_type, DATE_TRUNC('month', created_at);

-- Refresh schedule
REFRESH MATERIALIZED VIEW assessment_analytics_summary;
```

---

## 4. Migration Strategy

### 4.1. Phase 1: Foundation (Week 1-2)
```sql
-- 1. Create new tables alongside existing ones
-- 2. Create data migration functions
-- 3. Set up event sourcing infrastructure

-- Example migration function
CREATE OR REPLACE FUNCTION migrate_user_data()
RETURNS void AS $$
BEGIN
    -- Migrate tier2_users to users
    INSERT INTO users (
        id, email, first_name, last_name, phone, title, company,
        company_size, revenue_range, industry, timezone, linkedin_url,
        profile_pic_url, agreed_terms, agreed_marketing, role, created_at, updated_at
    )
    SELECT 
        u_id, email, first_name, last_name, phone, title, company,
        company_size, revenue_range, industry, timezone, linkedin_url,
        profile_pic_url, agreed_terms, agreed_marketing, role, created_at, NOW()
    FROM tier2_users
    ON CONFLICT (email) DO NOTHING;
    
    -- Log migration event
    INSERT INTO events (aggregate_id, aggregate_type, event_type, event_data, version)
    VALUES (gen_random_uuid(), 'migration', 'user_migration_completed', 
            jsonb_build_object('migrated_count', (SELECT COUNT(*) FROM tier2_users)), 1);
END;
$$ LANGUAGE plpgsql;
```

### 4.2. Phase 2: Assessment Consolidation (Week 3-4)
```sql
-- Migrate all assessment tables to unified structure
CREATE OR REPLACE FUNCTION migrate_assessments()
RETURNS void AS $$
BEGIN
    -- Migrate onboarding_assessments
    INSERT INTO assessments (
        id, user_id, assessment_type, responses, metadata, status, completed_at, created_at
    )
    SELECT 
        o_id, u_id, 'onboarding', 
        jsonb_build_object(
            'growth_metrics', growth_metrics,
            'gtm_strategy', gtm_strategy,
            'differentiator', differentiator,
            'brand_perception', brand_perception,
            'tech_stack', tech_stack,
            'process_discipline', process_discipline,
            'acquisition_channels', acquisition_channels,
            'retention_strategy', retention_strategy,
            'decision_bottlenecks', decision_bottlenecks,
            'future_success', future_success,
            'benchmark_preferences', benchmark_preferences,
            'unresolved_issue', unresolved_issue,
            'business_priorities', business_priorities,
            'business_overview', business_overview,
            'tech_maturity', tech_maturity,
            'team_alignment', team_alignment,
            'funding_status', funding_status,
            'growth_pace', growth_pace,
            'final_confirmation', final_confirmation,
            'strategy_decision_method', strategy_decision_method,
            'friction_points', friction_points
        ),
        jsonb_build_object('source', 'onboarding_assessments'),
        'completed',
        created_at,
        created_at
    FROM onboarding_assessments;
    
    -- Migrate scoring data
    INSERT INTO assessment_scores (
        assessment_id, overall_score, bracket, category_scores, recommendations, next_steps, ai_insights, confidence_score
    )
    SELECT 
        a.id,
        asr.score,
        asr.bracket,
        asr.category_scores,
        asr.recommendations,
        asr.next_steps,
        asr.ai_insights,
        asr.confidence
    FROM assessment_scoring_results asr
    JOIN assessments a ON asr.user_id = a.user_id AND a.assessment_type = 'onboarding';
END;
$$ LANGUAGE plpgsql;
```

### 4.3. Phase 3: Intelligence Migration (Week 5-6)
```sql
-- Migrate market insights and trends
CREATE OR REPLACE FUNCTION migrate_intelligence_data()
RETURNS void AS $$
BEGIN
    -- Migrate enhanced_market_insights
    INSERT INTO market_insights (
        user_id, industry, market_size, growth_rate, competition, 
        sentiment, full_insight, data_sources, confidence_score, 
        ai_model_version, created_at
    )
    SELECT 
        u_id, industry, market_size, growth_rate, competition,
        sentiment, full_insight, data_sources, confidence_score,
        ai_model_version, created_at
    FROM enhanced_market_insights;
    
    -- Migrate realtime_business_trends
    INSERT INTO business_trends (title, insight, industry, source, created_at)
    SELECT title, insight, industry, source, createdat
    FROM realtime_business_trends;
    
    -- Migrate realtime_marketing_playbook
    INSERT INTO engagement_intelligence (
        signal_score, engagement_metrics, recommendations, insights, source, created_at
    )
    SELECT 
        75.0, -- Default signal score
        jsonb_build_object('playbook_insight', insight),
        ARRAY['Review marketing playbook insights'],
        insight,
        source,
        createdat
    FROM realtime_marketing_playbook;
END;
$$ LANGUAGE plpgsql;
```

### 4.4. Phase 4: Application Updates (Week 7-8)
```sql
-- Update application to use new schema
-- Create compatibility views for gradual transition

-- Compatibility view for existing code
CREATE VIEW tier2_users_compat AS
SELECT 
    id as u_id,
    email,
    first_name,
    last_name,
    phone,
    title,
    company,
    company_size,
    revenue_range,
    industry,
    timezone,
    linkedin_url,
    profile_pic_url,
    agreed_terms,
    agreed_marketing,
    role,
    created_at,
    updated_at
FROM users;

-- Compatibility view for assessments
CREATE VIEW onboarding_assessments_compat AS
SELECT 
    id as o_id,
    user_id as u_id,
    responses->>'growth_metrics' as growth_metrics,
    responses->>'gtm_strategy' as gtm_strategy,
    responses->>'differentiator' as differentiator,
    responses->>'brand_perception' as brand_perception,
    responses->>'tech_stack' as tech_stack,
    responses->>'process_discipline' as process_discipline,
    responses->>'acquisition_channels' as acquisition_channels,
    responses->>'retention_strategy' as retention_strategy,
    responses->>'decision_bottlenecks' as decision_bottlenecks,
    responses->>'future_success' as future_success,
    responses->>'benchmark_preferences' as benchmark_preferences,
    responses->>'unresolved_issue' as unresolved_issue,
    responses->>'business_priorities' as business_priorities,
    responses->>'business_overview' as business_overview,
    responses->>'tech_maturity' as tech_maturity,
    responses->>'team_alignment' as team_alignment,
    responses->>'funding_status' as funding_status,
    responses->>'growth_pace' as growth_pace,
    responses->>'final_confirmation' as final_confirmation,
    responses->>'strategy_decision_method' as strategy_decision_method,
    responses->'friction_points' as friction_points,
    created_at
FROM assessments
WHERE assessment_type = 'onboarding';
```

### 4.5. Phase 5: Cleanup (Week 9-10)
```sql
-- Remove old tables after verification
-- Drop compatibility views
-- Update indexes and optimize

-- Example cleanup
-- DROP TABLE tier2_users CASCADE;
-- DROP TABLE onboarding_assessments CASCADE;
-- DROP TABLE assessment_scoring_results CASCADE;
-- DROP VIEW tier2_users_compat;
-- DROP VIEW onboarding_assessments_compat;
```

---

## 5. API Layer Updates

### 5.1. New API Structure
```typescript
// New assessment API
export async function createAssessment(data: {
  userId: string;
  organizationId?: string;
  assessmentType: string;
  responses: Record<string, any>;
  metadata?: Record<string, any>;
}) {
  const assessment = await supabase
    .from('assessments')
    .insert({
      user_id: data.userId,
      organization_id: data.organizationId,
      assessment_type: data.assessmentType,
      responses: data.responses,
      metadata: data.metadata || {}
    })
    .select()
    .single();

  // Create event
  await supabase
    .from('events')
    .insert({
      aggregate_id: assessment.id,
      aggregate_type: 'assessment',
      event_type: 'assessment_created',
      event_data: { assessment_type: data.assessmentType },
      version: 1,
      user_id: data.userId
    });

  return assessment;
}

// New dashboard API
export async function getUserDashboard(userId: string) {
  const { data } = await supabase
    .from('user_dashboard_summary')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
}
```

### 5.2. Migration Compatibility
```typescript
// Compatibility layer for gradual migration
export async function getAssessmentData(userId: string, type: string) {
  // Try new schema first
  const { data: newData } = await supabase
    .from('assessments')
    .select(`
      *,
      assessment_scores (*)
    `)
    .eq('user_id', userId)
    .eq('assessment_type', type)
    .single();

  if (newData) {
    return transformNewToOld(newData);
  }

  // Fallback to old schema
  return getLegacyAssessmentData(userId, type);
}
```

---

## 6. Performance Optimizations

### 6.1. Partitioning Strategy
```sql
-- Partition large tables by date
ALTER TABLE audit_log PARTITION BY RANGE (created_at);
ALTER TABLE analytics_events PARTITION BY RANGE (created_at);
ALTER TABLE events PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE audit_log_2024_01 PARTITION OF audit_log
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

### 6.2. Indexing Strategy
```sql
-- Composite indexes for common queries
CREATE INDEX idx_assessments_user_type_status 
ON assessments(user_id, assessment_type, status);

CREATE INDEX idx_analytics_events_user_type_created 
ON analytics_events(user_id, event_type, created_at DESC);

-- GIN indexes for JSONB
CREATE INDEX idx_assessments_responses_gin 
ON assessments USING GIN (responses);

CREATE INDEX idx_market_insights_sentiment_gin 
ON market_insights USING GIN (sentiment);
```

### 6.3. Materialized Views
```sql
-- Refresh materialized views on schedule
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW assessment_analytics_summary;
  REFRESH MATERIALIZED VIEW user_dashboard_summary;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh (using pg_cron or application-level scheduling)
SELECT cron.schedule('refresh-analytics', '0 2 * * *', 'SELECT refresh_analytics_views();');
```

---

## 7. Benefits of New Architecture

### 7.1. Performance Improvements
- **Reduced Table Count**: 114 → 25 tables (78% reduction)
- **Simplified Queries**: Fewer joins required
- **Better Indexing**: Optimized for common query patterns
- **Partitioning**: Large tables partitioned for performance

### 7.2. Maintainability Improvements
- **Consistent Naming**: Standardized field names
- **Single Responsibility**: Each table has one clear purpose
- **Event Sourcing**: Complete audit trail
- **CQRS**: Separate read/write models

### 7.3. Scalability Improvements
- **Horizontal Scaling**: Partitioned tables
- **Flexible Schema**: JSONB for complex data
- **Event-Driven**: Easy to add new features
- **Caching**: Materialized views for analytics

### 7.4. Developer Experience
- **Simplified APIs**: Fewer endpoints needed
- **Consistent Responses**: Standardized data structure
- **Better Documentation**: Clear table purposes
- **Easier Testing**: Simplified data setup

---

## 8. Implementation Timeline

### Week 1-2: Foundation
- Create new tables
- Set up event sourcing
- Create migration functions

### Week 3-4: Assessment Migration
- Migrate assessment data
- Update assessment APIs
- Test assessment functionality

### Week 5-6: Intelligence Migration
- Migrate market insights
- Migrate trends data
- Update intelligence APIs

### Week 7-8: Application Updates
- Update application code
- Create compatibility layers
- Test all functionality

### Week 9-10: Cleanup
- Remove old tables
- Optimize performance
- Update documentation

### Week 11-12: Monitoring
- Performance monitoring
- Bug fixes
- Documentation updates

---

## 9. Risk Mitigation

### 9.1. Data Safety
- **Backup Strategy**: Full backups before each phase
- **Rollback Plan**: Ability to revert each phase
- **Data Validation**: Comprehensive data verification
- **Staged Migration**: Migrate in small batches

### 9.2. Application Safety
- **Compatibility Layers**: Gradual transition
- **Feature Flags**: Control migration rollout
- **Monitoring**: Real-time performance monitoring
- **Testing**: Comprehensive test coverage

### 9.3. Business Continuity
- **Zero Downtime**: Migration during low-traffic periods
- **Rollback Windows**: Quick rollback capability
- **Communication**: Clear stakeholder communication
- **Documentation**: Complete migration documentation

---

## 10. Success Metrics

### 10.1. Performance Metrics
- **Query Response Time**: < 100ms for dashboard queries
- **Database Size**: 20-30% reduction
- **Index Efficiency**: > 95% index usage

### 10.2. Maintenance Metrics
- **Table Count**: 114 → 25 tables
- **API Complexity**: 40% reduction
- **Migration Time**: 50% reduction

### 10.3. Developer Experience
- **Query Complexity**: 60% simplification
- **API Consistency**: 100% consistent naming
- **Documentation**: Complete coverage

This redesigned architecture provides a **modern, efficient, and scalable foundation** for your business intelligence platform while maintaining all current functionality and providing a clear migration path. 