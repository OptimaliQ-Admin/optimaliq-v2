#!/usr/bin/env tsx

import { AIClient } from '../src/lib/ai/client'
import { OpenAIProvider } from '../src/lib/ai/providers/openai'
import { AnthropicProvider } from '../src/lib/ai/providers/anthropic'
import { VertexAIProvider } from '../src/lib/ai/providers/vertex'
import { MistralProvider } from '../src/lib/ai/providers/mistral'

async function testAIProviders() {
  console.log('🤖 Testing All AI Providers\n')

  const providers = [
    { name: 'OpenAI', provider: new OpenAIProvider() },
    { name: 'Anthropic', provider: new AnthropicProvider() },
    { name: 'Google AI', provider: new VertexAIProvider() },
    { name: 'Mistral', provider: new MistralProvider() }
  ]

  const testPrompts = [
    {
      name: 'Simple Text Generation',
      prompt: 'Write a short paragraph about artificial intelligence.',
      options: { model: 'gpt-4o-mini' } as any
    },
    {
      name: 'JSON Response',
      prompt: 'Generate a JSON object with 3 random facts about space exploration.',
      options: { 
        model: 'gpt-4o-mini',
        responseFormat: 'json' as const,
        maxTokens: 200
      }
    },
    {
      name: 'Creative Writing',
      prompt: 'Write a haiku about technology.',
      options: { 
        model: 'gpt-4o-mini',
        temperature: 0.8
      } as any
    }
  ]

  for (const { name, provider } of providers) {
    console.log(`\n${'='.repeat(50)}`)
    console.log(`🧪 Testing ${name}`)
    console.log(`${'='.repeat(50)}`)

    try {
      // Test health check
      console.log(`\n📊 Health Check:`)
      try {
        const health = await (provider as any).health()
        console.log(`✅ Status: ${health.status}`)
        console.log(`📈 Latency: ${health.latency}ms`)
        if (health.models) {
          console.log(`🤖 Available Models: ${health.models.join(', ')}`)
        }
      } catch (error) {
        console.log(`⚠️  Health check not available: ${(error as Error).message}`)
      }

      // Test each prompt
      for (const test of testPrompts) {
        console.log(`\n🔤 ${test.name}:`)
        console.log(`📝 Prompt: "${test.prompt.substring(0, 50)}..."`)
        
        const startTime = Date.now()
        const response = await provider.generate(test.prompt, test.options)
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
      }

    } catch (error) {
      console.error(`❌ Error testing ${name}:`, (error as Error).message)
    }
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log('🎉 All AI Provider Tests Complete!')
  console.log(`${'='.repeat(50)}`)
}

// Run the tests
testAIProviders().catch(console.error) 