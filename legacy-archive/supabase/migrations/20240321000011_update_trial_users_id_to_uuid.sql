-- Migration: Update Trial Users ID to UUID
-- Date: 2024-03-21
-- Description: Change trial_users table id column from SERIAL to UUID

-- First, add a new UUID column
ALTER TABLE trial_users ADD COLUMN id_new UUID DEFAULT gen_random_uuid();

-- Update existing records to have UUIDs
UPDATE trial_users SET id_new = gen_random_uuid() WHERE id_new IS NULL;

-- Drop the old id column and rename the new one
ALTER TABLE trial_users DROP COLUMN id;
ALTER TABLE trial_users RENAME COLUMN id_new TO id;

-- Make the id column the primary key
ALTER TABLE trial_users ADD PRIMARY KEY (id);

-- Recreate indexes that reference the id column
-- (The existing indexes should still work since they don't reference the id column)

-- Update the trigger function to handle UUID
CREATE OR REPLACE FUNCTION update_trial_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The trigger should still work as it doesn't reference the id column 