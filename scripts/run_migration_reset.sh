#!/bin/bash

# Run Migration Reset Script
# This script will execute the comprehensive migration reset

echo "🚀 Starting comprehensive migration reset..."

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "scripts/reset_and_apply_all_migrations.sql" ]; then
    echo -e "${RED}❌ Migration script not found. Please run this from the project root.${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will reset your entire database!${NC}"
echo -e "${YELLOW}📋 Make sure you have backed up your data before proceeding.${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}❌ Migration reset cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}🔄 Executing migration reset...${NC}"

# Execute the migration script
psql "$DATABASE_URL" -f scripts/reset_and_apply_all_migrations.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migration reset completed successfully!${NC}"
    echo -e "${GREEN}📊 All tables, indexes, and RLS policies have been created.${NC}"
    echo -e "${GREEN}📰 News ticker table is ready for business headlines.${NC}"
    echo -e "${GREEN}🔒 Row Level Security is enabled on protected tables.${NC}"
else
    echo -e "${RED}❌ Migration reset failed. Please check the error messages above.${NC}"
    exit 1
fi 