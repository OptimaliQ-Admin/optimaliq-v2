#!/usr/bin/env tsx

import { Client } from 'pg';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Direct PostgreSQL connection using provided credentials
const connectionString = 'postgresql://postgres:Thjsirb!23482(&^%@db.bhkdsvzechcovuvwapht.supabase.co:5432/postgres';

async function phase2Verification() {
  console.log('🎯 Phase 2 Verification - AI Infrastructure & Orchestration...\n');

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Direct PostgreSQL connection successful');

    // Check 1: Verify AI Infrastructure Files
    console.log('\n1️⃣ Checking AI Infrastructure Files...');
    
    const aiFiles = [
      'src/lib/ai-router.ts',
      'src/lib/ai/agents/base-agent.ts',
      'src/lib/ai/agents/assessment-agent.ts',
      'src/lib/ai/agents/growth-planning-agent.ts',
      'src/lib/ai/agents/market-intelligence-agent.ts',
      'src/lib/ai/agents/delegation-agent.ts',
      'src/lib/ai/agents/agent-manager.ts',
      'src/lib/ai/agents/index.ts'
    ];

    const existingFiles = [];
    const missingFiles = [];

    for (const file of aiFiles) {
      if (existsSync(join(process.cwd(), file))) {
        existingFiles.push(file);
        console.log(`✅ ${file} exists`);
      } else {
        missingFiles.push(file);
        console.log(`❌ ${file} missing`);
      }
    }

    console.log(`\n📊 AI Files Analysis:`);
    console.log(`   - Files expected: ${aiFiles.length}`);
    console.log(`   - Files found: ${existingFiles.length}`);
    console.log(`   - Files missing: ${missingFiles.length}`);

    // Check 2: Verify AI Router Implementation
    console.log('\n2️⃣ Checking AI Router Implementation...');
    
    let implementedRouterFeatures = 0;
    if (existsSync(join(process.cwd(), 'src/lib/ai-router.ts'))) {
      const aiRouterContent = readFileSync(join(process.cwd(), 'src/lib/ai-router.ts'), 'utf8');
      
      const routerFeatures = [
        { name: 'Multi-Provider Support', pattern: /AIProvider\.(OPENAI|ANTHROPIC|GOOGLE|MISTRAL)/g },
        { name: 'Provider Selection Logic', pattern: /selectProvider|selectBestProvider/g },
        { name: 'Cost Tracking', pattern: /costTracker|costPerToken/g },
        { name: 'Performance Monitoring', pattern: /performanceMetrics|latency/g },
        { name: 'Fallback Mechanisms', pattern: /fallback|retry/g },
        { name: 'Task-Based Routing', pattern: /AITask|task.*priority/g }
      ];

      for (const feature of routerFeatures) {
        const matches = aiRouterContent.match(feature.pattern);
        if (matches && matches.length > 0) {
          console.log(`✅ ${feature.name}: ${matches.length} implementations found`);
          implementedRouterFeatures++;
        } else {
          console.log(`❌ ${feature.name}: Not implemented`);
        }
      }

      console.log(`\n📊 AI Router Features:`);
      console.log(`   - Features expected: ${routerFeatures.length}`);
      console.log(`   - Features implemented: ${implementedRouterFeatures}`);
      console.log(`   - Implementation rate: ${((implementedRouterFeatures / routerFeatures.length) * 100).toFixed(1)}%`);
    }

    // Check 3: Verify AI Agents Implementation
    console.log('\n3️⃣ Checking AI Agents Implementation...');
    
    const agentFiles = [
      'src/lib/ai/agents/assessment-agent.ts',
      'src/lib/ai/agents/growth-planning-agent.ts',
      'src/lib/ai/agents/market-intelligence-agent.ts',
      'src/lib/ai/agents/delegation-agent.ts'
    ];

    let implementedAgents = 0;
    for (const agentFile of agentFiles) {
      if (existsSync(join(process.cwd(), agentFile))) {
        const agentContent = readFileSync(join(process.cwd(), agentFile), 'utf8');
        
        // Check for key agent features
        const hasPlanning = agentContent.includes('async plan(');
        const hasExecution = agentContent.includes('async execute(');
        const hasValidation = agentContent.includes('async validate(');
        const hasTools = agentContent.includes('registerTool(');
        const hasMemory = agentContent.includes('setMemory(') || agentContent.includes('getMemory(');
        
        if (hasPlanning && hasExecution && hasValidation) {
          console.log(`✅ ${agentFile.split('/').pop()}: Full implementation`);
          implementedAgents++;
        } else {
          console.log(`⚠️ ${agentFile.split('/').pop()}: Partial implementation`);
        }
      }
    }

    console.log(`\n📊 AI Agents Analysis:`);
    console.log(`   - Agents expected: ${agentFiles.length}`);
    console.log(`   - Agents implemented: ${implementedAgents}`);
    console.log(`   - Implementation rate: ${((implementedAgents / agentFiles.length) * 100).toFixed(1)}%`);

    // Check 4: Verify RAG Pipeline Implementation
    console.log('\n4️⃣ Checking RAG Pipeline Implementation...');
    
    const ragFeatures = [
      { name: 'Vector Database', check: async () => {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM pg_extension WHERE extname = 'vector'
          )
        `);
        return result.rows[0].exists;
      }},
      { name: 'Market Articles Table', check: async () => {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'market_articles'
          )
        `);
        return result.rows[0].exists;
      }},
      { name: 'Vector Indexes', check: async () => {
        const result = await client.query(`
          SELECT COUNT(*) FROM pg_indexes 
          WHERE indexname LIKE '%embed%' OR indexname LIKE '%vector%'
        `);
        return parseInt(result.rows[0].count) > 0;
      }},
      { name: 'Embedding Generation', check: async () => {
        // Check if embedding generation is implemented in code
        const aiRouterContent = existsSync(join(process.cwd(), 'src/lib/ai-router.ts')) 
          ? readFileSync(join(process.cwd(), 'src/lib/ai-router.ts'), 'utf8')
          : '';
        return aiRouterContent.includes('EMBEDDINGS') || aiRouterContent.includes('embed(');
      }},
      { name: 'Vector Search', check: async () => {
        // Check if vector search is implemented
        const supabaseContent = existsSync(join(process.cwd(), 'src/lib/supabase.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/supabase.ts'), 'utf8')
          : '';
        return supabaseContent.includes('searchMarketArticles') || supabaseContent.includes('vector');
      }},
      { name: 'Content Clustering', check: async () => {
        // Check if clustering is implemented
        const marketAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/market-intelligence-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/market-intelligence-agent.ts'), 'utf8')
          : '';
        return marketAgentContent.includes('clusterContent') || marketAgentContent.includes('clustering');
      }}
    ];

    let implementedRAGFeatures = 0;
    for (const feature of ragFeatures) {
      try {
        const isImplemented = await feature.check();
        if (isImplemented) {
          console.log(`✅ ${feature.name}: Implemented`);
          implementedRAGFeatures++;
        } else {
          console.log(`❌ ${feature.name}: Not implemented`);
        }
      } catch (error) {
        console.log(`❌ ${feature.name}: Error checking - ${error}`);
      }
    }

    console.log(`\n📊 RAG Pipeline Analysis:`);
    console.log(`   - Features expected: ${ragFeatures.length}`);
    console.log(`   - Features implemented: ${implementedRAGFeatures}`);
    console.log(`   - Implementation rate: ${((implementedRAGFeatures / ragFeatures.length) * 100).toFixed(1)}%`);

    // Check 5: Verify AI Scoring & Assessment Engine
    console.log('\n5️⃣ Checking AI Scoring & Assessment Engine...');
    
    const scoringFeatures = [
      { name: 'Deterministic Scoring', check: async () => {
        const assessmentAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'), 'utf8')
          : '';
        return assessmentAgentContent.includes('calculateScores') || assessmentAgentContent.includes('deterministic');
      }},
      { name: 'Assessment Frameworks', check: async () => {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'assessment_templates'
          )
        `);
        return result.rows[0].exists;
      }},
      { name: 'Question Branching', check: async () => {
        const assessmentAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'), 'utf8')
          : '';
        return assessmentAgentContent.includes('branching') || assessmentAgentContent.includes('dynamic');
      }},
      { name: 'Benchmarking', check: async () => {
        const assessmentAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'), 'utf8')
          : '';
        return assessmentAgentContent.includes('getBenchmarks') || assessmentAgentContent.includes('benchmark');
      }},
      { name: 'Progress Tracking', check: async () => {
        const result = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'onboarding_assessments'
          )
        `);
        return result.rows[0].exists;
      }}
    ];

    let implementedScoringFeatures = 0;
    for (const feature of scoringFeatures) {
      try {
        const isImplemented = await feature.check();
        if (isImplemented) {
          console.log(`✅ ${feature.name}: Implemented`);
          implementedScoringFeatures++;
        } else {
          console.log(`❌ ${feature.name}: Not implemented`);
        }
      } catch (error) {
        console.log(`❌ ${feature.name}: Error checking - ${error}`);
      }
    }

    console.log(`\n📊 Scoring Engine Analysis:`);
    console.log(`   - Features expected: ${scoringFeatures.length}`);
    console.log(`   - Features implemented: ${implementedScoringFeatures}`);
    console.log(`   - Implementation rate: ${((implementedScoringFeatures / scoringFeatures.length) * 100).toFixed(1)}%`);

    // Check 6: Verify AI Content Generation
    console.log('\n6️⃣ Checking AI Content Generation...');
    
    const contentFeatures = [
      { name: 'Roadmap Generation', check: async () => {
        const growthAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/growth-planning-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/growth-planning-agent.ts'), 'utf8')
          : '';
        return growthAgentContent.includes('roadmap') || growthAgentContent.includes('generateRoadmap');
      }},
      { name: 'Growth Lever Generation', check: async () => {
        const growthAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/growth-planning-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/growth-planning-agent.ts'), 'utf8')
          : '';
        return growthAgentContent.includes('growthLever') || growthAgentContent.includes('generateLevers');
      }},
      { name: 'Trend Analysis', check: async () => {
        const marketAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/market-intelligence-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/market-intelligence-agent.ts'), 'utf8')
          : '';
        return marketAgentContent.includes('analyzeTrends') || marketAgentContent.includes('trend');
      }},
      { name: 'Advisory Content', check: async () => {
        const assessmentAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'), 'utf8')
          : '';
        return assessmentAgentContent.includes('insights') || assessmentAgentContent.includes('recommendations');
      }},
      { name: 'Personalized Insights', check: async () => {
        const assessmentAgentContent = existsSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'))
          ? readFileSync(join(process.cwd(), 'src/lib/ai/agents/assessment-agent.ts'), 'utf8')
          : '';
        return assessmentAgentContent.includes('personalized') || assessmentAgentContent.includes('customize');
      }}
    ];

    let implementedContentFeatures = 0;
    for (const feature of contentFeatures) {
      try {
        const isImplemented = await feature.check();
        if (isImplemented) {
          console.log(`✅ ${feature.name}: Implemented`);
          implementedContentFeatures++;
        } else {
          console.log(`❌ ${feature.name}: Not implemented`);
        }
      } catch (error) {
        console.log(`❌ ${feature.name}: Error checking - ${error}`);
      }
    }

    console.log(`\n📊 Content Generation Analysis:`);
    console.log(`   - Features expected: ${contentFeatures.length}`);
    console.log(`   - Features implemented: ${implementedContentFeatures}`);
    console.log(`   - Implementation rate: ${((implementedContentFeatures / contentFeatures.length) * 100).toFixed(1)}%`);

    // Calculate overall Phase 2 completion
    console.log('\n🎉 Phase 2 Verification Complete!');
    console.log('\n📊 Overall Assessment:');
    
    const routerFeaturesCount = 6; // From the routerFeatures array
    const totalFeatures = routerFeaturesCount + agentFiles.length + ragFeatures.length + scoringFeatures.length + contentFeatures.length;
    const totalImplementedFeatures = implementedRouterFeatures + implementedAgents + implementedRAGFeatures + implementedScoringFeatures + implementedContentFeatures;
    const completionRate = (totalImplementedFeatures / totalFeatures) * 100;
    
    if (completionRate >= 90) {
      console.log('✅ Phase 2 is 90%+ complete - EXCELLENT!');
    } else if (completionRate >= 75) {
      console.log('⚠️ Phase 2 is 75-90% complete - Very Good');
    } else if (completionRate >= 50) {
      console.log('⚠️ Phase 2 is 50-75% complete - Good Progress');
    } else {
      console.log('❌ Phase 2 is <50% complete - Needs Significant Work');
    }
    
    console.log(`   - Total features: ${totalFeatures}`);
    console.log(`   - Implemented features: ${totalImplementedFeatures}`);
    console.log(`   - Completion rate: ${completionRate.toFixed(1)}%`);
    console.log(`   - AI Router: ${((implementedRouterFeatures / routerFeaturesCount) * 100).toFixed(1)}%`);
    console.log(`   - AI Agents: ${((implementedAgents / agentFiles.length) * 100).toFixed(1)}%`);
    console.log(`   - RAG Pipeline: ${((implementedRAGFeatures / ragFeatures.length) * 100).toFixed(1)}%`);
    console.log(`   - Scoring Engine: ${((implementedScoringFeatures / scoringFeatures.length) * 100).toFixed(1)}%`);
    console.log(`   - Content Generation: ${((implementedContentFeatures / contentFeatures.length) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('\n❌ Phase 2 verification failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the verification
phase2Verification();
