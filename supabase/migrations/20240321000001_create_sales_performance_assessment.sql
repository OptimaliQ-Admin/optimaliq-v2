-- Create sales_performance_assessment table
CREATE TABLE IF NOT EXISTS sales_performance_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on u_id for faster lookups
CREATE INDEX IF NOT EXISTS sales_performance_assessment_u_id_idx ON sales_performance_assessment(u_id);

-- Add RLS policies
ALTER TABLE sales_performance_assessment ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own assessment
CREATE POLICY "Users can insert their own assessment"
    ON sales_performance_assessment
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own assessment
CREATE POLICY "Users can view their own assessment"
    ON sales_performance_assessment
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own assessment
CREATE POLICY "Users can update their own assessment"
    ON sales_performance_assessment
    FOR UPDATE
    USING (auth.uid()::text = u_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sales_performance_assessment_updated_at
    BEFORE UPDATE ON sales_performance_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 