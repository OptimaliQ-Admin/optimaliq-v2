-- Migration: Create Assessment Delegation System
-- Date: 2024-03-21
-- Description: Create tables for assessment invitations and question delegations

-- 1. Create assessment_invitations table
CREATE TABLE IF NOT EXISTS assessment_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_u_id UUID NOT NULL REFERENCES tier2_users(u_id) ON DELETE CASCADE,
    invitee_email TEXT NOT NULL,
    invitee_name TEXT,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN (
        'sales', 'bpm', 'tech_stack', 'strategic_maturity', 'marketing_effectiveness',
        'ai_readiness', 'competitive_benchmarking', 'customer_experience',
        'digital_transformation', 'leadership'
    )),
    invitation_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    score DECIMAL(3,2),
    custom_message TEXT
);

-- 2. Create question_delegations table
CREATE TABLE IF NOT EXISTS question_delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delegator_u_id UUID NOT NULL REFERENCES tier2_users(u_id) ON DELETE CASCADE,
    delegate_email TEXT NOT NULL,
    delegate_name TEXT,
    assessment_type TEXT NOT NULL CHECK (assessment_type IN (
        'sales', 'bpm', 'tech_stack', 'strategic_maturity', 'marketing_effectiveness',
        'ai_readiness', 'competitive_benchmarking', 'customer_experience',
        'digital_transformation', 'leadership'
    )),
    question_keys TEXT[] NOT NULL,
    delegation_token TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    custom_message TEXT
);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_u_id UUID NOT NULL REFERENCES tier2_users(u_id) ON DELETE CASCADE,
    member_email TEXT NOT NULL,
    member_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('vp_sales', 'vp_marketing', 'manager', 'employee')),
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(owner_u_id, member_email)
);

-- 4. Add comments for documentation
COMMENT ON TABLE assessment_invitations IS 'Stores assessment invitations sent by business owners to team members';
COMMENT ON TABLE question_delegations IS 'Stores question delegations sent by VP-level users to team members';
COMMENT ON TABLE team_members IS 'Stores team member information for delegation management';

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_invitations_inviter ON assessment_invitations(inviter_u_id);
CREATE INDEX IF NOT EXISTS idx_assessment_invitations_token ON assessment_invitations(invitation_token);
CREATE INDEX IF NOT EXISTS idx_assessment_invitations_status ON assessment_invitations(status);
CREATE INDEX IF NOT EXISTS idx_assessment_invitations_expires ON assessment_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_assessment_invitations_type ON assessment_invitations(assessment_type);

CREATE INDEX IF NOT EXISTS idx_question_delegations_delegator ON question_delegations(delegator_u_id);
CREATE INDEX IF NOT EXISTS idx_question_delegations_token ON question_delegations(delegation_token);
CREATE INDEX IF NOT EXISTS idx_question_delegations_status ON question_delegations(status);
CREATE INDEX IF NOT EXISTS idx_question_delegations_expires ON question_delegations(expires_at);
CREATE INDEX IF NOT EXISTS idx_question_delegations_type ON question_delegations(assessment_type);

CREATE INDEX IF NOT EXISTS idx_team_members_owner ON team_members(owner_u_id);
CREATE INDEX IF NOT EXISTS idx_team_members_email ON team_members(member_email);
CREATE INDEX IF NOT EXISTS idx_team_members_role ON team_members(role);

-- 6. Enable RLS on all tables
ALTER TABLE assessment_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for assessment_invitations
-- Users can view invitations they sent
CREATE POLICY "Users can view their own invitations" ON assessment_invitations
    FOR SELECT USING (auth.uid()::uuid = inviter_u_id::uuid);

-- Users can create invitations
CREATE POLICY "Users can create invitations" ON assessment_invitations
    FOR INSERT WITH CHECK (auth.uid()::uuid = inviter_u_id::uuid);

-- Users can update their own invitations
CREATE POLICY "Users can update their own invitations" ON assessment_invitations
    FOR UPDATE USING (auth.uid()::uuid = inviter_u_id::uuid);

-- Public can read invitations by token (for completion)
CREATE POLICY "Public can read invitations by token" ON assessment_invitations
    FOR SELECT USING (true);

-- Public can update invitations by token (for completion)
CREATE POLICY "Public can update invitations by token" ON assessment_invitations
    FOR UPDATE USING (true);

-- 8. Create RLS policies for question_delegations
-- Users can view delegations they sent
CREATE POLICY "Users can view their own delegations" ON question_delegations
    FOR SELECT USING (auth.uid()::uuid = delegator_u_id::uuid);

-- Users can create delegations
CREATE POLICY "Users can create delegations" ON question_delegations
    FOR INSERT WITH CHECK (auth.uid()::uuid = delegator_u_id::uuid);

-- Users can update their own delegations
CREATE POLICY "Users can update their own delegations" ON question_delegations
    FOR UPDATE USING (auth.uid()::uuid = delegator_u_id::uuid);

-- Public can read delegations by token (for completion)
CREATE POLICY "Public can read delegations by token" ON question_delegations
    FOR SELECT USING (true);

-- Public can update delegations by token (for completion)
CREATE POLICY "Public can update delegations by token" ON question_delegations
    FOR UPDATE USING (true);

-- 9. Create RLS policies for team_members
-- Users can view their own team members
CREATE POLICY "Users can view their own team members" ON team_members
    FOR SELECT USING (auth.uid()::uuid = owner_u_id::uuid);

-- Users can create team members
CREATE POLICY "Users can create team members" ON team_members
    FOR INSERT WITH CHECK (auth.uid()::uuid = owner_u_id::uuid);

-- Users can update their own team members
CREATE POLICY "Users can update their own team members" ON team_members
    FOR UPDATE USING (auth.uid()::uuid = owner_u_id::uuid);

-- Users can delete their own team members
CREATE POLICY "Users can delete their own team members" ON team_members
    FOR DELETE USING (auth.uid()::uuid = owner_u_id::uuid);

-- 10. Create admin override policies
CREATE POLICY "Admins can access all assessment invitations" ON assessment_invitations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all question delegations" ON question_delegations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can access all team members" ON team_members
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM tier2_users 
            WHERE u_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- 11. Create function to clean up expired invitations and delegations
CREATE OR REPLACE FUNCTION cleanup_expired_delegations()
RETURNS void AS $$
BEGIN
    -- Update expired invitations
    UPDATE assessment_invitations 
    SET status = 'expired' 
    WHERE status = 'pending' AND expires_at < NOW();
    
    -- Update expired delegations
    UPDATE question_delegations 
    SET status = 'expired' 
    WHERE status = 'pending' AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 12. Create function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_secure_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 13. Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_team_members_updated_at
    BEFORE UPDATE ON team_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 