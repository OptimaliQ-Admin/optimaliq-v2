import { z } from 'zod';
import { env } from '@/lib/env';
import { AppError } from '@/utils';

// Google Vertex AI schemas
const VertexMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({
    text: z.string(),
  })),
});

const VertexRequestSchema = z.object({
  contents: z.array(VertexMessageSchema),
  generationConfig: z.object({
    temperature: z.number().finite().min(0).max(2).optional(),
    topK: z.number().finite().min(1).max(40).optional(),
    topP: z.number().finite().min(0).max(1).optional(),
    maxOutputTokens: z.number().finite().min(1).max(8192).optional(),
    stopSequences: z.array(z.string()).optional(),
  }).optional(),
  safetySettings: z.array(z.object({
    category: z.string(),
    threshold: z.string(),
  })).optional(),
});

const VertexResponseSchema = z.object({
  candidates: z.array(z.object({
    content: z.object({
      parts: z.array(z.object({
        text: z.string(),
      })),
      role: z.string(),
    }),
    finishReason: z.string().optional(),
    safetyRatings: z.array(z.object({
      category: z.string(),
      probability: z.string(),
    })).optional(),
  })),
  usageMetadata: z.object({
    promptTokenCount: z.number().finite(),
    candidatesTokenCount: z.number().finite(),
    totalTokenCount: z.number().finite(),
  }).optional(),
});

type VertexRequest = z.infer<typeof VertexRequestSchema>;
type VertexResponse = z.infer<typeof VertexResponseSchema>;

/**
 * Google Vertex AI Provider
 * Handles integration with Google's Gemini models
 */
export class GoogleVertexProvider {
  private projectId: string;
  private location: string = 'us-central1';
  private apiEndpoint: string;
  private defaultModel: string = 'gemini-1.5-pro';
  private rateLimitTracker: Map<string, number[]> = new Map();

  constructor() {
    if (!env.VERTEX_PROJECT_ID) {
      throw new AppError('Google Vertex AI project ID not configured', 'CONFIG_ERROR', 500);
    }

    this.projectId = env.VERTEX_PROJECT_ID;
    this.apiEndpoint = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.projectId}/locations/${this.location}/publishers/google/models`;
  }

  /**
   * Get access token for Google Cloud API
   */
  private async getAccessToken(): Promise<string> {
    try {
      // In production, you would use Google Cloud SDK or service account
      // For now, we'll simulate the token request
      // This should be replaced with actual Google Auth implementation
      
      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        throw new AppError('Google Application Credentials not configured', 'CONFIG_ERROR', 500);
      }

      // Placeholder for actual Google Auth implementation
      // In real implementation, use:
      // import { GoogleAuth } from 'google-auth-library';
      // const auth = new GoogleAuth({ scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
      // const client = await auth.getClient();
      // const token = await client.getAccessToken();
      
      return 'placeholder-token'; // Replace with actual token
    } catch (error) {
      throw new AppError(
        `Failed to get access token: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AUTH_ERROR',
        500
      );
    }
  }

  /**
   * Generate text completion using Gemini
   */
  async generateCompletion(request: {
    prompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    topK?: number;
    topP?: number;
    stopSequences?: string[];
  }): Promise<{
    text: string;
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
    };
    model: string;
    finishReason?: string;
    safetyRatings?: Array<{
      category: string;
      probability: string;
    }>;
  }> {
    try {
      await this.checkRateLimit();

      const model = request.model || this.defaultModel;
      const accessToken = await this.getAccessToken();

      // Prepare messages
      const messages: any[] = [];
      
      if (request.systemPrompt) {
        messages.push({
          role: 'user',
          parts: [{ text: `System: ${request.systemPrompt}` }],
        });
        messages.push({
          role: 'model',
          parts: [{ text: 'I understand the instructions.' }],
        });
      }

      messages.push({
        role: 'user',
        parts: [{ text: request.prompt }],
      });

      const vertexRequest: VertexRequest = {
        contents: messages,
        generationConfig: {
          temperature: request.temperature || 0.7,
          topK: request.topK || 40,
          topP: request.topP || 0.95,
          maxOutputTokens: request.maxTokens || 1000,
          stopSequences: request.stopSequences,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      };

      const validatedRequest = VertexRequestSchema.parse(vertexRequest);

      const response = await fetch(`${this.apiEndpoint}/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Google Vertex AI API error: ${response.status} ${response.statusText} - ${errorText}`,
          'VERTEX_API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedResponse = VertexResponseSchema.parse(data);

      if (!validatedResponse.candidates || validatedResponse.candidates.length === 0) {
        throw new AppError('No candidates returned from Vertex AI', 'VERTEX_ERROR', 500);
      }

      const candidate = validatedResponse.candidates[0];
      const text = candidate.content.parts.map(part => part.text).join('');

      return {
        text,
        usage: {
          inputTokens: validatedResponse.usageMetadata?.promptTokenCount || 0,
          outputTokens: validatedResponse.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: validatedResponse.usageMetadata?.totalTokenCount || 0,
        },
        model,
        finishReason: candidate.finishReason,
        safetyRatings: candidate.safetyRatings,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Vertex AI completion failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VERTEX_ERROR',
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
        const systemPrompt = `${request.systemPrompt || ''}\n\nYou must respond with valid JSON only. Do not include any explanations or additional text outside the JSON structure. Ensure the JSON matches the required schema exactly.`;

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

      const model = request.model || this.defaultModel;
      const accessToken = await this.getAccessToken();

      // Convert messages to Vertex AI format
      const vertexMessages: any[] = [];
      
      if (request.systemPrompt) {
        vertexMessages.push({
          role: 'user',
          parts: [{ text: `System: ${request.systemPrompt}` }],
        });
        vertexMessages.push({
          role: 'model',
          parts: [{ text: 'I understand the instructions.' }],
        });
      }

      for (const message of request.messages) {
        vertexMessages.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        });
      }

      const vertexRequest: VertexRequest = {
        contents: vertexMessages,
        generationConfig: {
          temperature: request.temperature || 0.7,
          maxOutputTokens: request.maxTokens || 1000,
        },
      };

      const validatedRequest = VertexRequestSchema.parse(vertexRequest);

      const response = await fetch(`${this.apiEndpoint}/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `Google Vertex AI API error: ${response.status} ${response.statusText} - ${errorText}`,
          'VERTEX_API_ERROR',
          response.status
        );
      }

      const data = await response.json();
      const validatedResponse = VertexResponseSchema.parse(data);

      if (!validatedResponse.candidates || validatedResponse.candidates.length === 0) {
        throw new AppError('No candidates returned from Vertex AI', 'VERTEX_ERROR', 500);
      }

      const candidate = validatedResponse.candidates[0];
      const message = candidate.content.parts.map(part => part.text).join('');

      return {
        message,
        usage: {
          inputTokens: validatedResponse.usageMetadata?.promptTokenCount || 0,
          outputTokens: validatedResponse.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: validatedResponse.usageMetadata?.totalTokenCount || 0,
        },
        model,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError(
        `Vertex AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VERTEX_ERROR',
        500
      );
    }
  }

  /**
   * Generate embeddings using Vertex AI
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

      const model = request.model || 'textembedding-gecko@003';
      const accessToken = await this.getAccessToken();

      const embeddings: number[][] = [];
      let totalTokens = 0;

      // Process texts in batches to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < request.texts.length; i += batchSize) {
        const batch = request.texts.slice(i, i + batchSize);
        
        const batchRequest = {
          instances: batch.map(text => ({
            content: text,
          })),
        };

        const response = await fetch(`${this.apiEndpoint}/${model}:predict`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchRequest),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new AppError(
            `Google Vertex AI embeddings error: ${response.status} ${response.statusText} - ${errorText}`,
            'VERTEX_API_ERROR',
            response.status
          );
        }

        const data = await response.json();
        
        if (data.predictions) {
          for (const prediction of data.predictions) {
            if (prediction.embeddings && prediction.embeddings.values) {
              embeddings.push(prediction.embeddings.values);
              totalTokens += prediction.embeddings.statistics?.tokenCount || 0;
            }
          }
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
        `Vertex AI embeddings failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'VERTEX_ERROR',
        500
      );
    }
  }

  /**
   * Check rate limits (Vertex AI: 300 requests per minute)
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 300;

    const requests = this.rateLimitTracker.get('vertex') || [];
    const validRequests = requests.filter(time => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      const waitTime = validRequests[0] + windowMs - now;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    validRequests.push(now);
    this.rateLimitTracker.set('vertex', validRequests);
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
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Most capable model with large context window',
        maxTokens: 8192,
        costPer1kTokens: {
          input: 0.0035,
          output: 0.0105,
        },
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient model',
        maxTokens: 8192,
        costPer1kTokens: {
          input: 0.00035,
          output: 0.00105,
        },
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        description: 'Balanced performance model',
        maxTokens: 4096,
        costPer1kTokens: {
          input: 0.0005,
          output: 0.0015,
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
   * Health check for Vertex AI service
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
export const googleVertexProvider = new GoogleVertexProvider();

// Export types
export type { VertexRequest, VertexResponse };
