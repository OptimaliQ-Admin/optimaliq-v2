import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

// Debug: Show which environment variables are loaded
console.log('Environment variables loaded:')
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✓ Set' : '✗ Missing')
console.log('ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Missing')
console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✓ Set' : '✗ Missing')
console.log('MISTRAL_API_KEY:', process.env.MISTRAL_API_KEY ? '✓ Set' : '✗ Missing')

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

async function testOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️ OpenAI: Skipped (no API key)')
    return
  }

  try {
    console.log('\n🧪 Testing OpenAI...')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: "user", content: "Say hello from OpenAI!" }],
      max_tokens: 50
    })

    const content = response.choices[0]?.message?.content
    console.log(`✅ OpenAI: Success!`)
    console.log(`   Content: ${content}`)
    console.log(`   Tokens: ${response.usage?.total_tokens}`)
  } catch (error) {
    console.error(`❌ OpenAI: Error:`, error instanceof Error ? error.message : error)
  }
}

async function testAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️ Anthropic: Skipped (no API key)')
    return
  }

  try {
    console.log('\n🧪 Testing Anthropic...')
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      messages: [{ role: "user", content: "Say hello from Anthropic!" }],
      max_tokens: 50
    })

    const content = response.content[0]?.text
    console.log(`✅ Anthropic: Success!`)
    console.log(`   Content: ${content}`)
    console.log(`   Tokens: ${(response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)}`)
  } catch (error) {
    console.error(`❌ Anthropic: Error:`, error instanceof Error ? error.message : error)
  }
}

async function testGoogleAI() {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.log('⚠️ Google AI: Skipped (no API key)')
    return
  }

  try {
    console.log('\n🧪 Testing Google AI...')
    // Note: This is a mock test since we haven't implemented the actual Google AI integration
    console.log(`✅ Google AI: Mock response (integration pending)`)
    console.log(`   Content: Hello from Google AI! (Mock response)`)
    console.log(`   Tokens: 10`)
  } catch (error) {
    console.error(`❌ Google AI: Error:`, error instanceof Error ? error.message : error)
  }
}

async function testMistral() {
  if (!process.env.MISTRAL_API_KEY) {
    console.log('⚠️ Mistral: Skipped (no API key)')
    return
  }

  try {
    console.log('\n🧪 Testing Mistral...')
    // Note: This is a mock test since we haven't implemented the actual Mistral integration
    console.log(`✅ Mistral: Mock response (integration pending)`)
    console.log(`   Content: Hello from Mistral! (Mock response)`)
    console.log(`   Tokens: 8`)
  } catch (error) {
    console.error(`❌ Mistral: Error:`, error instanceof Error ? error.message : error)
  }
}

async function main() {
  console.log('\n🚀 Starting Simple AI Provider Tests...\n')
  
  await testOpenAI()
  await testAnthropic()
  await testGoogleAI()
  await testMistral()
  
  console.log('\n🎉 Simple test completed!')
}

main().catch(console.error) 