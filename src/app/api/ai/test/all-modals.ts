import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Set default values for missing Supabase variables to prevent errors
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://placeholder.supabase.co'
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'placeholder-key'
}

// Debug: Show which environment variables are loaded
console.log('Environment variables loaded:')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing')
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Missing')
console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✓ Set' : '✗ Missing')
console.log('MISTRAL_API_KEY:', process.env.MISTRAL_API_KEY ? '✓ Set' : '✗ Missing')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing')
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing')

import { aiClient } from '@/lib/ai/client'

async function testProvider(provider: string, prompt: string) {
  try {
    console.log(`\n🧪 Testing ${provider}...`)
    const response = await aiClient.generate(prompt, {
      model: undefined, // Use default for each provider
      fallback: false
    })
    console.log(`✅ [${provider}] Success!`)
    console.log(`   Content: ${typeof response.content === 'string' ? response.content.substring(0, 100) + '...' : JSON.stringify(response.content).substring(0, 100) + '...'}`)
    console.log(`   Tokens: ${response.tokensUsed}`)
    console.log(`   Latency: ${response.latency}ms`)
  } catch (error) {
    console.error(`❌ [${provider}] Error:`, error instanceof Error ? error.message : error)
  }
}

async function main() {
  console.log('\n🚀 Starting AI Provider Tests...\n')
  
  const prompt = 'Say hello from your AI model!'
  const providers = [
    'openai',
    'anthropic', 
    'vertex',
    'mistral'
  ]

  for (const provider of providers) {
    try {
      await aiClient.switchProvider(provider)
      await testProvider(provider, prompt)
    } catch (e) {
      console.error(`⚠️ [${provider}] Skipped (not configured or error):`, e instanceof Error ? e.message : e)
    }
  }
  
  console.log('\n🎉 Test completed!')
}

main().catch(console.error) 