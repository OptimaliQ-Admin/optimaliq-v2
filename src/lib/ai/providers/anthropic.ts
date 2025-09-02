import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { env } from '@/lib/env';
import { AppError } from '@/utils';

// Anthropic API schemas
const AnthropicMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const AnthropicRequestSchema = z.object({
  model: z.string().default('claude-3-sonnet-20240229'),
  messages: z.array(AnthropicMessageSchema),
  max_tokens: z.number().finite().min(1).max(4096).default(1000),
  temperature: z.number().finite().min(0).max(1).default(0.7),
  system: z.string().optional(),
  stop_sequences: z.array(z.string()).optional(),
});

const AnthropicResponseSchema = z.object({
  id: z.string(),
  type: z.string(),
  role: z.string(),
  content: z.array(z.object({
    type: z.string(),
    text: z.string(),
  })),
  model: z.string(),
  stop_reason: z.string().optional(),
  stop_sequence: z.string().optional(),
  usage: z.object({
    input_tokens: z.number().finite(),
    output_tokens: z.number().finite(),
  }),
});

type AnthropicRequest = z.infer<typeof AnthropicRequestSchema>;
type AnthropicResponse = z.infer<typeof AnthropicResponseSchema>;

/**
 * Anthropic Claude Provider
 * Handles integration with Claude AI models
 */
export class AnthropicProvider {
  private client: Anthropic;
  private defaultModel: string;
  private rateLimitTracker: Map<string, number[]> = new Map();

  constructor() {
    if (!env.ANTHROPIC_API_KEY) {
      throw new AppError('Anthropic API key not configured', 'CONFIG_ERROR', 500);
    }

    this.client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
    
    this.defaultModel = 'claude-3-sonnet-20240229';
  }

  /**
   * Generate text completion using Claude
   */
  async generateCompletion(request: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    stopSequences?: string[];
  }): Promise<{
    text: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    model: string;
    stopReason?: string;
  }> {
    try {
      // Rate limiting check
      await this.checkRateLimit();

      const anthropicRequest: AnthropicRequest = {
        model: request.model || this.defaultModel,
        messages: [
          {
            role: 'user',
            content: request.prompt,
          },
        ],
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt,
        stop_sequences: request.stopSequences,
      };

      const validatedRequest = AnthropicRequestSchema.parse(anthropicRequest);

      const response = await this.client.messages.create(validatedRequest);

      const validatedResponse = AnthropicResponseSchema.parse(response);

      // Extract text from content array
      const text = validatedResponse.content
        .filter(content => content.type === 'text')
        .map(content => content.text)
        .join('');

      return {
        text,
        usage: {
          inputTokens: validatedResponse.usage.input_tokens,
          outputTokens: validatedResponse.usage.output_tokens,
          totalTokens: validatedResponse.usage.input_tokens + validatedResponse.usage.output_tokens,
        },
        model: validatedResponse.model,
        stopReason: validatedResponse.stop_reason,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      // Handle Anthropic-specific errors
      if (error instanceof Anthropic.APIError) {
        throw new AppError(
          `Anthropic API error: ${error.message}`,
          'ANTHROPIC_API_ERROR',
          error.status || 500
        );
      }

      throw new AppError(
        `Anthropic completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ANTHROPIC_ERROR',
        500
      );
    }
  }

  /**
   * Generate structured JSON response
   */
  async generateStructuredResponse<T>(request: {
    prompt: string;
    systemPrompt?: string;
    schema: z.ZodSchema<T>;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    maxRetries?: number;
  }): Promise<{
    data: T;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    attempts: number;
  }> {
    const maxRetries = request.maxRetries || 3;
    let lastError: Error | null = null;
    let totalUsage = {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    };

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const systemPrompt = `${request.systemPrompt || ''}\n\nYou must respond with valid JSON only. Do not include any explanations or additional text outside the JSON structure.`;

        const response = await this.generateCompletion({
          prompt: request.prompt,
          systemPrompt,
          model: request.model,
          maxTokens: request.maxTokens,
          temperature: request.temperature,
        });

        // Accumulate usage
        totalUsage.inputTokens += response.usage.inputTokens;
        totalUsage.outputTokens += response.usage.outputTokens;
        totalUsage.totalTokens += response.usage.totalTokens;

        // Try to parse JSON
        let jsonText = response.text.trim();
        
        // Extract JSON from markdown code blocks if present
        const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }

        const jsonData = JSON.parse(jsonText);
        const validatedData = request.schema.parse(jsonData);

        return {
          data: validatedData,
          usage: totalUsage,
          attempts: attempt,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          break;
        }

        // Add repair instructions for next attempt
        request.prompt += `\n\nPrevious attempt failed with error: ${lastError.message}. Please ensure your response is valid JSON that matches the required schema.`;
      }
    }

    throw new AppError(
      `Failed to generate valid structured response after ${maxRetries} attempts. Last error: ${lastError?.message}`,
      'STRUCTURED_RESPONSE_ERROR',
      500
    );
  }

  /**
   * Generate chat conversation
   */
  async generateChatResponse(request: {
    messages: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
  }): Promise<{
    message: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    model: string;
  }> {
    try {
      await this.checkRateLimit();

      const anthropicRequest: AnthropicRequest = {
        model: request.model || this.defaultModel,
        messages: request.messages,
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        system: request.systemPrompt,
      };

      const validatedRequest = AnthropicRequestSchema.parse(anthropicRequest);
      const response = await this.client.messages.create(validatedRequest);
      const validatedResponse = AnthropicResponseSchema.parse(response);

      const message = validatedResponse.content
        .filter(content => content.type === 'text')
        .map(content => content.text)
        .join('');

      return {
        message,
        usage: {
          inputTokens: validatedResponse.usage.input_tokens,
          outputTokens: validatedResponse.usage.output_tokens,
          totalTokens: validatedResponse.usage.input_tokens + validatedResponse.usage.output_tokens,
        },
        model: validatedResponse.model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      
      if (error instanceof Anthropic.APIError) {
        throw new AppError(
          `Anthropic API error: ${error.message}`,
          'ANTHROPIC_API_ERROR',
          error.status || 500
        );
      }

      throw new AppError(
        `Anthropic chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ANTHROPIC_ERROR',
        500
      );
    }
  }

  /**
   * Analyze text for sentiment, topics, etc.
   */
  async analyzeText(request: {
    text: string;
    analysisType: 'sentiment' | 'topics' | 'summary' | 'classification';
    options?: {
      categories?: string[];
      maxSummaryLength?: number;
      includeConfidence?: boolean;
    };
  }): Promise<{
    analysis: any;
    confidence?: number;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
  }> {
    try {
      let systemPrompt = '';
      let userPrompt = '';

      switch (request.analysisType) {
        case 'sentiment':
          systemPrompt = 'You are an expert sentiment analyst. Analyze the sentiment of the provided text and respond with a JSON object containing: sentiment (positive/negative/neutral), confidence (0-1), and reasoning.';
          userPrompt = `Analyze the sentiment of this text:\n\n${request.text}`;
          break;

        case 'topics':
          systemPrompt = 'You are an expert topic extraction specialist. Extract the main topics from the provided text and respond with a JSON object containing: topics (array of strings), relevanceScores (array of numbers 0-1), and summary.';
          userPrompt = `Extract the main topics from this text:\n\n${request.text}`;
          break;

        case 'summary':
          const maxLength = request.options?.maxSummaryLength || 200;
          systemPrompt = `You are an expert summarization specialist. Create a concise summary of the provided text (max ${maxLength} words) and respond with a JSON object containing: summary (string), keyPoints (array of strings), and wordCount.`;
          userPrompt = `Summarize this text:\n\n${request.text}`;
          break;

        case 'classification':
          const categories = request.options?.categories || ['Business', 'Technology', 'Politics', 'Sports', 'Entertainment', 'Health', 'Science'];
          systemPrompt = `You are an expert text classifier. Classify the provided text into one or more of these categories: ${categories.join(', ')}. Respond with a JSON object containing: categories (array of strings), confidence (0-1), and reasoning.`;
          userPrompt = `Classify this text:\n\n${request.text}`;
          break;

        default:
          throw new AppError(`Unsupported analysis type: ${request.analysisType}`, 'VALIDATION_ERROR', 400);
      }

      const response = await this.generateStructuredResponse({
        prompt: userPrompt,
        systemPrompt,
        schema: z.object({
          [request.analysisType]: z.any(),
          confidence: z.number().finite().min(0).max(1).optional(),
          reasoning: z.string().optional(),
          summary: z.string().optional(),
          keyPoints: z.array(z.string()).optional(),
          topics: z.array(z.string()).optional(),
          relevanceScores: z.array(z.number().finite()).optional(),
          categories: z.array(z.string()).optional(),
          sentiment: z.enum(['positive', 'negative', 'neutral']).optional(),
          wordCount: z.number().finite().optional(),
        }),
        maxTokens: 1000,
        temperature: 0.3,
      });

      return {
        analysis: response.data,
        confidence: response.data.confidence,
        usage: response.usage,
      };
    } catch (error) {
      throw new AppError(
        `Text analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ANALYSIS_ERROR',
        500
      );
    }
  }

  /**
   * Check rate limits (Anthropic: 1000 requests per minute)
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 1000;

    const requests = this.rateLimitTracker.get('anthropic') || [];
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      const waitTime = validRequests[0] + windowMs - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    validRequests.push(now);
    this.rateLimitTracker.set('anthropic', validRequests);
  }

  /**
   * Get available models
   */
  getAvailableModels(): Array<{
    id: string;
    name: string;
    description: string;
    maxTokens: number;
    costPer1kTokens: {
      input: number;
      output: number;
    };
  }> {
    return [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable model, best for complex tasks',
        maxTokens: 4096,
        costPer1kTokens: {
          input: 0.015,
          output: 0.075,
        },
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance and speed',
        maxTokens: 4096,
        costPer1kTokens: {
          input: 0.003,
          output: 0.015,
        },
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fastest model, good for simple tasks',
        maxTokens: 4096,
        costPer1kTokens: {
          input: 0.00025,
          output: 0.00125,
        },
      },
    ];
  }

  /**
   * Calculate cost estimate for a request
   */
  calculateCostEstimate(inputTokens: number, outputTokens: number, model?: string): {
    inputCost: number;
    outputCost: number;
    totalCost: number;
    currency: string;
  } {
    const modelId = model || this.defaultModel;
    const modelInfo = this.getAvailableModels().find(m => m.id === modelId);
    
    if (!modelInfo) {
      throw new AppError(`Unknown model: ${modelId}`, 'VALIDATION_ERROR', 400);
    }

    const inputCost = (inputTokens / 1000) * modelInfo.costPer1kTokens.input;
    const outputCost = (outputTokens / 1000) * modelInfo.costPer1kTokens.output;
    const totalCost = inputCost + outputCost;

    return {
      inputCost,
      outputCost,
      totalCost,
      currency: 'USD',
    };
  }

  /**
   * Health check for Anthropic service
   */
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    latency: number;
    error?: string;
  }> {
    try {
      const startTime = Date.now();
      
      await this.generateCompletion({
        prompt: 'Hello, respond with "OK" if you can read this.',
        maxTokens: 10,
        temperature: 0,
      });
      
      const latency = Date.now() - startTime;
      
      return {
        status: 'healthy',
        latency,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        latency: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const anthropicProvider = new AnthropicProvider();

// Export types
export type { AnthropicRequest, AnthropicResponse };
