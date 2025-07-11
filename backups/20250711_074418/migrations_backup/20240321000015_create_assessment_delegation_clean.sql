-- Migration: Create Assessment Delegation System (Clean)
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

-- 4. Create indexes for better performance (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_invitations_inviter') THEN
        CREATE INDEX idx_assessment_invitations_inviter ON assessment_invitations(inviter_u_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_invitations_token') THEN
        CREATE INDEX idx_assessment_invitations_token ON assessment_invitations(invitation_token);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_invitations_status') THEN
        CREATE INDEX idx_assessment_invitations_status ON assessment_invitations(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_invitations_expires') THEN
        CREATE INDEX idx_assessment_invitations_expires ON assessment_invitations(expires_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_assessment_invitations_type') THEN
        CREATE INDEX idx_assessment_invitations_type ON assessment_invitations(assessment_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_delegations_delegator') THEN
        CREATE INDEX idx_question_delegations_delegator ON question_delegations(delegator_u_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_delegations_token') THEN
        CREATE INDEX idx_question_delegations_token ON question_delegations(delegation_token);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_delegations_status') THEN
        CREATE INDEX idx_question_delegations_status ON question_delegations(status);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_delegations_expires') THEN
        CREATE INDEX idx_question_delegations_expires ON question_delegations(expires_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_question_delegations_type') THEN
        CREATE INDEX idx_question_delegations_type ON question_delegations(assessment_type);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_members_owner') THEN
        CREATE INDEX idx_team_members_owner ON team_members(owner_u_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_members_email') THEN
        CREATE INDEX idx_team_members_email ON team_members(member_email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_team_members_role') THEN
        CREATE INDEX idx_team_members_role ON team_members(role);
    END IF;
END $$;

-- 5. Enable RLS on all tables
ALTER TABLE assessment_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_delegations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies (only if they don't exist)
DO $$ 
BEGIN
    -- Assessment invitations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Users can view their own invitations') THEN
        CREATE POLICY "Users can view their own invitations" ON assessment_invitations
            FOR SELECT USING (auth.uid()::uuid = inviter_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Users can create invitations') THEN
        CREATE POLICY "Users can create invitations" ON assessment_invitations
            FOR INSERT WITH CHECK (auth.uid()::uuid = inviter_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Users can update their own invitations') THEN
        CREATE POLICY "Users can update their own invitations" ON assessment_invitations
            FOR UPDATE USING (auth.uid()::uuid = inviter_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Public can read invitations by token') THEN
        CREATE POLICY "Public can read invitations by token" ON assessment_invitations
            FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Public can update invitations by token') THEN
        CREATE POLICY "Public can update invitations by token" ON assessment_invitations
            FOR UPDATE USING (true);
    END IF;
    
    -- Question delegations policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Users can view their own delegations') THEN
        CREATE POLICY "Users can view their own delegations" ON question_delegations
            FOR SELECT USING (auth.uid()::uuid = delegator_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Users can create delegations') THEN
        CREATE POLICY "Users can create delegations" ON question_delegations
            FOR INSERT WITH CHECK (auth.uid()::uuid = delegator_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Users can update their own delegations') THEN
        CREATE POLICY "Users can update their own delegations" ON question_delegations
            FOR UPDATE USING (auth.uid()::uuid = delegator_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Public can read delegations by token') THEN
        CREATE POLICY "Public can read delegations by token" ON question_delegations
            FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Public can update delegations by token') THEN
        CREATE POLICY "Public can update delegations by token" ON question_delegations
            FOR UPDATE USING (true);
    END IF;
    
    -- Team members policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Users can view their own team members') THEN
        CREATE POLICY "Users can view their own team members" ON team_members
            FOR SELECT USING (auth.uid()::uuid = owner_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Users can create team members') THEN
        CREATE POLICY "Users can create team members" ON team_members
            FOR INSERT WITH CHECK (auth.uid()::uuid = owner_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Users can update their own team members') THEN
        CREATE POLICY "Users can update their own team members" ON team_members
            FOR UPDATE USING (auth.uid()::uuid = owner_u_id::uuid);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Users can delete their own team members') THEN
        CREATE POLICY "Users can delete their own team members" ON team_members
            FOR DELETE USING (auth.uid()::uuid = owner_u_id::uuid);
    END IF;
    
    -- Admin override policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'assessment_invitations' AND policyname = 'Admins can access all assessment invitations') THEN
        CREATE POLICY "Admins can access all assessment invitations" ON assessment_invitations
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tier2_users 
                    WHERE u_id = auth.uid() 
                    AND role = 'admin'
                )
            );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'question_delegations' AND policyname = 'Admins can access all question delegations') THEN
        CREATE POLICY "Admins can access all question delegations" ON question_delegations
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tier2_users 
                    WHERE u_id = auth.uid() 
                    AND role = 'admin'
                )
            );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_members' AND policyname = 'Admins can access all team members') THEN
        CREATE POLICY "Admins can access all team members" ON team_members
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM tier2_users 
                    WHERE u_id = auth.uid() 
                    AND role = 'admin'
                )
            );
    END IF;
END $$;

-- 7. Create utility functions
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

CREATE OR REPLACE FUNCTION generate_secure_token()
RETURNS TEXT AS $$
BEGIN
    RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- 8. Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_team_members_updated_at') THEN
        CREATE TRIGGER update_team_members_updated_at
            BEFORE UPDATE ON team_members
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$; 