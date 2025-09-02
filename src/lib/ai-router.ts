import OpenAI from 'openai';
import { AppError } from '@/utils';
import { anthropicProvider } from '@/lib/ai/providers/anthropic';
import { googleVertexProvider } from '@/lib/ai/providers/google-vertex';
import { mistralProvider } from '@/lib/ai/providers/mistral';
import { env } from '@/lib/env';
import { telemetryService, TelemetryTimer } from '@/lib/ai/telemetry/telemetry-service';
import { strategyEngine, StrategyContext } from '@/lib/ai/engines/strategy-engine';

// AI Provider Configuration
export interface AIProviderConfig {
  provider: string;
  apiKey: string;
  model: string;
  maxTokens: number;
  costPerToken: number;
  capabilities: string[];
  isActive: boolean;
  priority: number;
}

export interface AIRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  task: AITask;
  priority: 'low' | 'medium' | 'high';
  budget?: number;
  strategy?: string;
  context?: StrategyContext;
  telemetryEnabled?: boolean;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  cost: number;
  latency: number;
  timestamp: Date;
  confidence?: number;
  quality?: number;
  strategyUsed?: string;
  telemetryId?: string;
}

export enum AITask {
  TEXT_GENERATION = 'text_generation',
  EMBEDDINGS = 'embeddings',
  CLASSIFICATION = 'classification',
  SUMMARIZATION = 'summarization',
  TRANSLATION = 'translation',
  REASONING = 'reasoning',
  CREATIVE = 'creative',
  ANALYSIS = 'analysis'
}

export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral'
}

// AI Model Router Class
export class AIModelRouter {
  private static instance: AIModelRouter;
  private providers: Map<string, AIProviderConfig> = new Map();
  private performanceMetrics: Map<string, any> = new Map();
  private costTracker: Map<string, number> = new Map();
  
  private constructor() {
    this.initializeProviders();
  }
  
  public static getInstance(): AIModelRouter {
    if (!AIModelRouter.instance) {
      AIModelRouter.instance = new AIModelRouter();
    }
    return AIModelRouter.instance;
  }
  
  private initializeProviders(): void {
    // OpenAI Configuration
    if (env.OPENAI_API_KEY) {
      this.providers.set(AIProvider.OPENAI, {
        provider: AIProvider.OPENAI,
        apiKey: env.OPENAI_API_KEY,
        model: 'gpt-4',
        maxTokens: 8192,
        costPerToken: 0.00003, // $0.03 per 1K tokens
        capabilities: [
          AITask.TEXT_GENERATION,
          AITask.REASONING,
          AITask.CREATIVE,
          AITask.ANALYSIS,
          AITask.EMBEDDINGS
        ],
        isActive: true,
        priority: 1
      });
    }
    
    // Anthropic Configuration
    if (env.ANTHROPIC_API_KEY) {
      this.providers.set(AIProvider.ANTHROPIC, {
        provider: AIProvider.ANTHROPIC,
        apiKey: env.ANTHROPIC_API_KEY,
        model: 'claude-3-sonnet-20240229',
        maxTokens: 4096,
        costPerToken: 0.000015, // $0.015 per 1K tokens
        capabilities: [
          AITask.TEXT_GENERATION,
          AITask.REASONING,
          AITask.ANALYSIS,
          AITask.CREATIVE
        ],
        isActive: true,
        priority: 2
      });
    }
    
    // Google Vertex AI Configuration
    if (env.VERTEX_PROJECT_ID) {
      this.providers.set(AIProvider.GOOGLE, {
        provider: AIProvider.GOOGLE,
        apiKey: env.VERTEX_PROJECT_ID,
        model: 'gemini-1.5-pro',
        maxTokens: 8192,
        costPerToken: 0.0035, // $0.0035 per 1K tokens
        capabilities: [
          AITask.TEXT_GENERATION,
          AITask.REASONING,
          AITask.ANALYSIS,
          AITask.EMBEDDINGS
        ],
        isActive: true,
        priority: 3
      });
    }
    
    // Mistral Configuration
    if (env.MISTRAL_API_KEY) {
      this.providers.set(AIProvider.MISTRAL, {
        provider: AIProvider.MISTRAL,
        apiKey: env.MISTRAL_API_KEY,
        model: 'mistral-large-latest',
        maxTokens: 32768,
        costPerToken: 0.000008, // $0.008 per 1K tokens
        capabilities: [
          AITask.TEXT_GENERATION,
          AITask.REASONING,
          AITask.ANALYSIS,
          AITask.EMBEDDINGS,
          AITask.CREATIVE
        ],
        isActive: true,
        priority: 4
      });
    }
  }
  
  // Select the best provider for a given task
  private selectProvider(request: AIRequest): AIProviderConfig {
    const availableProviders = Array.from(this.providers.values())
      .filter(provider => provider.isActive)
      .filter(provider => provider.capabilities.includes(request.task));
    
    if (availableProviders.length === 0) {
      throw new AppError(
        'No available AI providers for the requested task',
        'AI_PROVIDER_UNAVAILABLE',
        503
      );
    }
    
    // Score providers based on multiple factors
    const scoredProviders = availableProviders.map(provider => {
      let score = 0;
      
      // Priority score (lower is better)
      score += provider.priority * 10;
      
      // Cost efficiency score
      score += (provider.costPerToken * 1000000); // Normalize cost
      
      // Performance score (based on historical data)
      const performance = this.performanceMetrics.get(provider.provider);
      if (performance) {
        score += (1 - performance.successRate) * 50; // Lower success rate = higher score (worse)
        score += performance.avgLatency / 1000; // Higher latency = higher score (worse)
      }
      
      // Budget constraint
      if (request.budget) {
        const estimatedCost = this.estimateCost(request, provider);
        if (estimatedCost > request.budget) {
          score += 1000; // Heavily penalize over-budget providers
        }
      }
      
      return { provider, score };
    });
    
    // Return the provider with the lowest score (best)
    scoredProviders.sort((a, b) => a.score - b.score);
    const bestProvider = scoredProviders[0];
    if (!bestProvider) {
      throw new AppError('No suitable provider found', 'NO_PROVIDER_AVAILABLE', 503);
    }
    return bestProvider.provider;
  }
  
  // Estimate cost for a request
  private estimateCost(request: AIRequest, provider: AIProviderConfig): number {
    const estimatedTokens = Math.min(
      request.maxTokens || provider.maxTokens,
      provider.maxTokens
    );
    return estimatedTokens * provider.costPerToken;
  }
  
  // Execute AI request with the best provider
  async execute(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    let timer: TelemetryTimer | null = null;
    
    // Initialize telemetry if enabled
    if (request.telemetryEnabled !== false) {
      timer = telemetryService.startTiming(`ai.${request.task}`);
      timer.addMetadata('prompt_length', request.prompt.length);
      timer.addMetadata('task', request.task);
      timer.addMetadata('priority', request.priority);
    }
    
    // Select strategy if specified
    let strategyResult = null;
    if (request.strategy && request.context) {
      try {
        strategyResult = await strategyEngine.executeStrategy(
          request.strategy,
          request.context,
          'state'
        );
      } catch (error) {
        console.warn('Strategy execution failed, continuing with default:', error);
      }
    }
    
    const selectedProvider = this.selectProvider(request);
    
    try {
      let response: AIResponse;
      
      switch (selectedProvider.provider) {
        case AIProvider.OPENAI:
          response = await this.executeOpenAI(request, selectedProvider);
          break;
        case AIProvider.ANTHROPIC:
          response = await this.executeAnthropic(request, selectedProvider);
          break;
        case AIProvider.GOOGLE:
          response = await this.executeGoogle(request, selectedProvider);
          break;
        case AIProvider.MISTRAL:
          response = await this.executeMistral(request, selectedProvider);
          break;
        default:
          throw new AppError(
            `Unsupported AI provider: ${selectedProvider.provider}`,
            'AI_PROVIDER_UNSUPPORTED',
            400
          );
      }
      
      // Update performance metrics
      this.updatePerformanceMetrics(selectedProvider.provider, {
        success: true,
        latency: Date.now() - startTime,
        cost: response.cost
      });
      
      // Add strategy and telemetry information
      response.strategyUsed = request.strategy;
      response.confidence = strategyResult?.confidence;
      response.quality = strategyResult?.quality;
      
      // Complete telemetry logging
      if (timer) {
        response.telemetryId = `tel_${Date.now()}`;
        await timer.end({
          content_length: response.content.length,
          tokens_used: response.tokensUsed,
          provider: response.provider,
          model: response.model
        }, {
          confidence: response.confidence,
          quality: response.quality,
          success: true,
          cost: response.cost,
          provider: response.provider,
          model: response.model
        });
      }
      
      return response;
      
    } catch (error) {
      // Update performance metrics for failure
      this.updatePerformanceMetrics(selectedProvider.provider, {
        success: false,
        latency: Date.now() - startTime,
        cost: 0
      });
      
      // Complete telemetry logging for failure
      if (timer) {
        await timer.end(null, {
          success: false,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          provider: selectedProvider.provider
        });
      }
      
      // Try fallback provider if available
      return this.executeWithFallback(request, selectedProvider.provider);
    }
  }
  
  // OpenAI execution
  private async executeOpenAI(request: AIRequest, config: AIProviderConfig): Promise<AIResponse> {
    const openai = new OpenAI({
      apiKey: config.apiKey
    });
    
    const completion = await openai.chat.completions.create({
      model: config.model,
      messages: [{ role: 'user', content: request.prompt }],
      max_tokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7
    });
    
    const content = completion.choices[0]?.message?.content || '';
    const tokensUsed = completion.usage?.total_tokens || 0;
    const cost = tokensUsed * config.costPerToken;
    
    return {
      content,
      provider: AIProvider.OPENAI,
      model: config.model,
      tokensUsed,
      cost,
      latency: 0, // Will be calculated by caller
      timestamp: new Date()
    };
  }
  
  // Anthropic execution
  private async executeAnthropic(request: AIRequest, config: AIProviderConfig): Promise<AIResponse> {
    const startTime = Date.now();
    
    const response = await anthropicProvider.generateCompletion({
      prompt: request.prompt,
      model: config.model,
      maxTokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7,
    });
    
    const cost = response.usage.totalTokens * config.costPerToken;
    
    return {
      content: response.text,
      provider: AIProvider.ANTHROPIC,
      model: response.model,
      tokensUsed: response.usage.totalTokens,
      cost,
      latency: Date.now() - startTime,
      timestamp: new Date()
    };
  }
  
  // Google execution
  private async executeGoogle(request: AIRequest, config: AIProviderConfig): Promise<AIResponse> {
    const startTime = Date.now();
    
    const response = await googleVertexProvider.generateCompletion({
      prompt: request.prompt,
      model: config.model,
      maxTokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7,
    });
    
    const cost = response.usage.totalTokens * config.costPerToken;
    
    return {
      content: response.text,
      provider: AIProvider.GOOGLE,
      model: response.model,
      tokensUsed: response.usage.totalTokens,
      cost,
      latency: Date.now() - startTime,
      timestamp: new Date()
    };
  }
  
  // Mistral execution
  private async executeMistral(request: AIRequest, config: AIProviderConfig): Promise<AIResponse> {
    const startTime = Date.now();
    
    const response = await mistralProvider.generateCompletion({
      prompt: request.prompt,
      model: config.model,
      maxTokens: request.maxTokens || config.maxTokens,
      temperature: request.temperature || 0.7,
    });
    
    const cost = response.usage.totalTokens * config.costPerToken;
    
    return {
      content: response.text,
      provider: AIProvider.MISTRAL,
      model: response.model,
      tokensUsed: response.usage.totalTokens,
      cost,
      latency: Date.now() - startTime,
      timestamp: new Date()
    };
  }
  
  // Fallback execution with alternative provider
  private async executeWithFallback(request: AIRequest, failedProvider: string): Promise<AIResponse> {
    const fallbackProviders = Array.from(this.providers.values())
      .filter(provider => provider.isActive && provider.provider !== failedProvider)
      .filter(provider => provider.capabilities.includes(request.task));
    
    if (fallbackProviders.length === 0) {
      throw new AppError(
        'No fallback AI providers available',
        'AI_PROVIDER_FALLBACK_UNAVAILABLE',
        503
      );
    }
    
    // Use the highest priority fallback provider
    fallbackProviders.sort((a, b) => a.priority - b.priority);
    
    // Retry with fallback provider
    const retryRequest = { ...request, priority: 'high' as const };
    return this.execute(retryRequest);
  }
  
  // Update performance metrics
  private updatePerformanceMetrics(provider: string, metrics: any): void {
    const current = this.performanceMetrics.get(provider) || {
      totalRequests: 0,
      successfulRequests: 0,
      totalLatency: 0,
      totalCost: 0
    };
    
    current.totalRequests++;
    if (metrics.success) {
      current.successfulRequests++;
    }
    current.totalLatency += metrics.latency;
    current.totalCost += metrics.cost;
    
    current.successRate = current.successfulRequests / current.totalRequests;
    current.avgLatency = current.totalLatency / current.totalRequests;
    current.avgCost = current.totalCost / current.totalRequests;
    
    this.performanceMetrics.set(provider, current);
  }
  
  // Get provider status
  getProviderStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [provider, config] of this.providers) {
      const metrics = this.performanceMetrics.get(provider);
      status[provider] = {
        isActive: config.isActive,
        priority: config.priority,
        capabilities: config.capabilities,
        costPerToken: config.costPerToken,
        maxTokens: config.maxTokens,
        performance: metrics || null
      };
    }
    
    return status;
  }
  
  // Get cost tracking
  getCostTracking(): Record<string, number> {
    return Object.fromEntries(this.costTracker);
  }
  
  // Reset cost tracking
  resetCostTracking(): void {
    this.costTracker.clear();
  }
}

// Export singleton instance
export const aiRouter = AIModelRouter.getInstance();

// Convenience functions for common AI tasks
export const ai = {
  // Generate text content
  generate: async (prompt: string, options?: Partial<AIRequest>): Promise<string> => {
    const request: AIRequest = {
      prompt,
      task: AITask.TEXT_GENERATION,
      priority: 'medium',
      ...options
    };
    
    const response = await aiRouter.execute(request);
    return response.content;
  },
  
  // Generate embeddings
  embed: async (text: string): Promise<number[]> => {
    const request: AIRequest = {
      prompt: text,
      task: AITask.EMBEDDINGS,
      priority: 'low'
    };
    
    await aiRouter.execute(request);
    // Parse embeddings from response (implementation depends on provider)
    return []; // Placeholder
  },
  
  // Classify text
  classify: async (text: string, categories: string[]): Promise<string> => {
    const prompt = `Classify the following text into one of these categories: ${categories.join(', ')}\n\nText: ${text}\n\nCategory:`;
    
    const request: AIRequest = {
      prompt,
      task: AITask.CLASSIFICATION,
      priority: 'medium',
      temperature: 0.1
    };
    
    const response = await aiRouter.execute(request);
    return response.content.trim();
  },
  
  // Summarize text
  summarize: async (text: string, maxLength: number = 150): Promise<string> => {
    const prompt = `Summarize the following text in ${maxLength} characters or less:\n\n${text}\n\nSummary:`;
    
    const request: AIRequest = {
      prompt,
      task: AITask.SUMMARIZATION,
      priority: 'medium',
      temperature: 0.3
    };
    
    const response = await aiRouter.execute(request);
    return response.content.trim();
  },
  
  // Analyze and reason
  analyze: async (prompt: string, context?: string): Promise<string> => {
    const fullPrompt = context ? `Context: ${context}\n\nQuestion: ${prompt}\n\nAnalysis:` : prompt;
    
    const request: AIRequest = {
      prompt: fullPrompt,
      task: AITask.REASONING,
      priority: 'high',
      temperature: 0.2
    };
    
    const response = await aiRouter.execute(request);
    return response.content;
  }
};
