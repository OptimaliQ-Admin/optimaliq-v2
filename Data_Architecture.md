# Data Architecture

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

## 2. Core User & Organization Tables

### 2.1. tier2_users
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

### 2.2. enterprise_orgs
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

### 2.3. growth_users (Legacy)
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

## 3. Assessment & Scoring System

### 3.1. onboarding_assessments
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

### 3.2. assessment_scoring_results
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

### 3.3. growth_assessment
**Main growth assessment responses**
- `u_id` (uuid, PK, FK): References growth_users(u_id)
- `obstacles`, `strategy`, `process`, `customers`, `technology` (text): Assessment responses
- `submittedat`, `created_at`, `updated_at` (timestamp): Timestamps

**Triggers:**
- Archive trigger for historical tracking

---

## 4. Real-time Intelligence Tables

### 4.1. realtime_market_trends
**Market trend insights and analysis**
- `id` (uuid, PK): Trend identifier
- `title` (text): Trend title
- `insight` (text): Detailed insight
- `source` (text): Data source
- `createdat` (timestamp): Creation time
- `industry` (text): Industry focus

### 4.2. realtime_business_trends
**Business trend insights**
- `id` (uuid, PK): Trend identifier
- `title`, `industry`, `insight`, `source` (text): Trend details
- `createdat` (timestamp): Creation time

### 4.3. realtime_marketing_playbook
**Marketing playbook insights**
- `id` (uuid, PK): Playbook identifier
- `title` (text, default: '🧠 Tactical Marketing Playbook')
- `insight` (text): Marketing insight
- `source` (text, default: 'GPT + Curated URLs')
- `createdat` (timestamp): Creation time

### 4.4. business_news_ticker
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

---

## 5. Growth & Simulation System

### 5.1. growth_levers
**Growth lever suggestions**
- `id` (uuid, PK): Lever identifier
- `u_id` (uuid, FK): References tier2_users(u_id)
- `levers` (text[]): Array of growth levers
- `generated_at` (timestamp): Generation time

### 5.2. growth_simulations
**Simulation runs and results**
- `id` (uuid, PK): Simulation identifier
- `user_id` (uuid): User running simulation
- `simulation_type` (varchar(100)): Type of simulation
- `input_data`, `output_data` (jsonb): Simulation data
- `status` (varchar(50), default: 'completed'): Simulation status
- `metadata` (jsonb): Additional metadata
- `created_at` (timestamp): Creation time

### 5.3. growth_levers_regeneration
**Growth lever regeneration tracking**
- `user_id` (uuid, FK): References tier2_users(u_id)
- `org_id` (uuid, FK): References enterprise_orgs(id)

---

## 6. Subscription & Payment System

### 6.1. subscriptions
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

## 7. Notification & Event System

### 7.1. notifications
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

### 7.2. audit_log
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

### 7.3. events
**System event tracking**
- `id` (uuid, PK): Event identifier
- `user_id`, `org_id` (uuid): User and organization
- `event_type` (varchar(100)): Event type
- `event_data` (jsonb, default: '{}'): Event data
- `source` (varchar(100)): Event source
- `created_at` (timestamp): Event time

---

## 8. Team & Collaboration System

### 8.1. team_members
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

## 9. Dashboard & Analytics System

### 9.1. dashboard_analytics
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

### 9.2. dashboard_benchmarks
**Benchmark data for comparisons**

### 9.3. dashboard_configs
**User dashboard configuration**

### 9.4. dashboard_events
**Dashboard event logging**

### 9.5. dashboard_layouts
**Dashboard layout management**

### 9.6. dashboard_trends
**Trend data for dashboard**

### 9.7. dashboard_widget_data
**Widget cache and data storage**

---

## 10. AI & Analytics System

### 10.1. ai_analytics
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

### 10.2. ai_log
**AI request logging**
- `u_id` (uuid, FK): References growth_users(u_id)

### 10.3. ai_readiness_assessment
**AI readiness assessment data**

### 10.4. ai_assessment_context
**AI assessment context data**

---

## 11. Specialized Assessment Tables

### 11.1. Strategic Maturity
- **strategic_maturity_assessment**: Strategic maturity assessment responses
- **score_strategic_maturity**: Strategic maturity scoring results
  - `gmf_score` (double precision): GMF score
  - `bracket_key` (text): Score bracket
  - `answers` (jsonb): Assessment answers
  - `version` (text, default: 'v1'): Assessment version

### 11.2. Business Process Management
- **bpm_assessment**: BPM assessment responses
- **score_bpm**: BPM scoring results

### 11.3. Competitive Benchmarking
- **competitive_benchmarking_assessment**: Competitive assessment responses
- **score_competitive_benchmarking**: Competitive scoring results

### 11.4. Customer Experience
- **customer_experience_assessment**: CX assessment responses
- **score_customer_experience**: CX scoring results

### 11.5. Digital Transformation
- **digital_transformation_assessment**: Digital transformation responses
- **score_digital_transformation**: Digital transformation scoring

### 11.6. Leadership
- **leadership_assessment**: Leadership assessment responses
- **score_leadership**: Leadership scoring results

### 11.7. Marketing Effectiveness
- **marketing_effectiveness_assessment**: Marketing assessment responses
- **score_marketing_effectiveness**: Marketing scoring results

### 11.8. Sales Performance
- **sales_performance_assessment**: Sales assessment responses
- **score_sales_performance**: Sales scoring results

### 11.9. Tech Stack
- **tech_stack_assessment**: Tech stack assessment responses
- **score_tech_stack**: Tech stack scoring results

### 11.10. Reassessment
- **reassessment_assessment**: Reassessment responses
- **score_reassessment**: Reassessment scoring results
- **reassessment_prompts**: Reassessment prompts

---

## 12. Supporting & Utility Tables

### 12.1. Integration & Templates
- **integration_templates**: Integration templates
- **assessment_templates**: Assessment structure templates
- **assessment_invitations**: Assessment invitations
- **assessment_assignments**: Assessment assignments
- **assessment_delegations**: Assessment delegations
- **assessment_insights**: Assessment insights
- **assessment_sessions**: Assessment session tracking
- **assessment_analytics**: Assessment usage analytics

### 12.2. Reference Data
- **industry_stock_symbols**: Stock symbol reference data
- **inspirational_quotes**: Motivational quotes
- **roadmap_updates**: Product roadmap updates
- **scorecard_insights**: Scorecard data
- **security_alerts**: Security event alerts

### 12.3. User Activity & Sessions
- **user_sessions**: User session tracking
- **user_analytics**: User analytics data
- **user_actions**: User action logging
- **useractivity**: Activity log (legacy)
- **websocket_connections**: WebSocket connection tracking

### 12.4. Team Collaboration
- **team_activities**: Team activity tracking
- **team_activity_log**: Team activity logging
- **team_analytics**: Team analytics
- **team_comments**: Team comments
- **team_messages**: Team messaging
- **team_presence**: Team presence tracking
- **team_users**: Team-user relationships

### 12.5. Growth Studio
- **growth_studio_audit_log**: Growth studio audit logging
- **growth_insights**: Growth insights data
- **growth_insights_history**: Growth insights history
- **growth_lever_progress**: Growth lever progress tracking
- **growth_quadrant_data**: Growth quadrant analysis
- **growth_simulations_log**: Growth simulation logging

### 12.6. Pulse & Delegation
- **pulse_delegations**: Pulse delegation tracking
- **pulse_responses**: Pulse response data
- **question_delegations**: Question delegation
- **strategic_pulses**: Strategic pulse data

### 12.7. Real-time Data
- **realtime_events**: Real-time event data
- **realtime_subscriptions**: Real-time subscription data
- **realtime_strategic_trends**: Real-time strategic trends
- **real_time_metrics**: Real-time metrics

### 12.8. Legacy & Migration
- **growth_assessment_history**: Historical growth assessments
- **trial_users**: Trial user data
- **leads**: Lead data
- **trends**: Legacy trends data
- **tier2_dashboard_insights**: Tier 2 dashboard insights
- **tier2_profiles**: Tier 2 user profiles
- **tier2_simulation_history**: Tier 2 simulation history

---

## 13. Key Enums & Custom Types

### 13.1. Stack Level Enums
- **comp_stack_level**: Company stack level
- **ind_stack_level**: Industry stack level  
- **rev_stack_level**: Revenue stack level
- **grow_stack_level**: Growth stack level
- **f_stack_level**: F stack level
- **tool_stack_level**: Tool stack level
- **tech_stack_level2**: Tech stack level 2

### 13.2. Assessment Enums
- **tech_maturity**: integrated, partially_integrated, siloed, early_stage, unsure
- **funding_status**: raising_now, early_planning, preparing_exit, not_planned, other
- **growth_pace**: Growth pace categories
- **team_alignment**: Team alignment levels
- **final_confirmation**: Final confirmation status
- **strategy_decision**: Strategy decision method

### 13.3. System Enums
- **notification_priority**: high, medium, low
- **notification_type**: Notification type categories

---

## 14. Database Architecture Notes

### 14.1. Security & Access Control
- **Row Level Security (RLS)**: Most tables have RLS policies for user/org isolation
- **Admin Access**: Admin users can access all data across organizations
- **User Isolation**: Users can only access their own data
- **Org Isolation**: Organization members can only access their org's data

### 14.2. Data Integrity
- **Foreign Key Constraints**: Comprehensive FK relationships maintain referential integrity
- **Check Constraints**: Enum values and numeric ranges enforced
- **Unique Constraints**: Email addresses, user subscriptions, etc.
- **Triggers**: Audit logging, timestamp updates, data archiving

### 14.3. Performance Optimizations
- **Indexes**: Strategic indexing on frequently queried columns
- **JSONB**: Flexible data storage for complex objects
- **Array Types**: Efficient storage for multiple values
- **Partitioning**: Some tables may be partitioned for performance

### 14.4. Audit & Compliance
- **Comprehensive Logging**: All data changes tracked in audit_log
- **User Tracking**: IP addresses, user agents, session IDs
- **Change History**: Old/new values preserved for compliance
- **Admin Oversight**: Admin-only access to audit logs

### 14.5. Scalability Considerations
- **UUID Primary Keys**: Distributed ID generation
- **JSONB for Flexibility**: Schema evolution without migrations
- **Array Types**: Efficient storage for multiple related values
- **Indexed Foreign Keys**: Fast relationship queries

---

## 15. Migration & Legacy Notes

### 15.1. Legacy Tables
- **growth_users**: Being phased out in favor of tier2_users
- **useractivity**: Legacy activity tracking
- **trends**: Legacy trends data
- **trial_users**: Legacy trial user management

### 15.2. Data Migration Paths
- User data migration from growth_users to tier2_users
- Assessment data consolidation
- Analytics data standardization

### 15.3. Deprecation Timeline
- Legacy tables maintained for backward compatibility
- Gradual migration to new schema
- Data validation during migration process 