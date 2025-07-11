/**
 * 📊 Real-Time Signal Calculation Example
 * 
 * This example demonstrates how to use the enhanced Business Trend Analysis
 * with Real-Time Signal Calculation features.
 */

import { businessTrendAnalysis, BusinessTrend, SignalFactors } from './businessTrendAnalysis';

/**
 * Example: Generate business trends with real-time signals
 */
export async function generateTrendsWithSignalsExample() {
  try {
    console.log('🚀 Generating Business Trends with Real-Time Signals...\n');

    // Generate trends for Technology industry
    const trends: BusinessTrend[] = await businessTrendAnalysis.generateBusinessTrends(
      'user123',
      'Technology',
      'premium'
    );

    console.log('📈 Generated Trends with Signal Data:');
    trends.forEach((trend, index) => {
      console.log(`\n${index + 1}. ${trend.title}`);
      console.log(`   Direction: ${trend.direction.toUpperCase()}`);
      console.log(`   Change: ${trend.percentageChange}%`);
      console.log(`   Signal Score: ${trend.signalScore?.toFixed(1)}/100`);
      console.log(`   Description: ${trend.description}`);
      
      if (trend.signalFactors) {
        console.log('   Signal Factors:');
        console.log(`     📰 News Volume: ${trend.signalFactors.newsVolume.toFixed(1)}/100`);
        console.log(`     📊 Market Momentum: ${trend.signalFactors.marketMomentum.toFixed(1)}/100`);
        console.log(`     😊 Sentiment: ${trend.signalFactors.sentimentScore.toFixed(1)}/100`);
        console.log(`     📋 Analyst Confidence: ${trend.signalFactors.analystConfidence.toFixed(1)}/100`);
        console.log(`     📈 Volatility: ${trend.signalFactors.volatilityIndex.toFixed(1)}/100`);
      }
    });

    return trends;
  } catch (error) {
    console.error('❌ Error generating trends:', error);
    throw error;
  }
}

/**
 * Example: Get detailed signal insights for an industry
 */
export async function getSignalInsightsExample() {
  try {
    console.log('\n🔍 Getting Detailed Signal Insights...\n');

    const insights = await businessTrendAnalysis.getSignalInsights('Healthcare');

    console.log('📊 Signal Analysis Results:');
    console.log(`Overall Signal Score: ${insights.signalScore.toFixed(1)}/100`);
    console.log(`Signal Strength: ${businessTrendAnalysis.getSignalStrengthDescription(insights.signalScore)}`);
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
      const insights = await businessTrendAnalysis.getSignalInsights(industry);
      results.push({
        industry,
        signalScore: insights.signalScore,
        strength: businessTrendAnalysis.getSignalStrengthDescription(insights.signalScore),
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
      
      const insights = await businessTrendAnalysis.getSignalInsights(industry);
      results.push({
        timePoint: i + 1,
        timestamp: new Date().toISOString(),
        signalScore: insights.signalScore,
        strength: businessTrendAnalysis.getSignalStrengthDescription(insights.signalScore),
        factors: insights.factors
      });

      console.log(`   Signal Score: ${insights.signalScore.toFixed(1)}/100`);
      console.log(`   Strength: ${businessTrendAnalysis.getSignalStrengthDescription(insights.signalScore)}`);
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
 * Main example runner
 */
export async function runAllExamples() {
  try {
    console.log('🎯 Real-Time Signal Calculation Examples\n');
    console.log('=' .repeat(50));

    // Run all examples
    await generateTrendsWithSignalsExample();
    await getSignalInsightsExample();
    await compareIndustrySignalsExample();
    await monitorSignalChangesExample();

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Export for use in other files
export default {
  generateTrendsWithSignalsExample,
  getSignalInsightsExample,
  compareIndustrySignalsExample,
  monitorSignalChangesExample,
  runAllExamples
}; 