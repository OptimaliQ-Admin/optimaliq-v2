-- Add business_overview column to tier2_profiles table
ALTER TABLE tier2_profiles 
ADD COLUMN business_overview TEXT DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN tier2_profiles.business_overview IS 'User-provided description of their business model, target audience, and value proposition'; 