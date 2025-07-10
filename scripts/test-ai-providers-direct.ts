#!/usr/bin/env tsx

import { OpenAIProvider } from '../src/lib/ai/providers/openai'
import { AnthropicProvider } from '../src/lib/ai/providers/anthropic'
import { VertexAIProvider } from '../src/lib/ai/providers/vertex'
import { MistralProvider } from '../src/lib/ai/providers/mistral'

async function testProvider(name: string, provider: any) {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`🧪 Testing ${name}`)
  console.log(`${'='.repeat(50)}`)

  try {
    // Test simple generation
    console.log(`\n🔤 Simple Text Generation:`)
    const prompt = 'Write a short paragraph about artificial intelligence.'
    console.log(`📝 Prompt: "${prompt}"`)
    
    const startTime = Date.now()
    const response = await provider.generate(prompt, { model: 'gpt-4o-mini' })
    const totalTime = Date.now() - startTime

    console.log(`✅ Success!`)
    console.log(`⏱️  Total Time: ${totalTime}ms`)
    console.log(`⚡ Provider Latency: ${response.latency}ms`)
    console.log(`🔢 Tokens Used: ${response.tokensUsed}`)
    console.log(`🤖 Model: ${response.model}`)
    
    const content = typeof response.content === 'string' 
      ? response.content.substring(0, 200) + (response.content.length > 200 ? '...' : '')
      : JSON.stringify(response.content, null, 2).substring(0, 200) + '...'
    
    console.log(`📄 Response: ${content}`)

    // Test JSON generation
    console.log(`\n🔤 JSON Response:`)
    const jsonPrompt = 'Generate a JSON object with 3 random facts about space exploration.'
    console.log(`📝 Prompt: "${jsonPrompt}"`)
    
    const jsonResponse = await provider.generate(jsonPrompt, { 
      model: 'gpt-4o-mini',
      responseFormat: 'json' as const,
      maxTokens: 200
    })

    console.log(`✅ JSON Success!`)
    console.log(`📄 JSON Response: ${JSON.stringify(jsonResponse.content, null, 2)}`)

  } catch (error) {
    console.error(`❌ Error testing ${name}:`, (error as Error).message)
  }
}

async function testAllProviders() {
  console.log('🤖 Testing All AI Providers Directly\n')

  const providers = [
    { name: 'OpenAI', provider: new OpenAIProvider() },
    { name: 'Anthropic', provider: new AnthropicProvider() },
    { name: 'Google AI', provider: new VertexAIProvider() },
    { name: 'Mistral', provider: new MistralProvider() }
  ]

  for (const { name, provider } of providers) {
    await testProvider(name, provider)
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log('🎉 All AI Provider Tests Complete!')
  console.log(`${'='.repeat(50)}`)
}

// Run the tests
testAllProviders().catch(console.error) 