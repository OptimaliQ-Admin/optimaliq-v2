-- Create tier2_profiles table
CREATE TABLE IF NOT EXISTS tier2_profiles (
    u_id TEXT PRIMARY KEY,
    sales_score DECIMAL(3,2),
    sales_last_taken TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on u_id for faster lookups
CREATE INDEX IF NOT EXISTS tier2_profiles_u_id_idx ON tier2_profiles(u_id);

-- Add RLS policies
ALTER TABLE tier2_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON tier2_profiles
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON tier2_profiles
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON tier2_profiles
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

CREATE TRIGGER update_tier2_profiles_updated_at
    BEFORE UPDATE ON tier2_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 