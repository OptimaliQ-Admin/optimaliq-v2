-- Add AI response tracking columns to user_responses table
ALTER TABLE user_responses 
ADD COLUMN IF NOT EXISTS ai_response TEXT,
ADD COLUMN IF NOT EXISTS extracted_data JSONB,
ADD COLUMN IF NOT EXISTS response_quality_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_generation_time_ms INTEGER;

-- Add index for faster queries on AI responses
CREATE INDEX IF NOT EXISTS idx_user_responses_ai_response 
ON user_responses(ai_response) 
WHERE ai_response IS NOT NULL;

-- Add index for extracted data queries
CREATE INDEX IF NOT EXISTS idx_user_responses_extracted_data 
ON user_responses USING GIN(extracted_data) 
WHERE extracted_data IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN user_responses.ai_response IS 'The AI-generated response for this user answer';
COMMENT ON COLUMN user_responses.extracted_data IS 'Structured data extracted from the AI response for dashboard scoring';
COMMENT ON COLUMN user_responses.response_quality_score IS 'Quality score of the AI response (0-10)';
COMMENT ON COLUMN user_responses.response_generation_time_ms IS 'Time taken to generate the AI response in milliseconds'; 