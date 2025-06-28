-- Migration: Add Trial Notification Tracking
-- Date: 2024-03-21
-- Description: Add fields to track when trial expiring notifications were sent

-- Add notification tracking columns to trial_users table
ALTER TABLE trial_users 
ADD COLUMN last_expiring_notification_3 TEXT DEFAULT NULL,
ADD COLUMN last_expiring_notification_1 TEXT DEFAULT NULL,
ADD COLUMN last_expiring_notification_0 TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN trial_users.last_expiring_notification_3 IS 'Date when 3-day expiring notification was last sent (YYYY-MM-DD format)';
COMMENT ON COLUMN trial_users.last_expiring_notification_1 IS 'Date when 1-day expiring notification was last sent (YYYY-MM-DD format)';
COMMENT ON COLUMN trial_users.last_expiring_notification_0 IS 'Date when day-of expiring notification was last sent (YYYY-MM-DD format)';

-- Add index for notification tracking queries
CREATE INDEX IF NOT EXISTS idx_trial_users_notification_tracking 
ON trial_users(last_expiring_notification_3, last_expiring_notification_1, last_expiring_notification_0);

-- Add status 'archived' to the status check constraint
ALTER TABLE trial_users DROP CONSTRAINT IF EXISTS trial_users_status_check;
ALTER TABLE trial_users ADD CONSTRAINT trial_users_status_check 
CHECK (status IN ('active', 'expired', 'converted', 'archived'));

-- Add comment for the new status
COMMENT ON COLUMN trial_users.status IS 'Current trial status: active, expired, converted, or archived'; 