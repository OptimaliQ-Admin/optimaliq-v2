import { AILogger } from './logger'
import { OpenAIProvider } from './providers/openai'
import { AnthropicProvider } from './providers/anthropic'
import { VertexAIProvider } from './providers/vertex'
import { MistralProvider } from './providers/mistral'

export interface AIProvider {
  name: string
  generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse>
  analyze(data: any, context: string): Promise<AIAnalysis>
  getModelInfo(): ModelInfo
  isHealthy(): Promise<boolean>
}

export interface AIGenerateOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  responseFormat?: 'json' | 'text'
  fallback?: boolean
}

export interface AIResponse {
  content: any
  tokensUsed: number
  provider: string
  model: string
  latency: number
  metadata: {
    version: string
    timestamp: string
    requestId: string
  }
}

export interface AIAnalysis {
  scores: {
    strategy: number
    process: number
    technology: number
    overall: number
  }
  insights: string[]
  recommendations: string[]
  confidence: number
}

export interface ModelInfo {
  name: string
  maxTokens: number
  costPerToken: number
  capabilities: string[]
}

export interface AIConfig {
  defaultProvider: string
  fallbackProvider: string
  maxRetries: number
  timeout: number
  enableLogging: boolean
}

export interface ProviderHealth {
  provider: string
  isHealthy: boolean
  lastCheck: Date
  errorRate: number
  avgLatency: number
}

export class AIProviderError extends Error {
  constructor(
    public provider: string,
    public originalError: any,
    message?: string
  ) {
    super(message || `AI Provider Error (${provider}): ${originalError?.message || 'Unknown error'}`)
    this.name = 'AIProviderError'
  }
}

export class AIClient {
  private providers: Map<string, AIProvider>
  private config: AIConfig
  private logger: AILogger
  private healthCache: Map<string, ProviderHealth>
  private healthCheckInterval: NodeJS.Timeout | null = null

  constructor(config: Partial<AIConfig> = {}) {
    this.config = {
      defaultProvider: 'openai',
      fallbackProvider: 'anthropic',
      maxRetries: 3,
      timeout: 30000,
      enableLogging: true,
      ...config
    }

    this.providers = new Map()
    this.logger = new AILogger()
    this.healthCache = new Map()

    // Initialize providers
    this.initializeProviders()
    
    // Start health monitoring
    this.startHealthMonitoring()
  }

  private initializeProviders(): void {
    // Initialize OpenAI provider
    if (process.env.OPENAI_API_KEY) {
      this.providers.set('openai', new OpenAIProvider())
    }

    // Initialize Anthropic provider
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set('anthropic', new AnthropicProvider())
    }

    // Initialize Google Vertex AI provider
    if (process.env.GOOGLE_AI_API_KEY) {
      this.providers.set('vertex', new VertexAIProvider())
    }

    // Initialize Mistral provider
    if (process.env.MISTRAL_API_KEY) {
      this.providers.set('mistral', new MistralProvider())
    }

    console.log(`🤖 AI Client initialized with ${this.providers.size} providers:`, 
      Array.from(this.providers.keys()))
  }

  async generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse> {
    const requestId = crypto.randomUUID()
    const startTime = Date.now()

    try {
      // Get healthy providers in priority order
      const healthyProviders = await this.getHealthyProviders()
      
      if (healthyProviders.length === 0) {
        throw new Error('No healthy AI providers available')
      }

      // Try primary provider first
      let lastError: Error | null = null
      
      for (const provider of healthyProviders) {
        try {
          const result = await provider.generate(prompt, options)
          
          // Log successful request
          if (this.config.enableLogging) {
            await this.logger.logRequest({
              request_id: requestId,
              provider: provider.name,
              model: result.model,
              apirequest: prompt,
              apiresponse: JSON.stringify(result.content),
              tokensused: result.tokensUsed,
              latency: result.latency,
              error_message: undefined,
              fallback_used: provider.name !== this.config.defaultProvider,
              model_version: result.metadata.version,
              u_id: null // Will be set by calling service
            })
          }

          return result
        } catch (error) {
          lastError = new AIProviderError(provider.name, error)
          
          // Update health cache
          await this.updateProviderHealth(provider.name, false, Date.now() - startTime)
          
          console.warn(`⚠️ Provider ${provider.name} failed, trying next...`, error)
          
          // Continue to next provider if fallback is enabled
          if (!options?.fallback) {
            break
          }
        }
      }

      // All providers failed
      throw lastError || new Error('All AI providers failed')
    } catch (error) {
      // Log error
      if (this.config.enableLogging) {
        await this.logger.logError(requestId, error as Error)
      }
      
      throw error
    }
  }

  async analyze(data: any, context: string): Promise<AIAnalysis> {
    const prompt = this.buildAnalysisPrompt(data, context)
    
    const response = await this.generate(prompt, {
      responseFormat: 'json',
      temperature: 0.3
    })

    return this.validateAnalysis(response.content)
  }

  async getProviderHealth(): Promise<ProviderHealth[]> {
    const health: ProviderHealth[] = []
    
    for (const [name, provider] of this.providers) {
      const cached = this.healthCache.get(name)
      
      if (cached && Date.now() - cached.lastCheck.getTime() < 60000) {
        // Use cached health if less than 1 minute old
        health.push(cached)
      } else {
        // Check fresh health
        const isHealthy = await provider.isHealthy()
        const providerHealth: ProviderHealth = {
          provider: name,
          isHealthy,
          lastCheck: new Date(),
          errorRate: cached?.errorRate || 0,
          avgLatency: cached?.avgLatency || 0
        }
        
        this.healthCache.set(name, providerHealth)
        health.push(providerHealth)
      }
    }
    
    return health
  }

  async switchProvider(provider: string): Promise<void> {
    if (!this.providers.has(provider)) {
      throw new Error(`Provider ${provider} not available`)
    }
    
    this.config.defaultProvider = provider
    console.log(`🔄 Switched default AI provider to: ${provider}`)
  }

  async getProviderStats(provider: string, days: number = 7): Promise<any> {
    return this.logger.getProviderStats(provider, days)
  }

  private async getHealthyProviders(): Promise<AIProvider[]> {
    const health = await this.getProviderHealth()
    const healthyProviders = health
      .filter(h => h.isHealthy)
      .sort((a, b) => {
        // Sort by error rate (ascending) then by latency (ascending)
        if (a.errorRate !== b.errorRate) {
          return a.errorRate - b.errorRate
        }
        return a.avgLatency - b.avgLatency
      })
      .map(h => this.providers.get(h.provider)!)
      .filter(Boolean)

    // Ensure default provider is first if healthy
    const defaultProvider = this.providers.get(this.config.defaultProvider)
    if (defaultProvider && healthyProviders.includes(defaultProvider)) {
      const reordered = [defaultProvider, ...healthyProviders.filter(p => p !== defaultProvider)]
      return reordered
    }

    return healthyProviders
  }

  private async updateProviderHealth(provider: string, success: boolean, latency: number): Promise<void> {
    const cached = this.healthCache.get(provider)
    
    if (cached) {
      // Update error rate (simple moving average)
      const errorRate = success ? cached.errorRate * 0.9 : cached.errorRate * 0.9 + 0.1
      
      // Update average latency (simple moving average)
      const avgLatency = cached.avgLatency * 0.9 + latency * 0.1
      
      this.healthCache.set(provider, {
        ...cached,
        errorRate,
        avgLatency,
        lastCheck: new Date()
      })
    }
  }

  private startHealthMonitoring(): void {
    // Check provider health every 5 minutes
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.getProviderHealth()
      } catch (error) {
        console.error('Health monitoring error:', error)
      }
    }, 5 * 60 * 1000)
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

  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = null
    }
  }
}

// Export singleton instance
export const aiClient = new AIClient() 