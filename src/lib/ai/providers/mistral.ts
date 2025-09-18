import { z } from 'zod';
import { env } from '@/lib/env';
import { AppError } from '@/utils';

// Mistral AI schemas
const MistralMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
});

const MistralRequestSchema = z.object({
  model: z.string(),
  messages: z.array(MistralMessageSchema),
  temperature: z.number().finite().min(0).max(1).optional(),
  top_p: z.number().finite().min(0).max(1).optional(),
  max_tokens: z.number().finite().min(1).max(32768).optional(),
  stream: z.boolean().optional(),
  safe_prompt: z.boolean().optional(),
  random_seed: z.number().finite().optional(),
});

const MistralResponseSchema = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number().finite(),
  model: z.string(),
  choices: z.array(z.object({
    index: z.number().finite(),
    message: z.object({
      role: z.string(),
      content: z.string(),
    }),
    finish_reason: z.string(),
  })),
  usage: z.object({
    prompt_tokens: z.number().finite(),
    completion_tokens: z.number().finite(),
    total_tokens: z.number().finite(),
  }),
});

type MistralRequest = z.infer<typeof MistralRequestSchema>;
type MistralResponse = z.infer<typeof MistralResponseSchema>;

/**
 * Mistral AI Provider
 * Handles integration with Mistral AI models
 */
export class MistralProvider {
  private apiKey: string;
  private baseUrl: string = 'https://api.mistral.ai/v1';
  private defaultModel: string = 'mistral-large-latest';
  private rateLimitTracker: Map<string, number[]> = new Map();

  constructor() {
    if (!env.MISTRAL_API_KEY) {
      console.warn('⚠️  Mistral API key not configured, provider will be disabled');
      this.apiKey = '';
      return;
    }

    this.apiKey = env.MISTRAL_API_KEY;
  }

  /**
   * Generate text completion using Mistral
   */
  async generateCompletion(request: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    safePrompt?: boolean;
    randomSeed?: number;
  }): Promise<{
    text: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    model: string;
    finishReason: string;
  }> {
    if (!this.apiKey) {
      throw new AppError('Mistral provider is disabled - API key not configured', 'PROVIDER_DISABLED', 503);
    }
    try {
      await this.checkRateLimit();

      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
      
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: request.prompt,
      });

      const mistralRequest: MistralRequest = {
        model: request.model || this.defaultModel,
        messages,
        temperature: request.temperature || 0.7,
        top_p: request.topP || 1.0,
        max_tokens: request.maxTokens || 1000,
        safe_prompt: request.safePrompt !== false,
        random_seed: request.randomSeed,
      };

      const validatedRequest = MistralRequestSchema.parse(mistralRequest);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Mistral API error: ${response.status} ${response.statusText} - ${errorText}`,
          'MISTRAL_API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedResponse = MistralResponseSchema.parse(data);

      if (!validatedResponse.choices || validatedResponse.choices.length === 0) {
        throw new AppError('No choices returned from Mistral AI', 'MISTRAL_ERROR', 500);
      }

      const choice = validatedResponse.choices[0];

      return {
        text: choice.message.content,
        usage: {
          inputTokens: validatedResponse.usage.prompt_tokens,
          outputTokens: validatedResponse.usage.completion_tokens,
          totalTokens: validatedResponse.usage.total_tokens,
        },
        model: validatedResponse.model,
        finishReason: choice.finish_reason,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Mistral completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'MISTRAL_ERROR',
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
        const systemPrompt = `${request.systemPrompt || ''}\n\nYou must respond with valid JSON only. Do not include any explanations or additional text outside the JSON structure. Ensure the JSON is properly formatted and matches the required schema.`;

        const response = await this.generateCompletion({
          prompt: request.prompt,
          systemPrompt,
          model: request.model,
          maxTokens: request.maxTokens,
          temperature: request.temperature || 0.3,
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
        request.prompt += `\n\nPrevious attempt failed with error: ${lastError.message}. Please ensure your response is valid JSON that matches the required schema exactly.`;
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

      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
      
      if (request.systemPrompt) {
        messages.push({
          role: 'system',
          content: request.systemPrompt,
        });
      }

      // Convert messages to Mistral format
      for (const message of request.messages) {
        messages.push({
          role: message.role,
          content: message.content,
        });
      }

      const mistralRequest: MistralRequest = {
        model: request.model || this.defaultModel,
        messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.maxTokens || 1000,
      };

      const validatedRequest = MistralRequestSchema.parse(mistralRequest);

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Mistral API error: ${response.status} ${response.statusText} - ${errorText}`,
          'MISTRAL_API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedResponse = MistralResponseSchema.parse(data);

      if (!validatedResponse.choices || validatedResponse.choices.length === 0) {
        throw new AppError('No choices returned from Mistral AI', 'MISTRAL_ERROR', 500);
      }

      const choice = validatedResponse.choices[0];

      return {
        message: choice.message.content,
        usage: {
          inputTokens: validatedResponse.usage.prompt_tokens,
          outputTokens: validatedResponse.usage.completion_tokens,
          totalTokens: validatedResponse.usage.total_tokens,
        },
        model: validatedResponse.model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Mistral chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'MISTRAL_ERROR',
        500
      );
    }
  }

  /**
   * Generate embeddings using Mistral
   */
  async generateEmbeddings(request: {
    texts: string[];
    model?: string;
  }): Promise<{
    embeddings: number[][];
    usage: {
      totalTokens: number;
    };
    model: string;
  }> {
    try {
      await this.checkRateLimit();

      const model = request.model || 'mistral-embed';
      const embeddings: number[][] = [];
      let totalTokens = 0;

      // Process texts in batches
      const batchSize = 16; // Mistral allows up to 16 texts per request
      for (let i = 0; i < request.texts.length; i += batchSize) {
        const batch = request.texts.slice(i, i + batchSize);
        
        const embeddingRequest = {
          model,
          input: batch,
        };

        const response = await fetch(`${this.baseUrl}/embeddings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(embeddingRequest),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new AppError(
            `Mistral embeddings error: ${response.status} ${response.statusText} - ${errorText}`,
            'MISTRAL_API_ERROR',
            response.status
          );
        }

        const data = await response.json();
        
        if (data.data) {
          for (const embeddingData of data.data) {
            embeddings.push(embeddingData.embedding);
          }
          totalTokens += data.usage?.total_tokens || 0;
        }

        // Rate limiting delay between batches
        if (i + batchSize < request.texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return {
        embeddings,
        usage: {
          totalTokens,
        },
        model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Mistral embeddings failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'MISTRAL_ERROR',
        500
      );
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<Array<{
    id: string;
    object: string;
    created: number;
    owned_by: string;
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Mistral models API error: ${response.status} ${response.statusText} - ${errorText}`,
          'MISTRAL_API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Mistral list models failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'MISTRAL_ERROR',
        500
      );
    }
  }

  /**
   * Check rate limits (Mistral: varies by model and plan)
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 100; // Conservative estimate

    const requests = this.rateLimitTracker.get('mistral') || [];
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      const waitTime = validRequests[0] + windowMs - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    validRequests.push(now);
    this.rateLimitTracker.set('mistral', validRequests);
  }

  /**
   * Get available models with pricing
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
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        description: 'Most capable model for complex tasks',
        maxTokens: 32768,
        costPer1kTokens: {
          input: 0.008,
          output: 0.024,
        },
      },
      {
        id: 'mistral-medium-latest',
        name: 'Mistral Medium',
        description: 'Balanced performance and cost',
        maxTokens: 32768,
        costPer1kTokens: {
          input: 0.0027,
          output: 0.0081,
        },
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        description: 'Fast and cost-effective',
        maxTokens: 32768,
        costPer1kTokens: {
          input: 0.001,
          output: 0.003,
        },
      },
      {
        id: 'mistral-tiny',
        name: 'Mistral Tiny',
        description: 'Fastest and most affordable',
        maxTokens: 32768,
        costPer1kTokens: {
          input: 0.00025,
          output: 0.00025,
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
   * Health check for Mistral service
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
export const mistralProvider = new MistralProvider();

// Export types
export type { MistralRequest, MistralResponse };
