# Complete Data Architecture Documentation

## 1. Supabase Connection Strings & Environment Variables

**Primary Database (Direct Connection):**
```
postgresql://postgres:Y8aTdGs66ahuUqROU98kteWkqjFpW91tHrCA@db.mpnpkrqznlqdlrtnphuw.supabase.co:5432/postgres
```

**Transaction Pooler:**
```
postgres://postgres:[YOUR-PASSWORD]@db.mpnpkrqznlqdlrtnphuw.supabase.co:6543/postgres
```

**Session Pooler:**
```
postgresql://postgres.mpnpkrqznlqdlrtnphuw:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

**PSQL CLI:**
```
psql -h db.mpnpkrqznlqdlrtnphuw.supabase.co -p 5432 -d postgres -U postgres
```

---

## 2. Complete Table Inventory (114 Tables)

### 2.1. Core User & Organization Tables

#### tier2_users
**Primary user table for the application**
- `u_id` (uuid, PK): User identifier
- `first_name`, `last_name` (text): User names
- `email` (text, unique): User email
- `phone`, `title`, `company`, `company_size`, `revenue_range`, `industry` (text): Profile info
- `created_at` (timestamp): Account creation
- `timezone`, `linkedin_url` (text): Additional profile data
- `agreed_terms`, `agreed_marketing` (boolean): Consent flags
- `profile_pic_url` (text): Profile image
- `role` (text): User role (admin, user, etc.)
- `org_id` (uuid, FK): References enterprise_orgs(id)

**Relationships:**
- Referenced by 30+ tables including assessments, subscriptions, notifications
- Foreign key to enterprise_orgs for organization membership

**Policies:**
- Admin access to all users
- Users can only access their own profile
- Insert policy allows new user creation

#### enterprise_orgs
**Organization management table**
- `id` (uuid, PK): Organization identifier
- `name`, `slug` (text, unique): Organization name and URL slug
- `owner_id` (uuid, FK): References tier2_users(u_id)
- `sso_config` (jsonb): SSO configuration
- `created_at`, `updated_at` (timestamp): Timestamps

**Relationships:**
- Referenced by org_users, org_roles, team_members, security_alerts
- Owner relationship to tier2_users

**Policies:**
- Super admin creation/update restrictions
- Org member viewing permissions
- Platform admin access

#### growth_users (Legacy)
**Legacy user table - being phased out**
- `u_id` (uuid, PK): User identifier
- `name`, `email` (text, unique): Basic user info
- `industry` (ind_stack_level): Industry classification
- `role`, `companysize`, `revenuerange` (text/enums): Company details
- `createdat` (timestamp): Creation time

**Relationships:**
- Referenced by ai_log, growth_assessment, useractivity
- Being replaced by tier2_users

---

### 2.2. Assessment & Scoring System

#### onboarding_assessments
**Comprehensive onboarding survey data**
- `o_id` (uuid, PK): Assessment identifier
- `u_id` (uuid, FK): References tier2_users(u_id)
- **Business Profile:**
  - `growth_metrics`, `gtm_strategy`, `differentiator`, `brand_perception` (text)
  - `tech_stack`, `process_discipline`, `acquisition_channels` (text)
  - `retention_strategy`, `decision_bottlenecks`, `future_success` (text)
  - `benchmark_preferences`, `unresolved_issue`, `business_priorities` (text)
  - `business_overview` (text): Business model description
- **Categorical Fields:**
  - `tech_maturity` (tech_maturity enum): integrated, partially_integrated, siloed, early_stage, unsure
  - `team_alignment` (team_alignment enum)
  - `funding_status` (funding_status enum): raising_now, early_planning, preparing_exit, not_planned, other
  - `growth_pace` (growth_pace enum)
  - `final_confirmation` (final_confirmation enum)
  - `strategy_decision_method` (strategy_decision enum)
- `friction_points` (text[]): Array of friction points
- `created_at` (timestamp): Assessment completion time

#### assessment_scoring_results
**Comprehensive scoring and recommendations**
- `id` (uuid, PK): Result identifier
- `user_id` (uuid, FK): References tier2_users(u_id)
- `assessment_type` (text): Type of assessment (sales, bpm, tech_stack, strategic_maturity, etc.)
- `score` (numeric(3,2)): Score from 0-5
- `bracket` (text): Score bracket (score_1, score_1_5, score_2, etc.)
- `description` (text): Score description
- `recommendations`, `next_steps` (text[]): Action items
- `confidence` (numeric(3,2)): AI confidence level (0-1)
- `ai_insights` (text): AI-generated insights
- `category_scores`, `swot_analysis` (jsonb): Detailed analysis
- `org_id` (uuid, FK): References enterprise_orgs(id)
- `created_at`, `updated_at` (timestamp): Timestamps

**Constraints:**
- Assessment type must be one of 11 predefined types
- Score must be between 0-5
- Confidence must be between 0-1
- Bracket must be one of 9 predefined brackets

#### assessment_invitations
**Assessment invitation management**
- `id` (uuid, PK): Invitation identifier
- `inviter_u_id` (uuid, FK): References tier2_users(u_id)
- `invitee_email` (text): Invitee email address
- `invitee_name` (text): Invitee name
- `assessment_type` (text): Type of assessment
- `invitation_token` (text, unique): Unique invitation token
- `status` (text, default: 'pending'): pending, completed, expired
- `expires_at` (timestamp): Expiration time
- `created_at` (timestamp): Creation time
- `completed_at` (timestamp): Completion time
- `answers` (jsonb): Assessment answers
- `score` (numeric(3,2)): Assessment score
- `custom_message` (text): Custom invitation message

**Constraints:**
- Assessment type must be one of 10 predefined types
- Status must be pending, completed, or expired

**Indexes:**
- Expires at
- Inviter
- Status
- Token
- Type

**Policies:**
- Public can read/update by token
- Users can manage their own invitations
- Admins can access all invitations

#### assessment_templates
**Assessment structure templates**
- `id` (varchar(50), PK): Template identifier
- `name` (varchar(255)): Template name
- `description` (text): Template description
- `assessment_type` (varchar(50)): Assessment type
- `version` (varchar(20), default: '1.0'): Template version
- `scoring` (jsonb, default: '{}'): Scoring configuration
- `metadata` (jsonb, default: '{}'): Additional metadata
- `is_active` (boolean, default: true): Active status
- `created_at`, `updated_at` (timestamp): Timestamps

**Policies:**
- Anyone can view assessment templates

**Triggers:**
- Update timestamp trigger

#### growth_assessment
**Main growth assessment responses**
- `u_id` (uuid, PK, FK): References growth_users(u_id)
- `obstacles`, `strategy`, `process`, `customers`, `technology` (text): Assessment responses
- `submittedat`, `created_at`, `updated_at` (timestamp): Timestamps

**Triggers:**
- Archive trigger for historical tracking

---

### 2.3. Real-time Intelligence Tables

#### realtime_market_trends
**Market trend insights and analysis**
- `id` (uuid, PK): Trend identifier
- `title` (text): Trend title
- `insight` (text): Detailed insight
- `source` (text): Data source
- `createdat` (timestamp): Creation time
- `industry` (text): Industry focus

#### realtime_business_trends
**Business trend insights**
- `id` (uuid, PK): Trend identifier
- `title`, `industry`, `insight`, `source` (text): Trend details
- `createdat` (timestamp): Creation time

#### realtime_marketing_playbook
**Marketing playbook insights**
- `id` (uuid, PK): Playbook identifier
- `title` (text, default: '🧠 Tactical Marketing Playbook')
- `insight` (text): Marketing insight
- `source` (text, default: 'GPT + Curated URLs')
- `createdat` (timestamp): Creation time

#### business_news_ticker
**Business news headlines**
- `id` (uuid, PK): News identifier
- `title` (text): News headline
- `url` (text): Article URL
- `source` (text): News source
- `published_at` (timestamp): Publication date
- `created_at`, `updated_at` (timestamp): System timestamps

**Indexes:**
- Created at (DESC)
- Published at (DESC)
- Source

**Policies:**
- Authenticated users can read
- Service role can manage

#### enhanced_market_insights
**Enhanced market intelligence data**
- `id` (uuid, PK): Insight identifier
- `u_id` (uuid, FK): References auth.users(id)
- `industry` (varchar(100)): Industry focus
- `market_size` (jsonb): Market size data
- `growth_rate` (jsonb): Growth rate data
- `competition` (jsonb): Competition analysis
- `sentiment` (jsonb): Market sentiment
- `full_insight` (text): Complete insight
- `data_sources` (jsonb): Data sources
- `confidence_score` (numeric(3,2)): Confidence level
- `ai_model_version` (varchar(50)): AI model version
- `created_at`, `updated_at` (timestamp): Timestamps

**Indexes:**
- Created at
- Industry
- User

**Policies:**
- Users can view their own insights
- Service can insert/update insights

**Triggers:**
- Update timestamp trigger

---

### 2.4. Growth & Simulation System

#### growth_levers
**Growth lever suggestions**
- `id` (uuid, PK): Lever identifier
- `u_id` (uuid, FK): References tier2_users(u_id)
- `levers` (text[]): Array of growth levers
- `generated_at` (timestamp): Generation time

#### growth_simulations
**Simulation runs and results**
- `id` (uuid, PK): Simulation identifier
- `user_id` (uuid): User running simulation
- `simulation_type` (varchar(100)): Type of simulation
- `input_data`, `output_data` (jsonb): Simulation data
- `status` (varchar(50), default: 'completed'): Simulation status
- `metadata` (jsonb): Additional metadata
- `created_at` (timestamp): Creation time

#### growth_levers_regeneration
**Growth lever regeneration tracking**
- `user_id` (uuid, FK): References tier2_users(u_id)
- `org_id` (uuid, FK): References enterprise_orgs(id)

---

### 2.5. Subscription & Payment System

#### subscriptions
**User subscription management**
- `sub_id` (uuid, PK): Subscription identifier
- `u_id` (uuid, FK, unique): References tier2_users(u_id)
- `plan` (text, default: 'Free'): Subscription plan
- `status` (text, default: 'trial'): active, trial, cancelled, expired
- `nextbillingdate` (date): Next billing date
- `createdat` (timestamp): Creation time
- `billingCycle` (text): Billing cycle
- `stripe_subscription_id`, `stripe_customer_id` (varchar): Stripe IDs
- `stripe_data` (json): Stripe response data

**Constraints:**
- Status must be one of 4 predefined values
- Trial subscriptions must have 'trial' plan
- Unique constraint on user_id

**Indexes:**
- Status
- User ID

---

### 2.6. Notification & Event System

#### notifications
**User notification management**
- `id` (uuid, PK): Notification identifier
- `u_id` (uuid, FK): References tier2_users(u_id)
- `type` (text): Notification type
- `title`, `message` (text): Notification content
- `priority` (text): high, medium, low
- `link` (text): Related link
- `is_read` (boolean, default: false): Read status
- `created_at`, `updated_at` (timestamp): Timestamps

**Constraints:**
- Priority must be high, medium, or low

**Indexes:**
- Created at
- Is read
- User ID

#### audit_log
**Comprehensive system audit logging**
- `id` (integer, PK): Log identifier
- `table_name` (text): Affected table
- `operation` (text): SELECT, INSERT, UPDATE, DELETE
- `user_id` (uuid): User performing operation
- `record_id` (uuid): Affected record
- `old_values`, `new_values` (jsonb): Data changes
- `ip_address` (inet): User IP
- `user_agent` (text): Browser/client info
- `timestamp` (timestamp): Operation time
- `session_id` (uuid): Session identifier

**Constraints:**
- Operation must be one of 4 predefined operations

**Indexes:**
- Operation
- Table name
- Timestamp
- User ID

**Policies:**
- Admin-only read access
- System can insert logs

#### events
**System event tracking**
- `id` (uuid, PK): Event identifier
- `user_id`, `org_id` (uuid): User and organization
- `event_type` (varchar(100)): Event type
- `event_data` (jsonb, default: '{}'): Event data
- `source` (varchar(100)): Event source
- `created_at` (timestamp): Event time

---

### 2.7. Team & Collaboration System

#### team_members
**Team structure and roles**
- `id` (uuid, PK): Member identifier
- `owner_u_id` (uuid, FK): References tier2_users(u_id)
- `member_email` (text): Member email
- `member_name` (text): Member name
- `role` (text): Role in organization
- `permissions` (jsonb, default: '{}'): Member permissions
- `department` (text): Department assignment
- `org_id` (uuid, FK): References enterprise_orgs(id)
- `created_at`, `updated_at` (timestamp): Timestamps

**Constraints:**
- Department must be one of 13 predefined departments
- Role must be one of 25 predefined roles
- Unique constraint on owner + email

**Indexes:**
- Department
- Email
- Organization ID
- Owner
- Role

**Policies:**
- Users can manage their own team members
- Admin access to all

---

### 2.8. Dashboard & Analytics System

#### dashboard_analytics
**Dashboard widget usage analytics**
- `id` (uuid, PK): Analytics identifier
- `user_id` (uuid, FK): References auth.users(id)
- `event_type` (varchar(50)): view, interaction, export, share
- `widget_id` (varchar(100)): Widget identifier
- `session_id` (uuid): Session tracking
- `metadata` (jsonb): Additional data
- `created_at` (timestamp): Event time

**Constraints:**
- Event type must be one of 4 predefined types

#### dashboard_benchmarks
**Benchmark data for comparisons**

#### dashboard_configs
**User dashboard configuration**

#### dashboard_events
**Dashboard event logging**

#### dashboard_layouts
**Dashboard layout management**

#### dashboard_trends
**Trend data for dashboard**

#### dashboard_widget_data
**Widget cache and data storage**

---

### 2.9. AI & Analytics System

#### ai_analytics
**AI usage analytics and monitoring**
- `id` (uuid, PK): Analytics identifier
- `user_id` (uuid): User making requests
- `provider` (varchar(100)): AI provider
- `model` (varchar(100)): AI model used
- `request_count` (integer, default: 1): Number of requests
- `token_count` (integer, default: 0): Token usage
- `latency_ms` (integer): Response time
- `success_rate` (numeric(5,4), default: 1.0): Success rate
- `cost_usd` (numeric(10,6), default: 0): Cost in USD
- `metadata` (jsonb, default: '{}'): Additional data
- `created_at` (timestamp): Request time

#### ai_log
**AI request logging**
- `u_id` (uuid, FK): References growth_users(u_id)

#### ai_readiness_assessment
**AI readiness assessment data**

#### ai_assessment_context
**AI assessment context data**

---

### 2.10. Specialized Assessment Tables

#### Strategic Maturity
- **strategic_maturity_assessment**: Strategic maturity assessment responses
- **score_strategic_maturity**: Strategic maturity scoring results
  - `gmf_score` (double precision): GMF score
  - `bracket_key` (text): Score bracket
  - `answers` (jsonb): Assessment answers
  - `version` (text, default: 'v1'): Assessment version

#### Business Process Management
- **bpm_assessment**: BPM assessment responses
- **score_bpm**: BPM scoring results

#### Competitive Benchmarking
- **competitive_benchmarking_assessment**: Competitive assessment responses
- **score_competitive_benchmarking**: Competitive scoring results

#### Customer Experience
- **customer_experience_assessment**: CX assessment responses
- **score_customer_experience**: CX scoring results

#### Digital Transformation
- **digital_transformation_assessment**: Digital transformation responses
- **score_digital_transformation**: Digital transformation scoring

#### Leadership
- **leadership_assessment**: Leadership assessment responses
- **score_leadership**: Leadership scoring results

#### Marketing Effectiveness
- **marketing_effectiveness_assessment**: Marketing assessment responses
- **score_marketing_effectiveness**: Marketing scoring results

#### Sales Performance
- **sales_performance_assessment**: Sales assessment responses
- **score_sales_performance**: Sales scoring results

#### Tech Stack
- **tech_stack_assessment**: Tech stack assessment responses
- **score_tech_stack**: Tech stack scoring results

#### Reassessment
- **reassessment_assessment**: Reassessment responses
- **score_reassessment**: Reassessment scoring results
- **reassessment_prompts**: Reassessment prompts

---

### 2.11. Supporting & Utility Tables

#### Integration & Templates
- **integration_templates**: Integration templates
- **assessment_assignments**: Assessment assignments
- **assessment_delegations**: Assessment delegations
- **assessment_insights**: Assessment insights
- **assessment_sessions**: Assessment session tracking
- **assessment_analytics**: Assessment usage analytics

#### Reference Data
- **industry_stock_symbols**: Stock symbol reference data
- **inspirational_quotes**: Motivational quotes
- **roadmap_updates**: Product roadmap updates
- **scorecard_insights**: Scorecard data
- **security_alerts**: Security event alerts

#### User Activity & Sessions
- **user_sessions**: User session tracking
- **user_analytics**: User analytics data
- **user_actions**: User action logging
- **useractivity**: Activity log (legacy)
- **websocket_connections**: WebSocket connection tracking

#### Team Collaboration
- **team_activities**: Team activity tracking
- **team_activity_log**: Team activity logging
- **team_analytics**: Team analytics
- **team_comments**: Team comments
- **team_messages**: Team messaging
- **team_presence**: Team presence tracking
- **team_users**: Team-user relationships

#### Growth Studio
- **growth_studio_audit_log**: Growth studio audit logging
- **growth_insights**: Growth insights data
- **growth_insights_history**: Growth insights history
- **growth_lever_progress**: Growth lever progress tracking
- **growth_quadrant_data**: Growth quadrant analysis
- **growth_simulations_log**: Growth simulation logging

#### Pulse & Delegation
- **pulse_delegations**: Pulse delegation tracking
- **pulse_responses**: Pulse response data
- **question_delegations**: Question delegation
- **strategic_pulses**: Strategic pulse data

#### Real-time Data
- **realtime_events**: Real-time event data
- **realtime_subscriptions**: Real-time subscription data
- **realtime_strategic_trends**: Real-time strategic trends
- **real_time_metrics**: Real-time metrics

#### Legacy & Migration
- **growth_assessment_history**: Historical growth assessments
- **trial_users**: Trial user data
- **leads**: Lead data
- **trends**: Legacy trends data
- **tier2_dashboard_insights**: Tier 2 dashboard insights
- **tier2_profiles**: Tier 2 user profiles
- **tier2_simulation_history**: Tier 2 simulation history

#### Additional Tables
- **business_reassessment**: Duplicate of onboarding_assessments
- **email_subscriptions**: Email newsletter subscriptions
- **email_subscription_analytics**: Email subscription analytics view
- **notification_preferences**: User notification preferences
- **org_audit_logs**: Organization audit logs
- **org_roles**: Organization roles
- **org_users**: Organization users
- **pulse_delegations**: Pulse delegation tracking
- **pulse_responses**: Pulse response data
- **question_delegations**: Question delegation
- **real_time_metrics**: Real-time metrics
- **realtime_events**: Real-time events
- **realtime_strategic_trends**: Real-time strategic trends
- **realtime_subscriptions**: Real-time subscription data
- **roadmap_updates**: Product roadmap updates
- **sales_performance_assessment**: Sales performance assessment
- **score_ai_readiness**: AI readiness scoring
- **score_bpm**: BPM scoring
- **score_competitive_benchmarking**: Competitive benchmarking scoring
- **score_customer_experience**: Customer experience scoring
- **score_digital_transformation**: Digital transformation scoring
- **score_leadership**: Leadership scoring
- **score_marketing_effectiveness**: Marketing effectiveness scoring
- **score_reassessment**: Reassessment scoring
- **score_sales_performance**: Sales performance scoring
- **score_strategic_maturity**: Strategic maturity scoring
- **score_tech_stack**: Tech stack scoring
- **scorecard_insights**: Scorecard insights
- **security_alerts**: Security alerts
- **simulation_analytics**: Simulation analytics
- **simulation_scenarios**: Simulation scenarios
- **simulation_sessions**: Simulation sessions
- **strategic_maturity_assessment**: Strategic maturity assessment
- **strategic_pulses**: Strategic pulses
- **team_activities**: Team activities
- **team_activity_log**: Team activity log
- **team_analytics**: Team analytics
- **team_comments**: Team comments
- **team_messages**: Team messages
- **team_presence**: Team presence
- **team_users**: Team users
- **tech_stack_assessment**: Tech stack assessment
- **tier2_dashboard_insights**: Tier 2 dashboard insights
- **tier2_profiles**: Tier 2 profiles
- **tier2_simulation_history**: Tier 2 simulation history
- **tier2_users**: Tier 2 users (main user table)
- **trends**: Legacy trends
- **trial_users**: Trial users
- **unified_assessment_analytics**: Unified assessment analytics
- **unified_assessment_context**: Unified assessment context
- **unified_assessment_delegations**: Unified assessment delegations
- **unified_assessment_progress**: Unified assessment progress
- **unified_assessment_sessions**: Unified assessment sessions
- **unified_assessment_templates**: Unified assessment templates
- **user_actions**: User actions
- **user_analytics**: User analytics
- **user_sessions**: User sessions
- **user_tech_stack**: User tech stack
- **useractivity**: User activity (legacy)
- **websocket_connections**: WebSocket connections

---

## 3. Key Enums & Custom Types

### 3.1. Stack Level Enums
- **comp_stack_level**: Company stack level
- **ind_stack_level**: Industry stack level  
- **rev_stack_level**: Revenue stack level
- **grow_stack_level**: Growth stack level
- **f_stack_level**: F stack level
- **tool_stack_level**: Tool stack level
- **tech_stack_level2**: Tech stack level 2

### 3.2. Assessment Enums
- **tech_maturity**: integrated, partially_integrated, siloed, early_stage, unsure
- **funding_status**: raising_now, early_planning, preparing_exit, not_planned, other
- **growth_pace**: Growth pace categories
- **team_alignment**: Team alignment levels
- **final_confirmation**: Final confirmation status
- **strategy_decision**: Strategy decision method

### 3.3. System Enums
- **notification_priority**: high, medium, low
- **notification_type**: Notification type categories

---

## 4. Database Architecture Notes

### 4.1. Security & Access Control
- **Row Level Security (RLS)**: Most tables have RLS policies for user/org isolation
- **Admin Access**: Admin users can access all data across organizations
- **User Isolation**: Users can only access their own data
- **Org Isolation**: Organization members can only access their org's data

### 4.2. Data Integrity
- **Foreign Key Constraints**: Comprehensive FK relationships maintain referential integrity
- **Check Constraints**: Enum values and numeric ranges enforced
- **Unique Constraints**: Email addresses, user subscriptions, etc.
- **Triggers**: Audit logging, timestamp updates, data archiving

### 4.3. Performance Optimizations
- **Indexes**: Strategic indexing on frequently queried columns
- **JSONB**: Flexible data storage for complex objects
- **Array Types**: Efficient storage for multiple values
- **Partitioning**: Some tables may be partitioned for performance

### 4.4. Audit & Compliance
- **Comprehensive Logging**: All data changes tracked in audit_log
- **User Tracking**: IP addresses, user agents, session IDs
- **Change History**: Old/new values preserved for compliance
- **Admin Oversight**: Admin-only access to audit logs

### 4.5. Scalability Considerations
- **UUID Primary Keys**: Distributed ID generation
- **JSONB for Flexibility**: Schema evolution without migrations
- **Array Types**: Efficient storage for multiple related values
- **Indexed Foreign Keys**: Fast relationship queries

---

## 5. Migration & Legacy Notes

### 5.1. Legacy Tables
- **growth_users**: Being phased out in favor of tier2_users
- **useractivity**: Legacy activity tracking
- **trends**: Legacy trends data
- **trial_users**: Legacy trial user management

### 5.2. Data Migration Paths
- User data migration from growth_users to tier2_users
- Assessment data consolidation
- Analytics data standardization

### 5.3. Deprecation Timeline
- Legacy tables maintained for backward compatibility
- Gradual migration to new schema
- Data validation during migration process

---

## 6. Complete Schema Dump

The complete schema dump for all 114 tables is available in `complete_schema_dump.txt` which contains:
- Full column definitions
- All constraints and indexes
- Foreign key relationships
- RLS policies
- Triggers and functions
- Table descriptions and metadata

This document provides a comprehensive reference for the entire database architecture, including detailed schema information for key tables and high-level descriptions for all 114 tables in the system. 