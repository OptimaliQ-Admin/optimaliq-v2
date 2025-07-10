const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('🚀 Testing Real-Time Data Pipeline Implementation');
console.log('================================================\n');

async function testDatabaseConnection() {
  console.log('1. Testing Database Connection...');
  try {
    const { data, error } = await supabase.from('events').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function testEventInsertion() {
  console.log('\n2. Testing Event Insertion...');
  try {
    const testEvent = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      org_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      event_type: 'test_event',
      event_data: { test: true, timestamp: new Date().toISOString() },
      source: 'test_script'
    };

    const { data, error } = await supabase.from('events').insert(testEvent).select();
    if (error) throw error;
    console.log('✅ Event insertion successful');
    return true;
  } catch (error) {
    console.error('❌ Event insertion failed:', error.message);
    return false;
  }
}

async function testTeamActivityInsertion() {
  console.log('\n3. Testing Team Activity Insertion...');
  try {
    const testActivity = {
      org_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      member_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      activity_type: 'test_activity',
      activity_data: { test: true, timestamp: new Date().toISOString() },
      metadata: { source: 'test_script' }
    };

    const { data, error } = await supabase.from('team_activities').insert(testActivity).select();
    if (error) throw error;
    console.log('✅ Team activity insertion successful');
    return true;
  } catch (error) {
    console.error('❌ Team activity insertion failed:', error.message);
    return false;
  }
}

async function testAIAnalyticsInsertion() {
  console.log('\n4. Testing AI Analytics Insertion...');
  try {
    const testAnalytics = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      provider: 'test_provider',
      model: 'test_model',
      request_count: 1,
      token_count: 100,
      latency_ms: 500,
      success_rate: 1.0,
      cost_usd: 0.01,
      metadata: { test: true, timestamp: new Date().toISOString() }
    };

    const { data, error } = await supabase.from('ai_analytics').insert(testAnalytics).select();
    if (error) throw error;
    console.log('✅ AI analytics insertion successful');
    return true;
  } catch (error) {
    console.error('❌ AI analytics insertion failed:', error.message);
    return false;
  }
}

async function testUserActionsInsertion() {
  console.log('\n5. Testing User Actions Insertion...');
  try {
    const testAction = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      action: 'test_action',
      page: '/test',
      session_id: 'test-session-123',
      metadata: { test: true, timestamp: new Date().toISOString() }
    };

    const { data, error } = await supabase.from('user_actions').insert(testAction).select();
    if (error) throw error;
    console.log('✅ User actions insertion successful');
    return true;
  } catch (error) {
    console.error('❌ User actions insertion failed:', error.message);
    return false;
  }
}

async function testGrowthSimulationInsertion() {
  console.log('\n6. Testing Growth Simulation Insertion...');
  try {
    const testSimulation = {
      user_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      simulation_type: 'test_simulation',
      input_data: { strategy_score: 75, process_score: 80, technology_score: 70 },
      output_data: { revenue_impact: 15, cost_savings: 10, efficiency_gain: 20 },
      status: 'completed',
      metadata: { test: true, timestamp: new Date().toISOString() }
    };

    const { data, error } = await supabase.from('growth_simulations').insert(testSimulation).select();
    if (error) throw error;
    console.log('✅ Growth simulation insertion successful');
    return true;
  } catch (error) {
    console.error('❌ Growth simulation insertion failed:', error.message);
    return false;
  }
}

async function insertTestUser() {
  // Insert a test user into tier2_users if not exists
  const testUUID = '00000000-0000-0000-0000-000000000000';
  const testUser = {
    u_id: testUUID,
    role: 'test',
    email: 'testuser@example.com'
  };
  // Try insert, ignore error if already exists
  await supabase.from('tier2_users').upsert(testUser, { onConflict: ['u_id'] });
}

async function deleteTestUser() {
  const testUUID = '00000000-0000-0000-0000-000000000000';
  await supabase.from('tier2_users').delete().eq('u_id', testUUID);
}

async function testExistingTables() {
  console.log('\n7. Testing Existing Tables (growth_levers, growth_insights, notifications)...');
  
  try {
    await insertTestUser();
    // Test growth_levers (using u_id)
    const testLever = {
      u_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      levers: ['test_lever_1', 'test_lever_2'],
      generated_at: new Date().toISOString()
    };

    const { data: leverData, error: leverError } = await supabase.from('growth_levers').insert(testLever).select();
    if (leverError) throw leverError;
    console.log('✅ Growth levers insertion successful');

    // Test growth_insights (using u_id)
    const testInsight = {
      u_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      strategy_score: 75,
      strategy_insight: 'Test strategy insight',
      process_score: 80,
      process_insight: 'Test process insight',
      technology_score: 70,
      technology_insight: 'Test technology insight',
      overall_score: 75,
      fallback_score_gpt: 0,
      generatedat: new Date().toISOString()
    };

    const { data: insightData, error: insightError } = await supabase.from('growth_insights').insert(testInsight).select();
    if (insightError) throw insightError;
    console.log('✅ Growth insights insertion successful');

    // Test notifications (using u_id)
    const testNotification = {
      id: '00000000-0000-0000-0000-000000000000', // Test UUID for id
      u_id: '00000000-0000-0000-0000-000000000000', // Test UUID
      type: 'test_notification',
      title: 'Test Notification',
      message: 'This is a test notification',
      priority: 'medium',
      link: '/test',
      is_read: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: notifData, error: notifError } = await supabase.from('notifications').insert(testNotification).select();
    if (notifError) throw notifError;
    console.log('✅ Notifications insertion successful');

    return true;
  } catch (error) {
    console.error('❌ Existing tables test failed:', error.message);
    return false;
  }
}

async function testTableStructure() {
  console.log('\n8. Testing Table Structure...');
  
  const tables = [
    'events',
    'team_activities', 
    'team_analytics',
    'ai_analytics',
    'user_actions',
    'user_analytics',
    'user_sessions',
    'growth_simulations',
    'growth_levers',
    'growth_insights',
    'notifications'
  ];

  let allTablesExist = true;

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ Table ${table} not accessible:`, error.message);
        allTablesExist = false;
      } else {
        console.log(`✅ Table ${table} accessible`);
      }
    } catch (error) {
      console.error(`❌ Table ${table} error:`, error.message);
      allTablesExist = false;
    }
  }

  return allTablesExist;
}

async function cleanupTestData() {
  console.log('\n9. Cleaning up test data...');
  
  // Only delete by test UUID for all tables
  const testUUID = '00000000-0000-0000-0000-000000000000';
  const tables = [
    'events',
    'team_activities',
    'ai_analytics', 
    'user_actions',
    'growth_simulations',
    'growth_levers',
    'growth_insights',
    'notifications'
  ];

  for (const table of tables) {
    try {
      let query = supabase.from(table).delete();
      if (table === 'growth_levers' || table === 'growth_insights' || table === 'notifications') {
        query = query.eq('u_id', testUUID);
      } else if (table === 'events' || table === 'ai_analytics' || table === 'user_actions' || table === 'growth_simulations') {
        query = query.eq('user_id', testUUID);
      } else if (table === 'team_activities') {
        query = query.eq('member_id', testUUID);
      }
      const { error } = await query;
      if (error) {
        console.error(`⚠️  Cleanup for ${table} failed:`, error.message);
      } else {
        console.log(`✅ Cleaned up test data from ${table}`);
      }
    } catch (error) {
      console.error(`⚠️  Cleanup for ${table} error:`, error.message);
    }
  }
  await deleteTestUser();
}

async function runAllTests() {
  const tests = [
    testDatabaseConnection,
    testEventInsertion,
    testTeamActivityInsertion,
    testAIAnalyticsInsertion,
    testUserActionsInsertion,
    testGrowthSimulationInsertion,
    testExistingTables,
    testTableStructure
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    const result = await test();
    if (result) passedTests++;
  }

  console.log('\n================================================');
  console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Real-time data pipeline is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.');
  }

  await cleanupTestData();
  console.log('\n🧹 Test cleanup completed');
}

// Run the tests
runAllTests().catch(console.error); 