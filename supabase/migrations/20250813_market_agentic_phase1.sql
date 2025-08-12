-- Market Agentic Phase 1: articles store, snapshots cache, refresh queue, indexes/uniques

-- 1) Vector extension (idempotent)
create extension if not exists vector;
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- 2) Raw articles/events with embeddings for Q&A and citations
create table if not exists market_articles (
  id uuid primary key default gen_random_uuid(),
  industry text not null,
  source text not null,                -- e.g., finnhub, newsapi, analyst_blog
  title text not null,
  url text not null,
  published_at timestamptz not null,
  summary text,
  sentiment numeric,                   -- -1..1
  entities jsonb,                      -- tickers, companies, topics
  embedding vector(3072),              -- text-embedding-3-large
  url_hash text generated always as (md5(url)) stored,
  created_at timestamptz default now()
);

-- Dedupe: prevent re-ingesting same story
create unique index if not exists uq_market_articles on market_articles(industry, url_hash, published_at);

-- Retention/time index
create index if not exists idx_articles_time on market_articles(published_at desc);

-- Vector index (tune lists as needed)
create index if not exists idx_market_articles_vec on market_articles using ivfflat (embedding) with (lists = 100);

-- RLS: admin-only access (service role bypasses RLS). Enable RLS and do not add anon policies.
alter table market_articles enable row level security;

-- 3) Card-level snapshots (cache the payload each card returns)
create table if not exists market_snapshots (
  id uuid primary key default gen_random_uuid(),
  card text not null,                  -- market_signals | business_trends | engagement_intel
  industry text not null,
  snapshot jsonb not null,             -- the card payload the UI consumes
  sources jsonb not null,              -- [{title,url,source,published_at}, ...]
  confidence numeric not null,         -- 0..1
  model_version text not null,
  ttl_minutes int not null default 360,
  divergence_note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_market_snapshots_card_ind on market_snapshots(card, industry, created_at desc);

alter table market_snapshots enable row level security;

-- 4) Snapshot refresh request queue (avoid duplicate rebuilds)
create table if not exists snapshot_refresh_requests (
  id uuid primary key default gen_random_uuid(),
  card text not null,
  industry text not null,
  requested_at timestamptz default now(),
  status text default 'queued'  -- queued|running|done|error
);

-- Only one queued request per (card,industry)
create unique index if not exists uq_refresh_once on snapshot_refresh_requests(card, industry) where status = 'queued';


