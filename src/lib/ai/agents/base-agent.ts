import { z } from 'zod';
import { aiRouter, AITask } from '@/lib/ai-router';
import { AppError } from '@/utils';

// Base agent interfaces
export interface AgentTool {
  name: string;
  description: string;
  parameters: z.ZodSchema;
  execute: (params: any) => Promise<any>;
}

export interface AgentMemory {
  shortTerm: Map<string, any>;
  mediumTerm: Map<string, any>;
  longTerm: Map<string, any>;
}

export interface AgentResponse<T = any> {
  success: boolean;
  data: T;
  errors?: string[];
  citations?: Array<{
    url: string;
    title: string;
    author?: string;
    publishedAt?: Date;
  }>;
  metadata?: {
    tokensUsed: number;
    cost: number;
    latency: number;
    provider: string;
    confidence: number;
  };
}

export interface AgentRequest {
  task: string;
  context?: any;
  userId?: string;
  organizationId?: string;
  priority?: 'low' | 'medium' | 'high';
  maxRetries?: number;
}

// Base Agent Class
export abstract class BaseAgent {
  protected name: string;
  protected description: string;
  protected tools: Map<string, AgentTool> = new Map();
  protected memory: AgentMemory;
  protected maxRetries: number = 3;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.memory = {
      shortTerm: new Map(),
      mediumTerm: new Map(),
      longTerm: new Map()
    };
  }

  // Abstract methods that must be implemented by concrete agents
  abstract plan(request: AgentRequest): Promise<string[]>;
  abstract execute(plan: string[], request: AgentRequest): Promise<any>;
  abstract validate(result: any): Promise<AgentResponse>;

  // Tool registration
  registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }

  // Tool execution with error handling
  protected async executeTool(toolName: string, params: any): Promise<any> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      throw new AppError(`Tool ${toolName} not found`, 'TOOL_NOT_FOUND', 400);
    }

    try {
      // Validate parameters
      const validatedParams = tool.parameters.parse(params);
      
      // Execute tool
      return await tool.execute(validatedParams);
    } catch (error) {
      throw new AppError(
        `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'TOOL_EXECUTION_ERROR',
        500
      );
    }
  }

  // Memory management
  protected setMemory(key: string, value: any, type: 'short' | 'medium' | 'long' = 'short'): void {
    switch (type) {
      case 'short':
        this.memory.shortTerm.set(key, value);
        break;
      case 'medium':
        this.memory.mediumTerm.set(key, value);
        break;
      case 'long':
        this.memory.longTerm.set(key, value);
        break;
    }
  }

  protected getMemory(key: string, type: 'short' | 'medium' | 'long' = 'short'): any {
    switch (type) {
      case 'short':
        return this.memory.shortTerm.get(key);
      case 'medium':
        return this.memory.mediumTerm.get(key);
      case 'long':
        return this.memory.longTerm.get(key);
    }
  }

  // Main agent execution flow
  async process(request: AgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    let attempt = 0;

    while (attempt < (request.maxRetries || this.maxRetries)) {
      try {
        // 1. Plan
        const plan = await this.plan(request);
        
        // 2. Execute
        const result = await this.execute(plan, request);
        
        // 3. Validate and format response
        const response = await this.validate(result);
        
        // Add metadata
        response.metadata = {
          tokensUsed: response.metadata?.tokensUsed || 0,
          cost: response.metadata?.cost || 0,
          latency: Date.now() - startTime,
          provider: this.name,
          confidence: this.calculateConfidence(response)
        };

        return response;

      } catch (error) {
        attempt++;
        
        if (attempt >= (request.maxRetries || this.maxRetries)) {
          return {
            success: false,
            data: null,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            metadata: {
              tokensUsed: 0,
              cost: 0,
              latency: Date.now() - startTime,
              provider: this.name,
              confidence: 0
            }
          };
        }

        // Wait before retry with exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new AppError('Agent execution failed after all retries', 'AGENT_EXECUTION_FAILED', 500);
  }

  // Helper methods
  protected async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected calculateConfidence(response: AgentResponse): number {
    // Basic confidence calculation - can be enhanced by concrete agents
    if (!response.success) return 0;
    if (response.errors && response.errors.length > 0) return 0.5;
    return 0.9;
  }

  // AI model interaction
  protected async generateContent(prompt: string, task: AITask = AITask.TEXT_GENERATION): Promise<string> {
    try {
      const response = await aiRouter.execute({
        prompt,
        task,
        priority: 'medium'
      });
      
      return response.content;
    } catch (error) {
      throw new AppError(
        `AI content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AI_GENERATION_ERROR',
        500
      );
    }
  }

  // JSON validation and repair
  protected async validateAndRepairJSON<T>(
    jsonString: string, 
    schema: z.ZodSchema<T>
  ): Promise<T> {
    try {
      const parsed = JSON.parse(jsonString);
      return schema.parse(parsed);
    } catch (error) {
      // Try to repair malformed JSON using AI
      const repairPrompt = `
        The following JSON is malformed or doesn't match the expected schema:
        ${jsonString}
        
        Please fix it and return only valid JSON that matches the expected structure.
        Do not include any explanation, just return the corrected JSON.
      `;
      
      const repairedJSON = await this.generateContent(repairPrompt);
      
      try {
        const parsed = JSON.parse(repairedJSON);
        return schema.parse(parsed);
      } catch (repairError) {
        throw new AppError(
          'Failed to repair malformed JSON response',
          'JSON_REPAIR_FAILED',
          500
        );
      }
    }
  }

  // Get agent status and performance
  getStatus(): {
    name: string;
    description: string;
    toolCount: number;
    memoryUsage: {
      shortTerm: number;
      mediumTerm: number;
      longTerm: number;
    };
  } {
    return {
      name: this.name,
      description: this.description,
      toolCount: this.tools.size,
      memoryUsage: {
        shortTerm: this.memory.shortTerm.size,
        mediumTerm: this.memory.mediumTerm.size,
        longTerm: this.memory.longTerm.size
      }
    };
  }
}
