#!/usr/bin/env tsx

import { Client } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

// Direct PostgreSQL connection using provided credentials
const connectionString = 'postgresql://postgres:Thjsirb!23482(&^%@db.bhkdsvzechcovuvwapht.supabase.co:5432/postgres';

async function applyPhase1Migration() {
  console.log('🚀 Applying Phase 1 Completion Migration...\n');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Direct PostgreSQL connection successful');

    // Read the migration file
    const migrationPath = join(process.cwd(), 'supabase/migrations/20240831000001_complete_phase1_tables.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');

    console.log('📄 Migration file loaded successfully');
    console.log(`📏 Migration size: ${migrationSQL.length} characters`);

    // Apply the migration
    console.log('\n🔧 Applying migration...');
    await client.query(migrationSQL);

    console.log('✅ Migration applied successfully!');

    // Verify the tables were created
    console.log('\n🔍 Verifying new tables...');
    const newTables = [
      'user_roles', 'permissions', 'user_sessions', 'user_activity_log',
      'score_bmp', 'bmp_assessment', 'question_banks', 'kpi_tracking',
      'scenarios', 'roi_metrics', 'pulse_surveys', 'pulse_invites',
      'pulse_responses', 'collaboration_spaces', 'workflow_definitions',
      'performance_metrics', 'ai_model_versions', 'performance_tracking',
      'content_clusters', 'semantic_groups', 'ai_insights',
      'recommendation_engine', 'model_feedback', 'improvement_tracking',
      'attribution_tracking', 'conversion_funnels', 'lead_scoring',
      'qualification_rules', 'trial_signups', 'nurture_campaigns',
      'funnel_analytics', 'affiliate_tracking', 'resource_library',
      'testimonial_management'
    ];

    let createdCount = 0;
    for (const table of newTables) {
      try {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table]);
        
        if (result.rows[0].exists) {
          console.log(`✅ Table '${table}' created successfully`);
          createdCount++;
        } else {
          console.log(`❌ Table '${table}' not found`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}': ${err}`);
      }
    }

    console.log(`\n📊 Migration Results:`);
    console.log(`   - Tables expected: ${newTables.length}`);
    console.log(`   - Tables created: ${createdCount}`);
    console.log(`   - Success rate: ${((createdCount / newTables.length) * 100).toFixed(1)}%`);

    if (createdCount === newTables.length) {
      console.log('\n🎉 Phase 1 Migration Complete! All tables created successfully.');
    } else {
      console.log('\n⚠️ Some tables may not have been created. Check the logs above.');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the migration
applyPhase1Migration();
