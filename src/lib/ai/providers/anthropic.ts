import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, AIGenerateOptions, AIResponse, AIAnalysis, ModelInfo, AIProviderError } from '../client'

export class AnthropicProvider implements AIProvider {
  name = 'anthropic'
  private anthropic: Anthropic
  private models: Record<string, string> = {
    'claude-opus-4': 'claude-3-opus-20240229',
    'claude-sonnet-4': 'claude-3-sonnet-20240229',
    'claude-sonnet-3.7': 'claude-3-5-sonnet-20241022',
    'claude-sonnet-3.5': 'claude-3-5-sonnet-20241022',
    'claude-haiku-3.5': 'claude-3-5-haiku-20241022'
  }

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('Anthropic API key not configured')
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      maxRetries: 3
    })
  }

  async generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse> {
    const startTime = Date.now()
    const model = this.models[options?.model || 'claude-sonnet-3.5'] || 'claude-3-5-sonnet-20241022'
    
    try {
      const response = await this.anthropic.messages.create({
        model,
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
        messages: [{ role: "user", content: prompt }],
        system: options?.responseFormat === 'json' 
          ? "You must respond with valid JSON only. Do not include any other text or formatting."
          : undefined
      })

      const content = response.content[0]?.text
      if (!content) {
        throw new Error('Empty response from Anthropic')
      }

      // Parse JSON if response format is json
      let parsedContent: any = content
      if (options?.responseFormat === 'json') {
        try {
          // Clean up the response to extract JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            parsedContent = JSON.parse(jsonMatch[0])
          } else {
            throw new Error('No JSON found in response')
          }
        } catch (parseError) {
          throw new Error(`Failed to parse JSON response: ${parseError}`)
        }
      }

      return {
        content: parsedContent,
        tokensUsed: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
        provider: this.name,
        model: options?.model || 'claude-sonnet-3.5',
        latency: Date.now() - startTime,
        metadata: {
          version: '1.0',
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID()
        }
      }
    } catch (error) {
      throw new AIProviderError(this.name, error)
    }
  }

  async analyze(data: any, context: string): Promise<AIAnalysis> {
    const prompt = this.buildAnalysisPrompt(data, context)
    
    const response = await this.generate(prompt, {
      model: 'claude-sonnet-3.5',
      responseFormat: 'json',
      temperature: 0.3
    })

    return this.validateAnalysis(response.content)
  }

  getModelInfo(): ModelInfo {
    return {
      name: 'claude-3-5-sonnet-20241022',
      maxTokens: 200000,
      costPerToken: 0.000003, // $3 per 1M tokens
      capabilities: [
        'text-generation',
        'json-output',
        'code-generation',
        'reasoning',
        'analysis',
        'long-context'
      ]
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Simple health check with a minimal request
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-haiku-20241022',
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5
      })

      return !!response.content[0]?.text
    } catch (error) {
      console.warn(`Anthropic health check failed:`, error)
      return false
    }
  }

  private buildAnalysisPrompt(data: any, context: string): string {
    return `Analyze the following business data and provide insights:

Context: ${context}

Data: ${JSON.stringify(data, null, 2)}

Please provide a JSON response with the following structure:
{
  "scores": {
    "strategy": number (1-5),
    "process": number (1-5),
    "technology": number (1-5),
    "overall": number (1-5)
  },
  "insights": ["insight1", "insight2", "insight3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
  "confidence": number (0-1)
}`
  }

  private validateAnalysis(content: any): AIAnalysis {
    // Basic validation
    if (!content.scores || !content.insights || !content.recommendations) {
      throw new Error('Invalid analysis response format')
    }

    return {
      scores: {
        strategy: Math.max(1, Math.min(5, content.scores.strategy || 3)),
        process: Math.max(1, Math.min(5, content.scores.process || 3)),
        technology: Math.max(1, Math.min(5, content.scores.technology || 3)),
        overall: Math.max(1, Math.min(5, content.scores.overall || 3))
      },
      insights: Array.isArray(content.insights) ? content.insights : [],
      recommendations: Array.isArray(content.recommendations) ? content.recommendations : [],
      confidence: Math.max(0, Math.min(1, content.confidence || 0.8))
    }
  }
} 
 