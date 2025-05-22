-- Create sales_performance_assessment table
CREATE TABLE IF NOT EXISTS sales_performance_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    -- Add all possible answer columns
    how_b5d8e7 TEXT,
    do_b7cc0a TEXT,
    how_fee95e TEXT,
    who_5d9558 TEXT,
    how_454fc5 TEXT,
    which_01150c TEXT,
    which_6a5924 TEXT[],
    how_142ca2 TEXT,
    how_2c42b7 TEXT,
    how_79028c TEXT,
    what_dcd0de TEXT[],
    how_47b050 TEXT,
    how_12d26c TEXT,
    how_1f869b TEXT,
    which_4b594c TEXT[],
    how_c8eb2a TEXT,
    how_64a8d1 TEXT,
    how_7d8dcb TEXT,
    how_0fa447 TEXT,
    how_a76658 TEXT,
    which_045862 TEXT[],
    how_5589a0 TEXT,
    how_92a11d TEXT,
    how_1e24f7 TEXT,
    do_b5793e TEXT,
    how_140f94 TEXT,
    how_3a6376 TEXT,
    how_4cd27c TEXT,
    how_68cbdb TEXT,
    how_a4d10a TEXT[],
    how_ed3928 TEXT,
    what_84c5f2 TEXT,
    which_e20c5f TEXT[],
    how_dcff82 TEXT,
    how_9d44c5 TEXT,
    what_cdbbe6 TEXT,
    how_3d4d34 TEXT,
    how_1d7838 TEXT,
    how_de0081 TEXT,
    how_fe4a96 TEXT,
    which_d1a7ce TEXT[],
    how_05b3d7 TEXT,
    how_5d49b3 TEXT,
    how_b650ca TEXT,
    how_152df3 TEXT,
    what_fed657 TEXT[],
    how_8e4ef6 TEXT,
    which_549cbb TEXT[],
    how_671b3b TEXT,
    how_27f529 TEXT,
    how_0f6cf0 TEXT,
    whats_b04f69 TEXT,
    how_03fce6 TEXT,
    how_4633fe TEXT,
    how_70b7b8 TEXT,
    which_117dee TEXT[],
    how_15ad3d TEXT,
    how_7e00a0 TEXT,
    whats_2e8609 TEXT,
    what_ada360 TEXT,
    how_229086 TEXT,
    how_a07904 TEXT,
    how_68025d TEXT[],
    how_e9af60 TEXT,
    how_faf5c1 TEXT,
    how_4e7ac1 TEXT,
    how_1d2529 TEXT,
    whats_719868 TEXT
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