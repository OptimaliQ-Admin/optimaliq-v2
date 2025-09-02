-- Add vector search function for market articles
-- This migration adds the search function needed by the RAG pipeline

-- Create the search function
CREATE OR REPLACE FUNCTION search_market_articles(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.8,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id bigint,
  title text,
  content text,
  url text,
  source text,
  published_at timestamptz,
  summary text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    market_articles.id,
    market_articles.title,
    market_articles.content,
    market_articles.url,
    market_articles.source,
    market_articles.published_at,
    market_articles.summary,
    (1 - (market_articles.embedding <=> query_embedding)) AS similarity
  FROM market_articles
  WHERE (1 - (market_articles.embedding <=> query_embedding)) > match_threshold
  ORDER BY market_articles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Add RLS policy for the search function
-- Allow authenticated users to search articles
CREATE POLICY "authenticated_users_can_search" ON market_articles
FOR SELECT TO authenticated
USING (true);

-- Add comments
COMMENT ON FUNCTION search_market_articles IS 'Semantic search function for market articles using vector similarity';

-- Create index for better performance if not exists
CREATE INDEX IF NOT EXISTS idx_market_articles_embedding_cosine 
ON market_articles 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Add function to get article statistics
CREATE OR REPLACE FUNCTION get_market_articles_stats()
RETURNS TABLE (
  total_articles bigint,
  sources_count bigint,
  latest_article timestamptz,
  oldest_article timestamptz
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_articles,
    COUNT(DISTINCT source) as sources_count,
    MAX(published_at) as latest_article,
    MIN(published_at) as oldest_article
  FROM market_articles;
END;
$$;

-- Add function to clean up old articles (optional)
CREATE OR REPLACE FUNCTION cleanup_old_articles(days_old int DEFAULT 90)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count int;
BEGIN
  DELETE FROM market_articles 
  WHERE published_at < NOW() - INTERVAL '1 day' * days_old;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

COMMENT ON FUNCTION cleanup_old_articles IS 'Clean up articles older than specified days (default 90)';
