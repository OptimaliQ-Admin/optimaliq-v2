#!/usr/bin/env tsx

/**
 * Phase 4 AI Services Test Script
 * Tests enhanced DashboardAIService with new analytics capabilities
 */

import { DashboardAIService } from '../src/lib/ai/services/dashboard';

interface TestResult {
  service: string
  test: string
  success: boolean
  duration: number
  result?: any
  error?: string
}

async function testPhase4AIServices(): Promise<TestResult[]> {
  console.log('🚀 Testing Phase 4 AI Services...\n')
  
  const results: TestResult[] = []
  const userId = 'test-user-phase4'
  
  // Sample dashboard data for testing
  const sampleDashboardData = {
    metrics: {
      revenue: 2500000,
      growth: 18.5,
      customers: 1250,
      churn: 3.2,
      marketShare: 12.5,
      customerSatisfaction: 4.6,
      operationalEfficiency: 87,
      technologyAdoption: 92
    },
    trends: [
      { date: '2024-01', value: 1800000, metric: 'revenue' },
      { date: '2024-02', value: 2000000, metric: 'revenue' },
      { date: '2024-03', value: 2200000, metric: 'revenue' },
      { date: '2024-04', value: 2500000, metric: 'revenue' }
    ],
    insights: [
      {
        id: '1',
        type: 'trend',
        title: 'Strong Revenue Growth',
        description: 'Consistent 15%+ monthly growth',
        impact: 0.9
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Revenue Target',
        target: 3000000,
        current: 2500000,
        deadline: '2024-12-31'
      }
    ]
  }

  const dashboardService = new DashboardAIService(userId)

  // Test 1: Executive Summary
  try {
    console.log('📊 Testing Executive Summary Generation...')
    const startTime = Date.now()
    const summary = await dashboardService.generateExecutiveSummary(sampleDashboardData, 'Q4 2024')
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Executive Summary',
      success: true,
      duration,
      result: {
        period: summary.period,
        keyMetricsCount: summary.keyMetrics.length,
        strategicHighlightsCount: summary.strategicHighlights.length,
        hasBusinessNarrative: !!summary.businessNarrative,
        hasRecommendations: !!summary.executiveRecommendations
      }
    })
    console.log('✅ Executive Summary - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Executive Summary',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Executive Summary - Failed:', (error as Error).message)
  }

  // Test 2: Predictive Analytics
  try {
    console.log('🔮 Testing Predictive Analytics...')
    const startTime = Date.now()
    const analytics = await dashboardService.generatePredictiveAnalytics(sampleDashboardData, 'revenue')
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Predictive Analytics',
      success: true,
      duration,
      result: {
        metric: analytics.metric,
        predictionsCount: analytics.predictions.length,
        seasonalityPattern: analytics.seasonality.pattern,
        riskFactorsCount: analytics.riskAssessment.highRisk.length + 
                         analytics.riskAssessment.mediumRisk.length + 
                         analytics.riskAssessment.lowRisk.length
      }
    })
    console.log('✅ Predictive Analytics - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Predictive Analytics',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Predictive Analytics - Failed:', (error as Error).message)
  }

  // Test 3: Strategic Insights
  try {
    console.log('🎯 Testing Strategic Insights...')
    const startTime = Date.now()
    const insights = await dashboardService.generateStrategicInsights(sampleDashboardData, 'technology')
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Strategic Insights',
      success: true,
      duration,
      result: {
        insightsCount: insights.length,
        categories: [...new Set(insights.map(i => i.category))],
        avgConfidence: insights.reduce((sum, i) => sum + i.confidence, 0) / insights.length
      }
    })
    console.log('✅ Strategic Insights - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Strategic Insights',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Strategic Insights - Failed:', (error as Error).message)
  }

  // Test 4: Competitive Analysis
  try {
    console.log('🏆 Testing Competitive Analysis...')
    const startTime = Date.now()
    const analysis = await dashboardService.generateCompetitiveAnalysis(sampleDashboardData, 'technology')
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Competitive Analysis',
      success: true,
      duration,
      result: {
        competitorsCount: analysis.competitors.length,
        hasMarketPosition: !!analysis.marketPosition,
        strategicMovesCount: analysis.strategicMoves.offensive.length + 
                           analysis.strategicMoves.defensive.length + 
                           analysis.strategicMoves.neutral.length
      }
    })
    console.log('✅ Competitive Analysis - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Competitive Analysis',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Competitive Analysis - Failed:', (error as Error).message)
  }

  // Test 5: Business Narrative
  try {
    console.log('📖 Testing Business Narrative...')
    const startTime = Date.now()
    const narrative = await dashboardService.generateBusinessNarrative(sampleDashboardData, 'executive presentation')
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Business Narrative',
      success: true,
      duration,
      result: {
        narrativeLength: narrative.length,
        hasContent: narrative.length > 100
      }
    })
    console.log('✅ Business Narrative - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Business Narrative',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Business Narrative - Failed:', (error as Error).message)
  }

  // Test 6: Scenario Planning
  try {
    console.log('🎲 Testing Scenario Planning...')
    const startTime = Date.now()
    const scenarios = await dashboardService.generateScenarioPlanning(sampleDashboardData, [
      'Market expansion into new territories',
      'Economic downturn affecting customer spending',
      'New competitor entering the market'
    ])
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard AI',
      test: 'Scenario Planning',
      success: true,
      duration,
      result: {
        scenariosCount: scenarios.scenarios?.length || 0,
        hasRecommendations: !!scenarios.recommendations
      }
    })
    console.log('✅ Scenario Planning - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard AI',
      test: 'Scenario Planning',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Scenario Planning - Failed:', (error as Error).message)
  }

  return results
}

async function runTests() {
  try {
    const results = await testPhase4AIServices()
    
    console.log('\n📋 Test Results Summary:')
    console.log('=' .repeat(60))
    
    const successfulTests = results.filter(r => r.success)
    const failedTests = results.filter(r => !r.success)
    
    console.log(`✅ Successful Tests: ${successfulTests.length}/${results.length}`)
    console.log(`❌ Failed Tests: ${failedTests.length}/${results.length}`)
    
    if (successfulTests.length > 0) {
      console.log('\n✅ Successful Tests:')
      successfulTests.forEach(test => {
        console.log(`  • ${test.test}: ${test.duration}ms`)
        if (test.result) {
          console.log(`    Result: ${JSON.stringify(test.result, null, 2)}`)
        }
      })
    }
    
    if (failedTests.length > 0) {
      console.log('\n❌ Failed Tests:')
      failedTests.forEach(test => {
        console.log(`  • ${test.test}: ${test.error}`)
      })
    }
    
    const avgDuration = successfulTests.length > 0 
      ? successfulTests.reduce((sum, t) => sum + t.duration, 0) / successfulTests.length 
      : 0
    
    console.log(`\n📊 Performance Metrics:`)
    console.log(`  • Average Response Time: ${Math.round(avgDuration)}ms`)
    console.log(`  • Success Rate: ${Math.round((successfulTests.length / results.length) * 100)}%`)
    
    if (successfulTests.length === results.length) {
      console.log('\n🎉 All Phase 4 AI Services are working correctly!')
      console.log('🚀 Ready for production deployment.')
    } else {
      console.log('\n⚠️ Some tests failed. Please review the errors above.')
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error)
    process.exit(1)
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests()
}

export { testPhase4AIServices, runTests } 