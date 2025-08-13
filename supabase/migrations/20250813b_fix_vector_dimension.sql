-- Fix vector dimension for market_articles.embedding to 1536 to satisfy ivfflat index limits
-- Switch to text-embedding-3-small (1536) for compatibility

-- Drop vector index if it exists (previous attempt may have partially created or failed)
do $$ begin
  execute 'drop index if exists idx_market_articles_vec';
exception when others then
  null;
end $$;

-- Alter the embedding column to 1536 dimensions
-- If direct type change fails, drop and recreate the column
do $$
begin
  alter table market_articles alter column embedding type vector(1536);
exception when others then
  begin
    alter table market_articles drop column if exists embedding;
    alter table market_articles add column embedding vector(1536);
  end;
end$$;

-- Recreate the vector index
create index if not exists idx_market_articles_vec
  on market_articles using ivfflat (embedding) with (lists = 100);


