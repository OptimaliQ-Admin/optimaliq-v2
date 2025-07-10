-- Migration: Complete tier2_users Policy Reset
-- Date: 2025-07-09
-- Description: Completely reset all policies on tier2_users table and create only safe ones

-- 1. DISABLE RLS temporarily to clear all policies
ALTER TABLE tier2_users DISABLE ROW LEVEL SECURITY;

-- 2. RE-ENABLE RLS (this will drop all existing policies)
ALTER TABLE tier2_users ENABLE ROW LEVEL SECURITY;

-- 3. Drop any remaining policies that might exist
DROP POLICY IF EXISTS "Admins can access all tier2_users" ON tier2_users;
DROP POLICY IF EXISTS "Users can access own data, admins can access all" ON tier2_users;
DROP POLICY IF EXISTS "Users can access their own record" ON tier2_users;
DROP POLICY IF EXISTS "Users can access their own tier2 profile" ON tier2_users;
DROP POLICY IF EXISTS "insert" ON tier2_users;
DROP POLICY IF EXISTS "select" ON tier2_users;
DROP POLICY IF EXISTS "Users can access own data by email" ON tier2_users;
DROP POLICY IF EXISTS "Admins can access all tier2_users" ON tier2_users;
DROP POLICY IF EXISTS "Users can access own data, admins can access all" ON tier2_users;

-- 4. Create a completely safe admin check function that uses session variables
CREATE OR REPLACE FUNCTION is_admin_user_final()
RETURNS BOOLEAN AS $$
DECLARE
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get user email from auth.users (this is safe, no recursion)
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, not admin
    IF user_email IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check role using email (this avoids the u_id recursion)
    SELECT role INTO user_role
    FROM tier2_users
    WHERE email = user_email
    LIMIT 1;
    
    RETURN user_role = 'admin';
EXCEPTION
    WHEN OTHERS THEN
        -- If there's any error, assume not admin
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create ONLY ONE safe policy for tier2_users
-- This policy allows users to access their own data by email match
CREATE POLICY "tier2_users_email_access" ON tier2_users
    FOR ALL USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- 6. Update all other functions to use the final version
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin_user_final();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin_user_safe()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin_user_final();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a function to safely get user data without recursion
CREATE OR REPLACE FUNCTION get_current_user_tier2_data()
RETURNS TABLE(
    u_id UUID,
    email TEXT,
    role TEXT,
    first_name TEXT,
    last_name TEXT
) AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, return empty
    IF user_email IS NULL THEN
        RETURN;
    END IF;
    
    -- Return user data from tier2_users
    RETURN QUERY
    SELECT 
        t.u_id,
        t.email,
        t.role,
        t.first_name,
        t.last_name
    FROM tier2_users t
    WHERE t.email = user_email;
EXCEPTION
    WHEN OTHERS THEN
        -- Return empty on any error
        RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create a function to safely check if user exists
CREATE OR REPLACE FUNCTION user_exists_in_tier2_safe()
RETURNS BOOLEAN AS $$
DECLARE
    user_email TEXT;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, user doesn't exist
    IF user_email IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user exists in tier2_users
    RETURN EXISTS (
        SELECT 1 FROM tier2_users WHERE email = user_email
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant permissions
GRANT EXECUTE ON FUNCTION is_admin_user_final() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_tier2_data() TO authenticated;
GRANT EXECUTE ON FUNCTION user_exists_in_tier2_safe() TO authenticated;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tier2_users_email_final ON tier2_users(email);
CREATE INDEX IF NOT EXISTS idx_tier2_users_role_final ON tier2_users(role);

-- 11. Verify the table structure
DO $$
BEGIN
    -- Check if tier2_users has the expected columns
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tier2_users' 
        AND column_name = 'email'
    ) THEN
        RAISE EXCEPTION 'tier2_users table does not have email column';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tier2_users' 
        AND column_name = 'role'
    ) THEN
        RAISE EXCEPTION 'tier2_users table does not have role column';
    END IF;
    
    RAISE NOTICE 'tier2_users table structure verified successfully';
END $$; 