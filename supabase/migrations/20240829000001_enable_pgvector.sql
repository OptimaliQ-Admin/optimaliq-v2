-- Enable pgvector extension for semantic search capabilities
CREATE EXTENSION IF NOT EXISTS vector;

-- Create market_articles table with vector embeddings
CREATE TABLE IF NOT EXISTS market_articles (
  id BIGSERIAL PRIMARY KEY,
  source TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  published_at TIMESTAMPTZ,
  title TEXT,
  summary TEXT,
  content TEXT,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vector index for efficient similarity search
CREATE INDEX IF NOT EXISTS idx_market_articles_embed 
ON market_articles 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Enable RLS
ALTER TABLE market_articles ENABLE ROW LEVEL SECURITY;

-- Default deny policy
CREATE POLICY "deny_all_market_articles" ON market_articles 
FOR ALL USING (false);

-- Allow public read access via API routes (will be controlled by service role)
-- This will be refined based on specific access patterns needed

-- Add comments for documentation
COMMENT ON TABLE market_articles IS 'Stores market articles with vector embeddings for RAG pipeline';
COMMENT ON COLUMN market_articles.embedding IS 'OpenAI ada-002 1536-dimensional embedding vector';
COMMENT ON INDEX idx_market_articles_embed IS 'IVFFlat index for efficient cosine similarity search';
