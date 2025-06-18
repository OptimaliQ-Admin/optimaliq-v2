-- Create bpm_assessment table
CREATE TABLE IF NOT EXISTS bpm_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create marketing_effectiveness_assessment table
CREATE TABLE IF NOT EXISTS marketing_effectiveness_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ai_readiness_assessment table
CREATE TABLE IF NOT EXISTS ai_readiness_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create competitive_benchmarking_assessment table
CREATE TABLE IF NOT EXISTS competitive_benchmarking_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create customer_experience_assessment table
CREATE TABLE IF NOT EXISTS customer_experience_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create digital_transformation_assessment table
CREATE TABLE IF NOT EXISTS digital_transformation_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create leadership_assessment table
CREATE TABLE IF NOT EXISTS leadership_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create reassessment_assessment table
CREATE TABLE IF NOT EXISTS reassessment_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies and triggers for each table
DO $$
DECLARE
    tables text[] := ARRAY[
        'bpm_assessment',
        'marketing_effectiveness_assessment',
        'ai_readiness_assessment',
        'competitive_benchmarking_assessment',
        'customer_experience_assessment',
        'digital_transformation_assessment',
        'leadership_assessment',
        'reassessment_assessment'
    ];
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY tables
    LOOP
        -- Create index on u_id
        EXECUTE format('CREATE INDEX IF NOT EXISTS %I_u_id_idx ON %I(u_id)', table_name, table_name);
        
        -- Enable RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        
        -- Create policies
        EXECUTE format('CREATE POLICY "Users can insert their own assessment" ON %I FOR INSERT WITH CHECK (auth.uid()::text = u_id)', table_name);
        EXECUTE format('CREATE POLICY "Users can view their own assessment" ON %I FOR SELECT USING (auth.uid()::text = u_id)', table_name);
        EXECUTE format('CREATE POLICY "Users can update their own assessment" ON %I FOR UPDATE USING (auth.uid()::text = u_id)', table_name);
        
        -- Create trigger function if it doesn't exist
        EXECUTE format('
            CREATE OR REPLACE FUNCTION update_%I_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = TIMEZONE(''utc''::text, NOW());
                RETURN NEW;
            END;
            $$ language ''plpgsql''', table_name);
        
        -- Create trigger
        EXECUTE format('
            CREATE TRIGGER update_%I_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_%I_updated_at_column()', table_name, table_name, table_name);
    END LOOP;
END $$; 