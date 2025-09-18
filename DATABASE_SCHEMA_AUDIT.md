# OptimaliQ Database Schema Audit

## Overview
This document provides a comprehensive audit of the OptimaliQ database schema, including all tables, relationships, and data structures.

## Database Configuration
- **Database**: PostgreSQL 17
- **Extensions**: pgvector (for AI embeddings)
- **RLS**: Enabled on all tables
- **Migrations**: 10 migration files

## Core Tables

### 1. Organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Tier2 Users (Enhanced User Profiles)
```sql
CREATE TABLE tier2_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  title TEXT,
  company TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  industry TEXT,
  timezone TEXT DEFAULT 'UTC',
  linkedin_url TEXT,
  agreed_terms BOOLEAN DEFAULT false,
  agreed_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Tier2 Profiles (Assessment Scores)
```sql
CREATE TABLE tier2_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES tier2_users(id) ON DELETE CASCADE,
  score_overall NUMERIC(5,2) DEFAULT 0,
  score_strategy NUMERIC(5,2) DEFAULT 0,
  score_process NUMERIC(5,2) DEFAULT 0,
  score_technology NUMERIC(5,2) DEFAULT 0,
  bmp_score NUMERIC(5,2),
  sales_score NUMERIC(5,2),
  ai_readiness_score NUMERIC(5,2),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4. Subscriptions (Billing)
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'accelerator', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'unpaid', 'trial')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Assessment Tables

### 5. Assessment Templates
```sql
CREATE TABLE assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('onboarding', 'bpm', 'sales_performance', 'ai_readiness', 'strategy', 'process', 'technology')),
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  questions JSONB NOT NULL DEFAULT '[]',
  scoring_rules JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6. Onboarding Assessments
```sql
CREATE TABLE onboarding_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'onboarding',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  payload_json JSONB NOT NULL DEFAULT '{}',
  score NUMERIC(5,2),
  breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### 7. Dashboard Insights
```sql
CREATE TABLE tier2_dashboard_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  strategy NUMERIC(5,2) NOT NULL DEFAULT 0,
  process NUMERIC(5,2) NOT NULL DEFAULT 0,
  technology NUMERIC(5,2) NOT NULL DEFAULT 0,
  roadmap JSONB DEFAULT '[]',
  benchmarks JSONB DEFAULT '[]',
  trends JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Growth Tables

### 8. Growth Levers
```sql
CREATE TABLE growth_levers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  impact NUMERIC(3,2) CHECK (impact >= 0 AND impact <= 10),
  effort NUMERIC(3,2) CHECK (effort >= 0 AND effort <= 10),
  priority NUMERIC(3,2) CHECK (priority >= 0 AND priority <= 10),
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. Market Snapshots
```sql
CREATE TABLE market_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  card_json JSONB NOT NULL,
  citations JSONB DEFAULT '[]',
  ttl_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. Benchmark Data
```sql
CREATE TABLE benchmark_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  industry_average NUMERIC(10,4),
  top_performers NUMERIC(10,4),
  bottom_quartile NUMERIC(10,4),
  sample_size INTEGER,
  data_source TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Marketing Tables

### 11. Leads
```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  title TEXT,
  industry TEXT,
  company_size TEXT CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),
  revenue_range TEXT CHECK (revenue_range IN ('Under $1M', '$1M - $10M', '$10M - $50M', '$50M - $100M', 'Over $100M')),
  lead_source TEXT,
  lead_score NUMERIC(5,2) DEFAULT 0,
  qualification_status TEXT DEFAULT 'unqualified' CHECK (qualification_status IN ('unqualified', 'marketing_qualified', 'sales_qualified', 'customer', 'churned')),
  notes TEXT,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Team Tables

### 12. Team Members
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES tier2_users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions JSONB DEFAULT '{}',
  invited_by UUID REFERENCES tier2_users(id),
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Key Relationships

1. **Users → Organizations**: Many-to-one (users belong to one organization)
2. **Users → Profiles**: One-to-one (each user has one profile)
3. **Users → Assessments**: One-to-many (users can have multiple assessments)
4. **Users → Growth Levers**: One-to-many (users have multiple growth recommendations)
5. **Organizations → Team Members**: One-to-many (organizations have multiple team members)
6. **Users → Subscriptions**: One-to-many (users can have multiple subscriptions)

## Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Allow users to read/update their own data
- Allow public read access to shared data (templates, benchmarks)
- Restrict access based on organization membership for team data

## Indexes

Performance indexes are created for:
- Foreign key relationships
- Frequently queried columns (email, user_id, industry)
- Search and filtering operations
- TTL-based cleanup operations

## Functions and Triggers

1. **update_updated_at_column()**: Automatically updates the `updated_at` timestamp
2. **clean_expired_snapshots()**: Removes expired market snapshots
3. **should_regenerate_growth_levers()**: Determines if growth levers need regeneration

## Migration Status

- ✅ Core tables (organizations, users, profiles, subscriptions)
- ✅ Assessment tables (templates, assessments, insights)
- ✅ Growth tables (levers, snapshots, benchmarks)
- ✅ Marketing tables (leads, campaigns, sources)
- ✅ Team tables (members, invitations, permissions)
- ✅ Realtime events and Stripe integration
- ✅ Vector search capabilities (pgvector)

## Potential Issues

1. **Missing Environment Configuration**: No `.env.local` file found
2. **Docker Not Running**: Local Supabase development requires Docker
3. **Fallback Configuration**: Current setup uses placeholder values
4. **Migration Dependencies**: Some migrations may have dependencies on external services

## Recommendations

1. Set up proper environment configuration
2. Start Docker for local development
3. Test database connections and migrations
4. Verify RLS policies are working correctly
5. Test CRUD operations on key tables
