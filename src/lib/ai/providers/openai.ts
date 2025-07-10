import OpenAI from 'openai'
import { AIProvider, AIGenerateOptions, AIResponse, AIAnalysis, ModelInfo, AIProviderError } from '../client'

export class OpenAIProvider implements AIProvider {
  name = 'openai'
  private openai: OpenAI
  private models: Record<string, string> = {
    'gpt-4.1': 'gpt-4o',
    'gpt-4.1-mini': 'gpt-4o-mini',
    'gpt-4-turbo': 'gpt-4-turbo-preview',
    'gpt-4': 'gpt-4',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'gpt-3.5-turbo-16k': 'gpt-3.5-turbo-16k'
  }

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 30000,
      maxRetries: 3
    })
  }

  async generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse> {
    const startTime = Date.now()
    const model = this.models[options?.model || 'gpt-4.1-mini'] || 'gpt-4o-mini'
    
    try {
      const response = await this.openai.chat.completions.create({
        model,
        messages: [{ role: "system", content: prompt }],
        max_tokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7,
        response_format: options?.responseFormat === 'json' 
          ? { type: "json_object" } 
          : undefined
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from OpenAI')
      }

      // Parse JSON if response format is json
      let parsedContent: any = content
      if (options?.responseFormat === 'json') {
        try {
          parsedContent = JSON.parse(content)
        } catch (parseError) {
          throw new Error(`Failed to parse JSON response: ${parseError}`)
        }
      }

      return {
        content: parsedContent,
        tokensUsed: response.usage?.total_tokens || 0,
        provider: this.name,
        model: options?.model || 'gpt-4.1-mini',
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
      model: 'gpt-4.1-mini',
      responseFormat: 'json',
      temperature: 0.3
    })

    return this.validateAnalysis(response.content)
  }

  getModelInfo(): ModelInfo {
    return {
      name: 'gpt-4o-mini',
      maxTokens: 128000,
      costPerToken: 0.00015, // $0.15 per 1M tokens
      capabilities: [
        'text-generation',
        'json-output',
        'code-generation',
        'reasoning',
        'analysis'
      ]
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      // Simple health check with a minimal request
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: "user", content: "Hello" }],
        max_tokens: 5
      })

      return !!response.choices[0]?.message?.content
    } catch (error) {
      console.warn(`OpenAI health check failed:`, error)
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