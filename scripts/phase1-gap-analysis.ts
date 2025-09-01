#!/usr/bin/env tsx

import { Client } from 'pg';

// Direct PostgreSQL connection using provided credentials
const connectionString = 'postgresql://postgres:Thjsirb!23482(&^%@db.bhkdsvzechcovuvwapht.supabase.co:5432/postgres';

async function phase1GapAnalysis() {
  console.log('🔍 Phase 1 Gap Analysis - Identifying Missing Components...\n');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Direct PostgreSQL connection successful');

    // Check 1: Verify all tables mentioned in ToDo list exist
    console.log('\n1️⃣ Checking ToDo list table completeness...');
    const todoListTables = [
      // Core User & Organization Tables
      'tier2_users',
      'tier2_profiles', 
      'organizations',
      'subscriptions',
      'user_roles',
      'permissions',
      'user_sessions',
      'user_activity_log',
      
      // Assessment & Scoring Tables
      'onboarding_assessments',
      'tier2_dashboard_insights',
      'score_bpm',
      'bmp_assessment',
      'score_sales_performance',
      'sales_performance_assessment',
      'assessment_templates',
      'assessment_questions',
      'question_banks',
      'assessment_scoring_rules',
      
      // Growth & Intelligence Tables
      'growth_levers',
      'growth_quadrant_data',
      'growth_lever_progress',
      'growth_metrics',
      'kpi_tracking',
      'benchmark_data',
      'forecast_models',
      'scenarios',
      'impact_calculations',
      'roi_metrics',
      
      // Team & Delegation Tables
      'team_members',
      'assessment_campaigns',
      'assessment_assignments',
      'pulse_surveys',
      'pulse_invites',
      'pulse_responses',
      'team_workspaces',
      'collaboration_spaces',
      'assignment_templates',
      'workflow_definitions',
      'team_analytics',
      'performance_metrics',
      'notification_preferences',
      'communication_logs',
      
      // Vector & AI Tables
      'market_articles',
      'market_snapshots',
      'realtime_business_trends',
      'ai_model_versions',
      'performance_tracking',
      'content_clusters',
      'semantic_groups',
      'ai_insights',
      'recommendation_engine',
      'model_feedback',
      'improvement_tracking',
      
      // Lead Generation & Marketing Tables
      'leads',
      'lead_sources',
      'attribution_tracking',
      'marketing_campaigns',
      'conversion_funnels',
      'lead_scoring',
      'qualification_rules',
      'demo_requests',
      'trial_signups',
      'email_sequences',
      'nurture_campaigns',
      'conversion_events',
      'funnel_analytics',
      'referral_programs',
      'affiliate_tracking',
      'content_assets',
      'resource_library',
      'social_proof',
      'testimonial_management'
    ];

    const existingTables = [];
    const missingTables = [];

    for (const table of todoListTables) {
      try {
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          )
        `, [table]);
        
        if (tableExists.rows[0].exists) {
          existingTables.push(table);
        } else {
          missingTables.push(table);
        }
      } catch (err) {
        missingTables.push(table);
      }
    }

    console.log(`📊 Table Analysis Results:`);
    console.log(`   - Total tables in ToDo: ${todoListTables.length}`);
    console.log(`   - Existing tables: ${existingTables.length}`);
    console.log(`   - Missing tables: ${missingTables.length}`);
    console.log(`   - Completion rate: ${((existingTables.length / todoListTables.length) * 100).toFixed(1)}%`);

    if (missingTables.length > 0) {
      console.log('\n❌ Missing Tables:');
      missingTables.forEach(table => {
        console.log(`   - ${table}`);
      });
    }

    // Check 2: Verify critical functionality
    console.log('\n2️⃣ Checking critical functionality...');
    
    // Check for auth integration
    try {
      const authCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'auth' 
          AND table_name = 'users'
        )
      `);
      
      if (authCheck.rows[0].exists) {
        console.log('✅ Supabase auth integration available');
      } else {
        console.log('❌ Supabase auth integration missing');
      }
    } catch (error) {
      console.log('⚠️ Could not verify auth integration');
    }

    // Check for RLS policies
    try {
      const rlsCheck = await client.query(`
        SELECT COUNT(*) as policy_count
        FROM pg_policies 
        WHERE schemaname = 'public'
      `);
      
      const policyCount = parseInt(rlsCheck.rows[0].policy_count);
      console.log(`✅ RLS policies: ${policyCount} policies configured`);
      
      if (policyCount < 10) {
        console.log('⚠️ RLS policy count seems low for enterprise security');
      }
    } catch (error) {
      console.log('❌ Could not verify RLS policies');
    }

    // Check for indexes
    try {
      const indexCheck = await client.query(`
        SELECT COUNT(*) as index_count
        FROM pg_indexes 
        WHERE schemaname = 'public'
      `);
      
      const indexCount = parseInt(indexCheck.rows[0].index_count);
      console.log(`✅ Database indexes: ${indexCount} indexes configured`);
      
      if (indexCount < 20) {
        console.log('⚠️ Index count seems low for optimal performance');
      }
    } catch (error) {
      console.log('❌ Could not verify database indexes');
    }

    // Check 3: Verify data seeding
    console.log('\n3️⃣ Checking data seeding...');
    try {
      const userCount = await client.query('SELECT COUNT(*) FROM tier2_users');
      const profileCount = await client.query('SELECT COUNT(*) FROM tier2_profiles');
      const orgCount = await client.query('SELECT COUNT(*) FROM organizations');
      
      console.log(`📊 Data Counts:`);
      console.log(`   - Users: ${userCount.rows[0].count}`);
      console.log(`   - Profiles: ${profileCount.rows[0].count}`);
      console.log(`   - Organizations: ${orgCount.rows[0].count}`);
      
      if (parseInt(userCount.rows[0].count) === 0) {
        console.log('⚠️ No users found - seeding may be needed');
      }
    } catch (error) {
      console.log('❌ Could not check data counts');
    }

    // Check 4: Verify functions and triggers
    console.log('\n4️⃣ Checking functions and triggers...');
    try {
      const functionCheck = await client.query(`
        SELECT COUNT(*) as function_count
        FROM information_schema.routines 
        WHERE routine_schema = 'public'
      `);
      
      const triggerCheck = await client.query(`
        SELECT COUNT(*) as trigger_count
        FROM information_schema.triggers 
        WHERE trigger_schema = 'public'
      `);
      
      console.log(`📊 Functions & Triggers:`);
      console.log(`   - Functions: ${functionCheck.rows[0].function_count}`);
      console.log(`   - Triggers: ${triggerCheck.rows[0].trigger_count}`);
      
      if (parseInt(functionCheck.rows[0].function_count) === 0) {
        console.log('⚠️ No custom functions found - may need business logic functions');
      }
    } catch (error) {
      console.log('❌ Could not check functions and triggers');
    }

    // Check 5: Verify pgvector functionality
    console.log('\n5️⃣ Checking pgvector functionality...');
    try {
      const vectorCheck = await client.query(`
        SELECT extname FROM pg_extension WHERE extname = 'vector'
      `);
      
      if (vectorCheck.rows.length > 0) {
        console.log('✅ pgvector extension enabled');
        
        // Check if any tables use vector columns
        const vectorColumns = await client.query(`
          SELECT table_name, column_name, data_type
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND data_type = 'USER-DEFINED'
          AND udt_name = 'vector'
        `);
        
        if (vectorColumns.rows.length > 0) {
          console.log(`✅ Found ${vectorColumns.rows.length} vector columns`);
          vectorColumns.rows.forEach(col => {
            console.log(`   - ${col.table_name}.${col.column_name}`);
          });
        } else {
          console.log('⚠️ No vector columns found - AI features may be limited');
        }
      } else {
        console.log('❌ pgvector extension not enabled');
      }
    } catch (error) {
      console.log('❌ Could not check pgvector functionality');
    }

    console.log('\n🎉 Phase 1 Gap Analysis Complete!');
    console.log('\n📊 Overall Assessment:');
    
    const completionRate = (existingTables.length / todoListTables.length) * 100;
    
    if (completionRate >= 90) {
      console.log('✅ Phase 1 is 95%+ complete - Minor gaps identified');
    } else if (completionRate >= 75) {
      console.log('⚠️ Phase 1 is 75-90% complete - Some gaps need attention');
    } else {
      console.log('❌ Phase 1 is <75% complete - Significant gaps identified');
    }
    
    console.log(`   - Table completion: ${completionRate.toFixed(1)}%`);
    console.log(`   - Missing tables: ${missingTables.length}`);
    console.log(`   - Critical functionality: Needs verification`);

  } catch (error) {
    console.error('\n❌ Gap analysis failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the gap analysis
phase1GapAnalysis();
