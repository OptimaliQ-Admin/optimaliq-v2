#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

// Import the AI service directly
import { aiService } from '../src/lib/ai/service'

async function testAIService() {
  console.log('🤖 Testing AI Service Directly\n')

  try {
    // Test 1: Generate text
    console.log('🔤 Test 1: Text Generation')
    const generationResult = await aiService.generateText(
      'Write a haiku about artificial intelligence.',
      { model: 'gpt-4o-mini', temperature: 0.7, maxTokens: 100 },
      'test-user-id'
    )
    console.log('✅ Generation Result:', generationResult.content.substring(0, 100) + '...')

    // Test 2: Analyze business data
    console.log('\n📊 Test 2: Business Analysis')
    const analysisResult = await aiService.analyzeBusinessData(
      { 
        prompt: 'Analyze this business data',
        data: { revenue: 1000000, growth: 15, customers: 500 },
        timestamp: new Date().toISOString()
      },
      'Test business analysis',
      'test-user-id'
    )
    console.log('✅ Analysis Result:', JSON.stringify(analysisResult, null, 2))

    // Test 3: Queue a task
    console.log('\n📋 Test 3: Task Queuing')
    const taskId = await aiService.queueTask({
      taskId: '',
      type: 'generation',
      data: { 
        prompt: 'Write a short story about robots.',
        options: { model: 'gpt-4o-mini' }
      },
      priority: 'normal',
      userId: 'test-user-id'
    })
    console.log('✅ Task Queued with ID:', taskId)

    // Test 4: Get provider health
    console.log('\n🏥 Test 4: Provider Health')
    const health = await aiService.getProviderHealth()
    console.log('✅ Health Status:', health)

    // Test 5: Get user stats
    console.log('\n📈 Test 5: User Stats')
    const stats = await aiService.getUserStats('test-user-id', 7)
    console.log('✅ User Stats:', stats)

    console.log('\n🎉 All AI Service Tests Passed!')

  } catch (error) {
    console.error('❌ AI Service Test Failed:', (error as Error).message)
    console.error('Stack:', (error as Error).stack)
  }
}

// Run the test
testAIService().catch(console.error) 