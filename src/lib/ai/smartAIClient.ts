/**
 * 🧠 Smart AI Client
 * 
 * Automatically selects the optimal AI model for different scenarios and integrates
 * with the existing multi-provider AI system for intelligent model selection.
 */

import { AIClient, AIGenerateOptions, AIResponse, AIAnalysis } from './client';
import { modelSelector, ModelSelectionCriteria, ModelRecommendation } from './modelSelector';

export interface SmartAIOptions extends AIGenerateOptions {
  scenario?: 'market_intelligence' | 'creative_content' | 'technical_analysis' | 'cost_optimized' | 'real_time' | 'batch_processing';
  complexity?: 'low' | 'medium' | 'high';
  priority?: 'speed' | 'accuracy' | 'cost' | 'balanced';
  autoSelectModel?: boolean;
}

export interface SmartAIResponse extends AIResponse {
  modelSelection: ModelRecommendation;
  scenario: string;
}

export class SmartAIClient {
  private aiClient: AIClient;

  constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }

  async generate(prompt: string, options?: SmartAIOptions): Promise<SmartAIResponse> {
    const modelSelection = await this.selectOptimalModel(options);
    
    console.log(`🧠 Smart AI: Selected ${modelSelection.provider}:${modelSelection.model} for ${options?.scenario || 'unknown'} scenario`);
    console.log(`📊 Reasoning: ${modelSelection.reasoning}`);

    const aiOptions: AIGenerateOptions = {
      ...options,
      model: modelSelection.model,
      provider: modelSelection.provider as any
    };

    const response = await this.aiClient.generate(prompt, aiOptions);

    return {
      ...response,
      modelSelection,
      scenario: options?.scenario || 'unknown'
    };
  }

  async analyze(data: any, context: string, options?: SmartAIOptions): Promise<AIAnalysis> {
    const modelSelection = await this.selectOptimalModel({
      ...options,
      scenario: options?.scenario || 'technical_analysis',
      responseFormat: 'json'
    });

    console.log(`🧠 Smart AI: Selected ${modelSelection.provider}:${modelSelection.model} for analysis`);

    const aiOptions: AIGenerateOptions = {
      ...options,
      model: modelSelection.model,
      provider: modelSelection.provider as any,
      responseFormat: 'json'
    };

    return this.aiClient.analyze(data, context);
  }

  private async selectOptimalModel(options?: SmartAIOptions): Promise<ModelRecommendation> {
    if (!options?.autoSelectModel && options?.model) {
      // Use specified model if auto-selection is disabled
      const capabilities = modelSelector.getModelCapabilities('openai', options.model);
      return {
        provider: 'openai',
        model: options.model,
        confidence: 1.0,
        reasoning: 'Manually specified model',
        estimatedCost: capabilities?.costPer1MTokens || 0.15,
        estimatedLatency: capabilities?.avgLatency || 800
      };
    }

    const criteria: ModelSelectionCriteria = {
      taskType: options?.scenario || 'market_intelligence',
      complexity: options?.complexity || 'medium',
      priority: options?.priority || 'balanced',
      maxTokens: options?.maxTokens,
      responseFormat: options?.responseFormat,
      temperature: options?.temperature
    };

    return modelSelector.selectModel(criteria);
  }

  // Scenario-specific methods for common use cases
  async generateMarketInsight(prompt: string, options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse> {
    return this.generate(prompt, {
      ...options,
      scenario: 'market_intelligence',
      priority: 'accuracy',
      complexity: 'high',
      responseFormat: 'json'
    });
  }

  async generateCreativeContent(prompt: string, options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse> {
    return this.generate(prompt, {
      ...options,
      scenario: 'creative_content',
      priority: 'balanced',
      complexity: 'medium',
      temperature: 0.8
    });
  }

  async generateRealTimeAnalysis(prompt: string, options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse> {
    return this.generate(prompt, {
      ...options,
      scenario: 'real_time',
      priority: 'speed',
      complexity: 'low'
    });
  }

  async generateCostOptimized(prompt: string, options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse> {
    return this.generate(prompt, {
      ...options,
      scenario: 'cost_optimized',
      priority: 'cost',
      complexity: 'low'
    });
  }

  async generateTechnicalAnalysis(prompt: string, options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse> {
    return this.generate(prompt, {
      ...options,
      scenario: 'technical_analysis',
      priority: 'accuracy',
      complexity: 'high',
      responseFormat: 'json'
    });
  }

  // Batch processing for cost optimization
  async generateBatch(prompts: string[], options?: Omit<SmartAIOptions, 'scenario'>): Promise<SmartAIResponse[]> {
    const modelSelection = await this.selectOptimalModel({
      ...options,
      scenario: 'batch_processing',
      priority: 'cost'
    });

    console.log(`🧠 Smart AI: Processing ${prompts.length} prompts with ${modelSelection.provider}:${modelSelection.model}`);

    const batchOptions: AIGenerateOptions = {
      ...options,
      model: modelSelection.model,
      provider: modelSelection.provider as any
    };

    const responses = await Promise.all(
      prompts.map(prompt => this.aiClient.generate(prompt, batchOptions))
    );

    return responses.map(response => ({
      ...response,
      modelSelection,
      scenario: 'batch_processing'
    }));
  }

  // Get model recommendations for a scenario
  getModelRecommendations(scenario: string): ModelRecommendation[] {
    const scenarios = ['market_intelligence', 'creative_content', 'technical_analysis', 'cost_optimized', 'real_time', 'batch_processing'];
    
    if (!scenarios.includes(scenario)) {
      throw new Error(`Invalid scenario: ${scenario}`);
    }

    const recommendations: ModelRecommendation[] = [];
    
    scenarios.forEach(s => {
      if (s === scenario) {
        const recommendation = modelSelector.selectModel({
          taskType: s as any,
          complexity: 'medium',
          priority: 'balanced'
        });
        recommendations.push(recommendation);
      }
    });

    return recommendations;
  }

  // Get available models and their capabilities
  getAvailableModels() {
    return modelSelector.getAllModels();
  }
}

// Export singleton instance
let smartAIClientInstance: SmartAIClient | null = null;

export const getSmartAIClient = (aiClient: AIClient): SmartAIClient => {
  if (!smartAIClientInstance) {
    smartAIClientInstance = new SmartAIClient(aiClient);
  }
  return smartAIClientInstance;
}; 