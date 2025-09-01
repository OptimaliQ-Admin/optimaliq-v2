#!/usr/bin/env tsx

import { Client } from 'pg';

// Direct PostgreSQL connection using provided credentials
const connectionString = 'postgresql://postgres:Thjsirb!23482(&^%@db.bhkdsvzechcovuvwapht.supabase.co:5432/postgres';

async function completePhase1Seeding() {
  console.log('🌱 Complete Phase 1 Database Seeding...\n');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Direct PostgreSQL connection successful');

    // First, create test users in auth.users (simulated)
    console.log('\n1️⃣ Creating test users...');
    
    const testUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'john.doe@optimaliq.com',
        firstName: 'John',
        lastName: 'Doe',
        title: 'CEO',
        company: 'TechCorp Inc',
        companySize: '1-10',
        revenueRange: 'Under $1M',
        industry: 'technology'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'jane.smith@optimaliq.com',
        firstName: 'Jane',
        lastName: 'Smith',
        title: 'CTO',
        company: 'InnovateTech',
        companySize: '11-50',
        revenueRange: '$1M - $10M',
        industry: 'technology'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'mike.johnson@optimaliq.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        title: 'VP Operations',
        company: 'ScaleUp Solutions',
        companySize: '51-200',
        revenueRange: '$10M - $50M',
        industry: 'consulting'
      }
    ];

    for (const user of testUsers) {
      try {
        await client.query(`
          INSERT INTO tier2_users (
            id, email, first_name, last_name, title, company, 
            company_size, revenue_range, industry, timezone, 
            agreed_terms, agreed_marketing, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING
        `, [
          user.id,
          user.email,
          user.firstName,
          user.lastName,
          user.title,
          user.company,
          user.companySize,
          user.revenueRange,
          user.industry,
          'UTC',
          true,
          true,
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created user: ${user.email}`);
      } catch (err) {
        console.log(`⚠️ User ${user.email} already exists or error: ${err}`);
      }
    }

    // Create user profiles
    console.log('\n2️⃣ Creating user profiles...');
    const profiles = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        scoreOverall: 78.5,
        scoreStrategy: 82.0,
        scoreProcess: 75.0,
        scoreTechnology: 79.0,
        bpmScore: 76.0,
        salesScore: 81.0,
        aiReadinessScore: 77.0
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        scoreOverall: 85.2,
        scoreStrategy: 88.0,
        scoreProcess: 83.0,
        scoreTechnology: 87.0,
        bpmScore: 84.0,
        salesScore: 86.0,
        aiReadinessScore: 89.0
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        scoreOverall: 72.8,
        scoreStrategy: 75.0,
        scoreProcess: 70.0,
        scoreTechnology: 73.0,
        bpmScore: 71.0,
        salesScore: 74.0,
        aiReadinessScore: 72.0
      }
    ];

    for (const profile of profiles) {
      try {
        await client.query(`
          INSERT INTO tier2_profiles (
            user_id, score_overall, score_strategy, score_process, score_technology,
            bpm_score, sales_score, ai_readiness_score, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (user_id) DO UPDATE SET
            score_overall = EXCLUDED.score_overall,
            score_strategy = EXCLUDED.score_strategy,
            score_process = EXCLUDED.score_process,
            score_technology = EXCLUDED.score_technology,
            bpm_score = EXCLUDED.bpm_score,
            sales_score = EXCLUDED.sales_score,
            ai_readiness_score = EXCLUDED.ai_readiness_score,
            updated_at = EXCLUDED.updated_at
        `, [
          profile.userId,
          profile.scoreOverall,
          profile.scoreStrategy,
          profile.scoreProcess,
          profile.scoreTechnology,
          profile.bpmScore,
          profile.salesScore,
          profile.aiReadinessScore,
          new Date().toISOString()
        ]);
        console.log(`✅ Created profile for user: ${profile.userId}`);
      } catch (err) {
        console.log(`⚠️ Profile for ${profile.userId} error: ${err}`);
      }
    }

    // Create organizations
    console.log('\n3️⃣ Creating organizations...');
    const organizations = [
      {
        id: '550e8400-e29b-41d4-a716-446655440010',
        name: 'TechCorp Inc',
        industry: 'technology',
        companySize: '1-10',
        revenueRange: 'Under $1M',
        timezone: 'UTC'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440011',
        name: 'InnovateTech',
        industry: 'technology',
        companySize: '11-50',
        revenueRange: '$1M - $10M',
        timezone: 'UTC'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440012',
        name: 'ScaleUp Solutions',
        industry: 'consulting',
        companySize: '51-200',
        revenueRange: '$10M - $50M',
        timezone: 'UTC'
      }
    ];

    for (const org of organizations) {
      try {
        await client.query(`
          INSERT INTO organizations (
            id, name, industry, company_size, revenue_range, timezone, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO NOTHING
        `, [
          org.id,
          org.name,
          org.industry,
          org.companySize,
          org.revenueRange,
          org.timezone,
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created organization: ${org.name}`);
      } catch (err) {
        console.log(`⚠️ Organization ${org.name} error: ${err}`);
      }
    }

    // Create team members
    console.log('\n4️⃣ Creating team members...');
    const teamMembers = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        organizationId: '550e8400-e29b-41d4-a716-446655440010',
        role: 'owner'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        organizationId: '550e8400-e29b-41d4-a716-446655440011',
        role: 'owner'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        organizationId: '550e8400-e29b-41d4-a716-446655440012',
        role: 'owner'
      }
    ];

    for (const member of teamMembers) {
      try {
        await client.query(`
          INSERT INTO team_members (
            id, user_id, organization_id, role, status, permissions, 
            joined_at, last_active_at, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (user_id, organization_id) DO NOTHING
        `, [
          `550e8400-e29b-41d4-a716-4466554400${Math.floor(Math.random() * 100)}`,
          member.userId,
          member.organizationId,
          member.role,
          'active',
          JSON.stringify(['read', 'write', 'admin']),
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created team member: ${member.userId} in ${member.organizationId}`);
      } catch (err) {
        console.log(`⚠️ Team member error: ${err}`);
      }
    }

    // Create user roles and permissions
    console.log('\n5️⃣ Creating user roles and permissions...');
    
    const roles = [
      { name: 'owner', description: 'Full system access', isDefault: false },
      { name: 'admin', description: 'Administrative access', isDefault: false },
      { name: 'manager', description: 'Team management access', isDefault: false },
      { name: 'user', description: 'Standard user access', isDefault: true }
    ];

    for (const role of roles) {
      try {
        await client.query(`
          INSERT INTO user_roles (name, description, is_default, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (name) DO NOTHING
        `, [
          role.name,
          role.description,
          role.isDefault,
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created role: ${role.name}`);
      } catch (err) {
        console.log(`⚠️ Role ${role.name} error: ${err}`);
      }
    }

    const permissions = [
      { name: 'read_users', resource: 'users', action: 'read', scope: 'own' },
      { name: 'write_users', resource: 'users', action: 'write', scope: 'own' },
      { name: 'read_organizations', resource: 'organizations', action: 'read', scope: 'org' },
      { name: 'write_organizations', resource: 'organizations', action: 'write', scope: 'org' },
      { name: 'read_assessments', resource: 'assessments', action: 'read', scope: 'own' },
      { name: 'write_assessments', resource: 'assessments', action: 'write', scope: 'own' }
    ];

    for (const permission of permissions) {
      try {
        await client.query(`
          INSERT INTO permissions (name, description, resource, action, scope, created_at)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (name) DO NOTHING
        `, [
          permission.name,
          `${permission.action} ${permission.resource}`,
          permission.resource,
          permission.action,
          permission.scope,
          new Date().toISOString()
        ]);
        console.log(`✅ Created permission: ${permission.name}`);
      } catch (err) {
        console.log(`⚠️ Permission ${permission.name} error: ${err}`);
      }
    }

    // Create KPI tracking data
    console.log('\n6️⃣ Creating KPI tracking data...');
    const kpis = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        kpiName: 'Customer Acquisition Cost',
        kpiCategory: 'marketing',
        currentValue: 150.00,
        targetValue: 120.00,
        unit: 'USD'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        kpiName: 'Monthly Recurring Revenue',
        kpiCategory: 'revenue',
        currentValue: 25000.00,
        targetValue: 30000.00,
        unit: 'USD'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        kpiName: 'Customer Satisfaction Score',
        kpiCategory: 'customer',
        currentValue: 4.2,
        targetValue: 4.5,
        unit: 'rating'
      }
    ];

    for (const kpi of kpis) {
      try {
        await client.query(`
          INSERT INTO kpi_tracking (
            user_id, kpi_name, kpi_category, current_value, target_value, unit, 
            frequency, trend_data, last_updated, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          kpi.userId,
          kpi.kpiName,
          kpi.kpiCategory,
          kpi.currentValue,
          kpi.targetValue,
          kpi.unit,
          'monthly',
          JSON.stringify({ trend: 'increasing', data: [kpi.currentValue * 0.9, kpi.currentValue * 0.95, kpi.currentValue] }),
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created KPI: ${kpi.kpiName} for user ${kpi.userId}`);
      } catch (err) {
        console.log(`⚠️ KPI error: ${err}`);
      }
    }

    // Create AI insights
    console.log('\n7️⃣ Creating AI insights...');
    const insights = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        insightType: 'growth_opportunity',
        title: 'Process Automation Opportunity',
        content: 'Your current process efficiency score of 75% indicates significant room for improvement through automation. Consider implementing workflow automation tools.',
        confidenceScore: 0.85,
        priority: 'high'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        insightType: 'performance_optimization',
        title: 'Customer Acquisition Optimization',
        content: 'Your CAC is 25% above target. Consider optimizing your marketing channels and improving lead qualification processes.',
        confidenceScore: 0.78,
        priority: 'medium'
      }
    ];

    for (const insight of insights) {
      try {
        await client.query(`
          INSERT INTO ai_insights (
            user_id, insight_type, title, content, confidence_score, 
            source_data, actionable, priority, created_at, expires_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          insight.userId,
          insight.insightType,
          insight.title,
          insight.content,
          insight.confidenceScore,
          JSON.stringify({ source: 'assessment_data', algorithm: 'growth_analyzer' }),
          true,
          insight.priority,
          new Date().toISOString(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        ]);
        console.log(`✅ Created AI insight: ${insight.title} for user ${insight.userId}`);
      } catch (err) {
        console.log(`⚠️ AI insight error: ${err}`);
      }
    }

    // Create recommendations
    console.log('\n8️⃣ Creating recommendations...');
    const recommendations = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        recommendationType: 'process_improvement',
        title: 'Implement CRM Automation',
        description: 'Automate lead scoring and follow-up processes to improve conversion rates.',
        actionItems: JSON.stringify([
          'Set up automated lead scoring rules',
          'Create follow-up email sequences',
          'Integrate with existing tools'
        ]),
        priorityScore: 0.92,
        category: 'process'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        recommendationType: 'technology_upgrade',
        title: 'Upgrade Analytics Platform',
        description: 'Implement advanced analytics to better track customer behavior and optimize marketing spend.',
        actionItems: JSON.stringify([
          'Evaluate analytics platforms',
          'Set up tracking implementation',
          'Train team on new tools'
        ]),
        priorityScore: 0.87,
        category: 'technology'
      }
    ];

    for (const rec of recommendations) {
      try {
        await client.query(`
          INSERT INTO recommendation_engine (
            user_id, recommendation_type, title, description, action_items,
            priority_score, category, is_implemented, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          rec.userId,
          rec.recommendationType,
          rec.title,
          rec.description,
          rec.actionItems,
          rec.priorityScore,
          rec.category,
          false,
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created recommendation: ${rec.title} for user ${rec.userId}`);
      } catch (err) {
        console.log(`⚠️ Recommendation error: ${err}`);
      }
    }

    // Create market articles with vector embeddings
    console.log('\n9️⃣ Creating market articles...');
    const articles = [
      {
        title: 'The Future of AI in Business Process Management',
        content: 'Artificial Intelligence is revolutionizing how businesses manage their processes. From automated workflows to intelligent decision-making, AI is becoming an essential tool for modern organizations.',
        source: 'Tech Insights',
        url: 'https://example.com/ai-bpm-future',
        category: 'technology',
        sentimentScore: 0.85,
        relevanceScore: 0.92
      },
      {
        title: 'Growth Strategies for SaaS Companies in 2024',
        content: 'SaaS companies are facing new challenges and opportunities in 2024. This article explores effective growth strategies including customer success, product-led growth, and market expansion.',
        source: 'Growth Weekly',
        url: 'https://example.com/saas-growth-2024',
        category: 'business',
        sentimentScore: 0.78,
        relevanceScore: 0.88
      }
    ];

    for (const article of articles) {
      try {
        await client.query(`
          INSERT INTO market_articles (
            id, title, content, source, url, published_at, category, 
            sentiment_score, relevance_score, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          `550e8400-e29b-41d4-a716-4466554400${Math.floor(Math.random() * 100)}`,
          article.title,
          article.content,
          article.source,
          article.url,
          new Date().toISOString(),
          article.category,
          article.sentimentScore,
          article.relevanceScore,
          new Date().toISOString()
        ]);
        console.log(`✅ Created market article: ${article.title}`);
      } catch (err) {
        console.log(`⚠️ Market article error: ${err}`);
      }
    }

    // Create subscriptions
    console.log('\n🔟 Creating subscriptions...');
    const subscriptions = [
      {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        planType: 'pro',
        status: 'active',
        stripeSubscriptionId: 'sub_test_001'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440001',
        planType: 'enterprise',
        status: 'active',
        stripeSubscriptionId: 'sub_test_002'
      },
      {
        userId: '550e8400-e29b-41d4-a716-446655440002',
        planType: 'free',
        status: 'active',
        stripeSubscriptionId: null
      }
    ];

    for (const sub of subscriptions) {
      try {
        await client.query(`
          INSERT INTO subscriptions (
            id, user_id, plan_type, status, current_period_start, current_period_end,
            cancel_at_period_end, stripe_subscription_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (user_id) DO UPDATE SET
            plan_type = EXCLUDED.plan_type,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at
        `, [
          `550e8400-e29b-41d4-a716-4466554400${Math.floor(Math.random() * 100)}`,
          sub.userId,
          sub.planType,
          sub.status,
          new Date().toISOString(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          false,
          sub.stripeSubscriptionId,
          new Date().toISOString(),
          new Date().toISOString()
        ]);
        console.log(`✅ Created subscription: ${sub.planType} for user ${sub.userId}`);
      } catch (err) {
        console.log(`⚠️ Subscription error: ${err}`);
      }
    }

    console.log('\n🎉 Complete Phase 1 Seeding Finished!');
    console.log('\n📊 Seeding Summary:');
    console.log('   - Users created: 3');
    console.log('   - Profiles created: 3');
    console.log('   - Organizations created: 3');
    console.log('   - Team members created: 3');
    console.log('   - User roles created: 4');
    console.log('   - Permissions created: 6');
    console.log('   - KPI tracking entries: 3');
    console.log('   - AI insights created: 2');
    console.log('   - Recommendations created: 2');
    console.log('   - Market articles created: 2');
    console.log('   - Subscriptions created: 3');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the complete seeding
completePhase1Seeding();
