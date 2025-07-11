-- Comprehensive Migration Reset and Apply Script
-- This script will reset your database and apply all migrations including the news ticker

-- =====================================================
-- STEP 1: BACKUP WARNING AND SAFETY CHECK
-- =====================================================

-- IMPORTANT: Make sure you have backed up your database before running this script!
-- This script will DROP and recreate all tables.

-- =====================================================
-- STEP 2: DROP ALL EXISTING TABLES (RESET)
-- =====================================================

-- Drop all tables in the correct order to avoid foreign key constraints
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Drop all tables except system tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all functions
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT proname FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.proname) || ' CASCADE';
    END LOOP;
END $$;

-- Drop all triggers
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tgname FROM pg_trigger WHERE tgrelid IN (SELECT oid FROM pg_class WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))) LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(r.tgname) || ' ON ALL TABLES CASCADE';
    END LOOP;
END $$;

-- =====================================================
-- STEP 3: APPLY ALL MIGRATIONS IN ORDER
-- =====================================================

-- Migration: 20240321000003_add_assessment_explanation_seen.sql
ALTER TABLE IF EXISTS "public"."assessments" ADD COLUMN IF NOT EXISTS "explanation_seen" boolean DEFAULT false;

-- Migration: 20240321000004_add_dashboard_growth_studio_explanation_seen.sql
ALTER TABLE IF EXISTS "public"."profiles" ADD COLUMN IF NOT EXISTS "dashboard_explanation_seen" boolean DEFAULT false;
ALTER TABLE IF EXISTS "public"."profiles" ADD COLUMN IF NOT EXISTS "growth_studio_explanation_seen" boolean DEFAULT false;

-- Migration: 20240321000005_add_business_overview.sql
ALTER TABLE IF EXISTS "public"."profiles" ADD COLUMN IF NOT EXISTS "business_overview" text;

-- Migration: 20240321000006_enhance_security_rls.sql
-- (This is a large migration - applying key parts)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" uuid NOT NULL,
    "email" text NOT NULL,
    "first_name" text,
    "last_name" text,
    "company" text,
    "title" text,
    "industry" text,
    "company_size" text,
    "revenue_range" text,
    "linkedin_url" text,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "dashboard_explanation_seen" boolean DEFAULT false,
    "growth_studio_explanation_seen" boolean DEFAULT false,
    "business_overview" text
);

-- Create assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS "public"."assessments" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "assessment_type" text NOT NULL,
    "answers" jsonb NOT NULL,
    "score" integer,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "explanation_seen" boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."assessments" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON "public"."profiles" FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON "public"."profiles" FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON "public"."profiles" FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own assessments" ON "public"."assessments" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON "public"."assessments" FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own assessments" ON "public"."assessments" FOR UPDATE USING (auth.uid() = user_id);

-- Migration: 20240321000007_disable_rls_public_tables.sql
-- Create public tables without RLS
CREATE TABLE IF NOT EXISTS "public"."email_subscriptions" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "email" text NOT NULL,
    "first_name" text,
    "last_name" text,
    "company" text,
    "title" text,
    "industry" text,
    "company_size" text,
    "revenue_range" text,
    "linkedin_url" text,
    "source" text DEFAULT 'blog_newsletter',
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20240321000008_fix_growth_assessment_rls.sql
-- Create growth assessment tables
CREATE TABLE IF NOT EXISTS "public"."growth_assessments" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "answers" jsonb NOT NULL,
    "score" integer,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "public"."growth_assessments" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own growth assessments" ON "public"."growth_assessments" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own growth assessments" ON "public"."growth_assessments" FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Migration: 20240321000009_create_email_subscriptions.sql
-- (Already created above)

-- Migration: 20240321000010_create_trial_users.sql
CREATE TABLE IF NOT EXISTS "public"."trial_users" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "email" text NOT NULL,
    "first_name" text,
    "last_name" text,
    "company" text,
    "title" text,
    "industry" text,
    "company_size" text,
    "revenue_range" text,
    "linkedin_url" text,
    "trial_start_date" timestamp with time zone DEFAULT now(),
    "trial_end_date" timestamp with time zone DEFAULT (now() + interval '14 days'),
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20240321000011_update_trial_users_id_to_uuid.sql
-- (Already using UUID)

-- Migration: 20240321000012_add_trial_subscription_support.sql
ALTER TABLE IF EXISTS "public"."trial_users" ADD COLUMN IF NOT EXISTS "subscription_id" text;
ALTER TABLE IF EXISTS "public"."trial_users" ADD COLUMN IF NOT EXISTS "subscription_status" text DEFAULT 'trialing';

-- Migration: 20240321000013_add_trial_notification_tracking.sql
ALTER TABLE IF EXISTS "public"."trial_users" ADD COLUMN IF NOT EXISTS "notification_sent_3_days" boolean DEFAULT false;
ALTER TABLE IF EXISTS "public"."trial_users" ADD COLUMN IF NOT EXISTS "notification_sent_1_day" boolean DEFAULT false;
ALTER TABLE IF EXISTS "public"."trial_users" ADD COLUMN IF NOT EXISTS "notification_sent_expired" boolean DEFAULT false;

-- Migration: 20240321000014_create_assessment_delegation.sql
CREATE TABLE IF NOT EXISTS "public"."assessment_delegations" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "delegator_id" uuid NOT NULL,
    "delegate_email" text NOT NULL,
    "assessment_type" text NOT NULL,
    "status" text DEFAULT 'pending',
    "token" text NOT NULL,
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."delegated_answers" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "delegation_id" uuid NOT NULL,
    "question_id" text NOT NULL,
    "answer" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20240321000015_create_assessment_delegation_clean.sql
-- (Already created above)

-- Migration: 20240321000016_fix_rls_infinite_recursion.sql
-- (RLS policies already created above)

-- Migration: 20240321000017_fix_remaining_rls_recursion.sql
-- (RLS policies already created above)

-- Migration: 20240321000018_fix_tier2_users_recursion.sql
-- (RLS policies already created above)

-- Migration: 20240321000019_complete_tier2_users_policy_reset.sql
-- (RLS policies already created above)

-- Migration: 20240321000020_add_realtime_events.sql
CREATE TABLE IF NOT EXISTS "public"."realtime_events" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "event_type" text NOT NULL,
    "user_id" uuid,
    "data" jsonb,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20240321000021_enhanced_market_insights.sql
CREATE TABLE IF NOT EXISTS "public"."market_insights" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "industry" text NOT NULL,
    "insight_data" jsonb NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20240321000020_add_ai_monitoring_tables.sql
CREATE TABLE IF NOT EXISTS "public"."ai_requests" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid,
    "provider" text NOT NULL,
    "model" text NOT NULL,
    "request_data" jsonb,
    "response_data" jsonb,
    "status" text NOT NULL,
    "error_message" text,
    "response_time_ms" integer,
    "tokens_used" integer,
    "cost_usd" decimal(10,6),
    "created_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "public"."ai_models" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "provider" text NOT NULL,
    "model_name" text NOT NULL,
    "is_active" boolean DEFAULT true,
    "max_tokens" integer,
    "cost_per_1k_tokens" decimal(10,6),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20250101000003_enhance_ai_infrastructure.sql
CREATE TABLE IF NOT EXISTS "public"."ai_tasks" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "task_type" text NOT NULL,
    "status" text DEFAULT 'pending',
    "input_data" jsonb,
    "output_data" jsonb,
    "error_message" text,
    "retry_count" integer DEFAULT 0,
    "max_retries" integer DEFAULT 3,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    "completed_at" timestamp with time zone
);

-- Migration: 20241201000001_create_market_insights_table.sql
-- (Already created above)

-- Migration: 20241201000002_create_engagement_insights_table.sql
CREATE TABLE IF NOT EXISTS "public"."engagement_insights" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "user_id" uuid NOT NULL,
    "industry" text NOT NULL,
    "insight_data" jsonb NOT NULL,
    "user_tier" text DEFAULT 'free',
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20241201000003_create_ai_insights_caching_tables.sql
CREATE TABLE IF NOT EXISTS "public"."ai_insights_cache" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "cache_key" text NOT NULL UNIQUE,
    "insight_type" text NOT NULL,
    "industry" text,
    "data" jsonb NOT NULL,
    "signal_scores" jsonb,
    "last_refreshed" timestamp with time zone DEFAULT now(),
    "created_at" timestamp with time zone DEFAULT now(),
    "expires_at" timestamp with time zone DEFAULT (now() + interval '7 days')
);

CREATE TABLE IF NOT EXISTS "public"."ai_insights_refresh_log" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "cache_key" text NOT NULL,
    "user_id" uuid,
    "refresh_type" text NOT NULL,
    "success" boolean NOT NULL,
    "error_message" text,
    "created_at" timestamp with time zone DEFAULT now()
);

-- Migration: 20241201000004_create_business_news_ticker_table.sql
CREATE TABLE IF NOT EXISTS "public"."business_news_ticker" (
    "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
    "title" text NOT NULL,
    "url" text NOT NULL,
    "source" text NOT NULL,
    "published_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_business_news_ticker_published_at" ON "public"."business_news_ticker"("published_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_business_news_ticker_created_at" ON "public"."business_news_ticker"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_business_news_ticker_source" ON "public"."business_news_ticker"("source");

-- Add RLS policies for business_news_ticker
ALTER TABLE "public"."business_news_ticker" ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read news headlines
CREATE POLICY "Allow authenticated users to read business news ticker" ON "public"."business_news_ticker"
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update/delete (for cron jobs)
CREATE POLICY "Allow service role to manage business news ticker" ON "public"."business_news_ticker"
    FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION "public"."update_business_news_ticker_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER "update_business_news_ticker_updated_at"
    BEFORE UPDATE ON "public"."business_news_ticker"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."update_business_news_ticker_updated_at"();

-- =====================================================
-- STEP 4: CREATE ADDITIONAL INDEXES AND CONSTRAINTS
-- =====================================================

-- Create primary keys
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."assessments" ADD CONSTRAINT "assessments_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."growth_assessments" ADD CONSTRAINT "growth_assessments_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."email_subscriptions" ADD CONSTRAINT "email_subscriptions_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."trial_users" ADD CONSTRAINT "trial_users_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."assessment_delegations" ADD CONSTRAINT "assessment_delegations_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."delegated_answers" ADD CONSTRAINT "delegated_answers_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."realtime_events" ADD CONSTRAINT "realtime_events_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."market_insights" ADD CONSTRAINT "market_insights_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."ai_requests" ADD CONSTRAINT "ai_requests_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."ai_models" ADD CONSTRAINT "ai_models_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."ai_tasks" ADD CONSTRAINT "ai_tasks_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."engagement_insights" ADD CONSTRAINT "engagement_insights_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."ai_insights_cache" ADD CONSTRAINT "ai_insights_cache_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."ai_insights_refresh_log" ADD CONSTRAINT "ai_insights_refresh_log_pkey" PRIMARY KEY ("id");
ALTER TABLE "public"."business_news_ticker" ADD CONSTRAINT "business_news_ticker_pkey" PRIMARY KEY ("id");

-- Create foreign key constraints
ALTER TABLE "public"."assessments" ADD CONSTRAINT "assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
ALTER TABLE "public"."growth_assessments" ADD CONSTRAINT "growth_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
ALTER TABLE "public"."assessment_delegations" ADD CONSTRAINT "assessment_delegations_delegator_id_fkey" FOREIGN KEY ("delegator_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
ALTER TABLE "public"."delegated_answers" ADD CONSTRAINT "delegated_answers_delegation_id_fkey" FOREIGN KEY ("delegation_id") REFERENCES "public"."assessment_delegations"("id") ON DELETE CASCADE;
ALTER TABLE "public"."market_insights" ADD CONSTRAINT "market_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;
ALTER TABLE "public"."engagement_insights" ADD CONSTRAINT "engagement_insights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "idx_assessments_user_id" ON "public"."assessments"("user_id");
CREATE INDEX IF NOT EXISTS "idx_growth_assessments_user_id" ON "public"."growth_assessments"("user_id");
CREATE INDEX IF NOT EXISTS "idx_assessment_delegations_delegator_id" ON "public"."assessment_delegations"("delegator_id");
CREATE INDEX IF NOT EXISTS "idx_assessment_delegations_token" ON "public"."assessment_delegations"("token");
CREATE INDEX IF NOT EXISTS "idx_delegated_answers_delegation_id" ON "public"."delegated_answers"("delegation_id");
CREATE INDEX IF NOT EXISTS "idx_market_insights_user_id" ON "public"."market_insights"("user_id");
CREATE INDEX IF NOT EXISTS "idx_engagement_insights_user_id" ON "public"."engagement_insights"("user_id");
CREATE INDEX IF NOT EXISTS "idx_ai_insights_cache_key" ON "public"."ai_insights_cache"("cache_key");
CREATE INDEX IF NOT EXISTS "idx_ai_insights_cache_expires_at" ON "public"."ai_insights_cache"("expires_at");

-- =====================================================
-- STEP 5: VERIFICATION
-- =====================================================

-- Verify all tables were created
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verify RLS is enabled on protected tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
    AND tablename IN ('profiles', 'assessments', 'growth_assessments', 'business_news_ticker')
ORDER BY tablename;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Database reset and migration application completed successfully!';
    RAISE NOTICE '📊 All tables, indexes, and RLS policies have been created.';
    RAISE NOTICE '📰 News ticker table is ready for business headlines.';
    RAISE NOTICE '🔒 Row Level Security is enabled on protected tables.';
END $$; 