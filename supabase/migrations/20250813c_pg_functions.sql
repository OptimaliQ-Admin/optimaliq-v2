-- Vector RAG helper function for market_articles
create or replace function match_market_articles(
  q_industry text,
  q_since timestamptz,
  q_embedding vector(1536),
  q_limit int
)
returns table (
  title text,
  url text,
  source text,
  published_at timestamptz,
  summary text,
  distance float
) language sql stable as $$
  select ma.title, ma.url, ma.source, ma.published_at, ma.summary,
         (ma.embedding <-> q_embedding) as distance
  from market_articles ma
  where ma.industry = q_industry
    and ma.published_at >= q_since
    and ma.embedding is not null
  order by ma.embedding <-> q_embedding
  limit q_limit;
$$;


