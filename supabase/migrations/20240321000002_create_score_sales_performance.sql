-- Create score_sales_performance table
CREATE TABLE IF NOT EXISTS score_sales_performance (
    id SERIAL PRIMARY KEY,
    u_id TEXT NOT NULL,
    gmf_score DECIMAL(3,2) NOT NULL,
    bracket_key TEXT NOT NULL,
    score DECIMAL(3,2) NOT NULL,
    answers JSONB NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS score_sales_performance_u_id_idx ON score_sales_performance(u_id);
CREATE INDEX IF NOT EXISTS score_sales_performance_created_at_idx ON score_sales_performance(created_at);

-- Add RLS policies
ALTER TABLE score_sales_performance ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own scores
CREATE POLICY "Users can insert their own scores"
    ON score_sales_performance
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own scores
CREATE POLICY "Users can view their own scores"
    ON score_sales_performance
    FOR SELECT
    USING (auth.uid()::text = u_id); 