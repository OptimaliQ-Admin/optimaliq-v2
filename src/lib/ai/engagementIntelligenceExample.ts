/**
 * 🎯 Engagement Intelligence Analysis Example Usage
 * 
 * This file demonstrates how to use the Engagement Intelligence Analysis service
 * to generate comprehensive engagement insights for different industries.
 */

import { engagementIntelligenceAnalysis } from './engagementIntelligenceAnalysis';

/**
 * Example: Generate engagement intelligence for a SaaS company
 */
export async function generateSaaSEngagementInsight() {
  try {
    console.log('🎯 Generating SaaS engagement intelligence...');
    
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      'user-123',
      'saas',
      'premium'
    );

    console.log('✅ SaaS Engagement Intelligence Generated:');
    console.log('   Signal Score:', insight.signalScore);
    console.log('   Trends:', insight.trends.length);
    console.log('   Strategies:', insight.strategies.length);
    console.log('   Confidence:', (insight.confidenceScore * 100).toFixed(1) + '%');

    return insight;
  } catch (error) {
    console.error('❌ Error generating SaaS engagement insight:', error);
    throw error;
  }
}

/**
 * Example: Generate engagement intelligence for an e-commerce company
 */
export async function generateEcommerceEngagementInsight() {
  try {
    console.log('🎯 Generating e-commerce engagement intelligence...');
    
    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      'user-456',
      'ecommerce',
      'premium'
    );

    console.log('✅ E-commerce Engagement Intelligence Generated:');
    console.log('   Signal Score:', insight.signalScore);
    console.log('   Key Metrics:', insight.keyMetrics);
    console.log('   Model Version:', insight.aiModelVersion);

    return insight;
  } catch (error) {
    console.error('❌ Error generating e-commerce engagement insight:', error);
    throw error;
  }
}

/**
 * Example: Get signal insights for market analysis
 */
export async function getEngagementSignalInsights() {
  try {
    console.log('📡 Getting engagement signal insights...');
    
    const signalInsights = await engagementIntelligenceAnalysis.getSignalInsights('technology');
    
    console.log('✅ Signal Insights Retrieved:');
    console.log('   Signal Score:', signalInsights.signalScore);
    console.log('   Interpretation:', signalInsights.interpretation);
    console.log('   Factors:', signalInsights.factors);

    return signalInsights;
  } catch (error) {
    console.error('❌ Error getting signal insights:', error);
    throw error;
  }
}

/**
 * Example: Compare engagement insights across industries
 */
export async function compareIndustryEngagement() {
  const industries = ['saas', 'ecommerce', 'healthcare', 'finance'];
  const insights: any[] = [];

  try {
    console.log('🔄 Comparing engagement insights across industries...');
    
    for (const industry of industries) {
      const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
        'user-compare',
        industry,
        'premium'
      );
      
      insights.push({
        industry,
        signalScore: insight.signalScore,
        engagementRate: insight.keyMetrics.overallEngagement,
        sentimentScore: insight.keyMetrics.sentimentScore,
        conversionRate: insight.keyMetrics.conversionRate
      });
    }

    console.log('✅ Industry Comparison Complete:');
    insights.forEach(insight => {
      console.log(`   ${insight.industry}: Signal ${insight.signalScore}, Engagement ${insight.engagementRate}%`);
    });

    return insights;
  } catch (error) {
    console.error('❌ Error comparing industry engagement:', error);
    throw error;
  }
}

/**
 * Example: Generate engagement intelligence with different user tiers
 */
export async function demonstrateUserTierDifferences() {
  const userId = 'user-tier-demo';
  const industry = 'technology';

  try {
    console.log('👥 Demonstrating user tier differences...');
    
    // Free tier (cost-optimized)
    const freeInsight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      userId,
      industry,
      'free'
    );

    // Premium tier (accuracy-optimized)
    const premiumInsight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      userId,
      industry,
      'premium'
    );

    console.log('✅ User Tier Comparison:');
    console.log('   Free Tier - Model:', freeInsight.aiModelVersion);
    console.log('   Premium Tier - Model:', premiumInsight.aiModelVersion);
    console.log('   Free Tier - Confidence:', (freeInsight.confidenceScore * 100).toFixed(1) + '%');
    console.log('   Premium Tier - Confidence:', (premiumInsight.confidenceScore * 100).toFixed(1) + '%');

    return { freeInsight, premiumInsight };
  } catch (error) {
    console.error('❌ Error demonstrating user tier differences:', error);
    throw error;
  }
}

/**
 * Example: Real-time engagement monitoring
 */
export async function monitorEngagementSignals() {
  const industries = ['saas', 'ecommerce', 'healthcare'];
  
  try {
    console.log('📊 Monitoring real-time engagement signals...');
    
    const monitoringResults = await Promise.all(
      industries.map(async (industry) => {
        const signalInsights = await engagementIntelligenceAnalysis.getSignalInsights(industry);
        
        return {
          industry,
          signalScore: signalInsights.signalScore,
          strength: engagementIntelligenceAnalysis.getSignalStrengthDescription(signalInsights.signalScore),
          factors: signalInsights.factors
        };
      })
    );

    console.log('✅ Real-time Monitoring Results:');
    monitoringResults.forEach(result => {
      console.log(`   ${result.industry}: ${result.signalScore.toFixed(1)} - ${result.strength}`);
    });

    return monitoringResults;
  } catch (error) {
    console.error('❌ Error monitoring engagement signals:', error);
    throw error;
  }
}

// Example usage in a Next.js API route
export async function handleEngagementIntelligenceRequest(req: any, res: any) {
  try {
    const { industry, userId, userTier = 'premium' } = req.body;

    if (!industry || !userId) {
      return res.status(400).json({ error: 'Industry and userId are required' });
    }

    const insight = await engagementIntelligenceAnalysis.generateEngagementInsight(
      userId,
      industry,
      userTier as 'free' | 'premium'
    );

    return res.json({
      success: true,
      insight,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate engagement intelligence',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Export all examples for easy testing
export const engagementIntelligenceExamples = {
  generateSaaSEngagementInsight,
  generateEcommerceEngagementInsight,
  getEngagementSignalInsights,
  compareIndustryEngagement,
  demonstrateUserTierDifferences,
  monitorEngagementSignals,
  handleEngagementIntelligenceRequest
}; 