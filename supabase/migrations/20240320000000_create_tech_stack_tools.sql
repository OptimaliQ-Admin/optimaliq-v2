-- Create tech_stack_tools table
CREATE TABLE IF NOT EXISTS tech_stack_tools (
    id BIGSERIAL PRIMARY KEY,
    u_id TEXT NOT NULL,
    category TEXT NOT NULL,
    tool_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT tech_stack_tools_category_check CHECK (category IN ('crm', 'esp', 'analytics', 'cms'))
);

-- Create index on u_id for faster lookups
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