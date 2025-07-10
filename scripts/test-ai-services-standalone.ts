#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

// Direct imports to avoid Supabase dependencies
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Mistral } from '@mistralai/mistralai'

interface TestResult {
  service: string
  test: string
  success: boolean
  duration: number
  result?: any
  error?: string
}

// Mock AI service for testing
class MockAIService {
  private openai: OpenAI
  private anthropic: Anthropic
  private googleAI: GoogleGenerativeAI
  private mistral: Mistral

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
      timeout: 30000
    })
    
    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      timeout: 30000
    })
    
    this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)
    
    this.mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! })
  }

  async generateText(prompt: string, options: any = {}): Promise<any> {
    const provider = options.provider || 'openai'
    
    try {
      switch (provider) {
        case 'openai':
          const openaiResponse = await this.openai.chat.completions.create({
            model: options.model || 'gpt-4o-mini',
            messages: [{ role: "user", content: prompt }],
            max_tokens: options.maxTokens || 1000,
            temperature: options.temperature || 0.7,
            response_format: options.responseFormat === 'json' 
              ? { type: "json_object" } 
              : undefined
          })
          return { content: openaiResponse.choices[0]?.message?.content }
          
        case 'anthropic':
          const anthropicResponse = await this.anthropic.messages.create({
            model: options.model || 'claude-3-5-sonnet-20241022',
            max_tokens: options.maxTokens || 1000,
            messages: [{ role: "user", content: prompt }]
          })
          return { content: anthropicResponse.content[0]?.text }
          
        case 'google':
          const genModel = this.googleAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
          const result = await genModel.generateContent(prompt)
          const response = await result.response
          return { content: response.text() }
          
        case 'mistral':
          const mistralResponse = await this.mistral.chat.complete({
            model: 'mistral-medium-latest',
            messages: [{ role: 'user', content: prompt }],
            maxTokens: options.maxTokens || 1000
          })
          const content = mistralResponse.choices[0]?.message?.content
          const contentText = typeof content === 'string' 
            ? content 
            : content?.map(chunk => chunk.type === 'text' ? chunk.text : '').join('') || ''
          return { content: contentText }
          
        default:
          throw new Error(`Unknown provider: ${provider}`)
      }
    } catch (error) {
      throw new Error(`AI generation failed: ${(error as Error).message}`)
    }
  }
}

// Mock AI services for testing
const mockAIService = new MockAIService()

async function testAssessmentService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Assessment AI Service...')
  const results: TestResult[] = []

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
    const prompt = `Analyze the following business assessment responses and provide a comprehensive analysis.

Assessment Responses by Category:
strategy:
- What is your current revenue growth rate?: We are growing at 15% year-over-year, primarily through organic growth and some strategic partnerships.

process:
- How do you measure customer satisfaction?: We use NPS surveys, customer feedback forms, and regular check-ins with key accounts.

technology:
- What technology stack do you use?: We use modern cloud-based tools including AWS, React, and various SaaS platforms.

Please provide a JSON response with the following structure:
{
  "scores": {
    "strategy": number (1-5),
    "process": number (1-5),
    "technology": number (1-5),
    "people": number (1-5),
    "overall": number (1-5)
  },
  "insights": [
    {
      "type": "strength|weakness|opportunity|threat",
      "category": "string",
      "description": "string",
      "impact": "high|medium|low"
    }
  ],
  "recommendations": [
    {
      "category": "string",
      "priority": "high|medium|low",
      "description": "string"
    }
  ],
  "confidence": number (0-1)
}`

    const startTime = Date.now()
    const response = await mockAIService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2000
    })
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Assessment',
      test: 'Analyze Responses',
      success: true,
      duration,
      result: response.content
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

  return results
}

async function testDashboardService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Dashboard AI Service...')
  const results: TestResult[] = []

  // Test 1: Generate insights
  try {
    const prompt = `Analyze the following dashboard data and generate actionable insights:

Dashboard Data:
{
  "metrics": {
    "revenue": 1000000,
    "growth": 15,
    "customers": 500,
    "churn": 5
  },
  "trends": [
    { "date": "2024-01", "value": 800000, "metric": "revenue" },
    { "date": "2024-02", "value": 900000, "metric": "revenue" },
    { "date": "2024-03", "value": 1000000, "metric": "revenue" }
  ]
}

Please provide a JSON response with an array of insights:
[
  {
    "id": "string",
    "type": "trend|anomaly|opportunity|risk|performance",
    "title": "string",
    "description": "string",
    "category": "string",
    "impact": "high|medium|low",
    "confidence": number (0-1),
    "data": {
      "metric": "string",
      "value": number,
      "change": number,
      "trend": "up|down|stable"
    },
    "recommendations": ["string"],
    "timeframe": "string"
  }
]`

    const startTime = Date.now()
    const response = await mockAIService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    })
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Dashboard',
      test: 'Generate Insights',
      success: true,
      duration,
      result: response.content
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

  return results
}

async function testGrowthStudioService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Growth Studio AI Service...')
  const results: TestResult[] = []

  // Test 1: Simulate growth scenarios
  try {
    const prompt = `Simulate different growth scenarios based on the following data:

Growth Data:
{
  "currentMetrics": {
    "revenue": 1000000,
    "customers": 500,
    "growthRate": 15,
    "churnRate": 5
  },
  "constraints": {
    "budget": 100000,
    "timeline": "12 months",
    "teamSize": 10,
    "marketConditions": "favorable"
  },
  "goals": {
    "targetRevenue": 2000000,
    "targetCustomers": 1000,
    "targetGrowthRate": 25,
    "timeframe": "12 months"
  }
}

Please provide a JSON response with simulation results for different scenarios:
[
  {
    "id": "string",
    "scenario": "conservative|moderate|aggressive",
    "description": "string",
    "summary": {
      "totalRevenue": number,
      "totalCustomers": number,
      "totalCost": number,
      "totalROI": number,
      "paybackPeriod": number,
      "riskLevel": "low|medium|high"
    },
    "assumptions": ["string"],
    "risks": ["string"],
    "recommendations": ["string"]
  }
]`

    const startTime = Date.now()
    const response = await mockAIService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 3000
    })
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Growth Studio',
      test: 'Simulate Scenarios',
      success: true,
      duration,
      result: response.content
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

  return results
}

async function testTeamService(): Promise<TestResult[]> {
  console.log('\n🧪 Testing Team AI Service...')
  const results: TestResult[] = []

  // Test 1: Analyze team performance
  try {
    const prompt = `Analyze the following team data and provide comprehensive insights:

Team Data:
{
  "members": [
    {
      "id": "1",
      "name": "John Doe",
      "role": "Product Manager",
      "skills": ["product strategy", "user research", "agile"],
      "experience": 5,
      "performance": 85,
      "availability": 90
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "role": "Software Engineer",
      "skills": ["react", "node.js", "aws"],
      "experience": 3,
      "performance": 80,
      "availability": 85
    }
  ],
  "projects": [
    {
      "id": "1",
      "name": "Product Launch",
      "status": "in-progress",
      "priority": "high",
      "deadline": "2024-06-30",
      "requirements": ["market research", "technical implementation"],
      "assignedMembers": ["1", "2"]
    }
  ]
}

Please provide a JSON response with team analysis:
{
  "id": "string",
  "overallScore": number (0-100),
  "memberPerformance": [
    {
      "memberId": "string",
      "name": "string",
      "score": number (0-100),
      "strengths": ["string"],
      "areas": ["string"],
      "recommendations": ["string"]
    }
  ],
  "teamDynamics": {
    "collaboration": number (0-100),
    "communication": number (0-100),
    "efficiency": number (0-100),
    "innovation": number (0-100)
  },
  "insights": [
    {
      "type": "strength|weakness|opportunity|threat",
      "title": "string",
      "description": "string",
      "impact": "high|medium|low",
      "recommendations": ["string"]
    }
  ],
  "recommendations": {
    "immediate": ["string"],
    "shortTerm": ["string"],
    "longTerm": ["string"]
  }
}`

    const startTime = Date.now()
    const response = await mockAIService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    })
    const duration = Date.now() - startTime
    
    results.push({
      service: 'Team',
      test: 'Analyze Performance',
      success: true,
      duration,
      result: response.content
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

  return results
}

async function runAllTests() {
  console.log('🤖 Testing All AI Services (Standalone)\n')

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