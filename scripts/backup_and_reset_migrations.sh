#!/bin/bash

# Backup and Reset Supabase Migrations Script
# This script will backup your current database and reset migrations

echo "🚀 Starting Supabase backup and migration reset..."

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Please install it first:${NC}"
    echo "npm install -g supabase"
    exit 1
fi

# Create backup directory
BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📦 Creating backup in: $BACKUP_DIR${NC}"

# Backup current database schema
echo -e "${YELLOW}📋 Backing up database schema...${NC}"
npx supabase db dump --schema-only > "$BACKUP_DIR/schema_backup.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema backup created: $BACKUP_DIR/schema_backup.sql${NC}"
else
    echo -e "${RED}❌ Failed to backup schema${NC}"
    exit 1
fi

# Backup current data (optional - comment out if you don't want data backup)
echo -e "${YELLOW}📊 Backing up database data...${NC}"
npx supabase db dump --data-only > "$BACKUP_DIR/data_backup.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Data backup created: $BACKUP_DIR/data_backup.sql${NC}"
else
    echo -e "${RED}❌ Failed to backup data${NC}"
fi

# Backup current migrations
echo -e "${YELLOW}📁 Backing up current migrations...${NC}"
cp -r supabase/migrations "$BACKUP_DIR/migrations_backup"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migrations backup created: $BACKUP_DIR/migrations_backup${NC}"
else
    echo -e "${RED}❌ Failed to backup migrations${NC}"
    exit 1
fi

# Reset migrations
echo -e "${YELLOW}🔄 Resetting migrations...${NC}"
npx supabase db reset

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database reset successful${NC}"
else
    echo -e "${RED}❌ Failed to reset database${NC}"
    echo -e "${YELLOW}💡 You may need to manually reset the database in Supabase dashboard${NC}"
fi

# Apply all migrations
echo -e "${YELLOW}📝 Applying all migrations...${NC}"
npx supabase db push

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All migrations applied successfully${NC}"
else
    echo -e "${RED}❌ Failed to apply migrations${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Backup and migration reset completed!${NC}"
echo -e "${YELLOW}📁 Backup location: $BACKUP_DIR${NC}"
echo -e "${YELLOW}💡 If you need to restore, check the backup files in: $BACKUP_DIR${NC}" 