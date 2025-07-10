-- Migration: Fix tier2_users Infinite Recursion
-- Date: 2025-07-09
-- Description: Fix infinite recursion in tier2_users table by dropping all existing policies and creating safe ones

-- 1. Drop ALL existing policies on tier2_users table
DROP POLICY IF EXISTS "Admins can access all tier2_users" ON tier2_users;
DROP POLICY IF EXISTS "Users can access own data, admins can access all" ON tier2_users;
DROP POLICY IF EXISTS "Users can access their own record" ON tier2_users;
DROP POLICY IF EXISTS "Users can access their own tier2 profile" ON tier2_users;
DROP POLICY IF EXISTS "insert" ON tier2_users;
DROP POLICY IF EXISTS "select" ON tier2_users;
DROP POLICY IF EXISTS "Only admins can read audit logs" ON audit_log;

-- 2. Create a completely safe admin check function that doesn't query tier2_users
CREATE OR REPLACE FUNCTION is_admin_user_safe()
RETURNS BOOLEAN AS $$
DECLARE
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, not admin
    IF user_email IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Check role using email instead of u_id to avoid recursion
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

-- 3. Create safe policies for tier2_users table
-- Users can access their own data by email match
CREATE POLICY "Users can access own data by email" ON tier2_users
    FOR ALL USING (
        email = (SELECT email FROM auth.users WHERE id = auth.uid())
    );

-- 4. Create safe audit log policy
CREATE POLICY "Only admins can read audit logs safe" ON audit_log
    FOR SELECT USING (is_admin_user_safe());

-- 5. Update the existing is_admin_user function to use the safe version
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_admin_user_safe();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create a function to safely check if user exists in tier2_users
CREATE OR REPLACE FUNCTION user_exists_in_tier2()
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

-- 7. Create a function to safely get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, return 'user'
    IF user_email IS NULL THEN
        RETURN 'user';
    END IF;
    
    -- Get role from tier2_users
    SELECT role INTO user_role
    FROM tier2_users
    WHERE email = user_email
    LIMIT 1;
    
    -- Return role or default to 'user'
    RETURN COALESCE(user_role, 'user');
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create a function to safely get user u_id
CREATE OR REPLACE FUNCTION get_user_u_id()
RETURNS UUID AS $$
DECLARE
    user_email TEXT;
    user_u_id UUID;
BEGIN
    -- Get user email from auth.users
    SELECT email INTO user_email
    FROM auth.users
    WHERE id = auth.uid();
    
    -- If no email found, return NULL
    IF user_email IS NULL THEN
        RETURN NULL;
    END IF;
    
    -- Get u_id from tier2_users
    SELECT u_id INTO user_u_id
    FROM tier2_users
    WHERE email = user_email
    LIMIT 1;
    
    RETURN user_u_id;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create indexes for better performance on email lookups
CREATE INDEX IF NOT EXISTS idx_tier2_users_email ON tier2_users(email);
CREATE INDEX IF NOT EXISTS idx_tier2_users_role ON tier2_users(role);

-- 10. Grant necessary permissions
GRANT EXECUTE ON FUNCTION is_admin_user_safe() TO authenticated;
GRANT EXECUTE ON FUNCTION user_exists_in_tier2() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_u_id() TO authenticated; 