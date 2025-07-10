/**
 * AI Model Versioning System
 * 
 * Provides comprehensive model versioning with:
 * - Model metadata tracking
 * - Performance metrics per version
 * - A/B testing capabilities
 * - Rollback functionality
 * - Cost tracking per model version
 */

import { supabase } from '@/lib/supabase';

export interface ModelVersion {
  id: string;
  provider: string;
  model: string;
  version: string;
  releaseDate: Date;
  status: 'active' | 'deprecated' | 'testing' | 'rollback';
  metadata: {
    maxTokens: number;
    temperature: number;
    costPer1kTokens: number;
    capabilities: string[];
    limitations: string[];
    trainingData: string;
    lastUpdated: Date;
  };
  performance: {
    averageResponseTime: number;
    successRate: number;
    errorRate: number;
    totalRequests: number;
    totalTokens: number;
    totalCost: number;
  };
}

export interface ModelRequest {
  id: string;
  userId: string;
  provider: string;
  model: string;
  version: string;
  requestData: any;
  responseData?: any;
  responseTime: number;
  tokensUsed: number;
  cost: number;
  success: boolean;
  errorMessage?: string;
  timestamp: Date;
}

export interface ModelComparison {
  versionA: string;
  versionB: string;
  metric: string;
  improvement: number;
  confidence: number;
  sampleSize: number;
}

class ModelVersioning {
  private static instance: ModelVersioning;
  private modelVersions = new Map<string, ModelVersion>();
  private activeVersions = new Map<string, string>(); // provider:model -> version

  // Default model configurations
  private readonly defaultModels: Record<string, ModelVersion> = {
    'openai:gpt-4': {
      id: 'gpt-4-v1',
      provider: 'openai',
      model: 'gpt-4',
      version: '1.0',
      releaseDate: new Date('2024-01-01'),
      status: 'active',
      metadata: {
        maxTokens: 8192,
        temperature: 0.7,
        costPer1kTokens: 0.03,
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        limitations: ['context-length', 'real-time-data'],
        trainingData: 'Up to April 2023',
        lastUpdated: new Date('2024-01-01')
      },
      performance: {
        averageResponseTime: 2000,
        successRate: 0.98,
        errorRate: 0.02,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0
      }
    },
    'openai:gpt-4-turbo': {
      id: 'gpt-4-turbo-v1',
      provider: 'openai',
      model: 'gpt-4-turbo',
      version: '1.0',
      releaseDate: new Date('2024-01-01'),
      status: 'active',
      metadata: {
        maxTokens: 128000,
        temperature: 0.7,
        costPer1kTokens: 0.01,
        capabilities: ['text-generation', 'code-generation', 'analysis', 'vision'],
        limitations: ['real-time-data'],
        trainingData: 'Up to April 2024',
        lastUpdated: new Date('2024-01-01')
      },
      performance: {
        averageResponseTime: 1500,
        successRate: 0.99,
        errorRate: 0.01,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0
      }
    },
    'claude:claude-3-sonnet': {
      id: 'claude-3-sonnet-v1',
      provider: 'claude',
      model: 'claude-3-sonnet',
      version: '1.0',
      releaseDate: new Date('2024-01-01'),
      status: 'active',
      metadata: {
        maxTokens: 200000,
        temperature: 0.7,
        costPer1kTokens: 0.015,
        capabilities: ['text-generation', 'analysis', 'reasoning'],
        limitations: ['code-generation'],
        trainingData: 'Up to August 2023',
        lastUpdated: new Date('2024-01-01')
      },
      performance: {
        averageResponseTime: 1800,
        successRate: 0.97,
        errorRate: 0.03,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0
      }
    },
    'vertex:gemini-pro': {
      id: 'gemini-pro-v1',
      provider: 'vertex',
      model: 'gemini-pro',
      version: '1.0',
      releaseDate: new Date('2024-01-01'),
      status: 'active',
      metadata: {
        maxTokens: 32768,
        temperature: 0.7,
        costPer1kTokens: 0.0125,
        capabilities: ['text-generation', 'code-generation', 'analysis'],
        limitations: ['context-length'],
        trainingData: 'Up to February 2024',
        lastUpdated: new Date('2024-01-01')
      },
      performance: {
        averageResponseTime: 1200,
        successRate: 0.96,
        errorRate: 0.04,
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0
      }
    }
  };

  private constructor() {
    this.initializeDefaultModels();
  }

  static getInstance(): ModelVersioning {
    if (!ModelVersioning.instance) {
      ModelVersioning.instance = new ModelVersioning();
    }
    return ModelVersioning.instance;
  }

  /**
   * Get the current active version for a model
   */
  getActiveVersion(provider: string, model: string): string | undefined {
    const key = `${provider}:${model}`;
    return this.activeVersions.get(key);
  }

  /**
   * Get model version details
   */
  getModelVersion(provider: string, model: string, version: string): ModelVersion | undefined {
    const key = `${provider}:${model}:${version}`;
    return this.modelVersions.get(key);
  }

  /**
   * Get all versions for a model
   */
  getModelVersions(provider: string, model: string): ModelVersion[] {
    const versions: ModelVersion[] = [];
    const prefix = `${provider}:${model}:`;
    
    for (const [key, version] of this.modelVersions) {
      if (key.startsWith(prefix)) {
        versions.push(version);
      }
    }
    
    return versions.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
  }

  /**
   * Register a new model version
   */
  async registerModelVersion(version: Omit<ModelVersion, 'id'>): Promise<string> {
    const id = `${version.provider}-${version.model}-${version.version}`;
    const key = `${version.provider}:${version.model}:${version.version}`;
    
    const newVersion: ModelVersion = {
      ...version,
      id
    };
    
    this.modelVersions.set(key, newVersion);
    
    // If this is the first version or marked as active, set it as active
    if (version.status === 'active') {
      this.activeVersions.set(`${version.provider}:${version.model}`, version.version);
    }
    
    // Log to database
    await this.logModelVersion(newVersion);
    
    return id;
  }

  /**
   * Update model version status
   */
  async updateModelStatus(
    provider: string,
    model: string,
    version: string,
    status: ModelVersion['status']
  ): Promise<void> {
    const key = `${provider}:${model}:${version}`;
    const modelVersion = this.modelVersions.get(key);
    
    if (!modelVersion) {
      throw new Error(`Model version not found: ${provider}:${model}:${version}`);
    }
    
    modelVersion.status = status;
    
    // If setting to active, update active version
    if (status === 'active') {
      this.activeVersions.set(`${provider}:${model}`, version);
    }
    
    // Log to database
    await this.logModelStatusUpdate(provider, model, version, status);
  }

  /**
   * Record a model request for performance tracking
   */
  async recordModelRequest(request: Omit<ModelRequest, 'id'>): Promise<void> {
    const id = crypto.randomUUID();
    const modelRequest: ModelRequest = { ...request, id };
    
    // Update performance metrics
    const key = `${request.provider}:${request.model}:${request.version}`;
    const modelVersion = this.modelVersions.get(key);
    
    if (modelVersion) {
      const perf = modelVersion.performance;
      perf.totalRequests++;
      perf.totalTokens += request.tokensUsed;
      perf.totalCost += request.cost;
      
      // Update average response time
      perf.averageResponseTime = (perf.averageResponseTime * (perf.totalRequests - 1) + request.responseTime) / perf.totalRequests;
      
      // Update success/error rates
      if (request.success) {
        perf.successRate = (perf.successRate * (perf.totalRequests - 1) + 1) / perf.totalRequests;
      } else {
        perf.errorRate = (perf.errorRate * (perf.totalRequests - 1) + 1) / perf.totalRequests;
      }
    }
    
    // Log to database
    await this.logModelRequest(modelRequest);
  }

  /**
   * Compare two model versions
   */
  async compareVersions(
    provider: string,
    model: string,
    versionA: string,
    versionB: string,
    metric: keyof ModelVersion['performance']
  ): Promise<ModelComparison> {
    const versionAData = this.getModelVersion(provider, model, versionA);
    const versionBData = this.getModelVersion(provider, model, versionB);
    
    if (!versionAData || !versionBData) {
      throw new Error('One or both model versions not found');
    }
    
    const valueA = versionAData.performance[metric];
    const valueB = versionBData.performance[metric];
    
    let improvement = 0;
    let confidence = 0;
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      improvement = ((valueB - valueA) / valueA) * 100;
      
      // Calculate confidence based on sample size
      const sampleSize = Math.min(versionAData.performance.totalRequests, versionBData.performance.totalRequests);
      confidence = Math.min(0.95, sampleSize / 1000); // Max 95% confidence
    }
    
    return {
      versionA,
      versionB,
      metric,
      improvement,
      confidence,
      sampleSize: Math.min(versionAData.performance.totalRequests, versionBData.performance.totalRequests)
    };
  }

  /**
   * Get performance metrics for all models
   */
  getAllModelPerformance(): Record<string, ModelVersion['performance']> {
    const performance: Record<string, ModelVersion['performance']> = {};
    
    for (const [key, version] of this.modelVersions) {
      performance[key] = version.performance;
    }
    
    return performance;
  }

  /**
   * Get cost analysis for models
   */
  getCostAnalysis(timeframe: 'day' | 'week' | 'month' = 'day'): Record<string, number> {
    const costs: Record<string, number> = {};
    
    for (const [key, version] of this.modelVersions) {
      costs[key] = version.performance.totalCost;
    }
    
    return costs;
  }

  /**
   * Rollback to a previous version
   */
  async rollbackToVersion(provider: string, model: string, version: string): Promise<void> {
    const targetVersion = this.getModelVersion(provider, model, version);
    
    if (!targetVersion) {
      throw new Error(`Target version not found: ${provider}:${model}:${version}`);
    }
    
    // Set target version as active
    await this.updateModelStatus(provider, model, version, 'active');
    
    // Mark current active version as rollback
    const currentActive = this.getActiveVersion(provider, model);
    if (currentActive && currentActive !== version) {
      await this.updateModelStatus(provider, model, currentActive, 'rollback');
    }
    
    // Log rollback action
    await this.logRollback(provider, model, version, currentActive);
  }

  /**
   * Initialize default models
   */
  private initializeDefaultModels(): void {
    for (const [key, model] of Object.entries(this.defaultModels)) {
      const [provider, modelName] = key.split(':');
      const versionKey = `${provider}:${modelName}:${model.version}`;
      
      this.modelVersions.set(versionKey, model);
      this.activeVersions.set(key, model.version);
    }
  }

  /**
   * Log model version to database
   */
  private async logModelVersion(version: ModelVersion): Promise<void> {
    try {
      await supabase
        .from('ai_model_versions')
        .upsert({
          id: version.id,
          provider: version.provider,
          model: version.model,
          version: version.version,
          release_date: version.releaseDate.toISOString(),
          status: version.status,
          metadata: version.metadata,
          performance: version.performance,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log model version:', error);
    }
  }

  /**
   * Log model status update to database
   */
  private async logModelStatusUpdate(
    provider: string,
    model: string,
    version: string,
    status: ModelVersion['status']
  ): Promise<void> {
    try {
      await supabase
        .from('ai_model_status_updates')
        .insert({
          provider,
          model,
          version,
          status,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log model status update:', error);
    }
  }

  /**
   * Log model request to database
   */
  private async logModelRequest(request: ModelRequest): Promise<void> {
    try {
      await supabase
        .from('ai_model_requests')
        .insert({
          id: request.id,
          u_id: request.userId,
          provider: request.provider,
          model: request.model,
          version: request.version,
          request_data: request.requestData,
          response_data: request.responseData,
          response_time: request.responseTime,
          tokens_used: request.tokensUsed,
          cost: request.cost,
          success: request.success,
          error_message: request.errorMessage,
          timestamp: request.timestamp.toISOString()
        });
    } catch (error) {
      console.error('Failed to log model request:', error);
    }
  }

  /**
   * Log rollback action to database
   */
  private async logRollback(
    provider: string,
    model: string,
    targetVersion: string,
    previousVersion?: string
  ): Promise<void> {
    try {
      await supabase
        .from('ai_model_rollbacks')
        .insert({
          provider,
          model,
          target_version: targetVersion,
          previous_version: previousVersion,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to log rollback:', error);
    }
  }
}

// Export singleton instance
export const modelVersioning = ModelVersioning.getInstance(); 