#!/usr/bin/env tsx

/**
 * 🧪 Model Selector Test Script
 * 
 * Tests the intelligent model selection system to validate:
 * - Model recommendations for different scenarios
 * - Cost and performance optimization
 * - Reasoning behind model choices
 */

import { modelSelector } from '../src/lib/ai/modelSelector';

console.log('🧠 Testing Intelligent Model Selection System\n');

// Test 1: Market Intelligence Scenario
console.log('📊 Test 1: Market Intelligence (High Accuracy)');
const marketIntelligence = modelSelector.selectModel({
  taskType: 'market_intelligence',
  complexity: 'high',
  priority: 'accuracy',
  responseFormat: 'json'
});

console.log(`   Selected: ${marketIntelligence.provider}:${marketIntelligence.model}`);
console.log(`   Confidence: ${marketIntelligence.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${marketIntelligence.reasoning}`);
console.log(`   Estimated Cost: $${marketIntelligence.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${marketIntelligence.estimatedLatency}ms\n`);

// Test 2: Real-time Updates Scenario
console.log('⚡ Test 2: Real-time Updates (Speed Priority)');
const realTime = modelSelector.selectModel({
  taskType: 'real_time',
  complexity: 'low',
  priority: 'speed',
  maxTokens: 500
});

console.log(`   Selected: ${realTime.provider}:${realTime.model}`);
console.log(`   Confidence: ${realTime.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${realTime.reasoning}`);
console.log(`   Estimated Cost: $${realTime.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${realTime.estimatedLatency}ms\n`);

// Test 3: Creative Content Scenario
console.log('🎨 Test 3: Creative Content (Balanced)');
const creative = modelSelector.selectModel({
  taskType: 'creative_content',
  complexity: 'medium',
  priority: 'balanced',
  temperature: 0.8
});

console.log(`   Selected: ${creative.provider}:${creative.model}`);
console.log(`   Confidence: ${creative.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${creative.reasoning}`);
console.log(`   Estimated Cost: $${creative.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${creative.estimatedLatency}ms\n`);

// Test 4: Cost-Optimized Scenario
console.log('💰 Test 4: Cost-Optimized Processing');
const costOptimized = modelSelector.selectModel({
  taskType: 'cost_optimized',
  complexity: 'low',
  priority: 'cost',
  maxTokens: 1000
});

console.log(`   Selected: ${costOptimized.provider}:${costOptimized.model}`);
console.log(`   Confidence: ${costOptimized.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${costOptimized.reasoning}`);
console.log(`   Estimated Cost: $${costOptimized.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${costOptimized.estimatedLatency}ms\n`);

// Test 5: Technical Analysis Scenario
console.log('🔬 Test 5: Technical Analysis (High Complexity)');
const technical = modelSelector.selectModel({
  taskType: 'technical_analysis',
  complexity: 'high',
  priority: 'accuracy',
  responseFormat: 'json'
});

console.log(`   Selected: ${technical.provider}:${technical.model}`);
console.log(`   Confidence: ${technical.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${technical.reasoning}`);
console.log(`   Estimated Cost: $${technical.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${technical.estimatedLatency}ms\n`);

// Test 6: Batch Processing Scenario
console.log('📦 Test 6: Batch Processing');
const batch = modelSelector.selectModel({
  taskType: 'batch_processing',
  complexity: 'low',
  priority: 'cost',
  maxTokens: 1000
});

console.log(`   Selected: ${batch.provider}:${batch.model}`);
console.log(`   Confidence: ${batch.confidence.toFixed(1)}%`);
console.log(`   Reasoning: ${batch.reasoning}`);
console.log(`   Estimated Cost: $${batch.estimatedCost}/1M tokens`);
console.log(`   Estimated Latency: ${batch.estimatedLatency}ms\n`);

// Test 7: Compare All Scenarios
console.log('📋 Test 7: Model Comparison Across All Scenarios');
const scenarios = [
  { name: 'Market Intelligence', criteria: { taskType: 'market_intelligence' as const, complexity: 'high' as const, priority: 'accuracy' as const } },
  { name: 'Real-time Updates', criteria: { taskType: 'real_time' as const, complexity: 'low' as const, priority: 'speed' as const } },
  { name: 'Creative Content', criteria: { taskType: 'creative_content' as const, complexity: 'medium' as const, priority: 'balanced' as const } },
  { name: 'Cost Optimized', criteria: { taskType: 'cost_optimized' as const, complexity: 'low' as const, priority: 'cost' as const } },
  { name: 'Technical Analysis', criteria: { taskType: 'technical_analysis' as const, complexity: 'high' as const, priority: 'accuracy' as const } },
  { name: 'Batch Processing', criteria: { taskType: 'batch_processing' as const, complexity: 'low' as const, priority: 'cost' as const } }
];

console.log('Scenario'.padEnd(20) + 'Model'.padEnd(25) + 'Cost'.padEnd(10) + 'Latency'.padEnd(10) + 'Confidence');
console.log('-'.repeat(80));

scenarios.forEach(scenario => {
  const selection = modelSelector.selectModel(scenario.criteria);
  console.log(
    scenario.name.padEnd(20) +
    `${selection.provider}:${selection.model}`.padEnd(25) +
    `$${selection.estimatedCost}`.padEnd(10) +
    `${selection.estimatedLatency}ms`.padEnd(10) +
    `${selection.confidence.toFixed(1)}%`
  );
});

console.log('\n');

// Test 8: Available Models
console.log('🔍 Test 8: All Available Models and Capabilities');
const allModels = modelSelector.getAllModels();

allModels.forEach(model => {
  console.log(`\n${model.provider}:${model.model}`);
  console.log(`  Strengths: ${model.strengths.join(', ')}`);
  console.log(`  Weaknesses: ${model.weaknesses.join(', ')}`);
  console.log(`  Best For: ${model.bestFor.join(', ')}`);
  console.log(`  Cost: $${model.costPer1MTokens}/1M tokens`);
  console.log(`  Max Tokens: ${model.maxTokens.toLocaleString()}`);
  console.log(`  Avg Latency: ${model.avgLatency}ms`);
});

// Test 9: Edge Cases
console.log('\n🧪 Test 9: Edge Cases and Validation');

// Test with invalid scenario
try {
  const invalid = modelSelector.selectModel({
    taskType: 'invalid_scenario' as any,
    complexity: 'medium',
    priority: 'balanced'
  });
  console.log('❌ Should have thrown error for invalid scenario');
} catch (error) {
  console.log('✅ Correctly handled invalid scenario');
}

// Test with extreme priorities
const speedTest = modelSelector.selectModel({
  taskType: 'real_time',
  complexity: 'low',
  priority: 'speed'
});

const accuracyTest = modelSelector.selectModel({
  taskType: 'market_intelligence',
  complexity: 'high',
  priority: 'accuracy'
});

const costTest = modelSelector.selectModel({
  taskType: 'batch_processing',
  complexity: 'low',
  priority: 'cost'
});

console.log(`\nSpeed Priority Model: ${speedTest.provider}:${speedTest.model} (${speedTest.estimatedLatency}ms)`);
console.log(`Accuracy Priority Model: ${accuracyTest.provider}:${accuracyTest.model} (${accuracyTest.confidence.toFixed(1)}% confidence)`);
console.log(`Cost Priority Model: ${costTest.provider}:${costTest.model} ($${costTest.estimatedCost}/1M tokens)`);

console.log('\n✅ Model Selector Tests Completed!');
console.log('\n📊 Summary:');
console.log('- Market Intelligence: High-accuracy models for strategic insights');
console.log('- Real-time Updates: Fast, cost-effective models for live data');
console.log('- Creative Content: Balanced models for creative tasks');
console.log('- Cost Optimization: Budget-friendly models for bulk processing');
console.log('- Technical Analysis: High-complexity models for deep reasoning');
console.log('- Batch Processing: Efficient models for large-scale operations'); 