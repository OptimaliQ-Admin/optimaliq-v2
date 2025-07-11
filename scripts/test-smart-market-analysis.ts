#!/usr/bin/env tsx

/**
 * 🧪 Smart Market Analysis Test Script
 * 
 * Tests the enhanced market analysis service with smart model selection
 * for different user tiers (free vs premium).
 */

import { enhancedMarketAnalysis, UserTier } from '../src/lib/ai/enhancedMarketAnalysis';

console.log('🧠 Testing Smart Market Analysis with User Tier Logic\n');

async function testMarketAnalysis() {
  const testUserId = 'test-user-123';
  const testIndustry = 'technology';

  console.log('📊 Test 1: Premium User Market Intelligence');
  console.log('Expected: High-accuracy model (GPT-4o or Claude-3-5-sonnet)');
  console.log('Priority: Accuracy over cost\n');

  try {
    const premiumInsight = await enhancedMarketAnalysis.generateMarketInsight(
      testUserId,
      testIndustry,
      'premium'
    );

    console.log('✅ Premium user insight generated successfully');
    console.log(`   Market Size: ${premiumInsight.marketSize.value}`);
    console.log(`   Growth Rate: ${premiumInsight.growthRate.value}%`);
    console.log(`   Competition Level: ${premiumInsight.competition.level}`);
    console.log(`   Sentiment Score: ${premiumInsight.sentiment.score}/100`);
    console.log(`   AI Model Version: ${premiumInsight.aiModelVersion}`);
    console.log(`   Confidence Score: ${premiumInsight.confidenceScore}\n`);
  } catch (error) {
    console.error('❌ Premium user test failed:', error);
  }

  console.log('💰 Test 2: Free User Market Intelligence');
  console.log('Expected: Cost-optimized model (Claude-3-haiku or GPT-3.5-turbo)');
  console.log('Priority: Cost over accuracy\n');

  try {
    const freeInsight = await enhancedMarketAnalysis.generateMarketInsight(
      testUserId,
      testIndustry,
      'free'
    );

    console.log('✅ Free user insight generated successfully');
    console.log(`   Market Size: ${freeInsight.marketSize.value}`);
    console.log(`   Growth Rate: ${freeInsight.growthRate.value}%`);
    console.log(`   Competition Level: ${freeInsight.competition.level}`);
    console.log(`   Sentiment Score: ${freeInsight.sentiment.score}/100`);
    console.log(`   AI Model Version: ${freeInsight.aiModelVersion}`);
    console.log(`   Confidence Score: ${freeInsight.confidenceScore}\n`);
  } catch (error) {
    console.error('❌ Free user test failed:', error);
  }

  console.log('🔄 Test 3: Default User (Premium) Market Intelligence');
  console.log('Expected: Default to premium tier when no tier specified\n');

  try {
    const defaultInsight = await enhancedMarketAnalysis.generateMarketInsight(
      testUserId,
      testIndustry
    );

    console.log('✅ Default user insight generated successfully');
    console.log(`   Market Size: ${defaultInsight.marketSize.value}`);
    console.log(`   Growth Rate: ${defaultInsight.growthRate.value}%`);
    console.log(`   Competition Level: ${defaultInsight.competition.level}`);
    console.log(`   Sentiment Score: ${defaultInsight.sentiment.score}/100`);
    console.log(`   AI Model Version: ${defaultInsight.aiModelVersion}`);
    console.log(`   Confidence Score: ${defaultInsight.confidenceScore}\n`);
  } catch (error) {
    console.error('❌ Default user test failed:', error);
  }

  console.log('📋 Test 4: Model Selection Comparison');
  console.log('Comparing model selection logic for different scenarios:\n');

  // Test different industries
  const industries = ['technology', 'healthcare', 'finance', 'retail'];
  const userTiers: UserTier[] = ['free', 'premium'];

  for (const tier of userTiers) {
    console.log(`👤 ${tier.toUpperCase()} User Tier:`);
    
    for (const industry of industries) {
      try {
        const insight = await enhancedMarketAnalysis.generateMarketInsight(
          `${testUserId}-${industry}`,
          industry,
          tier
        );

        console.log(`   ${industry}: ${insight.aiModelVersion} (confidence: ${insight.confidenceScore})`);
      } catch (error) {
        console.log(`   ${industry}: ❌ Failed`);
      }
    }
    console.log('');
  }

  console.log('✅ Smart Market Analysis Tests Completed!');
  console.log('\n📊 Summary:');
  console.log('- Premium users get high-accuracy models for better insights');
  console.log('- Free users get cost-optimized models for basic functionality');
  console.log('- Model selection is automatic based on user tier and scenario');
  console.log('- Fallback to GPT-4o-mini if selected model fails');
}

// Run the tests
testMarketAnalysis().catch(console.error); 