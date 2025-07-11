/**
 * 📊 Enhanced Market Analysis with Real-Time Signals Example
 * 
 * This example demonstrates how to use the enhanced Market Analysis
 * with Real-Time Signal Calculation features.
 */

import { enhancedMarketAnalysis, EnhancedMarketInsight, SignalFactors } from './enhancedMarketAnalysis';

/**
 * Example: Generate market insights with real-time signals
 */
export async function generateMarketInsightWithSignalsExample() {
  try {
    console.log('🚀 Generating Market Insights with Real-Time Signals...\n');

    // Generate market insight for Technology industry
    const insight: EnhancedMarketInsight = await enhancedMarketAnalysis.generateMarketInsight(
      'user123',
      'Technology',
      'premium'
    );

    console.log('📈 Generated Market Insight with Signal Data:');
    console.log(`\n📊 Market Size: ${insight.marketSize.value} (${insight.marketSize.growth}% growth)`);
    console.log(`📈 Growth Rate: ${insight.growthRate.value}% (${insight.growthRate.trend > 0 ? '+' : ''}${insight.growthRate.trend} trend)`);
    console.log(`🏆 Competition: ${insight.competition.level} (${insight.competition.trend})`);
    console.log(`😊 Sentiment: ${insight.sentiment.score}/100 (${insight.sentiment.trend})`);
    console.log(`🎯 Signal Score: ${insight.signalScore?.toFixed(1)}/100`);
    console.log(`📋 Confidence: ${(insight.confidenceScore * 100).toFixed(1)}%`);
    
    if (insight.signalFactors) {
      console.log('\n📡 Signal Factor Breakdown:');
      console.log(`   📰 News Volume: ${insight.signalFactors.newsVolume.toFixed(1)}/100`);
      console.log(`   📊 Market Momentum: ${insight.signalFactors.marketMomentum.toFixed(1)}/100`);
      console.log(`   😊 Sentiment: ${insight.signalFactors.sentimentScore.toFixed(1)}/100`);
      console.log(`   📋 Analyst Confidence: ${insight.signalFactors.analystConfidence.toFixed(1)}/100`);
      console.log(`   📈 Volatility: ${insight.signalFactors.volatilityIndex.toFixed(1)}/100`);
    }

    console.log('\n📝 Full Insight:');
    console.log(insight.fullInsight);

    return insight;
  } catch (error) {
    console.error('❌ Error generating market insight:', error);
    throw error;
  }
}

/**
 * Example: Get detailed signal insights for an industry
 */
export async function getSignalInsightsExample() {
  try {
    console.log('\n🔍 Getting Detailed Signal Insights...\n');

    const insights = await enhancedMarketAnalysis.getSignalInsights('Healthcare');

    console.log('📊 Signal Analysis Results:');
    console.log(`Overall Signal Score: ${insights.signalScore.toFixed(1)}/100`);
    console.log(`Signal Strength: ${enhancedMarketAnalysis.getSignalStrengthDescription(insights.signalScore)}`);
    console.log(`Interpretation: ${insights.interpretation}`);
    
    console.log('\n📈 Signal Factor Breakdown:');
    console.log(`📰 News Volume: ${insights.factors.newsVolume.toFixed(1)}/100`);
    console.log(`📊 Market Momentum: ${insights.factors.marketMomentum.toFixed(1)}/100`);
    console.log(`😊 Sentiment Score: ${insights.factors.sentimentScore.toFixed(1)}/100`);
    console.log(`📋 Analyst Confidence: ${insights.factors.analystConfidence.toFixed(1)}/100`);
    console.log(`📈 Volatility Index: ${insights.factors.volatilityIndex.toFixed(1)}/100`);

    console.log('\n📰 Recent News Articles:');
    insights.signalData.newsArticles.slice(0, 3).forEach((article, index) => {
      console.log(`${index + 1}. ${article.headline}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Sentiment: ${article.sentiment.toFixed(2)} (${article.sentiment > 0 ? 'Positive' : article.sentiment < 0 ? 'Negative' : 'Neutral'})`);
      console.log(`   Relevance: ${(article.relevance * 100).toFixed(1)}%`);
    });

    console.log('\n📊 Market Metrics:');
    console.log(`Market Cap: $${(insights.signalData.marketMetrics.marketCap / 1e12).toFixed(2)}T`);
    console.log(`Growth Rate: ${(insights.signalData.marketMetrics.growthRate * 100).toFixed(1)}%`);
    console.log(`P/E Ratio: ${insights.signalData.marketMetrics.peRatio.toFixed(1)}`);
    console.log(`Beta: ${insights.signalData.marketMetrics.beta.toFixed(2)}`);
    console.log(`Volatility: ${(insights.signalData.marketMetrics.volatility * 100).toFixed(1)}%`);

    return insights;
  } catch (error) {
    console.error('❌ Error getting signal insights:', error);
    throw error;
  }
}

/**
 * Example: Compare signal strength across industries
 */
export async function compareIndustrySignalsExample() {
  try {
    console.log('\n🏭 Comparing Signal Strength Across Industries...\n');

    const industries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing'];
    const results = [];

    for (const industry of industries) {
      const insights = await enhancedMarketAnalysis.getSignalInsights(industry);
      results.push({
        industry,
        signalScore: insights.signalScore,
        strength: enhancedMarketAnalysis.getSignalStrengthDescription(insights.signalScore),
        factors: insights.factors
      });
    }

    // Sort by signal score (highest first)
    results.sort((a, b) => b.signalScore - a.signalScore);

    console.log('📊 Industry Signal Comparison:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.industry}`);
      console.log(`   Signal Score: ${result.signalScore.toFixed(1)}/100`);
      console.log(`   Strength: ${result.strength}`);
      console.log(`   Market Momentum: ${result.factors.marketMomentum.toFixed(1)}/100`);
      console.log(`   Sentiment: ${result.factors.sentimentScore.toFixed(1)}/100`);
    });

    return results;
  } catch (error) {
    console.error('❌ Error comparing industry signals:', error);
    throw error;
  }
}

/**
 * Example: Generate market insights with caching
 */
export async function generateMarketInsightWithCacheExample() {
  try {
    console.log('\n💾 Generating Market Insights with Caching...\n');

    const userId = 'user123';
    const industry = 'Technology';

    // First call - generates fresh insight
    console.log('🔄 First call - generating fresh insight...');
    const insight1 = await enhancedMarketAnalysis.generateMarketInsightWithCache(
      userId,
      industry,
      'premium'
    );
    console.log(`Signal Score: ${insight1.signalScore?.toFixed(1)}/100`);

    // Second call - should return cached insight (if cache is implemented)
    console.log('\n🔄 Second call - should return cached insight...');
    const insight2 = await enhancedMarketAnalysis.generateMarketInsightWithCache(
      userId,
      industry,
      'premium'
    );
    console.log(`Signal Score: ${insight2.signalScore?.toFixed(1)}/100`);

    // Force refresh
    console.log('\n🔄 Force refresh - generating fresh insight...');
    const insight3 = await enhancedMarketAnalysis.generateMarketInsightWithCache(
      userId,
      industry,
      'premium',
      true // forceRefresh
    );
    console.log(`Signal Score: ${insight3.signalScore?.toFixed(1)}/100`);

    return { insight1, insight2, insight3 };
  } catch (error) {
    console.error('❌ Error generating market insight with cache:', error);
    throw error;
  }
}

/**
 * Example: Monitor signal changes over time
 */
export async function monitorSignalChangesExample() {
  try {
    console.log('\n⏰ Monitoring Signal Changes Over Time...\n');

    const industry = 'Technology';
    const timePoints = 3;
    const results = [];

    for (let i = 0; i < timePoints; i++) {
      console.log(`📊 Time Point ${i + 1}:`);
      
      const insights = await enhancedMarketAnalysis.getSignalInsights(industry);
      results.push({
        timePoint: i + 1,
        timestamp: new Date().toISOString(),
        signalScore: insights.signalScore,
        strength: enhancedMarketAnalysis.getSignalStrengthDescription(insights.signalScore),
        factors: insights.factors
      });

      console.log(`   Signal Score: ${insights.signalScore.toFixed(1)}/100`);
      console.log(`   Strength: ${enhancedMarketAnalysis.getSignalStrengthDescription(insights.signalScore)}`);
      console.log(`   Market Momentum: ${insights.factors.marketMomentum.toFixed(1)}/100`);
      console.log(`   Sentiment: ${insights.factors.sentimentScore.toFixed(1)}/100`);
      
      // Simulate time passing (in real implementation, this would be actual time intervals)
      if (i < timePoints - 1) {
        console.log('   ⏳ Waiting for next time point...\n');
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    // Analyze changes
    console.log('\n📈 Signal Change Analysis:');
    for (let i = 1; i < results.length; i++) {
      const change = results[i].signalScore - results[i-1].signalScore;
      const changeDirection = change > 0 ? '↗️ Increasing' : change < 0 ? '↘️ Decreasing' : '→ Stable';
      console.log(`   Time ${i} to ${i + 1}: ${change.toFixed(1)} points (${changeDirection})`);
    }

    return results;
  } catch (error) {
    console.error('❌ Error monitoring signal changes:', error);
    throw error;
  }
}

/**
 * Example: Force refresh market insight
 */
export async function forceRefreshExample() {
  try {
    console.log('\n🔄 Force Refresh Market Insight Example...\n');

    const userId = 'user123';
    const industry = 'Finance';

    // Generate initial insight
    console.log('📊 Generating initial market insight...');
    const initialInsight = await enhancedMarketAnalysis.generateMarketInsight(
      userId,
      industry,
      'premium'
    );
    console.log(`Initial Signal Score: ${initialInsight.signalScore?.toFixed(1)}/100`);

    // Force refresh
    console.log('\n🔄 Force refreshing market insight...');
    const refreshedInsight = await enhancedMarketAnalysis.forceRefreshInsight(
      userId,
      industry,
      'premium'
    );
    console.log(`Refreshed Signal Score: ${refreshedInsight.signalScore?.toFixed(1)}/100`);

    // Compare insights
    const signalChange = (refreshedInsight.signalScore || 0) - (initialInsight.signalScore || 0);
    console.log(`\n📈 Signal Change: ${signalChange > 0 ? '+' : ''}${signalChange.toFixed(1)} points`);

    return { initialInsight, refreshedInsight, signalChange };
  } catch (error) {
    console.error('❌ Error in force refresh example:', error);
    throw error;
  }
}

/**
 * Main example runner
 */
export async function runAllExamples() {
  try {
    console.log('🎯 Enhanced Market Analysis with Real-Time Signals Examples\n');
    console.log('=' .repeat(60));

    // Run all examples
    await generateMarketInsightWithSignalsExample();
    await getSignalInsightsExample();
    await compareIndustrySignalsExample();
    await generateMarketInsightWithCacheExample();
    await monitorSignalChangesExample();
    await forceRefreshExample();

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export for use in other files
export default {
  generateMarketInsightWithSignalsExample,
  getSignalInsightsExample,
  compareIndustrySignalsExample,
  generateMarketInsightWithCacheExample,
  monitorSignalChangesExample,
  forceRefreshExample,
  runAllExamples
}; 