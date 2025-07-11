# Database Migration Reset Guide

This guide will help you backup your Supabase tables, reset migrations, and apply all migrations including the new News Ticker feature.

## 📋 Prerequisites

1. **Supabase CLI installed**: `npm install -g supabase`
2. **PostgreSQL client**: `psql` command available
3. **Database connection**: `DATABASE_URL` environment variable set
4. **Backup your data**: Always backup before resetting!

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)

```bash
# Make scripts executable
chmod +x scripts/backup_and_reset_migrations.sh
chmod +x scripts/run_migration_reset.sh

# Run the automated backup and reset
./scripts/backup_and_reset_migrations.sh
```

### Option 2: Manual Process

```bash
# 1. Backup current database
npx supabase db dump --schema-only > backups/schema_backup.sql
npx supabase db dump --data-only > backups/data_backup.sql

# 2. Reset database
npx supabase db reset

# 3. Apply all migrations
npx supabase db push
```

### Option 3: Direct SQL Execution

```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Run the comprehensive migration script
./scripts/run_migration_reset.sh
```

## 📁 Files Created

### Backup Files
- `backups/[timestamp]/schema_backup.sql` - Database schema backup
- `backups/[timestamp]/data_backup.sql` - Database data backup  
- `backups/[timestamp]/migrations_backup/` - Current migrations backup

### Migration Scripts
- `scripts/reset_and_apply_all_migrations.sql` - Comprehensive migration script
- `scripts/backup_and_reset_migrations.sh` - Automated backup and reset script
- `scripts/run_migration_reset.sh` - Direct SQL execution script

## 🔄 What the Reset Does

### 1. **Drops All Existing Tables**
- Removes all tables in the public schema
- Drops all functions and triggers
- Clears all data (⚠️ **WARNING: This is destructive!**)

### 2. **Recreates All Tables**
- `profiles` - User profiles with RLS
- `assessments` - User assessments with RLS
- `growth_assessments` - Growth assessments with RLS
- `email_subscriptions` - Newsletter subscriptions
- `trial_users` - Trial user management
- `assessment_delegations` - Assessment delegation system
- `delegated_answers` - Delegated assessment answers
- `realtime_events` - Real-time event tracking
- `market_insights` - Market insights data
- `ai_requests` - AI request monitoring
- `ai_models` - AI model configuration
- `ai_tasks` - AI task queue
- `engagement_insights` - Engagement intelligence data
- `ai_insights_cache` - AI insights caching
- `ai_insights_refresh_log` - Cache refresh logging
- `business_news_ticker` - **NEW: News ticker headlines**

### 3. **Applies Security**
- Enables Row Level Security (RLS) on protected tables
- Creates appropriate RLS policies
- Sets up foreign key constraints
- Creates performance indexes

### 4. **News Ticker Features**
- `business_news_ticker` table with proper indexing
- RLS policies for authenticated users
- Automatic timestamp updates
- Optimized for news headline storage

## 🔧 Environment Variables

Make sure these are set:

```bash
# Required for database connection
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Required for cron jobs
export CRON_SECRET_TOKEN="your-secret-token"

# Required for news API
export NEWSAPI_KEY="your-newsapi-key"
```

## 🚨 Important Warnings

### ⚠️ **Data Loss**
- This process **WILL DELETE ALL YOUR DATA**
- Always backup before running
- Test on a development environment first

### ⚠️ **Production Considerations**
- Never run this on production without thorough testing
- Consider using Supabase's point-in-time recovery
- Have a rollback plan ready

### ⚠️ **Dependencies**
- Ensure all environment variables are set
- Verify database connectivity before running
- Check that Supabase CLI is properly configured

## 🔍 Verification Steps

After running the reset, verify:

```sql
-- Check all tables were created
SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'assessments', 'business_news_ticker');

-- Check news ticker table
SELECT * FROM business_news_ticker LIMIT 5;
```

## 🛠️ Troubleshooting

### Common Issues

#### "Permission denied" errors
```bash
# Make scripts executable
chmod +x scripts/*.sh
```

#### "Connection refused" errors
```bash
# Check your DATABASE_URL
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"
```

#### "Table already exists" errors
```bash
# The script uses IF NOT EXISTS, so this shouldn't happen
# If it does, the table might be locked - check for active connections
```

#### "RLS policy already exists" errors
```bash
# The script should handle this, but if not:
DROP POLICY IF EXISTS "policy_name" ON "table_name";
```

### Recovery Options

#### Restore from backup
```bash
# Restore schema
psql "$DATABASE_URL" -f backups/[timestamp]/schema_backup.sql

# Restore data (if needed)
psql "$DATABASE_URL" -f backups/[timestamp]/data_backup.sql
```

#### Manual table recreation
```bash
# If specific tables failed, you can recreate them manually
# Check the individual migration files in supabase/migrations/
```

## 📞 Support

If you encounter issues:

1. **Check the logs** - Look for specific error messages
2. **Verify environment** - Ensure all variables are set correctly
3. **Test connectivity** - Make sure you can connect to the database
4. **Review backups** - Ensure you have recent backups before proceeding

## 🎯 Next Steps

After successful reset:

1. **Test the application** - Ensure all features work correctly
2. **Verify news ticker** - Check that the news API integration works
3. **Monitor cron jobs** - Ensure the news fetching cron job runs properly
4. **Update documentation** - Document any changes made during the process

---

**Remember: Always backup before resetting!** 🛡️ 