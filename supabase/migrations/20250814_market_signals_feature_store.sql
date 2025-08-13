-- Feature store for market/business/engagement signals
create extension if not exists pgcrypto;

-- Daily normalized signals per industry
create table if not exists signals_daily (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  observed_on date not null,
  -- Core dials (0..100)
  growth_momentum numeric,
  sentiment_score numeric,
  competition_pressure numeric,
  capital_flow numeric,
  -- Extended indices
  hiring_index numeric,
  search_index numeric,
  price_index numeric,
  -- Evidence
  sources jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  unique(industry, observed_on)
);

create index if not exists idx_signals_daily_ind_date on signals_daily(industry, observed_on desc);

-- Cohort rollups (means/top performers) to compute z-scores
create table if not exists cohort_rollups (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  observed_on date not null,
  metric text not null,
  cohort_mean numeric,
  top_performer numeric,
  created_at timestamptz default now(),
  unique(industry, observed_on, metric)
);

create index if not exists idx_cohort_rollups on cohort_rollups(industry, observed_on desc, metric);

-- Industry priors for sparse-data periods
create table if not exists priors_industry (
  industry text primary key,
  growth_band jsonb,      -- {low: number, base: number, high: number}
  sentiment_base numeric, -- 0..100
  competition_base numeric,
  capital_flow_base numeric,
  notes text,
  updated_at timestamptz default now()
);


