-- Migration: Add Trial Subscription Support
-- Date: 2024-03-21
-- Description: Add support for trial subscriptions and ensure proper constraints

-- Add unique constraint on u_id to prevent duplicate subscriptions per user
-- (This assumes one subscription per user - adjust if you need multiple)
ALTER TABLE subscriptions ADD CONSTRAINT unique_user_subscription UNIQUE (u_id);

-- Add check constraint to ensure trial subscriptions have proper values
ALTER TABLE subscriptions ADD CONSTRAINT check_trial_subscription 
  CHECK (
    (status = 'trial' AND plan = 'trial') OR 
    (status != 'trial')
  );

-- Add index for faster subscription status lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_u_id ON subscriptions(u_id);

-- Add comment to document trial subscription usage
COMMENT ON COLUMN subscriptions.status IS 'Subscription status: active, trial, canceled, past_due, etc.';
COMMENT ON COLUMN subscriptions.plan IS 'Subscription plan: trial, accelerator, strategic, etc.'; 