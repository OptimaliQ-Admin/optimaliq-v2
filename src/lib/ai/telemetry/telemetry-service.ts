/**
 * AI Telemetry Service
 * Comprehensive telemetry logging for AI operations to help tune thresholds and optimize performance
 */

import { z } from 'zod';

// Telemetry Event Schema
export const TelemetryEventSchema = z.object({
  eventId: z.string(),
  timestamp: z.date(),
  operation: z.string(),
  provider: z.string().optional(),
  model: z.string().optional(),
  inputs: z.object({
    summary: z.string(),
    tokenCount: z.number().finite().optional(),
    parameters: z.record(z.any()).optional(),
    context: z.record(z.any()).optional()
  }),
  outputs: z.object({
    result: z.any(),
    confidence: z.number().finite().min(0).max(1).optional(),
    quality: z.number().finite().min(0).max(1).optional(),
    tokenCount: z.number().finite().optional()
  }),
  timing: z.object({
    startTime: z.date(),
    endTime: z.date(),
    duration: z.number().finite(), // milliseconds
    processingTime: z.number().finite().optional(),
    networkTime: z.number().finite().optional()
  }),
  performance: z.object({
    success: z.boolean(),
    errorCode: z.string().optional(),
    errorMessage: z.string().optional(),
    retryCount: z.number().finite().default(0),
    cacheHit: z.boolean().optional()
  }),
  thresholds: z.object({
    confidenceThreshold: z.number().finite().min(0).max(1).optional(),
    qualityThreshold: z.number().finite().min(0).max(1).optional(),
    timeoutThreshold: z.number().finite().optional(),
    costThreshold: z.number().finite().optional()
  }).optional(),
  cost: z.object({
    estimated: z.number().finite().optional(),
    actual: z.number().finite().optional(),
    currency: z.string().default('USD')
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;

// Telemetry Aggregation Schema
export const TelemetryAggregationSchema = z.object({
  period: z.enum(['hour', 'day', 'week', 'month']),
  operation: z.string(),
  metrics: z.object({
    totalEvents: z.number().finite(),
    successRate: z.number().finite().min(0).max(1),
    averageDuration: z.number().finite(),
    averageConfidence: z.number().finite().min(0).max(1).optional(),
    averageQuality: z.number().finite().min(0).max(1).optional(),
    totalCost: z.number().finite().optional(),
    errorRate: z.number().finite().min(0).max(1),
    retryRate: z.number().finite().min(0).max(1),
    cacheHitRate: z.number().finite().min(0).max(1).optional()
  }),
  thresholdAnalysis: z.object({
    confidenceDistribution: z.record(z.number().finite()).optional(),
    qualityDistribution: z.record(z.number().finite()).optional(),
    recommendedThresholds: z.object({
      confidence: z.number().finite().min(0).max(1).optional(),
      quality: z.number().finite().min(0).max(1).optional(),
      timeout: z.number().finite().optional()
    }).optional()
  }).optional()
});

export type TelemetryAggregation = z.infer<typeof TelemetryAggregationSchema>;

class TelemetryService {
  private static instance: TelemetryService;
  private events: TelemetryEvent[] = [];
  private aggregations: Map<string, TelemetryAggregation> = new Map();
  private isEnabled: boolean = true;

  private constructor() {
    this.isEnabled = process.env.NODE_ENV !== 'test';
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  /**
   * Log a telemetry event
   */
  async logEvent(event: Omit<TelemetryEvent, 'eventId' | 'timestamp'>): Promise<void> {
    if (!this.isEnabled) return;

    try {
      const telemetryEvent: TelemetryEvent = {
        eventId: this.generateEventId(),
        timestamp: new Date(),
        ...event
      };

      // Validate the event
      const validatedEvent = TelemetryEventSchema.parse(telemetryEvent);
      
      // Store the event
      this.events.push(validatedEvent);

      // Persist to storage (in production, this would go to a database)
      await this.persistEvent(validatedEvent);

      // Update aggregations
      this.updateAggregations(validatedEvent);

    } catch (error) {
      // Log error in production to monitoring service
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to log telemetry event:', error);
    }
    }
  }

  /**
   * Start timing for an operation
   */
  startTiming(operation: string): TelemetryTimer {
    return new TelemetryTimer(operation, this);
  }

  /**
   * Get telemetry events for analysis
   */
  getEvents(filters?: {
    operation?: string;
    provider?: string;
    startTime?: Date;
    endTime?: Date;
    success?: boolean;
  }): TelemetryEvent[] {
    let filteredEvents = this.events;

    if (filters?.operation) {
      filteredEvents = filteredEvents.filter(e => e.operation === filters.operation);
    }
    if (filters?.provider) {
      filteredEvents = filteredEvents.filter(e => e.provider === filters.provider);
    }
    if (filters?.startTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= filters.startTime!);
    }
    if (filters?.endTime) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= filters.endTime!);
    }
    if (filters?.success !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.performance.success === filters.success);
    }

    return filteredEvents;
  }

  /**
   * Get aggregated metrics
   */
  getAggregations(operation?: string): TelemetryAggregation[] {
    if (operation) {
      const aggregation = this.aggregations.get(operation);
      return aggregation ? [aggregation] : [];
    }
    return Array.from(this.aggregations.values());
  }

  /**
   * Analyze confidence thresholds
   */
  analyzeConfidenceThresholds(operation?: string): {
    current: number;
    recommended: number;
    distribution: Record<string, number>;
    analysis: string;
  } {
    const events = this.getEvents({ operation });
    const confidenceValues = events
      .map(e => e.outputs.confidence)
      .filter((c): c is number => c !== undefined);

    if (confidenceValues.length === 0) {
      return {
        current: 0.8,
        recommended: 0.8,
        distribution: {},
        analysis: 'No confidence data available'
      };
    }

    // Calculate distribution
    const distribution: Record<string, number> = {};
    const bucketSize = 0.1;
    for (let i = 0; i <= 1; i += bucketSize) {
      const bucket = `${i.toFixed(1)}-${(i + bucketSize).toFixed(1)}`;
      distribution[bucket] = confidenceValues.filter(
        c => c >= i && c < i + bucketSize
      ).length;
    }

    // Calculate recommended threshold
    const sortedConfidence = confidenceValues.sort((a, b) => a - b);
    const p75 = sortedConfidence[Math.floor(sortedConfidence.length * 0.75)];
    const recommended = Math.max(0.6, Math.min(0.9, p75));

    // Generate analysis
    const avgConfidence = confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length;
    const analysis = `Average confidence: ${avgConfidence.toFixed(3)}, 75th percentile: ${p75.toFixed(3)}`;

    return {
      current: 0.8, // Default current threshold
      recommended,
      distribution,
      analysis
    };
  }

  /**
   * Get performance insights
   */
  getPerformanceInsights(operation?: string): {
    successRate: number;
    averageDuration: number;
    errorPatterns: Record<string, number>;
    recommendations: string[];
  } {
    const events = this.getEvents({ operation });
    
    if (events.length === 0) {
      return {
        successRate: 0,
        averageDuration: 0,
        errorPatterns: {},
        recommendations: ['No data available for analysis']
      };
    }

    const successRate = events.filter(e => e.performance.success).length / events.length;
    const averageDuration = events.reduce((sum, e) => sum + e.timing.duration, 0) / events.length;

    // Analyze error patterns
    const errorPatterns: Record<string, number> = {};
    events
      .filter(e => !e.performance.success)
      .forEach(e => {
        const errorCode = e.performance.errorCode || 'unknown';
        errorPatterns[errorCode] = (errorPatterns[errorCode] || 0) + 1;
      });

    // Generate recommendations
    const recommendations: string[] = [];
    if (successRate < 0.95) {
      recommendations.push(`Success rate is ${(successRate * 100).toFixed(1)}% - investigate error patterns`);
    }
    if (averageDuration > 5000) {
      recommendations.push(`Average duration is ${averageDuration}ms - consider optimization`);
    }
    if (Object.keys(errorPatterns).length > 0) {
      const topError = Object.entries(errorPatterns).sort(([,a], [,b]) => b - a)[0];
      recommendations.push(`Most common error: ${topError[0]} (${topError[1]} occurrences)`);
    }

    return {
      successRate,
      averageDuration,
      errorPatterns,
      recommendations
    };
  }

  private generateEventId(): string {
    return `tel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async persistEvent(_event: TelemetryEvent): Promise<void> {
    // In production, persist to database
    // For now, we'll keep in memory with size limits
    if (this.events.length > 10000) {
      this.events = this.events.slice(-5000); // Keep last 5000 events
    }
  }

  private updateAggregations(event: TelemetryEvent): void {
    const key = event.operation;
    const existing = this.aggregations.get(key);

    if (!existing) {
      // Create new aggregation
      const aggregation: TelemetryAggregation = {
        period: 'day',
        operation: event.operation,
        metrics: {
          totalEvents: 1,
          successRate: event.performance.success ? 1 : 0,
          averageDuration: event.timing.duration,
          averageConfidence: event.outputs.confidence,
          averageQuality: event.outputs.quality,
          totalCost: event.cost?.actual || 0,
          errorRate: event.performance.success ? 0 : 1,
          retryRate: event.performance.retryCount > 0 ? 1 : 0,
          cacheHitRate: event.performance.cacheHit ? 1 : 0
        }
      };
      this.aggregations.set(key, aggregation);
    } else {
      // Update existing aggregation
      const totalEvents = existing.metrics.totalEvents + 1;
      const successCount = existing.metrics.successRate * existing.metrics.totalEvents + (event.performance.success ? 1 : 0);
      const durationSum = existing.metrics.averageDuration * existing.metrics.totalEvents + event.timing.duration;
      
      existing.metrics.totalEvents = totalEvents;
      existing.metrics.successRate = successCount / totalEvents;
      existing.metrics.averageDuration = durationSum / totalEvents;
      
      if (event.outputs.confidence !== undefined) {
        const confidenceSum = (existing.metrics.averageConfidence || 0) * (existing.metrics.totalEvents - 1) + event.outputs.confidence;
        existing.metrics.averageConfidence = confidenceSum / totalEvents;
      }
      
      if (event.outputs.quality !== undefined) {
        const qualitySum = (existing.metrics.averageQuality || 0) * (existing.metrics.totalEvents - 1) + event.outputs.quality;
        existing.metrics.averageQuality = qualitySum / totalEvents;
      }
    }
  }
}

/**
 * Telemetry Timer for measuring operation duration
 */
export class TelemetryTimer {
  private startTime: Date;
  private operation: string;
  private telemetryService: TelemetryService;
  private metadata: Record<string, any> = {};

  constructor(operation: string, telemetryService: TelemetryService) {
    this.operation = operation;
    this.telemetryService = telemetryService;
    this.startTime = new Date();
  }

  addMetadata(key: string, value: any): void {
    this.metadata[key] = value;
  }

  async end(
    result: any,
    options?: {
      confidence?: number;
      quality?: number;
      success?: boolean;
      errorCode?: string;
      errorMessage?: string;
      cost?: number;
      provider?: string;
      model?: string;
    }
  ): Promise<void> {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    await this.telemetryService.logEvent({
      operation: this.operation,
      provider: options?.provider,
      model: options?.model,
      inputs: {
        summary: `Operation: ${this.operation}`,
        parameters: this.metadata
      },
      outputs: {
        result,
        confidence: options?.confidence,
        quality: options?.quality
      },
      timing: {
        startTime: this.startTime,
        endTime,
        duration
      },
      performance: {
        success: options?.success ?? true,
        errorCode: options?.errorCode,
        errorMessage: options?.errorMessage
      },
      cost: options?.cost ? {
        actual: options.cost
      } : undefined,
      metadata: this.metadata
    });
  }
}

export const telemetryService = TelemetryService.getInstance();
