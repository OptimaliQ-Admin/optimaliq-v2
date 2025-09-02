/**
 * Strategy Pattern Implementation for AI Engines
 * Allows plugging different strategy objects for state/environment/learning computation
 */

import { z } from 'zod';
import { telemetryService } from '../telemetry/telemetry-service';

// Base Strategy Interface
export interface AIStrategy {
  name: string;
  version: string;
  description: string;
  computeState(context: any): Promise<any>;
  computeEnvironment(context: any): Promise<any>;
  computeLearning(context: any): Promise<any>;
  validate(input: any): boolean;
  getConfiguration(): Record<string, any>;
}

// Strategy Configuration Schema
export const StrategyConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  enabled: z.boolean().default(true),
  priority: z.number().finite().min(0).max(100).default(50),
  parameters: z.record(z.any()).optional(),
  thresholds: z.object({
    confidence: z.number().finite().min(0).max(1).default(0.8),
    quality: z.number().finite().min(0).max(1).default(0.7),
    performance: z.number().finite().min(0).max(1).default(0.8)
  }).optional(),
  constraints: z.object({
    maxExecutionTime: z.number().finite().min(100).default(30000), // 30 seconds
    maxRetries: z.number().finite().min(0).max(5).default(3),
    fallbackStrategy: z.string().optional()
  }).optional()
});

export type StrategyConfig = z.infer<typeof StrategyConfigSchema>;

// Strategy Context Schema
export const StrategyContextSchema = z.object({
  userId: z.string().optional(),
  sessionId: z.string().optional(),
  operation: z.string(),
  data: z.any(),
  environment: z.record(z.any()).optional(),
  preferences: z.record(z.any()).optional(),
  constraints: z.record(z.any()).optional()
});

export type StrategyContext = z.infer<typeof StrategyContextSchema>;

// Strategy Result Schema
export const StrategyResultSchema = z.object({
  strategyName: z.string(),
  success: z.boolean(),
  state: z.any().optional(),
  environment: z.any().optional(),
  learning: z.any().optional(),
  confidence: z.number().finite().min(0).max(1),
  quality: z.number().finite().min(0).max(1).optional(),
  executionTime: z.number().finite(),
  metadata: z.record(z.any()).optional(),
  recommendations: z.array(z.string()).optional(),
  errors: z.array(z.string()).optional()
});

export type StrategyResult = z.infer<typeof StrategyResultSchema>;

/**
 * Conservative Strategy - Focuses on reliability and proven approaches
 */
export class ConservativeStrategy implements AIStrategy {
  name = 'conservative';
  version = '1.0.0';
  description = 'Conservative approach focusing on reliability and proven methods';

  async computeState(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeState`);
    
    try {
      // Conservative state computation with safety checks
      const state = {
        confidence: Math.min(0.8, context.data?.confidence || 0.7),
        stability: 0.9,
        risk: 0.2,
        approach: 'conservative',
        validationLevel: 'high'
      };

      await timer.end(state, { 
        confidence: state.confidence, 
        success: true,
        provider: this.name 
      });

      return state;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeEnvironment(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeEnvironment`);
    
    try {
      const environment = {
        complexity: 'low',
        uncertainty: 'minimal',
        adaptability: 'gradual',
        safetyMargin: 0.3,
        fallbackOptions: ['default', 'basic', 'manual']
      };

      await timer.end(environment, { 
        confidence: 0.9, 
        success: true,
        provider: this.name 
      });

      return environment;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeLearning(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeLearning`);
    
    try {
      const learning = {
        rate: 'slow',
        method: 'incremental',
        validation: 'extensive',
        rollback: 'automatic',
        confidence: 0.8
      };

      await timer.end(learning, { 
        confidence: learning.confidence, 
        success: true,
        provider: this.name 
      });

      return learning;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  validate(input: any): boolean {
    return input != null && typeof input === 'object';
  }

  getConfiguration(): Record<string, any> {
    return {
      riskTolerance: 'low',
      adaptationSpeed: 'slow',
      validationLevel: 'high',
      fallbackEnabled: true
    };
  }
}

/**
 * Aggressive Strategy - Focuses on performance and rapid adaptation
 */
export class AggressiveStrategy implements AIStrategy {
  name = 'aggressive';
  version = '1.0.0';
  description = 'Aggressive approach focusing on performance and rapid adaptation';

  async computeState(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeState`);
    
    try {
      const state = {
        confidence: Math.min(0.95, (context.data?.confidence || 0.8) * 1.1),
        stability: 0.7,
        risk: 0.4,
        approach: 'aggressive',
        validationLevel: 'medium'
      };

      await timer.end(state, { 
        confidence: state.confidence, 
        success: true,
        provider: this.name 
      });

      return state;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeEnvironment(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeEnvironment`);
    
    try {
      const environment = {
        complexity: 'high',
        uncertainty: 'acceptable',
        adaptability: 'rapid',
        safetyMargin: 0.1,
        fallbackOptions: ['optimized', 'default']
      };

      await timer.end(environment, { 
        confidence: 0.85, 
        success: true,
        provider: this.name 
      });

      return environment;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeLearning(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeLearning`);
    
    try {
      const learning = {
        rate: 'fast',
        method: 'experimental',
        validation: 'minimal',
        rollback: 'manual',
        confidence: 0.85
      };

      await timer.end(learning, { 
        confidence: learning.confidence, 
        success: true,
        provider: this.name 
      });

      return learning;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  validate(input: any): boolean {
    return input != null;
  }

  getConfiguration(): Record<string, any> {
    return {
      riskTolerance: 'high',
      adaptationSpeed: 'fast',
      validationLevel: 'medium',
      fallbackEnabled: false
    };
  }
}

/**
 * Balanced Strategy - Balances performance and reliability
 */
export class BalancedStrategy implements AIStrategy {
  name = 'balanced';
  version = '1.0.0';
  description = 'Balanced approach between performance and reliability';

  async computeState(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeState`);
    
    try {
      const state = {
        confidence: context.data?.confidence || 0.8,
        stability: 0.8,
        risk: 0.3,
        approach: 'balanced',
        validationLevel: 'medium'
      };

      await timer.end(state, { 
        confidence: state.confidence, 
        success: true,
        provider: this.name 
      });

      return state;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeEnvironment(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeEnvironment`);
    
    try {
      const environment = {
        complexity: 'medium',
        uncertainty: 'moderate',
        adaptability: 'measured',
        safetyMargin: 0.2,
        fallbackOptions: ['optimized', 'default', 'conservative']
      };

      await timer.end(environment, { 
        confidence: 0.8, 
        success: true,
        provider: this.name 
      });

      return environment;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  async computeLearning(context: StrategyContext): Promise<any> {
    const timer = telemetryService.startTiming(`${this.name}.computeLearning`);
    
    try {
      const learning = {
        rate: 'moderate',
        method: 'validated',
        validation: 'thorough',
        rollback: 'conditional',
        confidence: 0.8
      };

      await timer.end(learning, { 
        confidence: learning.confidence, 
        success: true,
        provider: this.name 
      });

      return learning;
    } catch (error) {
      await timer.end(null, { 
        success: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        provider: this.name 
      });
      throw error;
    }
  }

  validate(input: any): boolean {
    return input != null && typeof input === 'object';
  }

  getConfiguration(): Record<string, any> {
    return {
      riskTolerance: 'medium',
      adaptationSpeed: 'moderate',
      validationLevel: 'medium',
      fallbackEnabled: true
    };
  }
}

/**
 * Strategy Engine - Manages and executes AI strategies
 */
export class StrategyEngine {
  private strategies: Map<string, AIStrategy> = new Map();
  private configurations: Map<string, StrategyConfig> = new Map();
  private defaultStrategy: string = 'balanced';

  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies(): void {
    // Register default strategies
    this.registerStrategy(new ConservativeStrategy());
    this.registerStrategy(new AggressiveStrategy());
    this.registerStrategy(new BalancedStrategy());
  }

  /**
   * Register a new strategy
   */
  registerStrategy(strategy: AIStrategy, config?: StrategyConfig): void {
    this.strategies.set(strategy.name, strategy);
    
    if (config) {
      this.configurations.set(strategy.name, config);
    } else {
      // Create default configuration
      const defaultConfig: StrategyConfig = {
        name: strategy.name,
        version: strategy.version,
        enabled: true,
        priority: 50
      };
      this.configurations.set(strategy.name, defaultConfig);
    }
  }

  /**
   * Execute a strategy
   */
  async executeStrategy(
    strategyName: string, 
    context: StrategyContext,
    operation: 'state' | 'environment' | 'learning' = 'state'
  ): Promise<StrategyResult> {
    const timer = telemetryService.startTiming(`strategy.${strategyName}.${operation}`);
    const startTime = Date.now();

    try {
      const strategy = this.strategies.get(strategyName);
      if (!strategy) {
        throw new Error(`Strategy '${strategyName}' not found`);
      }

      const config = this.configurations.get(strategyName);
      if (!config?.enabled) {
        throw new Error(`Strategy '${strategyName}' is disabled`);
      }

      // Validate input
      if (!strategy.validate(context)) {
        throw new Error(`Invalid context for strategy '${strategyName}'`);
      }

      // Execute the strategy operation
      let result: any;
      switch (operation) {
        case 'state':
          result = await strategy.computeState(context);
          break;
        case 'environment':
          result = await strategy.computeEnvironment(context);
          break;
        case 'learning':
          result = await strategy.computeLearning(context);
          break;
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }

      const executionTime = Date.now() - startTime;
      const confidence = this.extractConfidence(result);
      const quality = this.assessQuality(result, strategy);

      const strategyResult: StrategyResult = {
        strategyName,
        success: true,
        [operation]: result,
        confidence,
        quality,
        executionTime,
        metadata: {
          operation,
          strategyVersion: strategy.version,
          configuration: strategy.getConfiguration()
        }
      };

      await timer.end(strategyResult, {
        confidence,
        quality,
        success: true,
        provider: strategyName
      });

      return strategyResult;

    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await timer.end(null, {
        success: false,
        errorMessage,
        provider: strategyName
      });

      // Try fallback strategy if configured
      const config = this.configurations.get(strategyName);
      if (config?.constraints?.fallbackStrategy) {
        try {
          return await this.executeStrategy(
            config.constraints.fallbackStrategy,
            context,
            operation
          );
        } catch (fallbackError) {
          // If fallback also fails, return original error
        }
      }

      return {
        strategyName,
        success: false,
        confidence: 0,
        executionTime,
        errors: [errorMessage]
      };
    }
  }

  /**
   * Select best strategy based on context and performance
   */
  async selectStrategy(context: StrategyContext, operation: string): Promise<string> {
    const timer = telemetryService.startTiming('strategy.selection');

    try {
      // Get performance metrics for each strategy
      const performanceMetrics = await this.getPerformanceMetrics(operation);
      
      // Score strategies based on context and performance
      const scores: Array<{ strategy: string; score: number }> = [];
      
      for (const [strategyName, strategy] of this.strategies) {
        const config = this.configurations.get(strategyName);
        if (!config?.enabled) continue;

        let score = config.priority || 50;
        
        // Add performance bonus
        const metrics = performanceMetrics.get(strategyName);
        if (metrics) {
          score += metrics.successRate * 30;
          score += (1 - metrics.averageDuration / 10000) * 20; // Prefer faster strategies
        }

        // Context-based scoring
        if (context.preferences?.riskTolerance === 'low' && strategyName === 'conservative') {
          score += 20;
        }
        if (context.preferences?.performance === 'high' && strategyName === 'aggressive') {
          score += 20;
        }

        scores.push({ strategy: strategyName, score });
      }

      // Sort by score and select best
      scores.sort((a, b) => b.score - a.score);
      const selectedStrategy = scores[0]?.strategy || this.defaultStrategy;

      await timer.end(selectedStrategy, {
        success: true,
        confidence: 0.8
      });

      return selectedStrategy;

    } catch (error) {
      await timer.end(this.defaultStrategy, {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Selection failed'
      });

      return this.defaultStrategy;
    }
  }

  /**
   * Get available strategies
   */
  getAvailableStrategies(): Array<{ name: string; description: string; enabled: boolean }> {
    return Array.from(this.strategies.values()).map(strategy => ({
      name: strategy.name,
      description: strategy.description,
      enabled: this.configurations.get(strategy.name)?.enabled ?? false
    }));
  }

  /**
   * Update strategy configuration
   */
  updateConfiguration(strategyName: string, config: Partial<StrategyConfig>): void {
    const existingConfig = this.configurations.get(strategyName);
    if (!existingConfig) {
      throw new Error(`Strategy '${strategyName}' not found`);
    }

    const updatedConfig = { ...existingConfig, ...config };
    this.configurations.set(strategyName, updatedConfig);
  }

  private extractConfidence(result: any): number {
    if (typeof result === 'object' && result?.confidence) {
      return Math.max(0, Math.min(1, result.confidence));
    }
    return 0.8; // Default confidence
  }

  private assessQuality(result: any, strategy: AIStrategy): number {
    // Simple quality assessment based on result completeness and strategy configuration
    if (!result) return 0;
    
    let quality = 0.7; // Base quality
    
    if (typeof result === 'object') {
      const keys = Object.keys(result);
      quality += Math.min(0.3, keys.length * 0.05); // More properties = higher quality
    }
    
    return Math.max(0, Math.min(1, quality));
  }

  private async getPerformanceMetrics(operation: string): Promise<Map<string, any>> {
    // Get telemetry data for each strategy
    const metrics = new Map();
    
    for (const strategyName of this.strategies.keys()) {
      const insights = telemetryService.getPerformanceInsights(`strategy.${strategyName}.${operation}`);
      metrics.set(strategyName, insights);
    }
    
    return metrics;
  }
}

// Export singleton instance
export const strategyEngine = new StrategyEngine();
