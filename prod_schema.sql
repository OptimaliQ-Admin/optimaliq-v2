--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'Security Configuration:
- User-specific tables: RLS enabled with user-based policies
- Public tables: RLS disabled for anonymized/reference data
- Admin tables: RLS enabled with admin override policies
- Audit logging: Comprehensive tracking of all operations';


--
-- Name: comp_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.comp_stack_level AS ENUM (
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
);


ALTER TYPE public.comp_stack_level OWNER TO postgres;

--
-- Name: f_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.f_stack_level AS ENUM (
    'lack_funding',
    'leadership_misalignment',
    'hiring_retention',
    'operational_inefficiencies',
    'underperforming_marketing',
    'high_cac',
    'weak_retention',
    'tech_stack_issues',
    'brand_positioning',
    'market_saturation',
    'regulatory_issues',
    'other'
);


ALTER TYPE public.f_stack_level OWNER TO postgres;

--
-- Name: final_confirmation; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.final_confirmation AS ENUM (
    'yes_ready',
    'no_not_ready'
);


ALTER TYPE public.final_confirmation OWNER TO postgres;

--
-- Name: funding_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.funding_status AS ENUM (
    'raising_now',
    'early_planning',
    'preparing_exit',
    'not_planned',
    'other'
);


ALTER TYPE public.funding_status OWNER TO postgres;

--
-- Name: grow_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.grow_stack_level AS ENUM (
    'increase_revenue',
    'improve_profitability',
    'scale_operations',
    'expand_new_markets',
    'launch_new_product',
    'improve_retention',
    'raise_funding',
    'prepare_exit',
    'other'
);


ALTER TYPE public.grow_stack_level OWNER TO postgres;

--
-- Name: growth_pace; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.growth_pace AS ENUM (
    '10_25',
    '25_50',
    '50_100',
    '2x_3x',
    '3x_plus',
    'unsure'
);


ALTER TYPE public.growth_pace OWNER TO postgres;

--
-- Name: ind_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.ind_stack_level AS ENUM (
    'E-commerce',
    'Finance',
    'SaaS',
    'Education',
    'Technology',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Consulting',
    'Entertainment',
    'Real Estate',
    'Transportation',
    'Hospitality',
    'Energy',
    'Telecommunications',
    'Pharmaceuticals',
    'Automotive',
    'Construction',
    'Legal',
    'Nonprofit',
    'Other'
);


ALTER TYPE public.ind_stack_level OWNER TO postgres;

--
-- Name: notification_priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_priority AS ENUM (
    'high',
    'medium',
    'low'
);


ALTER TYPE public.notification_priority OWNER TO postgres;

--
-- Name: notification_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.notification_type AS ENUM (
    'assessment_reminder',
    'system_update',
    'subscription',
    'profile_update',
    'general'
);


ALTER TYPE public.notification_type OWNER TO postgres;

--
-- Name: rev_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rev_stack_level AS ENUM (
    '<$100K',
    '$100K-$500K',
    '$500K-$1M',
    '$1M-$10M',
    '$10M-$50M',
    '$50M+'
);


ALTER TYPE public.rev_stack_level OWNER TO postgres;

--
-- Name: strategy_decision; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.strategy_decision AS ENUM (
    'gut_feel',
    'data_driven',
    'team_alignment',
    'executive_top_down',
    'board_pressure',
    'mixed'
);


ALTER TYPE public.strategy_decision OWNER TO postgres;

--
-- Name: team_alignment; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.team_alignment AS ENUM (
    'fully_aligned',
    'mostly_aligned',
    'some_misalignment',
    'not_aligned',
    'other'
);


ALTER TYPE public.team_alignment OWNER TO postgres;

--
-- Name: tech_maturity; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tech_maturity AS ENUM (
    'integrated',
    'partially_integrated',
    'siloed',
    'early_stage',
    'unsure'
);


ALTER TYPE public.tech_maturity OWNER TO postgres;

--
-- Name: tech_stack_level2; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tech_stack_level2 AS ENUM (
    'Yes',
    'No'
);


ALTER TYPE public.tech_stack_level2 OWNER TO postgres;

--
-- Name: tool_stack_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tool_stack_level AS ENUM (
    'salesforce',
    'hubspot',
    'zoho',
    'mailchimp',
    'klaviyo',
    'emarsys',
    'shopify',
    'woocommerce',
    'monday',
    'asana',
    'netsuite',
    'quickbooks',
    'tableau',
    'ga4',
    'zendesk',
    'intercom',
    'custom'
);


ALTER TYPE public.tool_stack_level OWNER TO postgres;

--
-- Name: archive_growth_assessment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.archive_growth_assessment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO growth_assessment_history (
    u_id,
    obstacles,
    strategy,
    process,
    customers,
    technology,
    submittedat,
    created_at,
    updated_at,
    archived_at
  )
  VALUES (
    NEW.u_id,
    NEW.obstacles,
    NEW.strategy,
    NEW.process,
    NEW.customers,
    NEW.technology,
    NEW.submittedat,
    NEW.created_at,
    NEW.updated_at,
    NOW()
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.archive_growth_assessment() OWNER TO postgres;

--
-- Name: archive_growth_insights(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.archive_growth_insights() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO growth_insights_history (
    u_id,
    strategy_score,
    strategy_insight,
    processscore,
    process_insight,
    technology_score,
    technology_insight,
    overall_score,
    generatedat,
    archived_at
  )
  VALUES (
    NEW.u_id,
    NEW.strategy_score,
    NEW.strategy_insight,
    NEW.processscore,
    NEW.process_insight,
    NEW.technology_score,
    NEW.technology_insight,
    NEW.overall_score,
    NEW.generatedat,
    NOW()
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.archive_growth_insights() OWNER TO postgres;

--
-- Name: audit_tier2_users(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.audit_tier2_users() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.audit_tier2_users() OWNER TO postgres;

--
-- Name: get_email_subscription_count(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_email_subscription_count() RETURNS integer
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RETURN (
        SELECT COUNT(*) 
        FROM email_subscriptions 
        WHERE status = 'active'
    );
END;
$$;


ALTER FUNCTION public.get_email_subscription_count() OWNER TO postgres;

--
-- Name: get_random_quote(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_random_quote() RETURNS TABLE(quote text, author text)
    LANGUAGE sql
    AS $$
  select quote, author
  from inspirational_quotes
  order by random()
  limit 1;
$$;


ALTER FUNCTION public.get_random_quote() OWNER TO postgres;

--
-- Name: log_assessment_history(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_assessment_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO assessment_history (
    a_id,
    u_id,
    obstacles,
    strategy,
    process,
    customers,
    technology,
    submittedat
  )
  VALUES (
    NEW.a_id,
    NEW.u_id,
    NEW.obstacles,
    NEW.strategy,
    NEW.process,
    NEW.customers,
    NEW.technology,
    NEW.submittedat
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_assessment_history() OWNER TO postgres;

--
-- Name: log_audit_event(text, text, uuid, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_record_id uuid DEFAULT NULL::uuid, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_record_id uuid, p_old_values jsonb, p_new_values jsonb) OWNER TO postgres;

--
-- Name: log_insights_history(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.log_insights_history() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO insights_history (
    u_id,
    strategyscore,
    strategyinsight,
    processscore,
    processinsight,
    technologyscore,
    technologyinsight,
    overallscore,
    generatedat
  )
  VALUES (
    NEW.u_id,
    NEW.strategyscore,
    NEW.strategyinsight,
    NEW.processscore,
    NEW.processinsight,
    NEW.technologyscore,
    NEW.technologyinsight,
    NEW.overallscore,
    NEW.generatedat
  );
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.log_insights_history() OWNER TO postgres;

--
-- Name: update_email_subscriptions_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_email_subscriptions_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_email_subscriptions_updated_at() OWNER TO postgres;

--
-- Name: update_sales_performance_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_sales_performance_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_sales_performance_updated_at() OWNER TO postgres;

--
-- Name: update_trial_users_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_trial_users_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_trial_users_updated_at() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_log (
    id integer NOT NULL,
    table_name text NOT NULL,
    operation text NOT NULL,
    user_id uuid,
    record_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address inet,
    user_agent text,
    "timestamp" timestamp without time zone DEFAULT now(),
    session_id uuid,
    CONSTRAINT audit_log_operation_check CHECK ((operation = ANY (ARRAY['SELECT'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE public.audit_log OWNER TO postgres;

--
-- Name: growth_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_users (
    u_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    industry public.ind_stack_level NOT NULL,
    role text NOT NULL,
    companysize public.comp_stack_level NOT NULL,
    revenuerange public.rev_stack_level NOT NULL,
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.growth_users OWNER TO postgres;

--
-- Name: TABLE growth_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_users IS 'User-specific growth user profiles with RLS enabled';


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subscriptions (
    sub_id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    plan text DEFAULT 'Free'::text,
    status text DEFAULT 'trial'::text NOT NULL,
    nextbillingdate date DEFAULT (CURRENT_DATE + '30 days'::interval),
    createdat timestamp with time zone DEFAULT now(),
    "billingCycle" text,
    stripe_subscription_id character varying,
    stripe_customer_id character varying,
    stripe_data json,
    CONSTRAINT check_trial_subscription CHECK ((((status = 'trial'::text) AND (plan = 'trial'::text)) OR (status <> 'trial'::text))),
    CONSTRAINT subscriptions_status_check CHECK ((status = ANY (ARRAY['trial'::text, 'active'::text, 'cancelled'::text, 'expired'::text])))
);


ALTER TABLE public.subscriptions OWNER TO postgres;

--
-- Name: COLUMN subscriptions.plan; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.subscriptions.plan IS 'Subscription plan: trial, accelerator, strategic, etc.';


--
-- Name: COLUMN subscriptions.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.subscriptions.status IS 'Subscription status: active, trial, canceled, past_due, etc.';


--
-- Name: tier2_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier2_users (
    u_id uuid DEFAULT gen_random_uuid() NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    phone text,
    title text,
    company text,
    company_size text,
    revenue_range text,
    industry text,
    created_at timestamp without time zone DEFAULT now(),
    timezone text,
    linkedin_url text,
    agreed_terms boolean DEFAULT false,
    agreed_marketing boolean DEFAULT false,
    profile_pic_url text,
    role text
);


ALTER TABLE public.tier2_users OWNER TO postgres;

--
-- Name: admin_dashboard; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.admin_dashboard AS
 SELECT 'tier2_users'::text AS table_name,
    count(*) AS record_count,
    max(tier2_users.created_at) AS last_updated
   FROM public.tier2_users
UNION ALL
 SELECT 'growth_users'::text AS table_name,
    count(*) AS record_count,
    max(growth_users.createdat) AS last_updated
   FROM public.growth_users
UNION ALL
 SELECT 'subscriptions'::text AS table_name,
    count(*) AS record_count,
    max(subscriptions.createdat) AS last_updated
   FROM public.subscriptions
UNION ALL
 SELECT 'audit_log'::text AS table_name,
    count(*) AS record_count,
    max(audit_log."timestamp") AS last_updated
   FROM public.audit_log;


ALTER TABLE public.admin_dashboard OWNER TO postgres;

--
-- Name: ai_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_log (
    log_id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid,
    apirequest text,
    apiresponse text,
    tokensused integer,
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.ai_log OWNER TO postgres;

--
-- Name: ai_readiness_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_readiness_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.ai_readiness_assessment OWNER TO postgres;

--
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.audit_log_id_seq OWNER TO postgres;

--
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- Name: bpm_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bpm_assessment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score double precision,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bpm_assessment OWNER TO postgres;

--
-- Name: business_reassessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.business_reassessment (
    o_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    growth_metrics text,
    gtm_strategy text,
    friction_points text[],
    differentiator text,
    brand_perception text,
    tech_stack text,
    process_discipline text,
    acquisition_channels text,
    tech_maturity public.tech_maturity,
    retention_strategy text,
    decision_bottlenecks text,
    team_alignment public.team_alignment,
    future_success text,
    benchmark_preferences text,
    funding_status public.funding_status,
    growth_pace public.growth_pace,
    unresolved_issue text,
    final_confirmation public.final_confirmation,
    business_priorities text,
    strategy_decision_method public.strategy_decision,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.business_reassessment OWNER TO postgres;

--
-- Name: TABLE business_reassessment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.business_reassessment IS 'This is a duplicate of onboarding_assessments';


--
-- Name: competitive_benchmarking_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.competitive_benchmarking_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.competitive_benchmarking_assessment OWNER TO postgres;

--
-- Name: customer_experience_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customer_experience_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.customer_experience_assessment OWNER TO postgres;

--
-- Name: digital_transformation_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.digital_transformation_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.digital_transformation_assessment OWNER TO postgres;

--
-- Name: email_subscriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_subscriptions (
    id integer NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    company text,
    title text,
    industry text,
    company_size text,
    revenue_range text,
    linkedin_url text,
    source text DEFAULT 'blog_newsletter'::text,
    status text DEFAULT 'active'::text,
    subscribed_at timestamp with time zone DEFAULT now(),
    unsubscribed_at timestamp with time zone,
    last_email_sent_at timestamp with time zone,
    email_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT email_subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'unsubscribed'::text, 'bounced'::text])))
);


ALTER TABLE public.email_subscriptions OWNER TO postgres;

--
-- Name: TABLE email_subscriptions; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.email_subscriptions IS 'Stores email newsletter subscriptions for "Stay Ahead of the Curve"';


--
-- Name: COLUMN email_subscriptions.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.email_subscriptions.email IS 'Unique email address of the subscriber';


--
-- Name: COLUMN email_subscriptions.source; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.email_subscriptions.source IS 'Where the subscription came from (blog_newsletter, homepage, etc.)';


--
-- Name: COLUMN email_subscriptions.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.email_subscriptions.status IS 'Current subscription status';


--
-- Name: COLUMN email_subscriptions.email_count; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.email_subscriptions.email_count IS 'Number of emails sent to this subscriber';


--
-- Name: email_subscription_analytics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.email_subscription_analytics AS
 SELECT date_trunc('day'::text, email_subscriptions.subscribed_at) AS signup_date,
    count(*) AS new_subscribers,
    count(
        CASE
            WHEN (email_subscriptions.status = 'active'::text) THEN 1
            ELSE NULL::integer
        END) AS active_subscribers,
    count(
        CASE
            WHEN (email_subscriptions.status = 'unsubscribed'::text) THEN 1
            ELSE NULL::integer
        END) AS unsubscribed_count,
    count(
        CASE
            WHEN (email_subscriptions.status = 'bounced'::text) THEN 1
            ELSE NULL::integer
        END) AS bounced_count
   FROM public.email_subscriptions
  GROUP BY (date_trunc('day'::text, email_subscriptions.subscribed_at))
  ORDER BY (date_trunc('day'::text, email_subscriptions.subscribed_at)) DESC;


ALTER TABLE public.email_subscription_analytics OWNER TO postgres;

--
-- Name: email_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.email_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.email_subscriptions_id_seq OWNER TO postgres;

--
-- Name: email_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.email_subscriptions_id_seq OWNED BY public.email_subscriptions.id;


--
-- Name: growth_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_assessment (
    u_id uuid NOT NULL,
    obstacles text,
    strategy text,
    process text,
    customers text,
    technology text,
    submittedat timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.growth_assessment OWNER TO postgres;

--
-- Name: TABLE growth_assessment; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_assessment IS 'User-specific growth assessment data with RLS enabled';


--
-- Name: growth_assessment_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_assessment_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid,
    obstacles text,
    strategy text,
    process text,
    customers text,
    technology text,
    submittedat timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    archived_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.growth_assessment_history OWNER TO postgres;

--
-- Name: TABLE growth_assessment_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_assessment_history IS 'User-specific assessment history with RLS enabled';


--
-- Name: growth_insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_insights (
    u_id uuid NOT NULL,
    strategy_score numeric,
    strategy_insight text,
    process_score numeric,
    process_insight text,
    technology_score numeric,
    technology_insight text,
    overall_score numeric,
    fallback_score_gpt numeric,
    generatedat timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.growth_insights OWNER TO postgres;

--
-- Name: TABLE growth_insights; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_insights IS 'User-specific growth insights data with RLS enabled';


--
-- Name: growth_insights_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_insights_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id text,
    strategy_score numeric,
    strategy_insight text,
    processscore numeric,
    process_insight text,
    technology_score numeric,
    technology_insight text,
    overall_score numeric,
    generatedat timestamp with time zone,
    archived_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.growth_insights_history OWNER TO postgres;

--
-- Name: TABLE growth_insights_history; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_insights_history IS 'User-specific insights history with RLS enabled';


--
-- Name: growth_lever_progress; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_lever_progress (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    lever_text text NOT NULL,
    is_completed boolean NOT NULL,
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.growth_lever_progress OWNER TO postgres;

--
-- Name: growth_levers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_levers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    levers text[],
    generated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.growth_levers OWNER TO postgres;

--
-- Name: growth_quadrant_data; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_quadrant_data (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    label text,
    strategy_score double precision,
    process_score double precision,
    technology_score double precision,
    overall_score double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.growth_quadrant_data OWNER TO postgres;

--
-- Name: TABLE growth_quadrant_data; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_quadrant_data IS 'Public quadrant data with user-specific write access';


--
-- Name: growth_simulations_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.growth_simulations_log (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    email text,
    strategyscore double precision,
    processscore double precision,
    technologyscore double precision,
    revenue double precision,
    costs double precision,
    efficiency double precision,
    revenueimpact double precision,
    costsavings double precision,
    efficiencygain double precision,
    createdat timestamp without time zone DEFAULT now()
);


ALTER TABLE public.growth_simulations_log OWNER TO postgres;

--
-- Name: TABLE growth_simulations_log; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.growth_simulations_log IS 'User-specific simulation logs with RLS enabled';


--
-- Name: industry_stock_symbols; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.industry_stock_symbols (
    id integer NOT NULL,
    industry text NOT NULL,
    symbol text NOT NULL,
    company_name text NOT NULL
);


ALTER TABLE public.industry_stock_symbols OWNER TO postgres;

--
-- Name: TABLE industry_stock_symbols; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.industry_stock_symbols IS 'Public read access: Contains public industry reference data accessible to all users';


--
-- Name: industry_stock_symbols_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.industry_stock_symbols_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.industry_stock_symbols_id_seq OWNER TO postgres;

--
-- Name: industry_stock_symbols_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.industry_stock_symbols_id_seq OWNED BY public.industry_stock_symbols.id;


--
-- Name: inspirational_quotes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inspirational_quotes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    quote text NOT NULL,
    author text,
    category text
);


ALTER TABLE public.inspirational_quotes OWNER TO postgres;

--
-- Name: leadership_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leadership_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.leadership_assessment OWNER TO postgres;

--
-- Name: leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leads (
    lead_id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    phone text,
    title text,
    company text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.leads OWNER TO postgres;

--
-- Name: marketing_effectiveness_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marketing_effectiveness_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.marketing_effectiveness_assessment OWNER TO postgres;

--
-- Name: notification_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notification_preferences (
    u_id uuid NOT NULL,
    high_priority boolean DEFAULT true,
    medium_priority boolean DEFAULT true,
    low_priority boolean DEFAULT true,
    email_notifications boolean DEFAULT true,
    in_app_notifications boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE public.notification_preferences OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    u_id uuid NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    priority text NOT NULL,
    link text,
    is_read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT notifications_priority_check CHECK ((priority = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: onboarding_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.onboarding_assessments (
    o_id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid,
    growth_metrics text,
    gtm_strategy text,
    friction_points text[],
    differentiator text,
    brand_perception text,
    tech_stack text,
    process_discipline text,
    acquisition_channels text,
    tech_maturity public.tech_maturity,
    retention_strategy text,
    decision_bottlenecks text,
    team_alignment public.team_alignment,
    future_success text,
    benchmark_preferences text,
    funding_status public.funding_status,
    growth_pace public.growth_pace,
    unresolved_issue text,
    final_confirmation public.final_confirmation,
    business_priorities text,
    strategy_decision_method public.strategy_decision,
    created_at timestamp with time zone DEFAULT now(),
    business_overview text
);


ALTER TABLE public.onboarding_assessments OWNER TO postgres;

--
-- Name: COLUMN onboarding_assessments.business_overview; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.onboarding_assessments.business_overview IS 'User-provided description of their business model, target audience, and value proposition';


--
-- Name: public_tables_overview; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.public_tables_overview AS
 SELECT pg_tables.schemaname,
    pg_tables.tablename,
    'Public Read Access'::text AS access_type,
    'RLS Disabled'::text AS security_status,
    'Anonymized/Reference Data'::text AS data_type
   FROM pg_tables
  WHERE ((pg_tables.tablename = ANY (ARRAY['realtime_market_trends'::name, 'realtime_business_trends'::name, 'realtime_marketing_playbook'::name, 'realtime_strategic_trends'::name, 'industry_stock_symbols'::name, 'scorecard_insights'::name])) AND (pg_tables.schemaname = 'public'::name))
UNION ALL
 SELECT 'public'::name AS schemaname,
    'user_specific_tables'::name AS tablename,
    'Restricted Access'::text AS access_type,
    'RLS Enabled'::text AS security_status,
    'User-specific data with RLS policies'::text AS data_type;


ALTER TABLE public.public_tables_overview OWNER TO postgres;

--
-- Name: realtime_business_trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realtime_business_trends (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    title text,
    industry text,
    insight text,
    source text,
    createdat timestamp with time zone DEFAULT now()
);


ALTER TABLE public.realtime_business_trends OWNER TO postgres;

--
-- Name: TABLE realtime_business_trends; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.realtime_business_trends IS 'Public read access: Contains anonymized business trend data accessible to all users';


--
-- Name: realtime_market_trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realtime_market_trends (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    insight text NOT NULL,
    source text,
    createdat timestamp with time zone DEFAULT timezone('utc'::text, now()),
    industry text
);


ALTER TABLE public.realtime_market_trends OWNER TO postgres;

--
-- Name: TABLE realtime_market_trends; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.realtime_market_trends IS 'Public read access: Contains anonymized market trend data accessible to all users';


--
-- Name: realtime_marketing_playbook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realtime_marketing_playbook (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text DEFAULT '🧠 Tactical Marketing Playbook'::text,
    insight text NOT NULL,
    source text DEFAULT 'GPT + Curated URLs'::text,
    createdat timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.realtime_marketing_playbook OWNER TO postgres;

--
-- Name: TABLE realtime_marketing_playbook; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.realtime_marketing_playbook IS 'Public read access: Contains anonymized marketing insights accessible to all users';


--
-- Name: realtime_strategic_trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.realtime_strategic_trends (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    source_urls text[],
    raw_input text,
    gpt_summary text,
    gpt_tags text[],
    archived boolean DEFAULT false
);


ALTER TABLE public.realtime_strategic_trends OWNER TO postgres;

--
-- Name: TABLE realtime_strategic_trends; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.realtime_strategic_trends IS 'Public read access: Contains anonymized strategic trend data accessible to all users';


--
-- Name: reassessment_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reassessment_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.reassessment_assessment OWNER TO postgres;

--
-- Name: sales_performance_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_performance_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.sales_performance_assessment OWNER TO postgres;

--
-- Name: score_ai_readiness; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_ai_readiness (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_ai_readiness OWNER TO postgres;

--
-- Name: score_bpm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_bpm (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    gmf_score double precision,
    bracket_key text,
    score double precision,
    answers jsonb,
    version text DEFAULT 'v1'::text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.score_bpm OWNER TO postgres;

--
-- Name: score_competitive_benchmarking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_competitive_benchmarking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_competitive_benchmarking OWNER TO postgres;

--
-- Name: score_customer_experience; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_customer_experience (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_customer_experience OWNER TO postgres;

--
-- Name: score_digital_transformation; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_digital_transformation (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_digital_transformation OWNER TO postgres;

--
-- Name: score_leadership; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_leadership (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_leadership OWNER TO postgres;

--
-- Name: score_marketing_effectiveness; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_marketing_effectiveness (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_marketing_effectiveness OWNER TO postgres;

--
-- Name: score_reassessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_reassessment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_reassessment OWNER TO postgres;

--
-- Name: score_sales_performance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_sales_performance (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    score numeric NOT NULL,
    gmf_score numeric,
    bracket_key text NOT NULL,
    answers jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.score_sales_performance OWNER TO postgres;

--
-- Name: score_strategic_maturity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_strategic_maturity (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    gmf_score double precision,
    bracket_key text,
    score double precision,
    answers jsonb,
    version text DEFAULT 'v1'::text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.score_strategic_maturity OWNER TO postgres;

--
-- Name: score_tech_stack; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.score_tech_stack (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    gmf_score double precision,
    bracket_key text,
    score double precision,
    answers jsonb,
    version text DEFAULT 'v1'::text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.score_tech_stack OWNER TO postgres;

--
-- Name: scorecard_insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scorecard_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    category text NOT NULL,
    score_min numeric NOT NULL,
    score_max numeric NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    benchmark text NOT NULL,
    focus_areas text[] NOT NULL,
    industry text
);


ALTER TABLE public.scorecard_insights OWNER TO postgres;

--
-- Name: TABLE scorecard_insights; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.scorecard_insights IS 'Public scorecard insights with admin management';


--
-- Name: strategic_maturity_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.strategic_maturity_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.strategic_maturity_assessment OWNER TO postgres;

--
-- Name: tech_stack_assessment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tech_stack_assessment (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    u_id uuid NOT NULL,
    answers jsonb NOT NULL,
    score numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.tech_stack_assessment OWNER TO postgres;

--
-- Name: tier2_dashboard_insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier2_dashboard_insights (
    insight_id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    strategy_score numeric,
    process_score numeric,
    technology_score numeric,
    overall_score numeric,
    "industryAvgScore" numeric,
    "topPerformerScore" numeric,
    benchmarking jsonb,
    strengths jsonb,
    weaknesses jsonb,
    roadmap jsonb,
    "chartData" jsonb,
    updated_at timestamp with time zone DEFAULT now(),
    industry text
);


ALTER TABLE public.tier2_dashboard_insights OWNER TO postgres;

--
-- Name: tier2_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier2_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    bpm_score numeric,
    bpm_last_taken timestamp without time zone DEFAULT '2025-03-01 00:00:00'::timestamp without time zone,
    tech_stack_score numeric,
    tech_stack_last_taken timestamp without time zone,
    strategic_maturity_score numeric,
    strategic_maturity_last_taken timestamp without time zone,
    marketing_score numeric,
    marketing_last_taken timestamp without time zone,
    sales_score numeric,
    sales_last_taken timestamp without time zone,
    cx_score numeric,
    cx_last_taken timestamp without time zone,
    ai_score numeric,
    ai_last_taken timestamp without time zone,
    digital_score numeric,
    digital_last_taken timestamp without time zone,
    leadership_score numeric,
    leadership_last_taken timestamp without time zone,
    benchmarking_score numeric,
    benchmarking_last_taken timestamp without time zone,
    reassessment_score numeric,
    reassessment_last_taken timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    overall_score numeric(3,1),
    strategy_score numeric(3,1),
    process_score numeric(3,1),
    technology_score numeric(3,1),
    base_score numeric,
    assessment_explanation_seen_at timestamp with time zone,
    dashboard_explanation_seen_at timestamp with time zone,
    growth_studio_explanation_seen_at timestamp with time zone,
    business_overview text
);


ALTER TABLE public.tier2_profiles OWNER TO postgres;

--
-- Name: COLUMN tier2_profiles.assessment_explanation_seen_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tier2_profiles.assessment_explanation_seen_at IS 'Timestamp when user first saw the assessment explanation popup';


--
-- Name: COLUMN tier2_profiles.dashboard_explanation_seen_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tier2_profiles.dashboard_explanation_seen_at IS 'Timestamp when user first saw the dashboard explanation popup';


--
-- Name: COLUMN tier2_profiles.growth_studio_explanation_seen_at; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tier2_profiles.growth_studio_explanation_seen_at IS 'Timestamp when user first saw the growth studio explanation popup';


--
-- Name: COLUMN tier2_profiles.business_overview; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tier2_profiles.business_overview IS 'User-provided description of their business model, target audience, and value proposition';


--
-- Name: tier2_simulation_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tier2_simulation_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    createdat timestamp with time zone DEFAULT timezone('utc'::text, now()),
    email text NOT NULL,
    strategychange numeric,
    processchange numeric,
    techchange numeric,
    revenue numeric,
    costs numeric,
    efficiency numeric,
    revenueimpact numeric,
    costsavings numeric,
    efficiencygain numeric
);


ALTER TABLE public.tier2_simulation_history OWNER TO postgres;

--
-- Name: trends; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trends (
    t_id uuid DEFAULT gen_random_uuid() NOT NULL,
    industry text NOT NULL,
    emergingtrends text NOT NULL,
    aiadoptionrate double precision,
    growthpotential double precision,
    impactscore double precision,
    collectedat timestamp without time zone DEFAULT now(),
    CONSTRAINT trends_aiadoptionrate_check CHECK (((aiadoptionrate >= (0)::double precision) AND (aiadoptionrate <= (1)::double precision))),
    CONSTRAINT trends_growthpotential_check CHECK (((growthpotential >= (0)::double precision) AND (growthpotential <= (1)::double precision))),
    CONSTRAINT trends_impactscore_check CHECK (((impactscore >= (0)::double precision) AND (impactscore <= (1)::double precision)))
);


ALTER TABLE public.trends OWNER TO postgres;

--
-- Name: trial_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trial_users (
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text,
    company text,
    title text,
    trial_start_date timestamp with time zone NOT NULL,
    trial_end_date timestamp with time zone NOT NULL,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    last_expiring_notification_3 text,
    last_expiring_notification_1 text,
    last_expiring_notification_0 text,
    CONSTRAINT trial_users_status_check CHECK ((status = ANY (ARRAY['active'::text, 'expired'::text, 'converted'::text, 'archived'::text])))
);


ALTER TABLE public.trial_users OWNER TO postgres;

--
-- Name: TABLE trial_users; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trial_users IS 'Stores trial user information for 30-day free trials';


--
-- Name: COLUMN trial_users.email; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.email IS 'Unique email address of the trial user';


--
-- Name: COLUMN trial_users.trial_start_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.trial_start_date IS 'When the trial period began';


--
-- Name: COLUMN trial_users.trial_end_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.trial_end_date IS 'When the trial period ends (30 days from start)';


--
-- Name: COLUMN trial_users.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.status IS 'Current trial status: active, expired, converted, or archived';


--
-- Name: COLUMN trial_users.last_expiring_notification_3; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.last_expiring_notification_3 IS 'Date when 3-day expiring notification was last sent (YYYY-MM-DD format)';


--
-- Name: COLUMN trial_users.last_expiring_notification_1; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.last_expiring_notification_1 IS 'Date when 1-day expiring notification was last sent (YYYY-MM-DD format)';


--
-- Name: COLUMN trial_users.last_expiring_notification_0; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trial_users.last_expiring_notification_0 IS 'Date when day-of expiring notification was last sent (YYYY-MM-DD format)';


--
-- Name: trial_user_analytics; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.trial_user_analytics AS
 SELECT date_trunc('day'::text, trial_users.created_at) AS signup_date,
    count(*) AS new_trials,
    count(
        CASE
            WHEN (trial_users.status = 'active'::text) THEN 1
            ELSE NULL::integer
        END) AS active_trials,
    count(
        CASE
            WHEN (trial_users.status = 'expired'::text) THEN 1
            ELSE NULL::integer
        END) AS expired_trials,
    count(
        CASE
            WHEN (trial_users.status = 'converted'::text) THEN 1
            ELSE NULL::integer
        END) AS converted_trials,
    round((((count(
        CASE
            WHEN (trial_users.status = 'converted'::text) THEN 1
            ELSE NULL::integer
        END))::numeric / (count(*))::numeric) * (100)::numeric), 2) AS conversion_rate
   FROM public.trial_users
  GROUP BY (date_trunc('day'::text, trial_users.created_at))
  ORDER BY (date_trunc('day'::text, trial_users.created_at)) DESC;


ALTER TABLE public.trial_user_analytics OWNER TO postgres;

--
-- Name: user_tech_stack; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tech_stack (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    crm_tools text[],
    esp_tools text[],
    analytics_tools text[],
    cdp_tools text[],
    erp_tools text[],
    commerce_tools text[],
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.user_tech_stack OWNER TO postgres;

--
-- Name: useractivity; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.useractivity (
    activity_id uuid DEFAULT gen_random_uuid() NOT NULL,
    u_id uuid,
    pagevisited text NOT NULL,
    action text NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.useractivity OWNER TO postgres;

--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: email_subscriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.email_subscriptions_id_seq'::regclass);


--
-- Name: industry_stock_symbols id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industry_stock_symbols ALTER COLUMN id SET DEFAULT nextval('public.industry_stock_symbols_id_seq'::regclass);


--
-- Name: ai_log ai_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_log
    ADD CONSTRAINT ai_log_pkey PRIMARY KEY (log_id);


--
-- Name: ai_readiness_assessment ai_readiness_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_readiness_assessment
    ADD CONSTRAINT ai_readiness_assessment_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: bpm_assessment bpm_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bpm_assessment
    ADD CONSTRAINT bpm_assessment_pkey PRIMARY KEY (id);


--
-- Name: bpm_assessment bpm_assessment_u_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bpm_assessment
    ADD CONSTRAINT bpm_assessment_u_id_unique UNIQUE (u_id);


--
-- Name: business_reassessment business_reassessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_reassessment
    ADD CONSTRAINT business_reassessment_pkey PRIMARY KEY (o_id);


--
-- Name: competitive_benchmarking_assessment competitive_benchmarking_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competitive_benchmarking_assessment
    ADD CONSTRAINT competitive_benchmarking_assessment_pkey PRIMARY KEY (id);


--
-- Name: customer_experience_assessment customer_experience_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_experience_assessment
    ADD CONSTRAINT customer_experience_assessment_pkey PRIMARY KEY (id);


--
-- Name: digital_transformation_assessment digital_transformation_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_transformation_assessment
    ADD CONSTRAINT digital_transformation_assessment_pkey PRIMARY KEY (id);


--
-- Name: email_subscriptions email_subscriptions_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_subscriptions
    ADD CONSTRAINT email_subscriptions_email_key UNIQUE (email);


--
-- Name: email_subscriptions email_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_subscriptions
    ADD CONSTRAINT email_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: growth_assessment_history growth_assessment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_assessment_history
    ADD CONSTRAINT growth_assessment_history_pkey PRIMARY KEY (id);


--
-- Name: growth_assessment growth_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_assessment
    ADD CONSTRAINT growth_assessment_pkey PRIMARY KEY (u_id);


--
-- Name: growth_insights_history growth_insights_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_insights_history
    ADD CONSTRAINT growth_insights_history_pkey PRIMARY KEY (id);


--
-- Name: growth_insights growth_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_insights
    ADD CONSTRAINT growth_insights_pkey PRIMARY KEY (u_id);


--
-- Name: growth_lever_progress growth_lever_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_lever_progress
    ADD CONSTRAINT growth_lever_progress_pkey PRIMARY KEY (id);


--
-- Name: growth_levers growth_levers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_levers
    ADD CONSTRAINT growth_levers_pkey PRIMARY KEY (id);


--
-- Name: growth_quadrant_data growth_quadrant_data_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_quadrant_data
    ADD CONSTRAINT growth_quadrant_data_pkey PRIMARY KEY (id);


--
-- Name: growth_simulations_log growth_simulations_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_simulations_log
    ADD CONSTRAINT growth_simulations_log_pkey PRIMARY KEY (id);


--
-- Name: industry_stock_symbols industry_stock_symbols_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.industry_stock_symbols
    ADD CONSTRAINT industry_stock_symbols_pkey PRIMARY KEY (id);


--
-- Name: inspirational_quotes inspirational_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inspirational_quotes
    ADD CONSTRAINT inspirational_quotes_pkey PRIMARY KEY (id);


--
-- Name: leadership_assessment leadership_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leadership_assessment
    ADD CONSTRAINT leadership_assessment_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (lead_id);


--
-- Name: realtime_market_trends market_trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_market_trends
    ADD CONSTRAINT market_trends_pkey PRIMARY KEY (id);


--
-- Name: marketing_effectiveness_assessment marketing_effectiveness_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing_effectiveness_assessment
    ADD CONSTRAINT marketing_effectiveness_assessment_pkey PRIMARY KEY (id);


--
-- Name: notification_preferences notification_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_pkey PRIMARY KEY (u_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: onboarding_assessments onboarding_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_assessments
    ADD CONSTRAINT onboarding_assessments_pkey PRIMARY KEY (o_id);


--
-- Name: realtime_business_trends realtime_business_trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_business_trends
    ADD CONSTRAINT realtime_business_trends_pkey PRIMARY KEY (id);


--
-- Name: realtime_marketing_playbook realtime_marketing_playbook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_marketing_playbook
    ADD CONSTRAINT realtime_marketing_playbook_pkey PRIMARY KEY (id);


--
-- Name: realtime_strategic_trends realtime_strategic_trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.realtime_strategic_trends
    ADD CONSTRAINT realtime_strategic_trends_pkey PRIMARY KEY (id);


--
-- Name: reassessment_assessment reassessment_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reassessment_assessment
    ADD CONSTRAINT reassessment_assessment_pkey PRIMARY KEY (id);


--
-- Name: sales_performance_assessment sales_performance_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_performance_assessment
    ADD CONSTRAINT sales_performance_assessment_pkey PRIMARY KEY (id);


--
-- Name: score_ai_readiness score_ai_readiness_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_ai_readiness
    ADD CONSTRAINT score_ai_readiness_pkey PRIMARY KEY (id);


--
-- Name: score_ai_readiness score_ai_readiness_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_ai_readiness
    ADD CONSTRAINT score_ai_readiness_u_id_key UNIQUE (u_id);


--
-- Name: score_bpm score_bpm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_bpm
    ADD CONSTRAINT score_bpm_pkey PRIMARY KEY (id);


--
-- Name: score_bpm score_bpm_u_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_bpm
    ADD CONSTRAINT score_bpm_u_id_unique UNIQUE (u_id);


--
-- Name: score_competitive_benchmarking score_competitive_benchmarking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_competitive_benchmarking
    ADD CONSTRAINT score_competitive_benchmarking_pkey PRIMARY KEY (id);


--
-- Name: score_competitive_benchmarking score_competitive_benchmarking_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_competitive_benchmarking
    ADD CONSTRAINT score_competitive_benchmarking_u_id_key UNIQUE (u_id);


--
-- Name: score_customer_experience score_customer_experience_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_customer_experience
    ADD CONSTRAINT score_customer_experience_pkey PRIMARY KEY (id);


--
-- Name: score_customer_experience score_customer_experience_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_customer_experience
    ADD CONSTRAINT score_customer_experience_u_id_key UNIQUE (u_id);


--
-- Name: score_digital_transformation score_digital_transformation_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_digital_transformation
    ADD CONSTRAINT score_digital_transformation_pkey PRIMARY KEY (id);


--
-- Name: score_digital_transformation score_digital_transformation_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_digital_transformation
    ADD CONSTRAINT score_digital_transformation_u_id_key UNIQUE (u_id);


--
-- Name: score_leadership score_leadership_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_leadership
    ADD CONSTRAINT score_leadership_pkey PRIMARY KEY (id);


--
-- Name: score_leadership score_leadership_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_leadership
    ADD CONSTRAINT score_leadership_u_id_key UNIQUE (u_id);


--
-- Name: score_marketing_effectiveness score_marketing_effectiveness_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_marketing_effectiveness
    ADD CONSTRAINT score_marketing_effectiveness_pkey PRIMARY KEY (id);


--
-- Name: score_marketing_effectiveness score_marketing_effectiveness_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_marketing_effectiveness
    ADD CONSTRAINT score_marketing_effectiveness_u_id_key UNIQUE (u_id);


--
-- Name: score_reassessment score_reassessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_reassessment
    ADD CONSTRAINT score_reassessment_pkey PRIMARY KEY (id);


--
-- Name: score_reassessment score_reassessment_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_reassessment
    ADD CONSTRAINT score_reassessment_u_id_key UNIQUE (u_id);


--
-- Name: score_sales_performance score_sales_performance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_sales_performance
    ADD CONSTRAINT score_sales_performance_pkey PRIMARY KEY (id);


--
-- Name: score_sales_performance score_sales_performance_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_sales_performance
    ADD CONSTRAINT score_sales_performance_u_id_key UNIQUE (u_id);


--
-- Name: score_strategic_maturity score_strategic_maturity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_strategic_maturity
    ADD CONSTRAINT score_strategic_maturity_pkey PRIMARY KEY (id);


--
-- Name: score_strategic_maturity score_strategic_maturity_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_strategic_maturity
    ADD CONSTRAINT score_strategic_maturity_u_id_key UNIQUE (u_id);


--
-- Name: score_tech_stack score_tech_stack_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_tech_stack
    ADD CONSTRAINT score_tech_stack_pkey PRIMARY KEY (id);


--
-- Name: score_tech_stack score_tech_stack_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.score_tech_stack
    ADD CONSTRAINT score_tech_stack_u_id_key UNIQUE (u_id);


--
-- Name: scorecard_insights scorecard_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scorecard_insights
    ADD CONSTRAINT scorecard_insights_pkey PRIMARY KEY (id);


--
-- Name: strategic_maturity_assessment strategic_maturity_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.strategic_maturity_assessment
    ADD CONSTRAINT strategic_maturity_assessment_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (sub_id);


--
-- Name: subscriptions subscriptions_u_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_u_id_unique UNIQUE (u_id);


--
-- Name: tech_stack_assessment tehc_stack_assessment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tech_stack_assessment
    ADD CONSTRAINT tehc_stack_assessment_pkey PRIMARY KEY (id);


--
-- Name: tier2_dashboard_insights tier2_dashboard_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_dashboard_insights
    ADD CONSTRAINT tier2_dashboard_insights_pkey PRIMARY KEY (insight_id);


--
-- Name: tier2_dashboard_insights tier2_dashboard_insights_u_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_dashboard_insights
    ADD CONSTRAINT tier2_dashboard_insights_u_id_key UNIQUE (u_id);


--
-- Name: tier2_profiles tier2_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_profiles
    ADD CONSTRAINT tier2_profiles_pkey PRIMARY KEY (id, u_id);


--
-- Name: tier2_profiles tier2_profiles_u_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_profiles
    ADD CONSTRAINT tier2_profiles_u_id_unique UNIQUE (u_id);


--
-- Name: tier2_simulation_history tier2_simulation_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_simulation_history
    ADD CONSTRAINT tier2_simulation_history_pkey PRIMARY KEY (id);


--
-- Name: tier2_users tier2_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_users
    ADD CONSTRAINT tier2_users_email_key UNIQUE (email);


--
-- Name: tier2_users tier2_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_users
    ADD CONSTRAINT tier2_users_pkey PRIMARY KEY (u_id);


--
-- Name: trends trends_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trends
    ADD CONSTRAINT trends_pkey PRIMARY KEY (t_id);


--
-- Name: trial_users trial_users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trial_users
    ADD CONSTRAINT trial_users_email_key UNIQUE (email);


--
-- Name: trial_users trial_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trial_users
    ADD CONSTRAINT trial_users_pkey PRIMARY KEY (id);


--
-- Name: growth_users unique_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: growth_lever_progress unique_lever_per_user; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_lever_progress
    ADD CONSTRAINT unique_lever_per_user UNIQUE (u_id, lever_text);


--
-- Name: subscriptions unique_user_subscription; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT unique_user_subscription UNIQUE (u_id);


--
-- Name: user_tech_stack user_tech_stack_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tech_stack
    ADD CONSTRAINT user_tech_stack_pkey PRIMARY KEY (id);


--
-- Name: useractivity useractivity_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.useractivity
    ADD CONSTRAINT useractivity_pkey PRIMARY KEY (activity_id);


--
-- Name: growth_users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: growth_users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_users
    ADD CONSTRAINT users_pkey PRIMARY KEY (u_id);


--
-- Name: idx_audit_log_operation; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_operation ON public.audit_log USING btree (operation);


--
-- Name: idx_audit_log_table_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_table_name ON public.audit_log USING btree (table_name);


--
-- Name: idx_audit_log_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_timestamp ON public.audit_log USING btree ("timestamp");


--
-- Name: idx_audit_log_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_log_user_id ON public.audit_log USING btree (user_id);


--
-- Name: idx_bpm_assessment_uid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bpm_assessment_uid ON public.bpm_assessment USING btree (u_id);


--
-- Name: idx_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_category ON public.inspirational_quotes USING btree (category);


--
-- Name: idx_email_subscriptions_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_subscriptions_email ON public.email_subscriptions USING btree (email);


--
-- Name: idx_email_subscriptions_source; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_subscriptions_source ON public.email_subscriptions USING btree (source);


--
-- Name: idx_email_subscriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_subscriptions_status ON public.email_subscriptions USING btree (status);


--
-- Name: idx_email_subscriptions_subscribed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_email_subscriptions_subscribed_at ON public.email_subscriptions USING btree (subscribed_at);


--
-- Name: idx_score_bpm_uid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_score_bpm_uid ON public.score_bpm USING btree (u_id);


--
-- Name: idx_subscriptions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_status ON public.subscriptions USING btree (status);


--
-- Name: idx_subscriptions_u_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subscriptions_u_id ON public.subscriptions USING btree (u_id);


--
-- Name: idx_trial_users_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trial_users_created_at ON public.trial_users USING btree (created_at);


--
-- Name: idx_trial_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trial_users_email ON public.trial_users USING btree (email);


--
-- Name: idx_trial_users_notification_tracking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trial_users_notification_tracking ON public.trial_users USING btree (last_expiring_notification_3, last_expiring_notification_1, last_expiring_notification_0);


--
-- Name: idx_trial_users_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trial_users_status ON public.trial_users USING btree (status);


--
-- Name: idx_trial_users_trial_end_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_trial_users_trial_end_date ON public.trial_users USING btree (trial_end_date);


--
-- Name: leadership_assessment_u_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX leadership_assessment_u_id_idx ON public.leadership_assessment USING btree (u_id);


--
-- Name: leads_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX leads_email_idx ON public.leads USING btree (email);


--
-- Name: notifications_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_created_at_idx ON public.notifications USING btree (created_at);


--
-- Name: notifications_is_read_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_is_read_idx ON public.notifications USING btree (is_read);


--
-- Name: notifications_u_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_u_id_idx ON public.notifications USING btree (u_id);


--
-- Name: score_strategic_maturity_u_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX score_strategic_maturity_u_id_idx ON public.score_strategic_maturity USING btree (u_id);


--
-- Name: score_tech_stack_u_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX score_tech_stack_u_id_idx ON public.score_tech_stack USING btree (u_id);


--
-- Name: unique_sales_performance_uid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX unique_sales_performance_uid ON public.sales_performance_assessment USING btree (u_id);


--
-- Name: user_tech_stack_uid_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX user_tech_stack_uid_idx ON public.user_tech_stack USING btree (u_id);


--
-- Name: tier2_users audit_tier2_users_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER audit_tier2_users_trigger AFTER INSERT OR DELETE OR UPDATE ON public.tier2_users FOR EACH ROW EXECUTE FUNCTION public.audit_tier2_users();


--
-- Name: growth_assessment trigger_archive_growth_assessment; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_archive_growth_assessment AFTER INSERT OR UPDATE ON public.growth_assessment FOR EACH ROW EXECUTE FUNCTION public.archive_growth_assessment();


--
-- Name: sales_performance_assessment trigger_update_sales_performance_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trigger_update_sales_performance_updated_at BEFORE UPDATE ON public.sales_performance_assessment FOR EACH ROW EXECUTE FUNCTION public.update_sales_performance_updated_at();


--
-- Name: email_subscriptions update_email_subscriptions_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_email_subscriptions_updated_at_trigger BEFORE UPDATE ON public.email_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_email_subscriptions_updated_at();


--
-- Name: trial_users update_trial_users_updated_at_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_trial_users_updated_at_trigger BEFORE UPDATE ON public.trial_users FOR EACH ROW EXECUTE FUNCTION public.update_trial_users_updated_at();


--
-- Name: ai_log ai_log_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_log
    ADD CONSTRAINT ai_log_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.growth_users(u_id) ON DELETE CASCADE;


--
-- Name: business_reassessment business_reassessment_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_reassessment
    ADD CONSTRAINT business_reassessment_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.tier2_users(u_id);


--
-- Name: business_reassessment business_reassessment_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.business_reassessment
    ADD CONSTRAINT business_reassessment_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.tier2_users(u_id);


--
-- Name: competitive_benchmarking_assessment competitive_benchmarking_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.competitive_benchmarking_assessment
    ADD CONSTRAINT competitive_benchmarking_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: customer_experience_assessment customer_experience_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customer_experience_assessment
    ADD CONSTRAINT customer_experience_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: digital_transformation_assessment digital_transformation_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.digital_transformation_assessment
    ADD CONSTRAINT digital_transformation_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: growth_assessment growth_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.growth_assessment
    ADD CONSTRAINT growth_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.growth_users(u_id) ON DELETE CASCADE;


--
-- Name: leadership_assessment leadership_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leadership_assessment
    ADD CONSTRAINT leadership_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: marketing_effectiveness_assessment marketing_effectiveness_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marketing_effectiveness_assessment
    ADD CONSTRAINT marketing_effectiveness_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: notification_preferences notification_preferences_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notification_preferences
    ADD CONSTRAINT notification_preferences_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: notifications notifications_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: onboarding_assessments onboarding_assessments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_assessments
    ADD CONSTRAINT onboarding_assessments_user_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id);


--
-- Name: onboarding_assessments onboarding_assessments_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.onboarding_assessments
    ADD CONSTRAINT onboarding_assessments_user_id_fkey1 FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id);


--
-- Name: reassessment_assessment reassessment_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reassessment_assessment
    ADD CONSTRAINT reassessment_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: sales_performance_assessment sales_performance_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_performance_assessment
    ADD CONSTRAINT sales_performance_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: strategic_maturity_assessment strategic_maturity_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.strategic_maturity_assessment
    ADD CONSTRAINT strategic_maturity_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: subscriptions subscriptions_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tech_stack_assessment tehc_stack_assessment_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tech_stack_assessment
    ADD CONSTRAINT tehc_stack_assessment_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON DELETE CASCADE;


--
-- Name: tier2_dashboard_insights tier2_dashboard_insights_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tier2_dashboard_insights
    ADD CONSTRAINT tier2_dashboard_insights_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.tier2_users(u_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: useractivity useractivity_u_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.useractivity
    ADD CONSTRAINT useractivity_u_id_fkey FOREIGN KEY (u_id) REFERENCES public.growth_users(u_id) ON DELETE CASCADE;


--
-- Name: ai_log Admins can access all AI logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all AI logs" ON public.ai_log USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_assessment_history Admins can access all assessment history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessment history" ON public.growth_assessment_history USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: ai_readiness_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.ai_readiness_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: bpm_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.bpm_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: competitive_benchmarking_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.competitive_benchmarking_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: customer_experience_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.customer_experience_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: digital_transformation_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.digital_transformation_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: leadership_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.leadership_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: marketing_effectiveness_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.marketing_effectiveness_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: reassessment_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.reassessment_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: sales_performance_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.sales_performance_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: strategic_maturity_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.strategic_maturity_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: tech_stack_assessment Admins can access all assessments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all assessments" ON public.tech_stack_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: business_reassessment Admins can access all business reassessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all business reassessment" ON public.business_reassessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: tier2_dashboard_insights Admins can access all dashboard insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all dashboard insights" ON public.tier2_dashboard_insights USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: email_subscriptions Admins can access all email subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all email subscriptions" ON public.email_subscriptions USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_assessment Admins can access all growth assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all growth assessment" ON public.growth_assessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_insights Admins can access all growth insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all growth insights" ON public.growth_insights USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_users Admins can access all growth users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all growth users" ON public.growth_users USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_insights_history Admins can access all insights history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all insights history" ON public.growth_insights_history USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_lever_progress Admins can access all lever progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all lever progress" ON public.growth_lever_progress USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_levers Admins can access all levers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all levers" ON public.growth_levers USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: notification_preferences Admins can access all notification preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all notification preferences" ON public.notification_preferences USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: notifications Admins can access all notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all notifications" ON public.notifications USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: onboarding_assessments Admins can access all onboarding; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all onboarding" ON public.onboarding_assessments USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: tier2_profiles Admins can access all profiles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all profiles" ON public.tier2_profiles USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_ai_readiness Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_ai_readiness USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_bpm Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_bpm USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_competitive_benchmarking Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_competitive_benchmarking USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_customer_experience Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_customer_experience USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_digital_transformation Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_digital_transformation USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_leadership Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_leadership USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_marketing_effectiveness Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_marketing_effectiveness USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_reassessment Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_reassessment USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_sales_performance Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_sales_performance USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_strategic_maturity Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_strategic_maturity USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: score_tech_stack Admins can access all scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all scores" ON public.score_tech_stack USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: tier2_simulation_history Admins can access all simulation history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all simulation history" ON public.tier2_simulation_history USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: growth_simulations_log Admins can access all simulation logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all simulation logs" ON public.growth_simulations_log USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: subscriptions Admins can access all subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all subscriptions" ON public.subscriptions USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: user_tech_stack Admins can access all tech stacks; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all tech stacks" ON public.user_tech_stack USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: tier2_users Admins can access all tier2_users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all tier2_users" ON public.tier2_users USING (((((current_setting('request.jwt.claims'::text, true))::jsonb ->> 'role'::text) = 'admin'::text) OR (auth.uid() = u_id)));


--
-- Name: trial_users Admins can access all trial users; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all trial users" ON public.trial_users USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: useractivity Admins can access all user activity; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can access all user activity" ON public.useractivity USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: scorecard_insights Admins can manage scorecard insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins can manage scorecard insights" ON public.scorecard_insights USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: email_subscriptions Allow public newsletter signups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Allow public newsletter signups" ON public.email_subscriptions FOR INSERT WITH CHECK (true);


--
-- Name: ai_log Insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Insert" ON public.ai_log FOR INSERT WITH CHECK (true);


--
-- Name: audit_log Only admins can read audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only admins can read audit logs" ON public.audit_log FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.tier2_users
  WHERE ((tier2_users.u_id = auth.uid()) AND (tier2_users.role = 'admin'::text)))));


--
-- Name: scorecard_insights Public can read scorecard insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Public can read scorecard insights" ON public.scorecard_insights FOR SELECT USING (true);


--
-- Name: audit_log System can insert audit logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "System can insert audit logs" ON public.audit_log FOR INSERT WITH CHECK (true);


--
-- Name: trial_users Trial users can view own record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Trial users can view own record" ON public.trial_users FOR SELECT USING ((email = ((current_setting('request.headers'::text, true))::json ->> 'x-user-email'::text)));


--
-- Name: ai_readiness_assessment Users can access their own AI readiness assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own AI readiness assessment" ON public.ai_readiness_assessment USING ((auth.uid() = u_id));


--
-- Name: bpm_assessment Users can access their own BPM assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own BPM assessment" ON public.bpm_assessment USING ((auth.uid() = u_id));


--
-- Name: growth_assessment_history Users can access their own assessment history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own assessment history" ON public.growth_assessment_history USING ((auth.uid() = u_id));


--
-- Name: competitive_benchmarking_assessment Users can access their own competitive benchmarking assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own competitive benchmarking assessment" ON public.competitive_benchmarking_assessment USING ((auth.uid() = u_id));


--
-- Name: customer_experience_assessment Users can access their own customer experience assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own customer experience assessment" ON public.customer_experience_assessment USING ((auth.uid() = u_id));


--
-- Name: tier2_dashboard_insights Users can access their own dashboard insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own dashboard insights" ON public.tier2_dashboard_insights USING ((auth.uid() = u_id));


--
-- Name: digital_transformation_assessment Users can access their own digital transformation assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own digital transformation assessment" ON public.digital_transformation_assessment USING ((auth.uid() = u_id));


--
-- Name: growth_assessment Users can access their own growth assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own growth assessment" ON public.growth_assessment USING ((auth.uid() = u_id));


--
-- Name: growth_insights Users can access their own growth insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own growth insights" ON public.growth_insights USING ((auth.uid() = u_id));


--
-- Name: growth_users Users can access their own growth user profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own growth user profile" ON public.growth_users USING ((auth.uid() = u_id));


--
-- Name: growth_insights_history Users can access their own insights history; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own insights history" ON public.growth_insights_history USING (((auth.uid())::text = u_id));


--
-- Name: leadership_assessment Users can access their own leadership assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own leadership assessment" ON public.leadership_assessment USING ((auth.uid() = u_id));


--
-- Name: growth_lever_progress Users can access their own lever progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own lever progress" ON public.growth_lever_progress USING ((auth.uid() = u_id));


--
-- Name: growth_levers Users can access their own levers; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own levers" ON public.growth_levers USING ((auth.uid() = u_id));


--
-- Name: marketing_effectiveness_assessment Users can access their own marketing effectiveness assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own marketing effectiveness assessment" ON public.marketing_effectiveness_assessment USING ((auth.uid() = u_id));


--
-- Name: notification_preferences Users can access their own notification preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own notification preferences" ON public.notification_preferences USING ((auth.uid() = u_id));


--
-- Name: notifications Users can access their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own notifications" ON public.notifications USING ((auth.uid() = u_id));


--
-- Name: onboarding_assessments Users can access their own onboarding; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own onboarding" ON public.onboarding_assessments USING ((auth.uid() = u_id));


--
-- Name: tier2_profiles Users can access their own profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own profile" ON public.tier2_profiles USING ((auth.uid() = u_id));


--
-- Name: reassessment_assessment Users can access their own reassessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own reassessment" ON public.reassessment_assessment USING ((auth.uid() = u_id));


--
-- Name: tier2_users Users can access their own record; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own record" ON public.tier2_users FOR SELECT USING ((auth.uid() = u_id));


--
-- Name: sales_performance_assessment Users can access their own sales performance assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own sales performance assessment" ON public.sales_performance_assessment USING ((auth.uid() = u_id));


--
-- Name: score_ai_readiness Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_ai_readiness USING ((auth.uid() = u_id));


--
-- Name: score_bpm Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_bpm USING ((auth.uid() = u_id));


--
-- Name: score_competitive_benchmarking Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_competitive_benchmarking USING ((auth.uid() = u_id));


--
-- Name: score_customer_experience Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_customer_experience USING ((auth.uid() = u_id));


--
-- Name: score_digital_transformation Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_digital_transformation USING ((auth.uid() = u_id));


--
-- Name: score_leadership Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_leadership USING ((auth.uid() = u_id));


--
-- Name: score_marketing_effectiveness Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_marketing_effectiveness USING ((auth.uid() = u_id));


--
-- Name: score_reassessment Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_reassessment USING ((auth.uid() = u_id));


--
-- Name: score_sales_performance Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_sales_performance USING ((auth.uid() = u_id));


--
-- Name: score_strategic_maturity Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_strategic_maturity USING ((auth.uid() = u_id));


--
-- Name: score_tech_stack Users can access their own scores; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own scores" ON public.score_tech_stack USING ((auth.uid() = u_id));


--
-- Name: strategic_maturity_assessment Users can access their own strategic maturity assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own strategic maturity assessment" ON public.strategic_maturity_assessment USING ((auth.uid() = u_id));


--
-- Name: subscriptions Users can access their own subscriptions; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own subscriptions" ON public.subscriptions USING ((auth.uid() = u_id));


--
-- Name: user_tech_stack Users can access their own tech stack; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own tech stack" ON public.user_tech_stack USING ((auth.uid() = u_id));


--
-- Name: tech_stack_assessment Users can access their own tech stack assessment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own tech stack assessment" ON public.tech_stack_assessment USING ((auth.uid() = u_id));


--
-- Name: tier2_users Users can access their own tier2 profile; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can access their own tier2 profile" ON public.tier2_users USING ((auth.uid() = u_id));


--
-- Name: growth_lever_progress Users can insert their lever progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can insert their lever progress" ON public.growth_lever_progress FOR INSERT WITH CHECK ((auth.uid() = u_id));


--
-- Name: growth_lever_progress Users can read their lever progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can read their lever progress" ON public.growth_lever_progress FOR SELECT USING ((auth.uid() = u_id));


--
-- Name: email_subscriptions Users can update own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update own subscription" ON public.email_subscriptions FOR UPDATE USING (((email = ((current_setting('request.headers'::text, true))::json ->> 'x-user-email'::text)) OR (auth.uid() IS NOT NULL)));


--
-- Name: growth_lever_progress Users can update their lever progress; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their lever progress" ON public.growth_lever_progress FOR UPDATE USING ((auth.uid() = u_id));


--
-- Name: notification_preferences Users can update their own notification preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences FOR UPDATE USING ((auth.uid() = u_id));


--
-- Name: notifications Users can update their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = u_id));


--
-- Name: email_subscriptions Users can view own subscription; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view own subscription" ON public.email_subscriptions FOR SELECT USING (((email = ((current_setting('request.headers'::text, true))::json ->> 'x-user-email'::text)) OR (auth.uid() IS NOT NULL)));


--
-- Name: notification_preferences Users can view their own notification preferences; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences FOR SELECT USING ((auth.uid() = u_id));


--
-- Name: notifications Users can view their own notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = u_id));


--
-- Name: ai_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ai_log ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_readiness_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ai_readiness_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_log; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: bpm_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.bpm_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: business_reassessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.business_reassessment ENABLE ROW LEVEL SECURITY;

--
-- Name: competitive_benchmarking_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.competitive_benchmarking_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: customer_experience_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.customer_experience_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: digital_transformation_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.digital_transformation_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: email_subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.email_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_assessment_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_assessment_history ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_insights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_insights_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_insights_history ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_lever_progress; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_lever_progress ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_levers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_levers ENABLE ROW LEVEL SECURITY;

--
-- Name: growth_users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.growth_users ENABLE ROW LEVEL SECURITY;

--
-- Name: onboarding_assessments insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY insert ON public.onboarding_assessments FOR INSERT WITH CHECK (true);


--
-- Name: tier2_users insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY insert ON public.tier2_users FOR INSERT WITH CHECK (true);


--
-- Name: trends insert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY insert ON public.trends FOR INSERT WITH CHECK (true);


--
-- Name: business_reassessment instert; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY instert ON public.business_reassessment FOR INSERT WITH CHECK (true);


--
-- Name: leadership_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.leadership_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: marketing_effectiveness_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.marketing_effectiveness_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: notification_preferences; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: onboarding_assessments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.onboarding_assessments ENABLE ROW LEVEL SECURITY;

--
-- Name: reassessment_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.reassessment_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: sales_performance_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sales_performance_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: score_ai_readiness; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_ai_readiness ENABLE ROW LEVEL SECURITY;

--
-- Name: score_bpm; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_bpm ENABLE ROW LEVEL SECURITY;

--
-- Name: score_competitive_benchmarking; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_competitive_benchmarking ENABLE ROW LEVEL SECURITY;

--
-- Name: score_customer_experience; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_customer_experience ENABLE ROW LEVEL SECURITY;

--
-- Name: score_digital_transformation; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_digital_transformation ENABLE ROW LEVEL SECURITY;

--
-- Name: score_leadership; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_leadership ENABLE ROW LEVEL SECURITY;

--
-- Name: score_marketing_effectiveness; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_marketing_effectiveness ENABLE ROW LEVEL SECURITY;

--
-- Name: score_reassessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_reassessment ENABLE ROW LEVEL SECURITY;

--
-- Name: score_sales_performance; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_sales_performance ENABLE ROW LEVEL SECURITY;

--
-- Name: score_strategic_maturity; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_strategic_maturity ENABLE ROW LEVEL SECURITY;

--
-- Name: score_tech_stack; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.score_tech_stack ENABLE ROW LEVEL SECURITY;

--
-- Name: scorecard_insights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.scorecard_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: ai_log select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.ai_log FOR SELECT USING (true);


--
-- Name: business_reassessment select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.business_reassessment FOR SELECT USING (true);


--
-- Name: onboarding_assessments select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.onboarding_assessments FOR SELECT USING (true);


--
-- Name: tier2_users select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.tier2_users FOR SELECT USING (true);


--
-- Name: trends select; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "select" ON public.trends FOR SELECT USING (true);


--
-- Name: strategic_maturity_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.strategic_maturity_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: subscriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: tech_stack_assessment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tech_stack_assessment ENABLE ROW LEVEL SECURITY;

--
-- Name: tier2_dashboard_insights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tier2_dashboard_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: tier2_profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tier2_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: tier2_simulation_history; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tier2_simulation_history ENABLE ROW LEVEL SECURITY;

--
-- Name: tier2_users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tier2_users ENABLE ROW LEVEL SECURITY;

--
-- Name: trends; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;

--
-- Name: trial_users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trial_users ENABLE ROW LEVEL SECURITY;

--
-- Name: user_tech_stack; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_tech_stack ENABLE ROW LEVEL SECURITY;

--
-- Name: useractivity; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.useractivity ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION archive_growth_assessment(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.archive_growth_assessment() TO anon;
GRANT ALL ON FUNCTION public.archive_growth_assessment() TO authenticated;
GRANT ALL ON FUNCTION public.archive_growth_assessment() TO service_role;


--
-- Name: FUNCTION archive_growth_insights(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.archive_growth_insights() TO anon;
GRANT ALL ON FUNCTION public.archive_growth_insights() TO authenticated;
GRANT ALL ON FUNCTION public.archive_growth_insights() TO service_role;


--
-- Name: FUNCTION audit_tier2_users(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.audit_tier2_users() TO anon;
GRANT ALL ON FUNCTION public.audit_tier2_users() TO authenticated;
GRANT ALL ON FUNCTION public.audit_tier2_users() TO service_role;


--
-- Name: FUNCTION get_email_subscription_count(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_email_subscription_count() TO anon;
GRANT ALL ON FUNCTION public.get_email_subscription_count() TO authenticated;
GRANT ALL ON FUNCTION public.get_email_subscription_count() TO service_role;


--
-- Name: FUNCTION get_random_quote(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_random_quote() TO anon;
GRANT ALL ON FUNCTION public.get_random_quote() TO authenticated;
GRANT ALL ON FUNCTION public.get_random_quote() TO service_role;


--
-- Name: FUNCTION log_assessment_history(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_assessment_history() TO anon;
GRANT ALL ON FUNCTION public.log_assessment_history() TO authenticated;
GRANT ALL ON FUNCTION public.log_assessment_history() TO service_role;


--
-- Name: FUNCTION log_audit_event(p_table_name text, p_operation text, p_record_id uuid, p_old_values jsonb, p_new_values jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_record_id uuid, p_old_values jsonb, p_new_values jsonb) TO anon;
GRANT ALL ON FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_record_id uuid, p_old_values jsonb, p_new_values jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.log_audit_event(p_table_name text, p_operation text, p_record_id uuid, p_old_values jsonb, p_new_values jsonb) TO service_role;


--
-- Name: FUNCTION log_insights_history(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.log_insights_history() TO anon;
GRANT ALL ON FUNCTION public.log_insights_history() TO authenticated;
GRANT ALL ON FUNCTION public.log_insights_history() TO service_role;


--
-- Name: FUNCTION update_email_subscriptions_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_email_subscriptions_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_email_subscriptions_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_email_subscriptions_updated_at() TO service_role;


--
-- Name: FUNCTION update_sales_performance_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_sales_performance_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_sales_performance_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_sales_performance_updated_at() TO service_role;


--
-- Name: FUNCTION update_trial_users_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_trial_users_updated_at() TO anon;
GRANT ALL ON FUNCTION public.update_trial_users_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.update_trial_users_updated_at() TO service_role;


--
-- Name: FUNCTION update_updated_at_column(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_updated_at_column() TO anon;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO authenticated;
GRANT ALL ON FUNCTION public.update_updated_at_column() TO service_role;


--
-- Name: TABLE audit_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_log TO anon;
GRANT ALL ON TABLE public.audit_log TO authenticated;
GRANT ALL ON TABLE public.audit_log TO service_role;


--
-- Name: TABLE growth_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_users TO anon;
GRANT ALL ON TABLE public.growth_users TO authenticated;
GRANT ALL ON TABLE public.growth_users TO service_role;


--
-- Name: TABLE subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subscriptions TO anon;
GRANT ALL ON TABLE public.subscriptions TO authenticated;
GRANT ALL ON TABLE public.subscriptions TO service_role;


--
-- Name: TABLE tier2_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tier2_users TO anon;
GRANT ALL ON TABLE public.tier2_users TO authenticated;
GRANT ALL ON TABLE public.tier2_users TO service_role;


--
-- Name: TABLE admin_dashboard; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.admin_dashboard TO anon;
GRANT ALL ON TABLE public.admin_dashboard TO authenticated;
GRANT ALL ON TABLE public.admin_dashboard TO service_role;


--
-- Name: TABLE ai_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_log TO anon;
GRANT ALL ON TABLE public.ai_log TO authenticated;
GRANT ALL ON TABLE public.ai_log TO service_role;


--
-- Name: TABLE ai_readiness_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_readiness_assessment TO anon;
GRANT ALL ON TABLE public.ai_readiness_assessment TO authenticated;
GRANT ALL ON TABLE public.ai_readiness_assessment TO service_role;


--
-- Name: SEQUENCE audit_log_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.audit_log_id_seq TO anon;
GRANT ALL ON SEQUENCE public.audit_log_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.audit_log_id_seq TO service_role;


--
-- Name: TABLE bpm_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.bpm_assessment TO anon;
GRANT ALL ON TABLE public.bpm_assessment TO authenticated;
GRANT ALL ON TABLE public.bpm_assessment TO service_role;


--
-- Name: TABLE business_reassessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.business_reassessment TO anon;
GRANT ALL ON TABLE public.business_reassessment TO authenticated;
GRANT ALL ON TABLE public.business_reassessment TO service_role;


--
-- Name: TABLE competitive_benchmarking_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.competitive_benchmarking_assessment TO anon;
GRANT ALL ON TABLE public.competitive_benchmarking_assessment TO authenticated;
GRANT ALL ON TABLE public.competitive_benchmarking_assessment TO service_role;


--
-- Name: TABLE customer_experience_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.customer_experience_assessment TO anon;
GRANT ALL ON TABLE public.customer_experience_assessment TO authenticated;
GRANT ALL ON TABLE public.customer_experience_assessment TO service_role;


--
-- Name: TABLE digital_transformation_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.digital_transformation_assessment TO anon;
GRANT ALL ON TABLE public.digital_transformation_assessment TO authenticated;
GRANT ALL ON TABLE public.digital_transformation_assessment TO service_role;


--
-- Name: TABLE email_subscriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.email_subscriptions TO anon;
GRANT ALL ON TABLE public.email_subscriptions TO authenticated;
GRANT ALL ON TABLE public.email_subscriptions TO service_role;


--
-- Name: TABLE email_subscription_analytics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.email_subscription_analytics TO anon;
GRANT ALL ON TABLE public.email_subscription_analytics TO authenticated;
GRANT ALL ON TABLE public.email_subscription_analytics TO service_role;


--
-- Name: SEQUENCE email_subscriptions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.email_subscriptions_id_seq TO anon;
GRANT ALL ON SEQUENCE public.email_subscriptions_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.email_subscriptions_id_seq TO service_role;


--
-- Name: TABLE growth_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_assessment TO authenticated;
GRANT ALL ON TABLE public.growth_assessment TO service_role;
GRANT SELECT,INSERT,UPDATE ON TABLE public.growth_assessment TO anon;


--
-- Name: TABLE growth_assessment_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_assessment_history TO anon;
GRANT ALL ON TABLE public.growth_assessment_history TO authenticated;
GRANT ALL ON TABLE public.growth_assessment_history TO service_role;


--
-- Name: TABLE growth_insights; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_insights TO anon;
GRANT ALL ON TABLE public.growth_insights TO authenticated;
GRANT ALL ON TABLE public.growth_insights TO service_role;


--
-- Name: TABLE growth_insights_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_insights_history TO anon;
GRANT ALL ON TABLE public.growth_insights_history TO authenticated;
GRANT ALL ON TABLE public.growth_insights_history TO service_role;


--
-- Name: TABLE growth_lever_progress; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_lever_progress TO anon;
GRANT ALL ON TABLE public.growth_lever_progress TO authenticated;
GRANT ALL ON TABLE public.growth_lever_progress TO service_role;


--
-- Name: TABLE growth_levers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_levers TO anon;
GRANT ALL ON TABLE public.growth_levers TO authenticated;
GRANT ALL ON TABLE public.growth_levers TO service_role;


--
-- Name: TABLE growth_quadrant_data; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_quadrant_data TO anon;
GRANT ALL ON TABLE public.growth_quadrant_data TO authenticated;
GRANT ALL ON TABLE public.growth_quadrant_data TO service_role;


--
-- Name: TABLE growth_simulations_log; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.growth_simulations_log TO anon;
GRANT ALL ON TABLE public.growth_simulations_log TO authenticated;
GRANT ALL ON TABLE public.growth_simulations_log TO service_role;


--
-- Name: TABLE industry_stock_symbols; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.industry_stock_symbols TO anon;
GRANT ALL ON TABLE public.industry_stock_symbols TO authenticated;
GRANT ALL ON TABLE public.industry_stock_symbols TO service_role;


--
-- Name: SEQUENCE industry_stock_symbols_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.industry_stock_symbols_id_seq TO anon;
GRANT ALL ON SEQUENCE public.industry_stock_symbols_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.industry_stock_symbols_id_seq TO service_role;


--
-- Name: TABLE inspirational_quotes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.inspirational_quotes TO anon;
GRANT ALL ON TABLE public.inspirational_quotes TO authenticated;
GRANT ALL ON TABLE public.inspirational_quotes TO service_role;


--
-- Name: TABLE leadership_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leadership_assessment TO anon;
GRANT ALL ON TABLE public.leadership_assessment TO authenticated;
GRANT ALL ON TABLE public.leadership_assessment TO service_role;


--
-- Name: TABLE leads; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.leads TO anon;
GRANT ALL ON TABLE public.leads TO authenticated;
GRANT ALL ON TABLE public.leads TO service_role;


--
-- Name: TABLE marketing_effectiveness_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.marketing_effectiveness_assessment TO anon;
GRANT ALL ON TABLE public.marketing_effectiveness_assessment TO authenticated;
GRANT ALL ON TABLE public.marketing_effectiveness_assessment TO service_role;


--
-- Name: TABLE notification_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notification_preferences TO anon;
GRANT ALL ON TABLE public.notification_preferences TO authenticated;
GRANT ALL ON TABLE public.notification_preferences TO service_role;


--
-- Name: TABLE notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.notifications TO anon;
GRANT ALL ON TABLE public.notifications TO authenticated;
GRANT ALL ON TABLE public.notifications TO service_role;


--
-- Name: TABLE onboarding_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.onboarding_assessments TO anon;
GRANT ALL ON TABLE public.onboarding_assessments TO authenticated;
GRANT ALL ON TABLE public.onboarding_assessments TO service_role;


--
-- Name: TABLE public_tables_overview; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.public_tables_overview TO anon;
GRANT ALL ON TABLE public.public_tables_overview TO authenticated;
GRANT ALL ON TABLE public.public_tables_overview TO service_role;


--
-- Name: TABLE realtime_business_trends; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.realtime_business_trends TO anon;
GRANT ALL ON TABLE public.realtime_business_trends TO authenticated;
GRANT ALL ON TABLE public.realtime_business_trends TO service_role;


--
-- Name: TABLE realtime_market_trends; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.realtime_market_trends TO anon;
GRANT ALL ON TABLE public.realtime_market_trends TO authenticated;
GRANT ALL ON TABLE public.realtime_market_trends TO service_role;


--
-- Name: TABLE realtime_marketing_playbook; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.realtime_marketing_playbook TO anon;
GRANT ALL ON TABLE public.realtime_marketing_playbook TO authenticated;
GRANT ALL ON TABLE public.realtime_marketing_playbook TO service_role;


--
-- Name: TABLE realtime_strategic_trends; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.realtime_strategic_trends TO anon;
GRANT ALL ON TABLE public.realtime_strategic_trends TO authenticated;
GRANT ALL ON TABLE public.realtime_strategic_trends TO service_role;


--
-- Name: TABLE reassessment_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.reassessment_assessment TO anon;
GRANT ALL ON TABLE public.reassessment_assessment TO authenticated;
GRANT ALL ON TABLE public.reassessment_assessment TO service_role;


--
-- Name: TABLE sales_performance_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sales_performance_assessment TO anon;
GRANT ALL ON TABLE public.sales_performance_assessment TO authenticated;
GRANT ALL ON TABLE public.sales_performance_assessment TO service_role;


--
-- Name: TABLE score_ai_readiness; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_ai_readiness TO anon;
GRANT ALL ON TABLE public.score_ai_readiness TO authenticated;
GRANT ALL ON TABLE public.score_ai_readiness TO service_role;


--
-- Name: TABLE score_bpm; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_bpm TO anon;
GRANT ALL ON TABLE public.score_bpm TO authenticated;
GRANT ALL ON TABLE public.score_bpm TO service_role;


--
-- Name: TABLE score_competitive_benchmarking; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_competitive_benchmarking TO anon;
GRANT ALL ON TABLE public.score_competitive_benchmarking TO authenticated;
GRANT ALL ON TABLE public.score_competitive_benchmarking TO service_role;


--
-- Name: TABLE score_customer_experience; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_customer_experience TO anon;
GRANT ALL ON TABLE public.score_customer_experience TO authenticated;
GRANT ALL ON TABLE public.score_customer_experience TO service_role;


--
-- Name: TABLE score_digital_transformation; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_digital_transformation TO anon;
GRANT ALL ON TABLE public.score_digital_transformation TO authenticated;
GRANT ALL ON TABLE public.score_digital_transformation TO service_role;


--
-- Name: TABLE score_leadership; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_leadership TO anon;
GRANT ALL ON TABLE public.score_leadership TO authenticated;
GRANT ALL ON TABLE public.score_leadership TO service_role;


--
-- Name: TABLE score_marketing_effectiveness; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_marketing_effectiveness TO anon;
GRANT ALL ON TABLE public.score_marketing_effectiveness TO authenticated;
GRANT ALL ON TABLE public.score_marketing_effectiveness TO service_role;


--
-- Name: TABLE score_reassessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_reassessment TO anon;
GRANT ALL ON TABLE public.score_reassessment TO authenticated;
GRANT ALL ON TABLE public.score_reassessment TO service_role;


--
-- Name: TABLE score_sales_performance; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_sales_performance TO anon;
GRANT ALL ON TABLE public.score_sales_performance TO authenticated;
GRANT ALL ON TABLE public.score_sales_performance TO service_role;


--
-- Name: TABLE score_strategic_maturity; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_strategic_maturity TO anon;
GRANT ALL ON TABLE public.score_strategic_maturity TO authenticated;
GRANT ALL ON TABLE public.score_strategic_maturity TO service_role;


--
-- Name: TABLE score_tech_stack; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.score_tech_stack TO anon;
GRANT ALL ON TABLE public.score_tech_stack TO authenticated;
GRANT ALL ON TABLE public.score_tech_stack TO service_role;


--
-- Name: TABLE scorecard_insights; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.scorecard_insights TO anon;
GRANT ALL ON TABLE public.scorecard_insights TO authenticated;
GRANT ALL ON TABLE public.scorecard_insights TO service_role;


--
-- Name: TABLE strategic_maturity_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.strategic_maturity_assessment TO anon;
GRANT ALL ON TABLE public.strategic_maturity_assessment TO authenticated;
GRANT ALL ON TABLE public.strategic_maturity_assessment TO service_role;


--
-- Name: TABLE tech_stack_assessment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tech_stack_assessment TO anon;
GRANT ALL ON TABLE public.tech_stack_assessment TO authenticated;
GRANT ALL ON TABLE public.tech_stack_assessment TO service_role;


--
-- Name: TABLE tier2_dashboard_insights; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tier2_dashboard_insights TO anon;
GRANT ALL ON TABLE public.tier2_dashboard_insights TO authenticated;
GRANT ALL ON TABLE public.tier2_dashboard_insights TO service_role;


--
-- Name: TABLE tier2_profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tier2_profiles TO anon;
GRANT ALL ON TABLE public.tier2_profiles TO authenticated;
GRANT ALL ON TABLE public.tier2_profiles TO service_role;


--
-- Name: TABLE tier2_simulation_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tier2_simulation_history TO anon;
GRANT ALL ON TABLE public.tier2_simulation_history TO authenticated;
GRANT ALL ON TABLE public.tier2_simulation_history TO service_role;


--
-- Name: TABLE trends; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trends TO anon;
GRANT ALL ON TABLE public.trends TO authenticated;
GRANT ALL ON TABLE public.trends TO service_role;


--
-- Name: TABLE trial_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trial_users TO anon;
GRANT ALL ON TABLE public.trial_users TO authenticated;
GRANT ALL ON TABLE public.trial_users TO service_role;


--
-- Name: TABLE trial_user_analytics; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trial_user_analytics TO anon;
GRANT ALL ON TABLE public.trial_user_analytics TO authenticated;
GRANT ALL ON TABLE public.trial_user_analytics TO service_role;


--
-- Name: TABLE user_tech_stack; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_tech_stack TO anon;
GRANT ALL ON TABLE public.user_tech_stack TO authenticated;
GRANT ALL ON TABLE public.user_tech_stack TO service_role;


--
-- Name: TABLE useractivity; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.useractivity TO anon;
GRANT ALL ON TABLE public.useractivity TO authenticated;
GRANT ALL ON TABLE public.useractivity TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- PostgreSQL database dump complete
--

