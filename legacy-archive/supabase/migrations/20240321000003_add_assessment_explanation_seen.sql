-- Add column to track if user has seen the assessment explanation popup
ALTER TABLE tier2_profiles 
ADD COLUMN assessment_explanation_seen_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN tier2_profiles.assessment_explanation_seen_at IS 'Timestamp when user first saw the assessment explanation popup'; 