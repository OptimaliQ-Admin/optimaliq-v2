#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

// Import AI services
import { AssessmentAIService } from '../src/lib/ai/services/assessment'
import { DashboardAIService } from '../src/lib/ai/services/dashboard'
import { GrowthStudioAIService } from '../src/lib/ai/services/growthStudio'
import { TeamAIService } from '../src/lib/ai/services/team'

interface TestResult {
  service: string
  test: string
  success: boolean
  duration: number
  result?: any
  error?: string
}

async function testAssessmentService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Assessment AI Service...')
  const results: TestResult[] = []
  const service = new AssessmentAIService('test-user-id')

  // Sample assessment responses
  const sampleResponses = [
    {
      questionId: '1',
      question: 'What is your current revenue growth rate?',
      answer: 'We are growing at 15% year-over-year, primarily through organic growth and some strategic partnerships.',
      category: 'strategy',
      weight: 1.0
    },
    {
      questionId: '2',
      question: 'How do you measure customer satisfaction?',
      answer: 'We use NPS surveys, customer feedback forms, and regular check-ins with key accounts.',
      category: 'process',
      weight: 0.8
    },
    {
      questionId: '3',
      question: 'What technology stack do you use?',
      answer: 'We use modern cloud-based tools including AWS, React, and various SaaS platforms.',
      category: 'technology',
      weight: 0.9
    }
  ]

  // Test 1: Analyze responses
  try {
    const startTime = Date.now()
    const analysis = await service.analyzeResponses(sampleResponses)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Assessment',
      test: 'Analyze Responses',
      success: true,
      duration,
      result: analysis
    })
    console.log('✅ Analyze Responses - Success!')
  } catch (error) {
    results.push({
      service: 'Assessment',
      test: 'Analyze Responses',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Analyze Responses - Failed:', (error as Error).message)
  }

  // Test 2: Score assessment
  try {
    const startTime = Date.now()
    const score = await service.scoreAssessment(sampleResponses)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Assessment',
      test: 'Score Assessment',
      success: true,
      duration,
      result: score
    })
    console.log('✅ Score Assessment - Success!')
  } catch (error) {
    results.push({
      service: 'Assessment',
      test: 'Score Assessment',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Score Assessment - Failed:', (error as Error).message)
  }

  return results
}

async function testDashboardService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Dashboard AI Service...')
  const results: TestResult[] = []
  const service = new DashboardAIService('test-user-id')

  // Sample dashboard data
  const sampleData = {
    metrics: {
      revenue: 1000000,
      growth: 15,
      customers: 500,
      churn: 5
    },
    trends: [
      { date: '2024-01', value: 800000, metric: 'revenue' },
      { date: '2024-02', value: 900000, metric: 'revenue' },
      { date: '2024-03', value: 1000000, metric: 'revenue' }
    ],
    insights: [
      {
        id: '1',
        type: 'trend',
        title: 'Revenue Growth',
        description: 'Strong revenue growth trend',
        impact: 0.8
      }
    ],
    goals: [
      {
        id: '1',
        title: 'Revenue Target',
        target: 1200000,
        current: 1000000,
        deadline: '2024-12-31'
      }
    ]
  }

  // Test 1: Generate insights
  try {
    const startTime = Date.now()
    const insights = await service.generateInsights(sampleData)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard',
      test: 'Generate Insights',
      success: true,
      duration,
      result: insights
    })
    console.log('✅ Generate Insights - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard',
      test: 'Generate Insights',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Generate Insights - Failed:', (error as Error).message)
  }

  // Test 2: Predict trends
  try {
    const startTime = Date.now()
    const trends = await service.predictTrends(sampleData.trends)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard',
      test: 'Predict Trends',
      success: true,
      duration,
      result: trends
    })
    console.log('✅ Predict Trends - Success!')
  } catch (error) {
    results.push({
      service: 'Dashboard',
      test: 'Predict Trends',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Predict Trends - Failed:', (error as Error).message)
  }

  return results
}

async function testGrowthStudioService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Growth Studio AI Service...')
  const results: TestResult[] = []
  const service = new GrowthStudioAIService('test-user-id')

  // Sample growth data
  const sampleData = {
    currentMetrics: {
      revenue: 1000000,
      customers: 500,
      growthRate: 15,
      churnRate: 5
    },
    historicalData: [
      { date: '2024-01', revenue: 800000, customers: 400, growthRate: 10 },
      { date: '2024-02', revenue: 900000, customers: 450, growthRate: 12 },
      { date: '2024-03', revenue: 1000000, customers: 500, growthRate: 15 }
    ],
    constraints: {
      budget: 100000,
      timeline: '12 months',
      teamSize: 10,
      marketConditions: 'favorable'
    },
    goals: {
      targetRevenue: 2000000,
      targetCustomers: 1000,
      targetGrowthRate: 25,
      timeframe: '12 months'
    }
  }

  // Test 1: Simulate growth scenarios
  try {
    const startTime = Date.now()
    const scenarios = await service.simulateGrowthScenarios(sampleData)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Growth Studio',
      test: 'Simulate Scenarios',
      success: true,
      duration,
      result: scenarios
    })
    console.log('✅ Simulate Scenarios - Success!')
  } catch (error) {
    results.push({
      service: 'Growth Studio',
      test: 'Simulate Scenarios',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Simulate Scenarios - Failed:', (error as Error).message)
  }

  // Test 2: Identify opportunities
  try {
    const startTime = Date.now()
    const opportunities = await service.identifyOpportunities(sampleData)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Growth Studio',
      test: 'Identify Opportunities',
      success: true,
      duration,
      result: opportunities
    })
    console.log('✅ Identify Opportunities - Success!')
  } catch (error) {
    results.push({
      service: 'Growth Studio',
      test: 'Identify Opportunities',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Identify Opportunities - Failed:', (error as Error).message)
  }

  return results
}

async function testTeamService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Team AI Service...')
  const results: TestResult[] = []
  const service = new TeamAIService('test-user-id')

  // Sample team data
  const sampleData = {
    members: [
      {
        id: '1',
        name: 'John Doe',
        role: 'Product Manager',
        skills: ['product strategy', 'user research', 'agile'],
        experience: 5,
        performance: 85,
        availability: 90,
        preferences: ['collaborative work', 'data-driven decisions']
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Software Engineer',
        skills: ['react', 'node.js', 'aws'],
        experience: 3,
        performance: 80,
        availability: 85,
        preferences: ['technical challenges', 'learning new technologies']
      }
    ],
    projects: [
      {
        id: '1',
        name: 'Product Launch',
        status: 'in-progress',
        priority: 'high',
        deadline: '2024-06-30',
        requirements: ['market research', 'technical implementation'],
        assignedMembers: ['1', '2']
      }
    ],
    performance: [
      {
        memberId: '1',
        metric: 'productivity',
        value: 85,
        date: '2024-03-01'
      }
    ],
    collaboration: [
      {
        fromMember: '1',
        toMember: '2',
        interactionType: 'project collaboration',
        frequency: 5,
        effectiveness: 8
      }
    ]
  }

  // Test 1: Analyze team performance
  try {
    const startTime = Date.now()
    const analysis = await service.analyzeTeamPerformance(sampleData)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Team',
      test: 'Analyze Performance',
      success: true,
      duration,
      result: analysis
    })
    console.log('✅ Analyze Performance - Success!')
  } catch (error) {
    results.push({
      service: 'Team',
      test: 'Analyze Performance',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Analyze Performance - Failed:', (error as Error).message)
  }

  // Test 2: Suggest delegations
  try {
    const questions = [
      {
        id: '1',
        question: 'How should we approach the technical architecture for the new feature?',
        category: 'technical',
        complexity: 'medium'
      }
    ]
    
    const startTime = Date.now()
    const delegations = await service.suggestDelegations(questions)
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Team',
      test: 'Suggest Delegations',
      success: true,
      duration,
      result: delegations
    })
    console.log('✅ Suggest Delegations - Success!')
  } catch (error) {
    results.push({
      service: 'Team',
      test: 'Suggest Delegations',
      success: false,
      duration: 0,
      error: (error as Error).message
    })
    console.log('❌ Suggest Delegations - Failed:', (error as Error).message)
  }

  return results
}

async function runAllTests() {
  console.log('🤖 Testing All AI Services\n')

  const allResults: TestResult[] = []

  // Test all services
  const assessmentResults = await testAssessmentService()
  const dashboardResults = await testDashboardService()
  const growthStudioResults = await testGrowthStudioService()
  const teamResults = await testTeamService()

  allResults.push(...assessmentResults, ...dashboardResults, ...growthStudioResults, ...teamResults)

  // Generate summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 AI Services Test Summary')
  console.log('='.repeat(60))

  const successful = allResults.filter(r => r.success)
  const failed = allResults.filter(r => !r.success)

  console.log(`✅ Successful: ${successful.length}/${allResults.length}`)
  console.log(`❌ Failed: ${failed.length}/${allResults.length}`)

  if (successful.length > 0) {
    console.log('\n🏆 Best Performance:')
    const fastest = successful.reduce((a, b) => a.duration < b.duration ? a : b)
    console.log(`   ${fastest.service} - ${fastest.test}: ${fastest.duration}ms`)
  }

  if (failed.length > 0) {
    console.log('\n🚨 Failed Tests:')
    failed.forEach(f => {
      console.log(`   ${f.service} - ${f.test}: ${f.error}`)
    })
  }

  // Service breakdown
  const services = ['Assessment', 'Dashboard', 'Growth Studio', 'Team']
  console.log('\n📈 Service Breakdown:')
  services.forEach(service => {
    const serviceResults = allResults.filter(r => r.service === service)
    const serviceSuccess = serviceResults.filter(r => r.success).length
    const serviceTotal = serviceResults.length
    console.log(`   ${service}: ${serviceSuccess}/${serviceTotal} tests passed`)
  })

  console.log('\n🎉 AI Services Testing Complete!')
}

// Run the tests
runAllTests().catch(console.error) 