-- Migration: Fix Growth Assessment RLS Policy
-- Date: 2024-03-21
-- Description: Add missing user policy for growth_assessment table to allow users to insert their own data

-- Add user-specific policy for growth_assessment table
-- This allows users to insert, update, and select their own assessment data
CREATE POLICY "Users can access their own growth assessment" ON growth_assessment
    FOR ALL USING (auth.uid()::uuid = u_id::uuid);

-- Add comment to document the policy
COMMENT ON POLICY "Users can access their own growth assessment" ON growth_assessment IS 'Allows users to insert, update, and select their own growth assessment data';

-- Verify the policy was created
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'growth_assessment' 
        AND policyname = 'Users can access their own growth assessment'
    ) THEN
        RAISE EXCEPTION 'Failed to create user policy for growth_assessment table';
    END IF;
END $$; 