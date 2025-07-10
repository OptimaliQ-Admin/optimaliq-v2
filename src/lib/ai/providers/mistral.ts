import { Mistral } from '@mistralai/mistralai'
import { AIProvider, AIGenerateOptions, AIResponse, AIAnalysis, ModelInfo, AIProviderError } from '../client'

export class MistralProvider implements AIProvider {
  name = 'mistral'
  private client: Mistral
  private models: Record<string, string> = {
    'mistral-large': 'mistral-large-latest',
    'mistral-medium': 'mistral-medium-latest',
    'mistral-small': 'mistral-small-latest'
  }

  constructor() {
    if (!process.env.MISTRAL_API_KEY) {
      throw new Error('Mistral API key not configured')
    }

    this.client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY })
  }

  async generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse> {
    const startTime = Date.now()
    const model = this.models[options?.model || 'mistral-medium'] || 'mistral-medium-latest'
    
    try {
      const response = await this.client.chat.complete({
        model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        maxTokens: options?.maxTokens || 1000,
        temperature: options?.temperature || 0.7
      })

      const content = response.choices[0]?.message?.content
      if (!content) {
        throw new Error('Empty response from Mistral')
      }

      // Handle content which can be string or ContentChunk[]
      const contentText = typeof content === 'string' 
        ? content 
        : content.map(chunk => chunk.type === 'text' ? chunk.text : '').join('')
      if (!contentText) {
        throw new Error('Empty content from Mistral')
      }

      // Parse JSON if response format is json
      let parsedContent: any = contentText
      if (options?.responseFormat === 'json') {
        try {
          // Clean up the response to extract JSON
          const jsonMatch = contentText.match(/\{[\s\S]*\}/)
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
        tokensUsed: response.usage?.totalTokens || 0,
        provider: this.name,
        model: options?.model || 'mistral-medium',
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
      model: 'mistral-medium',
      responseFormat: 'json',
      temperature: 0.3
    })

    return this.validateAnalysis(response.content)
  }

  getModelInfo(): ModelInfo {
    return {
      name: 'mistral-medium-latest',
      maxTokens: 32000,
      costPerToken: 0.0000024, // $2.40 per 1M tokens
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
      // TODO: Implement actual health check
      console.warn('Mistral health check not implemented')
      return false // Return false until fully implemented
    } catch (error) {
      console.warn(`Mistral health check failed:`, error)
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