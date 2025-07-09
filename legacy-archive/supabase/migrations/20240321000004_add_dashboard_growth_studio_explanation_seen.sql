-- Add columns to track dashboard and growth studio explanation modals
ALTER TABLE tier2_profiles 
ADD COLUMN dashboard_explanation_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN growth_studio_explanation_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN tier2_profiles.dashboard_explanation_seen_at IS 'Timestamp when user first saw the dashboard explanation popup';
COMMENT ON COLUMN tier2_profiles.growth_studio_explanation_seen_at IS 'Timestamp when user first saw the growth studio explanation popup'; 