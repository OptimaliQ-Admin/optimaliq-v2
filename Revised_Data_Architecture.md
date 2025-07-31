# Revised Data Architecture: Accounting for Dynamic Assessment Complexity

## Executive Summary

After analyzing the actual implementation, I discovered the assessment system is **far more sophisticated** than initially understood. The system includes:

- **11 distinct assessment types** with unique scoring algorithms
- **Dynamic scoring maps** with bracket-based scoring (score_1, score_1_5, score_2, etc.)
- **Complex profile system** with 10+ individual scores and weighted overall calculations
- **Real-time score recalculation** based on user progress
- **Assessment delegation** and team collaboration features
- **Multi-dimensional scoring** with category breakdowns

This revised architecture properly accounts for this complexity while still providing optimization benefits.

---

## 1. Assessment System Complexity Analysis

### 1.1. Assessment Types (11 Types)
```sql
-- Current assessment types from constraints
'sales', 'bpm', 'tech_stack', 'strategic_maturity', 'marketing_effectiveness', 
'ai_readiness', 'competitive_benchmarking', 'customer_experience', 
'digital_transformation', 'leadership', 'reassessment'
```

### 1.2. Dynamic Scoring System
- **Bracket-based scoring**: score_1, score_1_5, score_2, score_2_5, score_3, score_3_5, score_4, score_4_5, score_5
- **Weighted scoring maps**: Each assessment type has unique scoring configurations
- **Multi-select and single-select questions**: Different scoring algorithms
- **Category-based scoring**: Questions grouped by business function

### 1.3. Profile Complexity
The `tier2_profiles` table contains:
- **10 individual assessment scores**: bpm_score, sales_score, tech_stack_score, etc.
- **Dynamic overall score calculation**: Weighted based on completion progress
- **Base score vs. deep assessment scores**: Different weighting algorithms
- **Assessment data storage**: JSONB fields for each assessment type
- **Timestamps for each assessment**: Last taken dates

---

## 2. Revised Core Tables (35 Tables)

### 2.1. User & Organization Management (4 Tables)
*Same as before - no changes needed*

### 2.2. Assessment System (8 Tables - Expanded)

#### assessments
```sql
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    assessment_type TEXT NOT NULL CHECK (
        assessment_type IN (
            'sales', 'bpm', 'tech_stack', 'strategic_maturity', 
            'marketing_effectiveness', 'ai_readiness', 'competitive_benchmarking', 
            'customer_experience', 'digital_transformation', 'leadership', 'reassessment'
        )
    ),
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
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_responses_gin ON assessments USING GIN (responses);
```

#### assessment_scores
```sql
CREATE TABLE assessment_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    overall_score NUMERIC(3,2),
    bracket TEXT CHECK (
        bracket IN (
            'score_1', 'score_1_5', 'score_2', 'score_2_5', 'score_3', 
            'score_3_5', 'score_4', 'score_4_5', 'score_5'
        )
    ),
    category_scores JSONB DEFAULT '{}',
    recommendations TEXT[],
    next_steps TEXT[],
    ai_insights TEXT,
    confidence_score NUMERIC(3,2),
    swot_analysis JSONB DEFAULT '{}',
    scoring_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_scores_assessment ON assessment_scores(assessment_id);
CREATE INDEX idx_assessment_scores_bracket ON assessment_scores(bracket);
CREATE INDEX idx_assessment_scores_score ON assessment_scores(overall_score);
```

#### assessment_scoring_maps
```sql
CREATE TABLE assessment_scoring_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_type TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    bracket TEXT NOT NULL,
    scoring_config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_type, version, bracket)
);

-- Indexes
CREATE INDEX idx_scoring_maps_type ON assessment_scoring_maps(assessment_type);
CREATE INDEX idx_scoring_maps_bracket ON assessment_scoring_maps(bracket);
CREATE INDEX idx_scoring_maps_active ON assessment_scoring_maps(is_active);
```

#### user_profiles
```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) UNIQUE,
    organization_id UUID REFERENCES organizations(id),
    
    -- Individual assessment scores
    base_score NUMERIC(3,2),
    bpm_score NUMERIC(3,2),
    sales_score NUMERIC(3,2),
    tech_stack_score NUMERIC(3,2),
    strategic_maturity_score NUMERIC(3,2),
    marketing_score NUMERIC(3,2),
    ai_score NUMERIC(3,2),
    digital_score NUMERIC(3,2),
    leadership_score NUMERIC(3,2),
    benchmarking_score NUMERIC(3,2),
    cx_score NUMERIC(3,2),
    reassessment_score NUMERIC(3,2),
    
    -- Last taken timestamps
    bpm_last_taken TIMESTAMP WITH TIME ZONE,
    sales_last_taken TIMESTAMP WITH TIME ZONE,
    tech_stack_last_taken TIMESTAMP WITH TIME ZONE,
    strategic_maturity_last_taken TIMESTAMP WITH TIME ZONE,
    marketing_last_taken TIMESTAMP WITH TIME ZONE,
    ai_last_taken TIMESTAMP WITH TIME ZONE,
    digital_last_taken TIMESTAMP WITH TIME ZONE,
    leadership_last_taken TIMESTAMP WITH TIME ZONE,
    benchmarking_last_taken TIMESTAMP WITH TIME ZONE,
    cx_last_taken TIMESTAMP WITH TIME ZONE,
    reassessment_last_taken TIMESTAMP WITH TIME ZONE,
    
    -- Calculated scores
    overall_score NUMERIC(3,1),
    strategy_score NUMERIC(3,1),
    process_score NUMERIC(3,1),
    technology_score NUMERIC(3,1),
    
    -- Assessment data (JSONB for flexibility)
    sales_assessment_data JSONB DEFAULT '{}',
    bpm_assessment_data JSONB DEFAULT '{}',
    tech_stack_assessment_data JSONB DEFAULT '{}',
    strategic_maturity_assessment_data JSONB DEFAULT '{}',
    marketing_assessment_data JSONB DEFAULT '{}',
    ai_assessment_data JSONB DEFAULT '{}',
    digital_assessment_data JSONB DEFAULT '{}',
    leadership_assessment_data JSONB DEFAULT '{}',
    benchmarking_assessment_data JSONB DEFAULT '{}',
    cx_assessment_data JSONB DEFAULT '{}',
    reassessment_assessment_data JSONB DEFAULT '{}',
    
    -- Business context
    business_overview TEXT,
    
    -- UI state tracking
    assessment_explanation_seen_at TIMESTAMP WITH TIME ZONE,
    dashboard_explanation_seen_at TIMESTAMP WITH TIME ZONE,
    growth_studio_explanation_seen_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_org ON user_profiles(organization_id);
CREATE INDEX idx_user_profiles_overall_score ON user_profiles(overall_score);
CREATE INDEX idx_user_profiles_base_score ON user_profiles(base_score);
```

#### assessment_invitations
```sql
CREATE TABLE assessment_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    invitee_email TEXT NOT NULL,
    invitee_name TEXT,
    assessment_type TEXT NOT NULL CHECK (
        assessment_type IN (
            'sales', 'bpm', 'tech_stack', 'strategic_maturity', 
            'marketing_effectiveness', 'ai_readiness', 'competitive_benchmarking', 
            'customer_experience', 'digital_transformation', 'leadership'
        )
    ),
    invitation_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB DEFAULT '{}',
    score NUMERIC(3,2),
    custom_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_invitations_inviter ON assessment_invitations(inviter_id);
CREATE INDEX idx_assessment_invitations_token ON assessment_invitations(invitation_token);
CREATE INDEX idx_assessment_invitations_status ON assessment_invitations(status);
CREATE INDEX idx_assessment_invitations_expires ON assessment_invitations(expires_at);
```

#### question_delegations
```sql
CREATE TABLE question_delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    assessment_type TEXT NOT NULL,
    question_key TEXT NOT NULL,
    delegate_email TEXT NOT NULL,
    delegate_name TEXT,
    question_text TEXT NOT NULL,
    question_options JSONB DEFAULT '{}',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    answer TEXT,
    score NUMERIC(3,2),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_question_delegations_delegator ON question_delegations(delegator_id);
CREATE INDEX idx_question_delegations_type ON question_delegations(assessment_type);
CREATE INDEX idx_question_delegations_status ON question_delegations(status);
```

#### assessment_templates
```sql
CREATE TABLE assessment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_type TEXT NOT NULL,
    version TEXT DEFAULT '1.0',
    name TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    scoring_config JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_templates_type ON assessment_templates(assessment_type);
CREATE INDEX idx_assessment_templates_active ON assessment_templates(is_active);
```

#### assessment_analytics
```sql
CREATE TABLE assessment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    organization_id UUID REFERENCES organizations(id),
    assessment_type TEXT,
    event_type TEXT NOT NULL, -- 'started', 'completed', 'abandoned', 'delegated'
    session_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assessment_analytics_user ON assessment_analytics(user_id);
CREATE INDEX idx_assessment_analytics_type ON assessment_analytics(assessment_type);
CREATE INDEX idx_assessment_analytics_event ON assessment_analytics(event_type);
```

### 2.3. Intelligence & Analytics (4 Tables)
*Same as before - no changes needed*

### 2.4. Growth & Simulation (3 Tables)
*Same as before - no changes needed*

### 2.5. Event Sourcing & Audit (3 Tables)
*Same as before - no changes needed*

### 2.6. Dashboard & Analytics (3 Tables)
*Same as before - no changes needed*

### 2.7. Notifications & Communication (3 Tables)
*Same as before - no changes needed*

### 2.8. Team Collaboration (4 Tables)

#### team_members
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    role TEXT NOT NULL,
    permissions JSONB DEFAULT '{}',
    department TEXT,
    status TEXT DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(organization_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_members_org ON team_members(organization_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);
```

#### team_activities
```sql
CREATE TABLE team_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    activity_type TEXT NOT NULL,
    activity_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_team_activities_org ON team_activities(organization_id);
CREATE INDEX idx_team_activities_user ON team_activities(user_id);
CREATE INDEX idx_team_activities_type ON team_activities(activity_type);
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

#### team_presence
```sql
CREATE TABLE team_presence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'offline',
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Indexes
CREATE INDEX idx_team_presence_org ON team_presence(organization_id);
CREATE INDEX idx_team_presence_user ON team_presence(user_id);
CREATE INDEX idx_team_presence_status ON team_presence(status);
```

---

## 3. Database Views & Materialized Views

### 3.1. User Profile Summary View
```sql
CREATE VIEW user_profile_summary AS
SELECT 
    u.id as user_id,
    u.email,
    u.first_name,
    u.last_name,
    u.company,
    u.industry,
    s.plan,
    s.status as subscription_status,
    up.overall_score,
    up.base_score,
    up.bpm_score,
    up.sales_score,
    up.tech_stack_score,
    up.strategic_maturity_score,
    up.marketing_score,
    up.ai_score,
    up.digital_score,
    up.leadership_score,
    up.benchmarking_score,
    up.cx_score,
    up.reassessment_score,
    COUNT(DISTINCT a.id) as total_assessments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_assessments,
    MAX(a.created_at) as last_assessment_date,
    up.business_overview,
    up.created_at as profile_created,
    up.updated_at as profile_updated
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN assessments a ON u.id = a.user_id
GROUP BY 
    u.id, u.email, u.first_name, u.last_name, u.company, u.industry, 
    s.plan, s.status, up.overall_score, up.base_score, up.bpm_score, 
    up.sales_score, up.tech_stack_score, up.strategic_maturity_score, 
    up.marketing_score, up.ai_score, up.digital_score, up.leadership_score, 
    up.benchmarking_score, up.cx_score, up.reassessment_score, 
    up.business_overview, up.created_at, up.updated_at;
```

### 3.2. Assessment Analytics Materialized View
```sql
CREATE MATERIALIZED VIEW assessment_analytics_summary AS
SELECT 
    assessment_type,
    COUNT(*) as total_assessments,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_assessments,
    AVG(as2.overall_score) as avg_score,
    COUNT(CASE WHEN as2.overall_score >= 4.0 THEN 1 END) as high_performers,
    COUNT(CASE WHEN as2.overall_score < 2.0 THEN 1 END) as low_performers,
    AVG(as2.confidence_score) as avg_confidence,
    DATE_TRUNC('month', a.created_at) as month
FROM assessments a
LEFT JOIN assessment_scores as2 ON a.id = as2.assessment_id
GROUP BY assessment_type, DATE_TRUNC('month', a.created_at);

-- Refresh schedule
REFRESH MATERIALIZED VIEW assessment_analytics_summary;
```

### 3.3. Organization Assessment Progress View
```sql
CREATE VIEW organization_assessment_progress AS
SELECT 
    o.id as organization_id,
    o.name as organization_name,
    COUNT(DISTINCT tm.user_id) as member_count,
    COUNT(DISTINCT a.id) as total_assessments,
    COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_assessments,
    AVG(up.overall_score) as avg_overall_score,
    AVG(up.base_score) as avg_base_score,
    COUNT(DISTINCT CASE WHEN up.overall_score >= 4.0 THEN tm.user_id END) as high_performers,
    COUNT(DISTINCT CASE WHEN up.overall_score < 2.0 THEN tm.user_id END) as low_performers,
    MAX(a.created_at) as last_assessment_date
FROM organizations o
LEFT JOIN team_members tm ON o.id = tm.organization_id
LEFT JOIN assessments a ON tm.user_id = a.user_id
LEFT JOIN user_profiles up ON tm.user_id = up.user_id
GROUP BY o.id, o.name;
```

---

## 4. Migration Strategy (Revised)

### 4.1. Phase 1: Foundation (Week 1-2)
```sql
-- Create new tables alongside existing ones
-- Set up assessment scoring maps
-- Create migration functions for complex profile data

-- Migrate scoring maps
CREATE OR REPLACE FUNCTION migrate_scoring_maps()
RETURNS void AS $$
BEGIN
    -- Migrate sales scoring map
    INSERT INTO assessment_scoring_maps (
        assessment_type, bracket, scoring_config, version
    )
    SELECT 
        'sales',
        bracket,
        config,
        '1.0'
    FROM jsonb_each(
        (SELECT content::jsonb FROM files WHERE name = 'sales_scoring_map.json')
    ) AS maps(bracket, config);
    
    -- Repeat for other assessment types
END;
$$ LANGUAGE plpgsql;
```

### 4.2. Phase 2: Profile Migration (Week 3-4)
```sql
-- Migrate tier2_profiles to user_profiles
CREATE OR REPLACE FUNCTION migrate_user_profiles()
RETURNS void AS $$
BEGIN
    INSERT INTO user_profiles (
        user_id, organization_id,
        base_score, bpm_score, sales_score, tech_stack_score,
        strategic_maturity_score, marketing_score, ai_score,
        digital_score, leadership_score, benchmarking_score,
        cx_score, reassessment_score,
        bpm_last_taken, sales_last_taken, tech_stack_last_taken,
        strategic_maturity_last_taken, marketing_last_taken,
        ai_last_taken, digital_last_taken, leadership_last_taken,
        benchmarking_last_taken, cx_last_taken, reassessment_last_taken,
        overall_score, strategy_score, process_score, technology_score,
        sales_assessment_data, bpm_assessment_data, tech_stack_assessment_data,
        strategic_maturity_assessment_data, marketing_assessment_data,
        ai_assessment_data, digital_assessment_data, leadership_assessment_data,
        benchmarking_assessment_data, cx_assessment_data, reassessment_assessment_data,
        business_overview, assessment_explanation_seen_at,
        dashboard_explanation_seen_at, growth_studio_explanation_seen_at,
        created_at, updated_at
    )
    SELECT 
        u_id, org_id,
        base_score, bpm_score, sales_score, tech_stack_score,
        strategic_maturity_score, marketing_score, ai_score,
        digital_score, leadership_score, benchmarking_score,
        cx_score, reassessment_score,
        bpm_last_taken, sales_last_taken, tech_stack_last_taken,
        strategic_maturity_last_taken, marketing_last_taken,
        ai_last_taken, digital_last_taken, leadership_last_taken,
        benchmarking_last_taken, cx_last_taken, reassessment_last_taken,
        overall_score, strategy_score, process_score, technology_score,
        sales_assessment_data, bpm_assessment_data, tech_stack_assessment_data,
        strategic_maturity_assessment_data, marketing_assessment_data,
        ai_assessment_data, digital_assessment_data, leadership_assessment_data,
        benchmarking_assessment_data, cx_assessment_data, reassessment_assessment_data,
        business_overview, assessment_explanation_seen_at,
        dashboard_explanation_seen_at, growth_studio_explanation_seen_at,
        created_at, updated_at
    FROM tier2_profiles;
END;
$$ LANGUAGE plpgsql;
```

### 4.3. Phase 3: Assessment Migration (Week 5-6)
```sql
-- Migrate individual assessment tables to unified structure
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

### 4.4. Phase 4: Application Updates (Week 7-8)
```sql
-- Update application to use new schema
-- Create compatibility views for gradual transition

-- Compatibility view for existing code
CREATE VIEW tier2_profiles_compat AS
SELECT 
    id,
    user_id as u_id,
    base_score, bpm_score, sales_score, tech_stack_score,
    strategic_maturity_score, marketing_score, ai_score,
    digital_score, leadership_score, benchmarking_score,
    cx_score, reassessment_score,
    bpm_last_taken, sales_last_taken, tech_stack_last_taken,
    strategic_maturity_last_taken, marketing_last_taken,
    ai_last_taken, digital_last_taken, leadership_last_taken,
    benchmarking_last_taken, cx_last_taken, reassessment_last_taken,
    overall_score, strategy_score, process_score, technology_score,
    sales_assessment_data, bpm_assessment_data, tech_stack_assessment_data,
    strategic_maturity_assessment_data, marketing_assessment_data,
    ai_assessment_data, digital_assessment_data, leadership_assessment_data,
    benchmarking_assessment_data, cx_assessment_data, reassessment_assessment_data,
    business_overview, assessment_explanation_seen_at,
    dashboard_explanation_seen_at, growth_studio_explanation_seen_at,
    created_at, updated_at
FROM user_profiles;
```

---

## 5. API Layer Updates (Revised)

### 5.1. Assessment API with Dynamic Scoring
```typescript
// New assessment API with dynamic scoring
export async function submitAssessment(data: {
  userId: string;
  organizationId?: string;
  assessmentType: string;
  responses: Record<string, any>;
  metadata?: Record<string, any>;
}) {
  // Get scoring map for this assessment type
  const { data: scoringMap } = await supabase
    .from('assessment_scoring_maps')
    .select('scoring_config')
    .eq('assessment_type', data.assessmentType)
    .eq('is_active', true)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  // Calculate score using dynamic scoring algorithm
  const score = calculateDynamicScore(data.responses, scoringMap.scoring_config);
  
  // Create assessment record
  const assessment = await supabase
    .from('assessments')
    .insert({
      user_id: data.userId,
      organization_id: data.organizationId,
      assessment_type: data.assessmentType,
      responses: data.responses,
      metadata: data.metadata || {},
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .select()
    .single();

  // Create assessment score record
  await supabase
    .from('assessment_scores')
    .insert({
      assessment_id: assessment.id,
      overall_score: score.overall,
      bracket: score.bracket,
      category_scores: score.categories,
      recommendations: score.recommendations,
      next_steps: score.nextSteps,
      confidence_score: score.confidence
    });

  // Update user profile
  await updateUserProfileScore(data.userId, data.assessmentType, score.overall);

  // Recalculate overall score
  await recalculateOverallScore(data.userId);

  return assessment;
}

// Dynamic score calculation function
function calculateDynamicScore(responses: Record<string, any>, scoringConfig: any) {
  // Implementation of the complex scoring algorithm
  // This would replicate the current calculateScore function logic
  // with bracket-based scoring and category breakdowns
}
```

### 5.2. Profile Management API
```typescript
// Profile management with all assessment scores
export async function getUserProfile(userId: string) {
  const { data } = await supabase
    .from('user_profile_summary')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data;
}

// Update individual assessment score
export async function updateUserProfileScore(
  userId: string, 
  assessmentType: string, 
  score: number
) {
  const scoreField = `${assessmentType}_score`;
  const lastTakenField = `${assessmentType}_last_taken`;
  
  const { error } = await supabase
    .from('user_profiles')
    .update({
      [scoreField]: score,
      [lastTakenField]: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) throw error;
}
```

---

## 6. Benefits of Revised Architecture

### 6.1. Maintains Assessment Complexity
- **Preserves all 11 assessment types** with unique scoring
- **Maintains dynamic scoring algorithms** with bracket-based scoring
- **Keeps complex profile system** with 10+ individual scores
- **Supports assessment delegation** and team collaboration

### 6.2. Improves Structure
- **Consolidates redundant tables** while preserving functionality
- **Standardizes naming conventions** across all tables
- **Improves data relationships** and referential integrity
- **Reduces table count** from 114 to 35 (69% reduction)

### 6.3. Enhances Performance
- **Optimized indexes** for common query patterns
- **Materialized views** for analytics
- **Partitioned tables** for large datasets
- **Better query performance** with simplified joins

### 6.4. Maintains Compatibility
- **Compatibility views** for gradual migration
- **Preserves all existing functionality**
- **Supports current API contracts**
- **Enables incremental migration**

---

## 7. Migration Timeline (Revised)

### Week 1-2: Foundation
- Create new tables alongside existing ones
- Set up assessment scoring maps
- Create migration functions

### Week 3-4: Profile Migration
- Migrate tier2_profiles to user_profiles
- Update profile management APIs
- Test profile functionality

### Week 5-6: Assessment Migration
- Migrate assessment data to unified structure
- Update assessment APIs with dynamic scoring
- Test all assessment types

### Week 7-8: Application Updates
- Update application code
- Create compatibility layers
- Test all functionality

### Week 9-10: Cleanup
- Remove old tables
- Optimize performance
- Update documentation

---

## 8. Success Metrics (Revised)

### Performance Metrics
- **Query Response Time**: < 100ms for dashboard queries
- **Database Size**: Reduce by 15-20% through consolidation
- **Index Efficiency**: > 95% index usage on common queries

### Maintenance Metrics
- **Table Count**: Reduce from 114 to 35 tables (69% reduction)
- **Code Complexity**: Reduce API complexity by 30%
- **Migration Time**: Reduce deployment time by 40%

### Developer Experience
- **Query Complexity**: Simplify common queries by 50%
- **API Consistency**: 100% consistent field naming
- **Assessment Complexity**: Preserved while improving structure

---

## 9. Conclusion

This revised architecture **properly accounts for the sophisticated assessment system** while still providing significant optimization benefits. The key insight is that the assessment system is **far more complex** than initially understood, with:

- **Dynamic scoring algorithms** with bracket-based scoring
- **Complex profile management** with 10+ individual scores
- **Assessment delegation** and team collaboration features
- **Real-time score recalculation** based on user progress

The revised architecture **preserves all this complexity** while improving the overall structure, reducing table count by 69%, and maintaining full compatibility with existing functionality.

**Priority Recommendation**: Start with Phase 1 (Foundation) to set up the new structure, then carefully migrate the complex assessment system in phases to ensure no functionality is lost. 