-- Create growth_assessment table
CREATE TABLE IF NOT EXISTS growth_assessment (
    u_id TEXT PRIMARY KEY,
    obstacles TEXT,
    strategy TEXT,
    process TEXT,
    customers TEXT,
    technology TEXT,
    submittedat TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on u_id for faster lookups
CREATE INDEX IF NOT EXISTS growth_assessment_u_id_idx ON growth_assessment(u_id);

-- Add RLS policies
ALTER TABLE growth_assessment ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own assessment
CREATE POLICY "Users can insert their own assessment"
    ON growth_assessment
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own assessment
CREATE POLICY "Users can view their own assessment"
    ON growth_assessment
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own assessment
CREATE POLICY "Users can update their own assessment"
    ON growth_assessment
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

CREATE TRIGGER update_growth_assessment_updated_at
    BEFORE UPDATE ON growth_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create strategic_maturity_assessment table
CREATE TABLE IF NOT EXISTS strategic_maturity_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on u_id for faster lookups
CREATE INDEX IF NOT EXISTS strategic_maturity_assessment_u_id_idx ON strategic_maturity_assessment(u_id);

-- Add RLS policies
ALTER TABLE strategic_maturity_assessment ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own assessment
CREATE POLICY "Users can insert their own assessment"
    ON strategic_maturity_assessment
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own assessment
CREATE POLICY "Users can view their own assessment"
    ON strategic_maturity_assessment
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own assessment
CREATE POLICY "Users can update their own assessment"
    ON strategic_maturity_assessment
    FOR UPDATE
    USING (auth.uid()::text = u_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_strategic_maturity_assessment_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_strategic_maturity_assessment_updated_at
    BEFORE UPDATE ON strategic_maturity_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_strategic_maturity_assessment_updated_at_column(); 