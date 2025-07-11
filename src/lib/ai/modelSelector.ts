/**
 * 🧠 Intelligent Model Selection Service
 * 
 * Automatically selects the optimal AI model for different scenarios:
 * - Market Intelligence: High accuracy, real-time analysis
 * - Creative Content: Balanced creativity and structure
 * - Technical Analysis: Precision and reasoning
 * - Cost Optimization: Budget-conscious tasks
 */

export interface ModelSelectionCriteria {
  taskType: 'market_intelligence' | 'creative_content' | 'technical_analysis' | 'cost_optimized' | 'real_time' | 'batch_processing'
  complexity: 'low' | 'medium' | 'high'
  priority: 'speed' | 'accuracy' | 'cost' | 'balanced'
  maxTokens?: number
  responseFormat?: 'json' | 'text'
  temperature?: number
}

export interface ModelRecommendation {
  provider: string
  model: string
  confidence: number
  reasoning: string
  estimatedCost: number
  estimatedLatency: number
}

export interface ModelCapabilities {
  provider: string
  model: string
  strengths: string[]
  weaknesses: string[]
  bestFor: string[]
  costPer1MTokens: number
  maxTokens: number
  avgLatency: number
}

class ModelSelector {
  private static instance: ModelSelector;
  private modelCapabilities: Map<string, ModelCapabilities>;

  private constructor() {
    this.initializeModelCapabilities();
  }

  static getInstance(): ModelSelector {
    if (!ModelSelector.instance) {
      ModelSelector.instance = new ModelSelector();
    }
    return ModelSelector.instance;
  }

  private initializeModelCapabilities(): void {
    this.modelCapabilities = new Map([
      // OpenAI Models
      ['openai:gpt-4o', {
        provider: 'openai',
        model: 'gpt-4o',
        strengths: ['high_accuracy', 'complex_reasoning', 'multimodal', 'large_context'],
        weaknesses: ['higher_cost', 'slower_than_mini'],
        bestFor: ['market_intelligence', 'technical_analysis', 'complex_strategy'],
        costPer1MTokens: 5.00,
        maxTokens: 128000,
        avgLatency: 2000
      }],
      ['openai:gpt-4o-mini', {
        provider: 'openai',
        model: 'gpt-4o-mini',
        strengths: ['fast', 'cost_effective', 'good_accuracy', 'json_output'],
        weaknesses: ['smaller_context', 'less_complex_reasoning'],
        bestFor: ['real_time', 'cost_optimized', 'standard_analysis'],
        costPer1MTokens: 0.15,
        maxTokens: 128000,
        avgLatency: 800
      }],
      ['openai:gpt-3.5-turbo', {
        provider: 'openai',
        model: 'gpt-3.5-turbo',
        strengths: ['very_fast', 'very_cheap', 'good_for_simple_tasks'],
        weaknesses: ['lower_accuracy', 'limited_reasoning'],
        bestFor: ['cost_optimized', 'simple_tasks', 'batch_processing'],
        costPer1MTokens: 0.50,
        maxTokens: 16385,
        avgLatency: 400
      }],

      // Anthropic Models
      ['anthropic:claude-3-5-sonnet', {
        provider: 'anthropic',
        model: 'claude-3-5-sonnet',
        strengths: ['excellent_reasoning', 'creative_writing', 'safety', 'large_context'],
        weaknesses: ['higher_cost', 'slower'],
        bestFor: ['creative_content', 'complex_strategy', 'safety_critical'],
        costPer1MTokens: 3.00,
        maxTokens: 200000,
        avgLatency: 2500
      }],
      ['anthropic:claude-3-haiku', {
        provider: 'anthropic',
        model: 'claude-3-haiku',
        strengths: ['very_fast', 'cost_effective', 'good_accuracy'],
        weaknesses: ['smaller_context', 'less_complex_reasoning'],
        bestFor: ['real_time', 'cost_optimized', 'standard_analysis'],
        costPer1MTokens: 0.25,
        maxTokens: 200000,
        avgLatency: 600
      }],

      // Google Vertex AI Models
      ['vertex:gemini-1.5-pro', {
        provider: 'vertex',
        model: 'gemini-1.5-pro',
        strengths: ['multimodal', 'large_context', 'good_reasoning'],
        weaknesses: ['variable_latency', 'less_mature'],
        bestFor: ['technical_analysis', 'multimodal_tasks'],
        costPer1MTokens: 3.50,
        maxTokens: 1000000,
        avgLatency: 1800
      }],
      ['vertex:gemini-1.5-flash', {
        provider: 'vertex',
        model: 'gemini-1.5-flash',
        strengths: ['fast', 'cost_effective', 'good_accuracy'],
        weaknesses: ['smaller_context'],
        bestFor: ['real_time', 'cost_optimized'],
        costPer1MTokens: 0.075,
        maxTokens: 1000000,
        avgLatency: 500
      }],

      // Mistral Models
      ['mistral:mixtral-8x7b', {
        provider: 'mistral',
        model: 'mixtral-8x7b',
        strengths: ['open_source', 'cost_effective', 'good_performance'],
        weaknesses: ['less_mature', 'variable_quality'],
        bestFor: ['cost_optimized', 'batch_processing'],
        costPer1MTokens: 0.14,
        maxTokens: 32768,
        avgLatency: 1200
      }]
    ]);
  }

  selectModel(criteria: ModelSelectionCriteria): ModelRecommendation {
    const candidates = this.getCandidates(criteria);
    const scored = this.scoreCandidates(candidates, criteria);
    const best = scored.sort((a, b) => b.score - a.score)[0];

    return {
      provider: best.capabilities.provider,
      model: best.capabilities.model,
      confidence: best.score,
      reasoning: best.reasoning,
      estimatedCost: best.capabilities.costPer1MTokens,
      estimatedLatency: best.capabilities.avgLatency
    };
  }

  private getCandidates(criteria: ModelSelectionCriteria): ModelCapabilities[] {
    const candidates: ModelCapabilities[] = [];

    for (const [key, capabilities] of this.modelCapabilities) {
      // Filter based on task type
      if (this.matchesTaskType(capabilities, criteria.taskType)) {
        candidates.push(capabilities);
      }
    }

    return candidates;
  }

  private matchesTaskType(capabilities: ModelCapabilities, taskType: string): boolean {
    const taskMapping: Record<string, string[]> = {
      market_intelligence: ['market_intelligence', 'technical_analysis', 'complex_strategy'],
      creative_content: ['creative_content', 'complex_strategy'],
      technical_analysis: ['technical_analysis', 'complex_strategy'],
      cost_optimized: ['cost_optimized', 'batch_processing'],
      real_time: ['real_time', 'standard_analysis'],
      batch_processing: ['batch_processing', 'cost_optimized']
    };

    const requiredCapabilities = taskMapping[taskType] || [];
    return requiredCapabilities.some(cap => capabilities.bestFor.includes(cap));
  }

  private scoreCandidates(candidates: ModelCapabilities[], criteria: ModelSelectionCriteria): Array<{ capabilities: ModelCapabilities; score: number; reasoning: string }> {
    return candidates.map(capabilities => {
      let score = 0;
      const reasoning: string[] = [];

      // Priority-based scoring
      switch (criteria.priority) {
        case 'speed':
          score += this.scoreSpeed(capabilities);
          reasoning.push(`Speed score: ${this.scoreSpeed(capabilities)}`);
          break;
        case 'accuracy':
          score += this.scoreAccuracy(capabilities);
          reasoning.push(`Accuracy score: ${this.scoreAccuracy(capabilities)}`);
          break;
        case 'cost':
          score += this.scoreCost(capabilities);
          reasoning.push(`Cost score: ${this.scoreCost(capabilities)}`);
          break;
        case 'balanced':
          score += this.scoreBalanced(capabilities);
          reasoning.push(`Balanced score: ${this.scoreBalanced(capabilities)}`);
          break;
      }

      // Complexity adjustment
      score += this.scoreComplexity(capabilities, criteria.complexity);
      reasoning.push(`Complexity adjustment: ${this.scoreComplexity(capabilities, criteria.complexity)}`);

      // JSON output preference
      if (criteria.responseFormat === 'json' && capabilities.strengths.includes('json_output')) {
        score += 10;
        reasoning.push('JSON output capability: +10');
      }

      return {
        capabilities,
        score,
        reasoning: reasoning.join(', ')
      };
    });
  }

  private scoreSpeed(capabilities: ModelCapabilities): number {
    // Lower latency = higher score
    const maxLatency = 3000;
    return Math.max(0, 100 - (capabilities.avgLatency / maxLatency) * 100);
  }

  private scoreAccuracy(capabilities: ModelCapabilities): number {
    // Higher accuracy models get higher scores
    const accuracyScores: Record<string, number> = {
      'gpt-4o': 95,
      'claude-3-5-sonnet': 90,
      'gemini-1.5-pro': 85,
      'gpt-4o-mini': 80,
      'claude-3-haiku': 75,
      'gemini-1.5-flash': 70,
      'gpt-3.5-turbo': 65,
      'mixtral-8x7b': 60
    };
    return accuracyScores[capabilities.model] || 50;
  }

  private scoreCost(capabilities: ModelCapabilities): number {
    // Lower cost = higher score
    const maxCost = 5.00;
    return Math.max(0, 100 - (capabilities.costPer1MTokens / maxCost) * 100);
  }

  private scoreBalanced(capabilities: ModelCapabilities): number {
    return (this.scoreSpeed(capabilities) + this.scoreAccuracy(capabilities) + this.scoreCost(capabilities)) / 3;
  }

  private scoreComplexity(capabilities: ModelCapabilities, complexity: string): number {
    const complexityScores: Record<string, number> = {
      low: capabilities.strengths.includes('very_fast') ? 10 : 0,
      medium: capabilities.strengths.includes('good_accuracy') ? 10 : 0,
      high: capabilities.strengths.includes('complex_reasoning') ? 10 : 0
    };
    return complexityScores[complexity] || 0;
  }

  getModelCapabilities(provider: string, model: string): ModelCapabilities | undefined {
    return this.modelCapabilities.get(`${provider}:${model}`);
  }

  getAllModels(): ModelCapabilities[] {
    return Array.from(this.modelCapabilities.values());
  }
}

export const modelSelector = ModelSelector.getInstance(); 