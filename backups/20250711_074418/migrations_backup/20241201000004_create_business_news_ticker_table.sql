-- Create business_news_ticker table for storing news headlines
CREATE TABLE IF NOT EXISTS business_news_ticker (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_news_ticker_published_at ON business_news_ticker(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_news_ticker_created_at ON business_news_ticker(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_news_ticker_source ON business_news_ticker(source);

-- Add RLS policies
ALTER TABLE business_news_ticker ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read news headlines
CREATE POLICY "Allow authenticated users to read business news ticker" ON business_news_ticker
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert/update/delete (for cron jobs)
CREATE POLICY "Allow service role to manage business news ticker" ON business_news_ticker
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_business_news_ticker_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_business_news_ticker_updated_at
  BEFORE UPDATE ON business_news_ticker
  FOR EACH ROW
  EXECUTE FUNCTION update_business_news_ticker_updated_at();

-- Add comment to table
COMMENT ON TABLE business_news_ticker IS 'Stores business news headlines for the news ticker component';
COMMENT ON COLUMN business_news_ticker.title IS 'News headline title';
COMMENT ON COLUMN business_news_ticker.url IS 'URL to the full article';
COMMENT ON COLUMN business_news_ticker.source IS 'News source name';
COMMENT ON COLUMN business_news_ticker.published_at IS 'When the article was published'; 