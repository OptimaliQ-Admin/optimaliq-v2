-- Create tech_stack_tools table
CREATE TABLE IF NOT EXISTS tech_stack_tools (
    id BIGSERIAL PRIMARY KEY,
    u_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(u_id, category, tool_name)
);

-- Enable RLS
ALTER TABLE tech_stack_tools ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tech stack tools"
    ON tech_stack_tools
    FOR SELECT
    USING (auth.uid() = u_id);

CREATE POLICY "Users can insert their own tech stack tools"
    ON tech_stack_tools
    FOR INSERT
    WITH CHECK (auth.uid() = u_id);

CREATE POLICY "Users can update their own tech stack tools"
    ON tech_stack_tools
    FOR UPDATE
    USING (auth.uid() = u_id)
    WITH CHECK (auth.uid() = u_id);

CREATE POLICY "Users can delete their own tech stack tools"
    ON tech_stack_tools
    FOR DELETE
    USING (auth.uid() = u_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS tech_stack_tools_u_id_idx ON tech_stack_tools(u_id);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS tech_stack_tools_category_idx ON tech_stack_tools(category);

-- Add RLS policies
ALTER TABLE tech_stack_tools ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own tools
CREATE POLICY "Users can insert their own tools"
    ON tech_stack_tools
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own tools
CREATE POLICY "Users can view their own tools"
    ON tech_stack_tools
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own tools
CREATE POLICY "Users can update their own tools"
    ON tech_stack_tools
    FOR UPDATE
    USING (auth.uid()::text = u_id);

-- Allow users to delete their own tools
CREATE POLICY "Users can delete their own tools"
    ON tech_stack_tools
    FOR DELETE
    USING (auth.uid()::text = u_id);

-- Create tech_stack_assessment table
CREATE TABLE IF NOT EXISTS tech_stack_assessment (
    u_id TEXT PRIMARY KEY,
    score DECIMAL(3,2),
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on u_id for faster lookups
CREATE INDEX IF NOT EXISTS tech_stack_assessment_u_id_idx ON tech_stack_assessment(u_id);

-- Add RLS policies
ALTER TABLE tech_stack_assessment ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own assessment
CREATE POLICY "Users can insert their own assessment"
    ON tech_stack_assessment
    FOR INSERT
    WITH CHECK (auth.uid()::text = u_id);

-- Allow users to view their own assessment
CREATE POLICY "Users can view their own assessment"
    ON tech_stack_assessment
    FOR SELECT
    USING (auth.uid()::text = u_id);

-- Allow users to update their own assessment
CREATE POLICY "Users can update their own assessment"
    ON tech_stack_assessment
    FOR UPDATE
    USING (auth.uid()::text = u_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tech_stack_assessment_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tech_stack_assessment_updated_at
    BEFORE UPDATE ON tech_stack_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_tech_stack_assessment_updated_at_column(); 