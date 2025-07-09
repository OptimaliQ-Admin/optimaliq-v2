-- Migration: Add Response Tokens for Individual Responses
-- Date: 2024-03-21
-- Description: Add response_token field to pulse_responses table

-- Add response_token column
ALTER TABLE pulse_responses 
ADD COLUMN response_token TEXT UNIQUE;

-- Create index for response tokens
CREATE INDEX idx_pulse_responses_token ON pulse_responses(response_token); 