import { z } from 'zod';
import { aiRouter, AITask } from '@/lib/ai-router';
import { ragPipeline } from '@/lib/ai/rag-pipeline';
import { kMeansClusterer } from '@/lib/clustering-algorithms';
import { createServerClient } from '@/lib/supabase/server';
import { AppError } from '@/utils';

// Optimization configuration schema
const OptimizationConfigSchema = z.object({
  caching: z.object({
    enabled: z.boolean().default(true),
    ttl: z.number().finite().min(300).max(86400).default(3600), // 1 hour default
    maxSize: z.number().finite().min(100).max(10000).default(1000),
  }),
  aiRouting: z.object({
    enabled: z.boolean().default(true),
    costThreshold: z.number().finite().min(0).max(1).default(0.1), // $0.10 per request
    latencyThreshold: z.number().finite().min(1000).max(30000).default(5000), // 5s
    fallbackEnabled: z.boolean().default(true),
  }),
  vectorSearch: z.object({
    enabled: z.boolean().default(true),
    defaultThreshold: z.number().finite().min(0.1).max(1).default(0.8),
    maxResults: z.number().finite().min(1).max(100).default(10),
    indexOptimization: z.boolean().default(true),
  }),
  clustering: z.object({
    enabled: z.boolean().default(true),
    autoOptimizeK: z.boolean().default(true),
    maxClusters: z.number().finite().min(2).max(50).default(10),
    qualityThreshold: z.number().finite().min(0).max(1).default(0.5),
  }),
});

type OptimizationConfig = z.infer<typeof OptimizationConfigSchema>;

/**
 * ML/RAG Optimization Layer
 * Provides intelligent optimization across all ML and RAG components
 */
export class OptimizationLayer {
  private static instance: OptimizationLayer;
  private config: OptimizationConfig;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private performanceMetrics: Map<string, any[]> = new Map();
  private supabase;

  private constructor(config?: Partial<OptimizationConfig>) {
    this.config = OptimizationConfigSchema.parse(config || {});
    this.supabase = createServerClient();
    this.startCacheCleanup();
  }

  public static getInstance(config?: Partial<OptimizationConfig>): OptimizationLayer {
    if (!OptimizationLayer.instance) {
      OptimizationLayer.instance = new OptimizationLayer(config);
    }
    return OptimizationLayer.instance;
  }

  /**
   * Optimized RAG query with intelligent caching and routing
   */
  async optimizedRAGQuery(query: string, options?: {
    threshold?: number;
    limit?: number;
    useCache?: boolean;
    forceRefresh?: boolean;
  }): Promise<{
    answer: string;
    citations: any[];
    context: string[];
    metadata: {
      cacheHit: boolean;
      processingTime: number;
      optimizations: string[];
    };
  }> {
    const startTime = Date.now();
    const optimizations: string[] = [];
    
    // Generate cache key
    const cacheKey = this.generateCacheKey('rag', query, options);
    
    // Check cache first
    if (this.config.caching.enabled && options?.useCache !== false && !options?.forceRefresh) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        optimizations.push('cache-hit');
        return {
          ...cached,
          metadata: {
            cacheHit: true,
            processingTime: Date.now() - startTime,
            optimizations,
          },
        };
      }
    }

    // Optimize query parameters
    const optimizedOptions = this.optimizeRAGParameters(options);
    optimizations.push('parameter-optimization');

    // Execute RAG query
    const result = await ragPipeline.retrieveAndGenerate(query, optimizedOptions);
    
    // Cache result if enabled
    if (this.config.caching.enabled) {
      this.setCache(cacheKey, result, this.config.caching.ttl);
      optimizations.push('result-cached');
    }

    // Record performance metrics
    this.recordPerformance('rag-query', {
      query,
      processingTime: Date.now() - startTime,
      resultCount: result.citations.length,
      cacheHit: false,
    });

    return {
      ...result,
      metadata: {
        cacheHit: false,
        processingTime: Date.now() - startTime,
        optimizations,
      },
    };
  }

  /**
   * Optimized AI request with intelligent provider selection
   */
  async optimizedAIRequest(
    prompt: string,
    task: AITask,
    options?: {
      priority?: 'low' | 'medium' | 'high';
      maxTokens?: number;
      temperature?: number;
      budget?: number;
      preferredProvider?: string;
    }
  ): Promise<{
    content: string;
    provider: string;
    model: string;
    cost: number;
    metadata: {
      processingTime: number;
      optimizations: string[];
      fallbackUsed: boolean;
    };
  }> {
    const startTime = Date.now();
    const optimizations: string[] = [];
    let fallbackUsed = false;

    try {
      // Optimize request parameters
      const optimizedRequest = this.optimizeAIRequest(prompt, task, options);
      optimizations.push('request-optimization');

      // Execute with AI router
      const result = await aiRouter.execute(optimizedRequest);
      
      // Record performance
      this.recordPerformance('ai-request', {
        task,
        provider: result.provider,
        cost: result.cost,
        processingTime: Date.now() - startTime,
        success: true,
      });

      return {
        content: result.content,
        provider: result.provider,
        model: result.model,
        cost: result.cost,
        metadata: {
          processingTime: Date.now() - startTime,
          optimizations,
          fallbackUsed,
        },
      };
    } catch (error) {
      // Try fallback if enabled
      if (this.config.aiRouting.fallbackEnabled) {
        try {
          optimizations.push('fallback-attempted');
          fallbackUsed = true;
          
          // Simplified fallback request
          const fallbackResult = await aiRouter.execute({
            prompt,
            task,
            priority: 'low',
            maxTokens: 500,
          });

          return {
            content: fallbackResult.content,
            provider: fallbackResult.provider,
            model: fallbackResult.model,
            cost: fallbackResult.cost,
            metadata: {
              processingTime: Date.now() - startTime,
              optimizations,
              fallbackUsed,
            },
          };
        } catch (fallbackError) {
          optimizations.push('fallback-failed');
        }
      }

      throw new AppError(
        `Optimized AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'OPTIMIZATION_ERROR',
        500
      );
    }
  }

  /**
   * Optimized content clustering with adaptive parameters
   */
  async optimizedClustering(
    contentIds: string[],
    options?: {
      algorithm?: 'kmeans' | 'hierarchical';
      maxClusters?: number;
      qualityThreshold?: number;
    }
  ): Promise<{
    clusters: any[];
    metrics: {
      silhouetteScore: number;
      optimalK: number;
      processingTime: number;
    };
    optimizations: string[];
  }> {
    const startTime = Date.now();
    const optimizations: string[] = [];

    // Fetch content with embeddings
    const { data: articles, error } = await this.supabase
      .from('market_articles')
      .select('id, embedding, title, content')
      .in('id', contentIds)
      .not('embedding', 'is', null);

    if (error || !articles || articles.length < 2) {
      throw new AppError('Insufficient content for clustering', 'INSUFFICIENT_DATA', 400);
    }

    // Prepare data points
    const dataPoints = articles.map(article => ({
      id: article.id.toString(),
      vector: article.embedding as number[],
      metadata: {
        title: article.title,
        content: article.content,
      },
    }));

    // Optimize clustering parameters
    const maxK = Math.min(
      options?.maxClusters || this.config.clustering.maxClusters,
      Math.floor(dataPoints.length / 2)
    );

    let optimalK = 3;
    let clusters: any[] = [];
    let silhouetteScore = 0;

    if (this.config.clustering.autoOptimizeK) {
      // Find optimal K
      const optimalKResult = await kMeansClusterer.findOptimalK(dataPoints, maxK);
      optimalK = optimalKResult.optimalK;
      optimizations.push('auto-k-optimization');
    }

    // Perform clustering
    const clusteringResult = await kMeansClusterer.cluster(dataPoints, optimalK);
    clusters = clusteringResult.clusters;
    silhouetteScore = clusteringResult.silhouetteScore || 0;

    // Quality check and re-optimization
    if (silhouetteScore < (options?.qualityThreshold || this.config.clustering.qualityThreshold)) {
      optimizations.push('quality-reoptimization');
      
      // Try different K values
      for (let k = 2; k <= maxK; k++) {
        if (k === optimalK) continue;
        
        const testResult = await kMeansClusterer.cluster(dataPoints, k);
        if ((testResult.silhouetteScore || 0) > silhouetteScore) {
          optimalK = k;
          clusters = testResult.clusters;
          silhouetteScore = testResult.silhouetteScore || 0;
        }
      }
    }

    // Record performance
    this.recordPerformance('clustering', {
      contentCount: dataPoints.length,
      optimalK,
      silhouetteScore,
      processingTime: Date.now() - startTime,
    });

    return {
      clusters,
      metrics: {
        silhouetteScore,
        optimalK,
        processingTime: Date.now() - startTime,
      },
      optimizations,
    };
  }

  /**
   * Performance analytics and recommendations
   */
  getPerformanceAnalytics(): {
    ragQueries: {
      avgResponseTime: number;
      cacheHitRate: number;
      totalQueries: number;
    };
    aiRequests: {
      avgResponseTime: number;
      successRate: number;
      costPerRequest: number;
      providerDistribution: Record<string, number>;
    };
    clustering: {
      avgProcessingTime: number;
      avgSilhouetteScore: number;
      totalClusters: number;
    };
    recommendations: Array<{
      component: string;
      recommendation: string;
      impact: 'low' | 'medium' | 'high';
    }>;
  } {
    const ragMetrics = this.performanceMetrics.get('rag-query') || [];
    const aiMetrics = this.performanceMetrics.get('ai-request') || [];
    const clusteringMetrics = this.performanceMetrics.get('clustering') || [];

    const recommendations = [];

    // RAG analytics
    const ragAnalytics = {
      avgResponseTime: ragMetrics.length > 0 
        ? ragMetrics.reduce((sum, m) => sum + m.processingTime, 0) / ragMetrics.length 
        : 0,
      cacheHitRate: ragMetrics.length > 0
        ? ragMetrics.filter(m => m.cacheHit).length / ragMetrics.length * 100
        : 0,
      totalQueries: ragMetrics.length,
    };

    if (ragAnalytics.cacheHitRate < 30) {
      recommendations.push({
        component: 'RAG Pipeline',
        recommendation: 'Consider increasing cache TTL or improving query patterns',
        impact: 'medium',
      });
    }

    // AI request analytics
    const aiAnalytics = {
      avgResponseTime: aiMetrics.length > 0
        ? aiMetrics.reduce((sum, m) => sum + m.processingTime, 0) / aiMetrics.length
        : 0,
      successRate: aiMetrics.length > 0
        ? aiMetrics.filter(m => m.success).length / aiMetrics.length * 100
        : 0,
      costPerRequest: aiMetrics.length > 0
        ? aiMetrics.reduce((sum, m) => sum + (m.cost || 0), 0) / aiMetrics.length
        : 0,
      providerDistribution: aiMetrics.reduce((acc: Record<string, number>, m) => {
        acc[m.provider] = (acc[m.provider] || 0) + 1;
        return acc;
      }, {}),
    };

    if (aiAnalytics.costPerRequest > this.config.aiRouting.costThreshold) {
      recommendations.push({
        component: 'AI Router',
        recommendation: 'Consider using more cost-effective providers for routine tasks',
        impact: 'high',
      });
    }

    // Clustering analytics
    const clusteringAnalytics = {
      avgProcessingTime: clusteringMetrics.length > 0
        ? clusteringMetrics.reduce((sum, m) => sum + m.processingTime, 0) / clusteringMetrics.length
        : 0,
      avgSilhouetteScore: clusteringMetrics.length > 0
        ? clusteringMetrics.reduce((sum, m) => sum + (m.silhouetteScore || 0), 0) / clusteringMetrics.length
        : 0,
      totalClusters: clusteringMetrics.reduce((sum, m) => sum + (m.optimalK || 0), 0),
    };

    if (clusteringAnalytics.avgSilhouetteScore < 0.5) {
      recommendations.push({
        component: 'Clustering',
        recommendation: 'Consider preprocessing content more thoroughly or adjusting clustering parameters',
        impact: 'medium',
      });
    }

    return {
      ragQueries: ragAnalytics,
      aiRequests: aiAnalytics,
      clustering: clusteringAnalytics,
      recommendations,
    };
  }

  /**
   * Auto-optimize system based on performance metrics
   */
  async autoOptimize(): Promise<{
    optimizations: Array<{
      component: string;
      action: string;
      expectedImpact: string;
    }>;
    newConfig: OptimizationConfig;
  }> {
    const analytics = this.getPerformanceAnalytics();
    const optimizations = [];
    const newConfig = { ...this.config };

    // Optimize caching based on hit rates
    if (analytics.ragQueries.cacheHitRate < 30 && analytics.ragQueries.totalQueries > 10) {
      newConfig.caching.ttl = Math.min(this.config.caching.ttl * 1.5, 86400);
      optimizations.push({
        component: 'Caching',
        action: `Increased cache TTL to ${newConfig.caching.ttl}s`,
        expectedImpact: 'Improved cache hit rate and reduced latency',
      });
    }

    // Optimize AI routing based on cost and performance
    if (analytics.aiRequests.costPerRequest > this.config.aiRouting.costThreshold) {
      newConfig.aiRouting.costThreshold = analytics.aiRequests.costPerRequest * 0.8;
      optimizations.push({
        component: 'AI Router',
        action: `Adjusted cost threshold to $${newConfig.aiRouting.costThreshold.toFixed(3)}`,
        expectedImpact: 'Increased use of cost-effective providers',
      });
    }

    // Optimize vector search based on performance
    if (analytics.ragQueries.avgResponseTime > 2000) {
      newConfig.vectorSearch.defaultThreshold = Math.min(this.config.vectorSearch.defaultThreshold + 0.1, 0.95);
      optimizations.push({
        component: 'Vector Search',
        action: `Increased similarity threshold to ${newConfig.vectorSearch.defaultThreshold}`,
        expectedImpact: 'Faster search with more relevant results',
      });
    }

    // Optimize clustering based on quality
    if (analytics.clustering.avgSilhouetteScore < 0.5) {
      newConfig.clustering.qualityThreshold = Math.max(analytics.clustering.avgSilhouetteScore - 0.1, 0.3);
      optimizations.push({
        component: 'Clustering',
        action: `Adjusted quality threshold to ${newConfig.clustering.qualityThreshold}`,
        expectedImpact: 'Better clustering quality with adaptive parameters',
      });
    }

    // Apply optimizations
    this.config = newConfig;

    return {
      optimizations,
      newConfig,
    };
  }

  /**
   * Cache management
   */
  private generateCacheKey(type: string, query: string, options?: any): string {
    const optionsStr = options ? JSON.stringify(options) : '';
    return `${type}:${Buffer.from(query + optionsStr).toString('base64')}`;
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }

  private setCache(key: string, data: any, ttl: number): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.config.caching.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private startCacheCleanup(): void {
    // Clean expired cache entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, cached] of this.cache.entries()) {
        if (now - cached.timestamp > cached.ttl * 1000) {
          this.cache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  /**
   * Parameter optimization
   */
  private optimizeRAGParameters(options?: any): any {
    return {
      threshold: options?.threshold || this.config.vectorSearch.defaultThreshold,
      limit: Math.min(options?.limit || this.config.vectorSearch.maxResults, this.config.vectorSearch.maxResults),
      includeContext: true,
    };
  }

  private optimizeAIRequest(prompt: string, task: AITask, options?: any): any {
    // Estimate token count for cost optimization
    const estimatedTokens = Math.ceil(prompt.length / 4); // Rough estimation
    
    return {
      prompt,
      task,
      priority: options?.priority || 'medium',
      maxTokens: Math.min(options?.maxTokens || 1000, 4000),
      temperature: options?.temperature || 0.7,
      budget: options?.budget || this.config.aiRouting.costThreshold,
    };
  }

  /**
   * Performance tracking
   */
  private recordPerformance(type: string, metrics: any): void {
    const existing = this.performanceMetrics.get(type) || [];
    existing.push({
      ...metrics,
      timestamp: Date.now(),
    });

    // Keep only last 1000 entries per type
    if (existing.length > 1000) {
      existing.splice(0, existing.length - 1000);
    }

    this.performanceMetrics.set(type, existing);
  }

  /**
   * Get current configuration
   */
  getConfig(): OptimizationConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<OptimizationConfig>): void {
    this.config = OptimizationConfigSchema.parse({
      ...this.config,
      ...newConfig,
    });
  }
}

// Export singleton instance
export const optimizationLayer = OptimizationLayer.getInstance();

// Export types
export type { OptimizationConfig };
