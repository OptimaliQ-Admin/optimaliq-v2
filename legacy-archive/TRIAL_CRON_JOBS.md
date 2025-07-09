# Trial Flow Cron Jobs for Vercel

This document outlines the cron jobs required to manage the trial user lifecycle in your OptimaliQ application.

## 📋 Required Cron Jobs

### **1. Trial Expiration Check**
- **Endpoint**: `/api/cron/check-trial-expiration`
- **Schedule**: `0 2 * * *` (Daily at 2:00 AM)
- **Purpose**: 
  - Checks for expired trials and updates their status to "expired"
  - Updates corresponding subscription status
  - Sends trial expired email notifications
  - Processes trials that have passed their end date

### **2. Trial Expiring Soon Notifications**
- **Endpoint**: `/api/cron/send-trial-expiring-notifications`
- **Schedule**: `0 9 * * *` (Daily at 9:00 AM)
- **Purpose**:
  - Sends reminder emails to users whose trials expire soon
  - Sends notifications at 3 days, 1 day, and on the day of expiration
  - Prevents duplicate notifications using tracking fields
  - Only sends to active trials

### **3. Trial Status Cleanup**
- **Endpoint**: `/api/cron/cleanup-trial-records`
- **Schedule**: `0 3 * * 1` (Weekly on Monday at 3:00 AM)
- **Purpose**:
  - Archives very old expired trials (older than 90 days)
  - Cleans up orphaned trial records
  - Syncs trial statuses with subscription statuses
  - Removes old notification tracking data

## 🔧 Complete Vercel Cron Configuration

Add these to your Vercel project settings:

```bash
# Existing Jobs
/api/cron/generateMarketInsight
*/5 1-3 * * 2
Every 5 minutes, between 01:00 AM and 03:59 AM, only on Tuesday

/api/cron/generateBusinessTrends
0 1 * * 1
At 01:00 AM, only on Monday

/api/cron/generateMarketingPlaybook
0 2 */14 * *
At 02:00 AM, every 14 days

/api/cron/strategic-trends
0 2 */14 * *
At 02:00 AM, every 14 days

# New Trial Management Jobs
/api/cron/check-trial-expiration
0 2 * * *
Daily at 02:00 AM

/api/cron/send-trial-expiring-notifications
0 9 * * *
Daily at 09:00 AM

/api/cron/cleanup-trial-records
0 3 * * 1
Weekly on Monday at 03:00 AM
```

## 📊 Database Schema Updates

The following migration has been created to support the trial cron jobs:

**File**: `supabase/migrations/20240321000013_add_trial_notification_tracking.sql`

**Changes**:
- Added notification tracking fields to `trial_users` table:
  - `last_expiring_notification_3` - Tracks 3-day notifications
  - `last_expiring_notification_1` - Tracks 1-day notifications  
  - `last_expiring_notification_0` - Tracks day-of notifications
- Added `archived` status to trial status options
- Added indexes for better performance

## 🚀 Implementation Details

### Trial Expiration Check (`/api/cron/check-trial-expiration`)
- Fetches all active trials that have passed their end date
- Updates trial status to "expired"
- Updates corresponding subscription status to "expired"
- Sends trial expired email with upgrade and support links
- Handles errors gracefully and continues processing

### Trial Expiring Notifications (`/api/cron/send-trial-expiring-notifications`)
- Fetches trials expiring within the next 3 days
- Calculates days remaining for each trial
- Sends notifications only on specific days (3, 1, and 0 days remaining)
- Uses tracking fields to prevent duplicate notifications
- Sends different email content based on urgency

### Trial Cleanup (`/api/cron/cleanup-trial-records`)
- Archives trials older than 90 days
- Removes orphaned trial records
- Syncs trial and subscription statuses
- Cleans up old notification tracking data
- Provides detailed processing statistics

## 📧 Email Templates Used

The cron jobs use the following email templates:
- `TrialExpiredEmail` - Sent when trial expires
- `TrialExpiringSoonEmail` - Sent for expiring notifications

## 🔍 Monitoring

Each cron job returns detailed statistics:
- Number of records processed
- Number of errors encountered
- Summary of actions taken

Monitor these endpoints in Vercel logs to ensure proper operation.

## ⚠️ Prerequisites

Before enabling these cron jobs, ensure:
1. The migration `20240321000013_add_trial_notification_tracking.sql` has been applied
2. Email service is properly configured
3. Supabase admin client is available with proper permissions
4. Environment variables are set:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`

## 🎯 Expected Outcomes

With these cron jobs running:
- Trial users receive timely notifications about expiring trials
- Expired trials are properly marked and users are notified
- Database stays clean with old records archived
- Trial and subscription statuses remain synchronized
- Users have clear upgrade paths when trials expire 