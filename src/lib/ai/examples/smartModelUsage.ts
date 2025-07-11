/**
 * 🧠 Smart Model Selection Examples
 * 
 * This file demonstrates how the intelligent model selection system
 * automatically chooses the best AI model for different scenarios.
 */

import { modelSelector } from '../modelSelector';

// Example 1: Market Intelligence (High Accuracy)
export async function generateMarketInsight(industry: string, marketData: any) {
  const modelSelection = modelSelector.selectModel({
    taskType: 'market_intelligence',
    complexity: 'high',
    priority: 'accuracy',
    responseFormat: 'json'
  });

  console.log(`📊 Market Intelligence Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Reasoning: ${modelSelection.reasoning}`);
  // Expected: GPT-4o or Claude-3-5-sonnet for high accuracy

  // Use the selected model for market analysis
  return {
    model: modelSelection.model,
    provider: modelSelection.provider,
    prompt: `Analyze ${industry} market with live data...`,
    estimatedCost: modelSelection.estimatedCost
  };
}

// Example 2: Real-time Dashboard Updates (Speed Priority)
export async function generateRealTimeUpdate(userId: string, data: any) {
  const modelSelection = modelSelector.selectModel({
    taskType: 'real_time',
    complexity: 'low',
    priority: 'speed',
    maxTokens: 500
  });

  console.log(`⚡ Real-time Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Reasoning: ${modelSelection.reasoning}`);
  // Expected: GPT-4o-mini or Claude-3-haiku for speed

  return {
    model: modelSelection.model,
    provider: modelSelection.provider,
    prompt: `Quick update for user ${userId}...`,
    estimatedLatency: modelSelection.estimatedLatency
  };
}

// Example 3: Creative Content Generation (Balanced)
export async function generateCreativeContent(contentType: string, context: string) {
  const modelSelection = modelSelector.selectModel({
    taskType: 'creative_content',
    complexity: 'medium',
    priority: 'balanced',
    temperature: 0.8
  });

  console.log(`🎨 Creative Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Reasoning: ${modelSelection.reasoning}`);
  // Expected: Claude-3-5-sonnet or GPT-4o for creativity

  return {
    model: modelSelection.model,
    provider: modelSelection.provider,
    prompt: `Generate ${contentType} content about ${context}...`,
    temperature: 0.8
  };
}

// Example 4: Cost-Optimized Batch Processing
export async function generateBatchInsights(insights: string[]) {
  const modelSelection = modelSelector.selectModel({
    taskType: 'batch_processing',
    complexity: 'low',
    priority: 'cost',
    maxTokens: 1000
  });

  console.log(`💰 Cost-Optimized Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Reasoning: ${modelSelection.reasoning}`);
  // Expected: GPT-3.5-turbo or Mistral for cost optimization

  return {
    model: modelSelection.model,
    provider: modelSelection.provider,
    batchSize: insights.length,
    estimatedTotalCost: modelSelection.estimatedCost * insights.length
  };
}

// Example 5: Technical Analysis (High Complexity)
export async function generateTechnicalAnalysis(technicalData: any) {
  const modelSelection = modelSelector.selectModel({
    taskType: 'technical_analysis',
    complexity: 'high',
    priority: 'accuracy',
    responseFormat: 'json'
  });

  console.log(`🔬 Technical Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Reasoning: ${modelSelection.reasoning}`);
  // Expected: GPT-4o or Claude-3-5-sonnet for complex reasoning

  return {
    model: modelSelection.model,
    provider: modelSelection.provider,
    prompt: `Analyze technical data with deep reasoning...`,
    confidence: modelSelection.confidence
  };
}

// Example 6: Scenario-based Model Recommendations
export function getModelRecommendations() {
  const scenarios = [
    'market_intelligence',
    'creative_content', 
    'technical_analysis',
    'cost_optimized',
    'real_time',
    'batch_processing'
  ];

  const recommendations = scenarios.map(scenario => {
    const selection = modelSelector.selectModel({
      taskType: scenario as any,
      complexity: 'medium',
      priority: 'balanced'
    });

    return {
      scenario,
      recommendedModel: `${selection.provider}:${selection.model}`,
      confidence: selection.confidence,
      reasoning: selection.reasoning,
      estimatedCost: selection.estimatedCost,
      estimatedLatency: selection.estimatedLatency
    };
  });

  console.log('📋 Model Recommendations by Scenario:');
  recommendations.forEach(rec => {
    console.log(`  ${rec.scenario}: ${rec.recommendedModel} (${rec.confidence.toFixed(1)}% confidence)`);
    console.log(`    Cost: $${rec.estimatedCost}/1M tokens, Latency: ${rec.estimatedLatency}ms`);
  });

  return recommendations;
}

// Example 7: Dynamic Model Selection Based on User Tier
export async function generateUserSpecificContent(userTier: 'free' | 'premium' | 'enterprise', task: string) {
  let priority: 'cost' | 'speed' | 'accuracy' | 'balanced';
  let complexity: 'low' | 'medium' | 'high';

  switch (userTier) {
    case 'free':
      priority = 'cost';
      complexity = 'low';
      break;
    case 'premium':
      priority = 'balanced';
      complexity = 'medium';
      break;
    case 'enterprise':
      priority = 'accuracy';
      complexity = 'high';
      break;
  }

  const modelSelection = modelSelector.selectModel({
    taskType: 'market_intelligence',
    complexity,
    priority,
    responseFormat: 'json'
  });

  console.log(`👤 ${userTier.toUpperCase()} User Model: ${modelSelection.provider}:${modelSelection.model}`);
  console.log(`🎯 Priority: ${priority}, Complexity: ${complexity}`);

  return {
    userTier,
    model: modelSelection.model,
    provider: modelSelection.provider,
    priority,
    complexity,
    estimatedCost: modelSelection.estimatedCost
  };
} 