-- Migration: Extend Team Members with Department and Expanded Roles
-- Date: 2024-03-21
-- Description: Add department field and expand role options for team members

-- 1. Add department column to team_members table
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS department TEXT;

-- 2. Update the role constraint to include more enterprise roles
ALTER TABLE team_members 
DROP CONSTRAINT IF EXISTS team_members_role_check;

ALTER TABLE team_members 
ADD CONSTRAINT team_members_role_check 
CHECK (role IN (
    'ceo', 'cto', 'cfo', 'coo',
    'vp_sales', 'vp_marketing', 'vp_engineering', 'vp_product', 'vp_operations', 'vp_customer_success',
    'director_sales', 'director_marketing', 'director_engineering', 'director_product', 'director_operations',
    'senior_manager', 'manager', 'team_lead',
    'senior_analyst', 'analyst', 'specialist',
    'senior_engineer', 'engineer', 'developer',
    'employee', 'intern'
));

-- 3. Add department constraint
ALTER TABLE team_members 
ADD CONSTRAINT team_members_department_check 
CHECK (department IN (
    'executive', 'sales', 'marketing', 'engineering', 'product', 'operations', 
    'customer_success', 'finance', 'hr', 'legal', 'it', 'research', 'other'
));

-- 4. Create index for department queries
CREATE INDEX IF NOT EXISTS idx_team_members_department ON team_members(department);

-- 5. Add comments for documentation
COMMENT ON COLUMN team_members.department IS 'Department the team member belongs to';
COMMENT ON COLUMN team_members.role IS 'Role/level of the team member in the organization';

-- 6. Update existing records to have a default department
UPDATE team_members 
SET department = CASE 
    WHEN role LIKE '%sales%' THEN 'sales'
    WHEN role LIKE '%marketing%' THEN 'marketing'
    WHEN role LIKE '%engineer%' OR role LIKE '%developer%' THEN 'engineering'
    WHEN role LIKE '%product%' THEN 'product'
    WHEN role LIKE '%operation%' THEN 'operations'
    WHEN role LIKE '%customer%' THEN 'customer_success'
    WHEN role IN ('ceo', 'cto', 'cfo', 'coo') THEN 'executive'
    ELSE 'other'
END
WHERE department IS NULL;

-- 7. Make department NOT NULL after setting defaults
ALTER TABLE team_members 
ALTER COLUMN department SET NOT NULL; 