#!/usr/bin/env tsx

// Load environment variables
import { config } from 'dotenv'
config({ path: '.env.local' })

// Direct imports to avoid client dependencies
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Mistral } from '@mistralai/mistralai'

interface TestResult {
  provider: string
  success: boolean
  latency: number
  tokensUsed: number
  content: string
  error?: string
}

async function testOpenAI(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: "user", content: "Write a short paragraph about AI." }],
      max_tokens: 100
    })

    const content = response.choices[0]?.message?.content || ''
    
    return {
      provider: 'OpenAI',
      success: true,
      latency: Date.now() - startTime,
      tokensUsed: response.usage?.total_tokens || 0,
      content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
    }
  } catch (error) {
    return {
      provider: 'OpenAI',
      success: false,
      latency: Date.now() - startTime,
      tokensUsed: 0,
      content: '',
      error: (error as Error).message
    }
  }
}

async function testAnthropic(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not configured')
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 30000
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      messages: [{ role: "user", content: "Write a short paragraph about AI." }]
    })

    const content = response.content[0]?.text || ''
    
    return {
      provider: 'Anthropic',
      success: true,
      latency: Date.now() - startTime,
      tokensUsed: response.usage?.input_tokens + response.usage?.output_tokens || 0,
      content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
    }
  } catch (error) {
    return {
      provider: 'Anthropic',
      success: false,
      latency: Date.now() - startTime,
      tokensUsed: 0,
      content: '',
      error: (error as Error).message
    }
  }
}

async function testGoogleAI(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('Google AI API key not configured')
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    
    const result = await model.generateContent('Write a short paragraph about AI.')
    const response = await result.response
    const content = response.text() || ''
    
    return {
      provider: 'Google AI',
      success: true,
      latency: Date.now() - startTime,
      tokensUsed: result.response.usageMetadata?.totalTokenCount || 0,
      content: content.substring(0, 100) + (content.length > 100 ? '...' : '')
    }
  } catch (error) {
    return {
      provider: 'Google AI',
      success: false,
      latency: Date.now() - startTime,
      tokensUsed: 0,
      content: '',
      error: (error as Error).message
    }
  }
}

async function testMistral(): Promise<TestResult> {
  const startTime = Date.now()
  
  try {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('Mistral API key not configured')
    }

    const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
    
    const response = await client.chat.complete({
      model: 'mistral-medium-latest',
      messages: [
        {
          role: 'user',
          content: 'Write a short paragraph about AI.'
        }
      ],
      maxTokens: 100
    })

    const content = response.choices[0]?.message?.content
    const contentText = typeof content === 'string' 
      ? content 
      : content?.map(chunk => chunk.type === 'text' ? chunk.text : '').join('') || ''
    
    return {
      provider: 'Mistral',
      success: true,
      latency: Date.now() - startTime,
      tokensUsed: response.usage?.totalTokens || 0,
      content: contentText.substring(0, 100) + (contentText.length > 100 ? '...' : '')
    }
  } catch (error) {
    return {
      provider: 'Mistral',
      success: false,
      latency: Date.now() - startTime,
      tokensUsed: 0,
      content: '',
      error: (error as Error).message
    }
  }
}

async function runAllTests() {
  console.log('🤖 Testing All AI Providers Standalone\n')

  const tests = [
    testOpenAI,
    testAnthropic,
    testGoogleAI,
    testMistral
  ]

  const results: TestResult[] = []

  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`)
    const result = await test()
    results.push(result)
    
    if (result.success) {
      console.log(`✅ ${result.provider} - Success!`)
      console.log(`⏱️  Latency: ${result.latency}ms`)
      console.log(`🔢 Tokens: ${result.tokensUsed}`)
      console.log(`📄 Content: ${result.content}`)
    } else {
      console.log(`❌ ${result.provider} - Failed!`)
      console.log(`🚨 Error: ${result.error}`)
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log('📊 Summary:')
  console.log(`${'='.repeat(50)}`)
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Successful: ${successful.length}/4`)
  console.log(`❌ Failed: ${failed.length}/4`)
  
  if (successful.length > 0) {
    console.log(`\n🏆 Best Performance:`)
    const fastest = successful.reduce((a, b) => a.latency < b.latency ? a : b)
    console.log(`   ${fastest.provider}: ${fastest.latency}ms`)
  }
  
  if (failed.length > 0) {
    console.log(`\n🚨 Failed Providers:`)
    failed.forEach(f => console.log(`   ${f.provider}: ${f.error}`))
  }
}

// Run the tests
runAllTests().catch(console.error) 