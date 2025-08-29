# Supabase Rules — Migrations & RLS

## Core Principles
- **Every schema change** via migration in `supabase/migrations` with forward/backward safety.
- **RLS first:** Deny-by-default; per-tenant `u_id/org_id` policies.
- Add `pgvector`; create HNSW/IVFFlat index for `market_articles.embedding`.

## Migration Pattern
```sql
-- migrations/YYYYMMDD_create_table.sql
CREATE TABLE IF NOT EXISTS table_name (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Setup
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Default deny policy
CREATE POLICY "deny_all" ON table_name FOR ALL USING (false);

-- User-specific access
CREATE POLICY "users_own_data" ON table_name 
FOR ALL USING (auth.uid() = user_id);
```

## pgvector Setup
```sql
-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table with vector column
CREATE TABLE market_articles (
  id BIGSERIAL PRIMARY KEY,
  content TEXT,
  embedding VECTOR(1536)
);

-- Create index
CREATE INDEX ON market_articles 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```
