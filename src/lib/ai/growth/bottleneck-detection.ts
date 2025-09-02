/**
 * AI-Powered Bottleneck Detection for Growth Planning
 * Automated bottleneck identification and optimization recommendations
 */

import { z } from 'zod';

// Bottleneck Detection Request Schema
const BottleneckDetectionRequestSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  analysisScope: z.object({
    areas: z.array(z.enum(['operations', 'finance', 'technology', 'human_resources', 'marketing', 'sales', 'supply_chain', 'customer_service'])),
    timeframe: z.enum(['1_month', '3_months', '6_months', '1_year']),
    granularity: z.enum(['daily', 'weekly', 'monthly']),
    includeHistorical: z.boolean().default(true),
    includePredictive: z.boolean().default(true)
  }),
  systemData: z.object({
    processes: z.array(z.object({
      id: z.string(),
      name: z.string(),
      area: z.string(),
      inputs: z.array(z.object({
        resource: z.string(),
        quantity: z.number().finite(),
        unit: z.string()
      })),
      outputs: z.array(z.object({
        product: z.string(),
        quantity: z.number().finite(),
        unit: z.string()
      })),
      capacity: z.object({
        theoretical: z.number().finite(),
        practical: z.number().finite(),
        current: z.number().finite(),
        unit: z.string()
      }),
      performance: z.object({
        efficiency: z.number().finite().min(0).max(1),
        utilization: z.number().finite().min(0).max(1),
        throughput: z.number().finite(),
        errorRate: z.number().finite().min(0).max(1)
      }),
      dependencies: z.array(z.string()),
      constraints: z.array(z.object({
        type: z.enum(['resource', 'time', 'quality', 'regulatory', 'technical']),
        description: z.string(),
        impact: z.enum(['low', 'medium', 'high', 'critical'])
      }))
    })),
    resources: z.array(z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['human', 'equipment', 'financial', 'material', 'information']),
      availability: z.object({
        total: z.number().finite(),
        allocated: z.number().finite(),
        utilized: z.number().finite(),
        unit: z.string()
      }),
      cost: z.object({
        fixed: z.number().finite(),
        variable: z.number().finite(),
        unit: z.string()
      }),
      performance: z.object({
        reliability: z.number().finite().min(0).max(1),
        efficiency: z.number().finite().min(0).max(1),
        maintenance: z.number().finite().min(0).max(1)
      })
    })),
    metrics: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      value: z.number().finite(),
      target: z.number().finite(),
      trend: z.array(z.object({
        date: z.string(),
        value: z.number().finite()
      })),
      threshold: z.object({
        warning: z.number().finite(),
        critical: z.number().finite()
      })
    }))
  }),
  externalFactors: z.object({
    marketConditions: z.object({
      demand: z.number().finite().min(0).max(2), // 0 = low, 1 = normal, 2 = high
      competition: z.number().finite().min(0).max(2),
      seasonality: z.number().finite().min(-1).max(1), // -1 = low season, 1 = peak season
      economicCondition: z.enum(['recession', 'slow_growth', 'stable', 'growth', 'boom'])
    }),
    regulatory: z.array(z.object({
      regulation: z.string(),
      impact: z.enum(['positive', 'neutral', 'negative']),
      compliance: z.number().finite().min(0).max(1),
      deadline: z.string().optional()
    })),
    technology: z.array(z.object({
      technology: z.string(),
      adoptionLevel: z.number().finite().min(0).max(1),
      impact: z.enum(['disruptive', 'enhancing', 'neutral', 'declining']),
      timeToImpact: z.string()
    }))
  }),
  detectionSettings: z.object({
    sensitivityLevel: z.enum(['low', 'medium', 'high']).default('medium'),
    includeMinorBottlenecks: z.boolean().default(true),
    focusAreas: z.array(z.string()).optional(),
    thresholds: z.object({
      utilizationThreshold: z.number().finite().min(0).max(1).default(0.8),
      efficiencyThreshold: z.number().finite().min(0).max(1).default(0.7),
      performanceThreshold: z.number().finite().min(0).max(1).default(0.75)
    })
  })
});

export type BottleneckDetectionRequest = z.infer<typeof BottleneckDetectionRequestSchema>;

// Bottleneck Detection Result Schema
const BottleneckDetectionResultSchema = z.object({
  bottleneckAnalysis: z.object({
    identifiedBottlenecks: z.array(z.object({
      id: z.string(),
      name: z.string(),
      area: z.string(),
      type: z.enum(['capacity', 'resource', 'process', 'skill', 'technology', 'financial']),
      severity: z.enum(['minor', 'moderate', 'major', 'critical']),
      impact: z.object({
        throughputReduction: z.number().finite().min(0).max(1),
        costIncrease: z.number().finite(),
        timeDelay: z.number().finite(), // in hours
        qualityImpact: z.number().finite().min(0).max(1)
      }),
      causes: z.array(z.object({
        cause: z.string(),
        category: z.enum(['internal', 'external', 'systemic', 'temporary']),
        contribution: z.number().finite().min(0).max(1), // percentage contribution to bottleneck
        controllability: z.enum(['high', 'medium', 'low', 'none'])
      })),
      metrics: z.object({
        currentUtilization: z.number().finite().min(0).max(1),
        targetUtilization: z.number().finite().min(0).max(1),
        efficiency: z.number().finite().min(0).max(1),
        throughput: z.number().finite(),
        backlog: z.number().finite()
      }),
      dependencies: z.object({
        upstream: z.array(z.string()),
        downstream: z.array(z.string()),
        critical: z.array(z.string())
      })
    })),
    bottleneckMap: z.object({
      processFlow: z.array(z.object({
        process: z.string(),
        position: z.number().finite(),
        isBottleneck: z.boolean(),
        severity: z.enum(['none', 'minor', 'moderate', 'major', 'critical']),
        flowRate: z.number().finite()
      })),
      resourceAllocation: z.record(z.object({
        allocated: z.number().finite(),
        required: z.number().finite(),
        gap: z.number().finite(),
        priority: z.enum(['low', 'medium', 'high', 'critical'])
      })),
      capacityAnalysis: z.object({
        totalCapacity: z.number().finite(),
        utilizedCapacity: z.number().finite(),
        availableCapacity: z.number().finite(),
        constrainedCapacity: z.number().finite(),
        utilizationRate: z.number().finite().min(0).max(1)
      })
    }),
    impactAssessment: z.object({
      overallImpact: z.object({
        productivityLoss: z.number().finite().min(0).max(1),
        revenueImpact: z.number().finite(),
        costImpact: z.number().finite(),
        timeImpact: z.number().finite(), // hours
        customerImpact: z.number().finite().min(0).max(1)
      }),
      cascadingEffects: z.array(z.object({
        effect: z.string(),
        area: z.string(),
        magnitude: z.enum(['low', 'medium', 'high']),
        timeframe: z.string(),
        mitigation: z.string()
      })),
      riskFactors: z.array(z.object({
        risk: z.string(),
        probability: z.number().finite().min(0).max(1),
        impact: z.enum(['low', 'medium', 'high', 'critical']),
        timeframe: z.string()
      }))
    })
  }),
  optimizationOpportunities: z.object({
    quickWins: z.array(z.object({
      opportunity: z.string(),
      description: z.string(),
      implementation: z.string(),
      effort: z.enum(['low', 'medium', 'high']),
      impact: z.number().finite().min(0).max(1),
      timeframe: z.string(),
      cost: z.number().finite(),
      roi: z.number().finite()
    })),
    strategicImprovements: z.array(z.object({
      improvement: z.string(),
      description: z.string(),
      rationale: z.string(),
      requirements: z.array(z.string()),
      benefits: z.array(z.string()),
      timeline: z.string(),
      investment: z.number().finite(),
      expectedReturn: z.number().finite(),
      riskLevel: z.enum(['low', 'medium', 'high'])
    })),
    processOptimizations: z.array(z.object({
      process: z.string(),
      currentState: z.string(),
      optimizedState: z.string(),
      improvements: z.array(z.object({
        type: z.enum(['automation', 'reorganization', 'elimination', 'parallelization', 'resource_addition']),
        description: z.string(),
        impact: z.number().finite().min(0).max(1)
      })),
      metrics: z.object({
        throughputIncrease: z.number().finite().min(0).max(1),
        efficiencyGain: z.number().finite().min(0).max(1),
        costReduction: z.number().finite().min(0).max(1),
        timeReduction: z.number().finite().min(0).max(1)
      })
    }))
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      recommendation: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      targetBottleneck: z.string(),
      action: z.string(),
      timeline: z.string(),
      resources: z.array(z.string()),
      expectedOutcome: z.string()
    })),
    shortTerm: z.array(z.object({
      recommendation: z.string(),
      description: z.string(),
      benefits: z.array(z.string()),
      implementation: z.object({
        steps: z.array(z.string()),
        timeline: z.string(),
        dependencies: z.array(z.string()),
        risks: z.array(z.string())
      }),
      successMetrics: z.array(z.string())
    })),
    longTerm: z.array(z.object({
      recommendation: z.string(),
      strategicValue: z.string(),
      transformationalImpact: z.string(),
      investment: z.object({
        financial: z.number().finite(),
        time: z.string(),
        resources: z.array(z.string())
      }),
      outcomes: z.object({
        quantitative: z.array(z.string()),
        qualitative: z.array(z.string())
      }),
      milestones: z.array(z.object({
        milestone: z.string(),
        timeline: z.string(),
        success: z.string()
      }))
    }))
  }),
  monitoringPlan: z.object({
    keyMetrics: z.array(z.object({
      metric: z.string(),
      currentValue: z.number().finite(),
      targetValue: z.number().finite(),
      monitoringFrequency: z.enum(['real_time', 'hourly', 'daily', 'weekly', 'monthly']),
      alertThresholds: z.object({
        warning: z.number().finite(),
        critical: z.number().finite()
      })
    })),
    alertSystem: z.object({
      triggers: z.array(z.object({
        condition: z.string(),
        severity: z.enum(['info', 'warning', 'critical']),
        action: z.string(),
        stakeholders: z.array(z.string())
      })),
      escalationProcedure: z.array(z.object({
        level: z.number().finite(),
        timeframe: z.string(),
        stakeholder: z.string(),
        action: z.string()
      }))
    }),
    reviewSchedule: z.object({
      frequency: z.enum(['weekly', 'bi_weekly', 'monthly', 'quarterly']),
      participants: z.array(z.string()),
      agenda: z.array(z.string()),
      outcomes: z.array(z.string())
    })
  })
});

export type BottleneckDetectionResult = z.infer<typeof BottleneckDetectionResultSchema>;

export class BottleneckDetectionSystem {
  private analysisEngine: Map<string, any>;
  private optimizationEngine: Map<string, any>;
  private predictionEngine: Map<string, any>;

  constructor() {
    this.analysisEngine = new Map();
    this.optimizationEngine = new Map();
    this.predictionEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Detect bottlenecks and generate optimization recommendations
   */
  async detectBottlenecks(request: BottleneckDetectionRequest): Promise<BottleneckDetectionResult> {
    try {
      const validatedRequest = BottleneckDetectionRequestSchema.parse(request);
      
      // Analyze bottlenecks
      const bottleneckAnalysis = this.analyzeBottlenecks(validatedRequest);
      
      // Identify optimization opportunities
      const optimizationOpportunities = this.identifyOptimizationOpportunities(validatedRequest, bottleneckAnalysis);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, bottleneckAnalysis, optimizationOpportunities);
      
      // Create monitoring plan
      const monitoringPlan = this.createMonitoringPlan(validatedRequest, bottleneckAnalysis);
      
      const result: BottleneckDetectionResult = {
        bottleneckAnalysis,
        optimizationOpportunities,
        recommendations,
        monitoringPlan
      };

      return BottleneckDetectionResultSchema.parse(result);
    } catch (error) {
      console.error('Error detecting bottlenecks:', error);
      return this.getFallbackDetectionResult(request);
    }
  }

  /**
   * Analyze bottlenecks in the system
   */
  private analyzeBottlenecks(request: BottleneckDetectionRequest): any {
    const identifiedBottlenecks = this.identifyBottlenecks(request);
    const bottleneckMap = this.createBottleneckMap(request, identifiedBottlenecks);
    const impactAssessment = this.assessBottleneckImpact(request, identifiedBottlenecks);

    return {
      identifiedBottlenecks,
      bottleneckMap,
      impactAssessment
    };
  }

  /**
   * Identify bottlenecks in processes and resources
   */
  private identifyBottlenecks(request: BottleneckDetectionRequest): any[] {
    const bottlenecks = [];
    const { processes, resources, metrics } = request.systemData;
    const thresholds = request.detectionSettings.thresholds;

    // Analyze process bottlenecks
    for (const process of processes) {
      const bottleneck = this.analyzeProcessBottleneck(process, thresholds, request);
      if (bottleneck) {
        bottlenecks.push(bottleneck);
      }
    }

    // Analyze resource bottlenecks
    for (const resource of resources) {
      const bottleneck = this.analyzeResourceBottleneck(resource, thresholds, request);
      if (bottleneck) {
        bottlenecks.push(bottleneck);
      }
    }

    // Analyze metric-based bottlenecks
    for (const metric of metrics) {
      const bottleneck = this.analyzeMetricBottleneck(metric, thresholds, request);
      if (bottleneck) {
        bottlenecks.push(bottleneck);
      }
    }

    return bottlenecks.sort((a, b) => this.getSeverityScore(b.severity) - this.getSeverityScore(a.severity));
  }

  /**
   * Analyze process bottleneck
   */
  private analyzeProcessBottleneck(process: any, thresholds: any, request: BottleneckDetectionRequest): any | null {
    const { performance, capacity, constraints } = process;
    
    // Check if process meets bottleneck criteria
    const isBottleneck = 
      performance.utilization > thresholds.utilizationThreshold ||
      performance.efficiency < thresholds.efficiencyThreshold ||
      capacity.current / capacity.practical > thresholds.utilizationThreshold;

    if (!isBottleneck && !request.detectionSettings.includeMinorBottlenecks) {
      return null;
    }

    const severity = this.calculateSeverity(performance, capacity, constraints);
    const impact = this.calculateProcessImpact(process, request);
    const causes = this.identifyProcessCauses(process, request);

    return {
      id: `process_${process.id}`,
      name: process.name,
      area: process.area,
      type: 'process' as const,
      severity,
      impact,
      causes,
      metrics: {
        currentUtilization: performance.utilization,
        targetUtilization: thresholds.utilizationThreshold,
        efficiency: performance.efficiency,
        throughput: performance.throughput,
        backlog: this.calculateBacklog(process)
      },
      dependencies: {
        upstream: this.findUpstreamDependencies(process, request.systemData.processes),
        downstream: this.findDownstreamDependencies(process, request.systemData.processes),
        critical: this.findCriticalDependencies(process, request.systemData.processes)
      }
    };
  }

  /**
   * Analyze resource bottleneck
   */
  private analyzeResourceBottleneck(resource: any, thresholds: any, request: BottleneckDetectionRequest): any | null {
    const { availability, performance } = resource;
    
    const utilizationRate = availability.utilized / availability.total;
    const isBottleneck = 
      utilizationRate > thresholds.utilizationThreshold ||
      performance.efficiency < thresholds.efficiencyThreshold ||
      performance.reliability < thresholds.performanceThreshold;

    if (!isBottleneck && !request.detectionSettings.includeMinorBottlenecks) {
      return null;
    }

    const severity = this.calculateResourceSeverity(resource, thresholds);
    const impact = this.calculateResourceImpact(resource, request);
    const causes = this.identifyResourceCauses(resource, request);

    return {
      id: `resource_${resource.id}`,
      name: resource.name,
      area: resource.type,
      type: 'resource' as const,
      severity,
      impact,
      causes,
      metrics: {
        currentUtilization: utilizationRate,
        targetUtilization: thresholds.utilizationThreshold,
        efficiency: performance.efficiency,
        throughput: availability.utilized,
        backlog: Math.max(0, availability.allocated - availability.total)
      },
      dependencies: {
        upstream: this.findResourceUpstream(resource, request),
        downstream: this.findResourceDownstream(resource, request),
        critical: this.findResourceCritical(resource, request)
      }
    };
  }

  /**
   * Analyze metric-based bottleneck
   */
  private analyzeMetricBottleneck(metric: any, thresholds: any, request: BottleneckDetectionRequest): any | null {
    const currentValue = metric.value;
    const targetValue = metric.target;
    const warningThreshold = metric.threshold.warning;
    const criticalThreshold = metric.threshold.critical;

    const isBottleneck = 
      currentValue < criticalThreshold ||
      (currentValue < warningThreshold && Math.abs(currentValue - targetValue) / targetValue > 0.2);

    if (!isBottleneck && !request.detectionSettings.includeMinorBottlenecks) {
      return null;
    }

    const severity = this.calculateMetricSeverity(metric);
    const impact = this.calculateMetricImpact(metric, request);
    const causes = this.identifyMetricCauses(metric, request);

    return {
      id: `metric_${metric.id}`,
      name: metric.name,
      area: metric.category,
      type: 'process' as const,
      severity,
      impact,
      causes,
      metrics: {
        currentUtilization: currentValue / targetValue,
        targetUtilization: 1.0,
        efficiency: Math.min(1, currentValue / targetValue),
        throughput: currentValue,
        backlog: Math.max(0, targetValue - currentValue)
      },
      dependencies: {
        upstream: [],
        downstream: [],
        critical: []
      }
    };
  }

  /**
   * Create bottleneck map
   */
  private createBottleneckMap(request: BottleneckDetectionRequest, bottlenecks: any[]): any {
    const processFlow = this.createProcessFlow(request, bottlenecks);
    const resourceAllocation = this.createResourceAllocation(request, bottlenecks);
    const capacityAnalysis = this.createCapacityAnalysis(request, bottlenecks);

    return {
      processFlow,
      resourceAllocation,
      capacityAnalysis
    };
  }

  /**
   * Assess bottleneck impact
   */
  private assessBottleneckImpact(request: BottleneckDetectionRequest, bottlenecks: any[]): any {
    const overallImpact = this.calculateOverallImpact(bottlenecks, request);
    const cascadingEffects = this.identifyCascadingEffects(bottlenecks, request);
    const riskFactors = this.identifyRiskFactors(bottlenecks, request);

    return {
      overallImpact,
      cascadingEffects,
      riskFactors
    };
  }

  /**
   * Identify optimization opportunities
   */
  private identifyOptimizationOpportunities(request: BottleneckDetectionRequest, bottleneckAnalysis: any): any {
    const quickWins = this.identifyQuickWins(bottleneckAnalysis, request);
    const strategicImprovements = this.identifyStrategicImprovements(bottleneckAnalysis, request);
    const processOptimizations = this.identifyProcessOptimizations(bottleneckAnalysis, request);

    return {
      quickWins,
      strategicImprovements,
      processOptimizations
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: BottleneckDetectionRequest, bottleneckAnalysis: any, optimizationOpportunities: any): any {
    const immediate = this.generateImmediateRecommendations(bottleneckAnalysis, optimizationOpportunities);
    const shortTerm = this.generateShortTermRecommendations(bottleneckAnalysis, optimizationOpportunities);
    const longTerm = this.generateLongTermRecommendations(bottleneckAnalysis, optimizationOpportunities);

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Create monitoring plan
   */
  private createMonitoringPlan(request: BottleneckDetectionRequest, bottleneckAnalysis: any): any {
    const keyMetrics = this.defineKeyMetrics(bottleneckAnalysis);
    const alertSystem = this.createAlertSystem(bottleneckAnalysis);
    const reviewSchedule = this.createReviewSchedule(request);

    return {
      keyMetrics,
      alertSystem,
      reviewSchedule
    };
  }

  // Helper methods
  private calculateSeverity(performance: any, capacity: any, constraints: any): 'minor' | 'moderate' | 'major' | 'critical' {
    let severityScore = 0;

    // Performance factors
    if (performance.utilization > 0.95) severityScore += 3;
    else if (performance.utilization > 0.85) severityScore += 2;
    else if (performance.utilization > 0.75) severityScore += 1;

    if (performance.efficiency < 0.5) severityScore += 3;
    else if (performance.efficiency < 0.7) severityScore += 2;
    else if (performance.efficiency < 0.8) severityScore += 1;

    // Capacity factors
    const capacityUtilization = capacity.current / capacity.practical;
    if (capacityUtilization > 0.95) severityScore += 2;
    else if (capacityUtilization > 0.85) severityScore += 1;

    // Constraints factors
    const criticalConstraints = constraints.filter(c => c.impact === 'critical').length;
    severityScore += criticalConstraints;

    if (severityScore >= 6) return 'critical';
    if (severityScore >= 4) return 'major';
    if (severityScore >= 2) return 'moderate';
    return 'minor';
  }

  private calculateProcessImpact(process: any, request: BottleneckDetectionRequest): any {
    const throughputReduction = 1 - process.performance.efficiency;
    const costIncrease = this.estimateCostIncrease(process);
    const timeDelay = this.estimateTimeDelay(process);
    const qualityImpact = process.performance.errorRate;

    return {
      throughputReduction,
      costIncrease,
      timeDelay,
      qualityImpact
    };
  }

  private identifyProcessCauses(process: any, request: BottleneckDetectionRequest): any[] {
    const causes = [];

    // Low efficiency causes
    if (process.performance.efficiency < 0.7) {
      causes.push({
        cause: 'Low process efficiency',
        category: 'internal' as const,
        contribution: 1 - process.performance.efficiency,
        controllability: 'high' as const
      });
    }

    // High utilization causes
    if (process.performance.utilization > 0.9) {
      causes.push({
        cause: 'High capacity utilization',
        category: 'internal' as const,
        contribution: process.performance.utilization - 0.8,
        controllability: 'medium' as const
      });
    }

    // Constraint-based causes
    for (const constraint of process.constraints) {
      if (constraint.impact === 'high' || constraint.impact === 'critical') {
        causes.push({
          cause: constraint.description,
          category: constraint.type === 'regulatory' ? 'external' : 'internal',
          contribution: constraint.impact === 'critical' ? 0.8 : 0.5,
          controllability: constraint.type === 'regulatory' ? 'low' : 'medium'
        });
      }
    }

    return causes;
  }

  private calculateResourceSeverity(resource: any, thresholds: any): 'minor' | 'moderate' | 'major' | 'critical' {
    const utilizationRate = resource.availability.utilized / resource.availability.total;
    let severityScore = 0;

    if (utilizationRate > 0.95) severityScore += 3;
    else if (utilizationRate > 0.85) severityScore += 2;
    else if (utilizationRate > 0.75) severityScore += 1;

    if (resource.performance.efficiency < 0.5) severityScore += 2;
    else if (resource.performance.efficiency < 0.7) severityScore += 1;

    if (resource.performance.reliability < 0.7) severityScore += 2;
    else if (resource.performance.reliability < 0.85) severityScore += 1;

    if (severityScore >= 5) return 'critical';
    if (severityScore >= 3) return 'major';
    if (severityScore >= 2) return 'moderate';
    return 'minor';
  }

  private calculateResourceImpact(resource: any, request: BottleneckDetectionRequest): any {
    const utilizationRate = resource.availability.utilized / resource.availability.total;
    
    return {
      throughputReduction: Math.max(0, utilizationRate - 0.8),
      costIncrease: this.estimateResourceCostIncrease(resource),
      timeDelay: this.estimateResourceTimeDelay(resource),
      qualityImpact: 1 - resource.performance.reliability
    };
  }

  private identifyResourceCauses(resource: any, request: BottleneckDetectionRequest): any[] {
    const causes = [];
    const utilizationRate = resource.availability.utilized / resource.availability.total;

    if (utilizationRate > 0.9) {
      causes.push({
        cause: 'High resource utilization',
        category: 'internal' as const,
        contribution: utilizationRate - 0.8,
        controllability: 'high' as const
      });
    }

    if (resource.performance.efficiency < 0.7) {
      causes.push({
        cause: 'Low resource efficiency',
        category: 'internal' as const,
        contribution: 1 - resource.performance.efficiency,
        controllability: 'medium' as const
      });
    }

    if (resource.performance.reliability < 0.8) {
      causes.push({
        cause: 'Resource reliability issues',
        category: 'systemic' as const,
        contribution: 1 - resource.performance.reliability,
        controllability: 'medium' as const
      });
    }

    return causes;
  }

  private calculateMetricSeverity(metric: any): 'minor' | 'moderate' | 'major' | 'critical' {
    const currentValue = metric.value;
    const targetValue = metric.target;
    const criticalThreshold = metric.threshold.critical;
    const warningThreshold = metric.threshold.warning;

    if (currentValue <= criticalThreshold) return 'critical';
    if (currentValue <= warningThreshold) return 'major';
    if (currentValue < targetValue * 0.8) return 'moderate';
    return 'minor';
  }

  private calculateMetricImpact(metric: any, request: BottleneckDetectionRequest): any {
    const performanceGap = Math.max(0, (metric.target - metric.value) / metric.target);
    
    return {
      throughputReduction: performanceGap,
      costIncrease: performanceGap * 10000, // Simplified cost estimation
      timeDelay: performanceGap * 8, // Hours
      qualityImpact: performanceGap
    };
  }

  private identifyMetricCauses(metric: any, request: BottleneckDetectionRequest): any[] {
    const causes = [];
    const performanceGap = (metric.target - metric.value) / metric.target;

    if (performanceGap > 0.2) {
      causes.push({
        cause: `${metric.name} performance below target`,
        category: 'internal' as const,
        contribution: performanceGap,
        controllability: 'medium' as const
      });
    }

    // Analyze trend
    if (metric.trend.length >= 2) {
      const recentTrend = metric.trend.slice(-3);
      const isDecreasing = recentTrend.every((point, i) => 
        i === 0 || point.value < recentTrend[i - 1].value
      );
      
      if (isDecreasing) {
        causes.push({
          cause: 'Declining performance trend',
          category: 'systemic' as const,
          contribution: 0.3,
          controllability: 'medium' as const
        });
      }
    }

    return causes;
  }

  private getSeverityScore(severity: string): number {
    const scores = { minor: 1, moderate: 2, major: 3, critical: 4 };
    return scores[severity] || 0;
  }

  private calculateBacklog(process: any): number {
    // Simplified backlog calculation
    const demand = process.capacity.theoretical;
    const capacity = process.capacity.current;
    return Math.max(0, demand - capacity);
  }

  private findUpstreamDependencies(process: any, allProcesses: any[]): string[] {
    return process.dependencies || [];
  }

  private findDownstreamDependencies(process: any, allProcesses: any[]): string[] {
    return allProcesses
      .filter(p => p.dependencies && p.dependencies.includes(process.id))
      .map(p => p.id);
  }

  private findCriticalDependencies(process: any, allProcesses: any[]): string[] {
    const upstream = this.findUpstreamDependencies(process, allProcesses);
    const downstream = this.findDownstreamDependencies(process, allProcesses);
    
    // Critical dependencies are those with high utilization
    return [...upstream, ...downstream].filter(depId => {
      const dep = allProcesses.find(p => p.id === depId);
      return dep && dep.performance.utilization > 0.85;
    });
  }

  private findResourceUpstream(resource: any, request: BottleneckDetectionRequest): string[] {
    // Find processes that depend on this resource
    return request.systemData.processes
      .filter(p => this.processUsesResource(p, resource.id))
      .map(p => p.id);
  }

  private findResourceDownstream(resource: any, request: BottleneckDetectionRequest): string[] {
    // Find resources that depend on this resource's output
    return [];
  }

  private findResourceCritical(resource: any, request: BottleneckDetectionRequest): string[] {
    // Find critical processes that use this resource
    return request.systemData.processes
      .filter(p => this.processUsesResource(p, resource.id) && p.performance.utilization > 0.9)
      .map(p => p.id);
  }

  private processUsesResource(process: any, resourceId: string): boolean {
    // Check if process uses the resource (simplified)
    return process.inputs.some(input => input.resource === resourceId);
  }

  private estimateCostIncrease(process: any): number {
    // Simplified cost increase estimation
    const inefficiency = 1 - process.performance.efficiency;
    return inefficiency * 5000; // $5000 per 100% inefficiency
  }

  private estimateTimeDelay(process: any): number {
    // Simplified time delay estimation
    const utilizationDelay = Math.max(0, process.performance.utilization - 0.8) * 8; // 8 hours max
    const efficiencyDelay = (1 - process.performance.efficiency) * 4; // 4 hours max
    return utilizationDelay + efficiencyDelay;
  }

  private estimateResourceCostIncrease(resource: any): number {
    const utilizationRate = resource.availability.utilized / resource.availability.total;
    const overUtilization = Math.max(0, utilizationRate - 0.8);
    return overUtilization * resource.cost.variable * 1.5; // 50% premium for over-utilization
  }

  private estimateResourceTimeDelay(resource: any): number {
    const utilizationRate = resource.availability.utilized / resource.availability.total;
    const reliabilityFactor = 1 - resource.performance.reliability;
    return (utilizationRate - 0.8) * 6 + reliabilityFactor * 4; // Hours
  }

  private createProcessFlow(request: BottleneckDetectionRequest, bottlenecks: any[]): any[] {
    return request.systemData.processes.map((process, index) => {
      const bottleneck = bottlenecks.find(b => b.id === `process_${process.id}`);
      
      return {
        process: process.name,
        position: index + 1,
        isBottleneck: !!bottleneck,
        severity: bottleneck ? bottleneck.severity : 'none',
        flowRate: process.performance.throughput
      };
    });
  }

  private createResourceAllocation(request: BottleneckDetectionRequest, bottlenecks: any[]): any {
    const allocation = {};
    
    for (const resource of request.systemData.resources) {
      const bottleneck = bottlenecks.find(b => b.id === `resource_${resource.id}`);
      const allocated = resource.availability.allocated;
      const required = resource.availability.utilized;
      const gap = Math.max(0, required - allocated);
      
      allocation[resource.name] = {
        allocated,
        required,
        gap,
        priority: bottleneck ? 
          (bottleneck.severity === 'critical' ? 'critical' : 
           bottleneck.severity === 'major' ? 'high' : 'medium') : 'low'
      };
    }
    
    return allocation;
  }

  private createCapacityAnalysis(request: BottleneckDetectionRequest, bottlenecks: any[]): any {
    const processes = request.systemData.processes;
    
    const totalCapacity = processes.reduce((sum, p) => sum + p.capacity.theoretical, 0);
    const utilizedCapacity = processes.reduce((sum, p) => sum + p.capacity.current, 0);
    const availableCapacity = totalCapacity - utilizedCapacity;
    const constrainedCapacity = processes
      .filter(p => bottlenecks.some(b => b.id === `process_${p.id}`))
      .reduce((sum, p) => sum + p.capacity.current, 0);
    const utilizationRate = utilizedCapacity / totalCapacity;

    return {
      totalCapacity,
      utilizedCapacity,
      availableCapacity,
      constrainedCapacity,
      utilizationRate
    };
  }

  private calculateOverallImpact(bottlenecks: any[], request: BottleneckDetectionRequest): any {
    const productivityLoss = bottlenecks.reduce((sum, b) => sum + b.impact.throughputReduction, 0) / bottlenecks.length;
    const revenueImpact = bottlenecks.reduce((sum, b) => sum + b.impact.costIncrease, 0);
    const costImpact = revenueImpact * 0.3; // Simplified cost calculation
    const timeImpact = bottlenecks.reduce((sum, b) => sum + b.impact.timeDelay, 0);
    const customerImpact = bottlenecks.reduce((sum, b) => sum + b.impact.qualityImpact, 0) / bottlenecks.length;

    return {
      productivityLoss,
      revenueImpact,
      costImpact,
      timeImpact,
      customerImpact
    };
  }

  private identifyCascadingEffects(bottlenecks: any[], request: BottleneckDetectionRequest): any[] {
    const effects = [];
    
    const criticalBottlenecks = bottlenecks.filter(b => b.severity === 'critical');
    if (criticalBottlenecks.length > 0) {
      effects.push({
        effect: 'System-wide performance degradation',
        area: 'Operations',
        magnitude: 'high' as const,
        timeframe: '1-2 weeks',
        mitigation: 'Address critical bottlenecks immediately'
      });
    }
    
    const resourceBottlenecks = bottlenecks.filter(b => b.type === 'resource');
    if (resourceBottlenecks.length > 2) {
      effects.push({
        effect: 'Resource constraint propagation',
        area: 'Resource Management',
        magnitude: 'medium' as const,
        timeframe: '2-4 weeks',
        mitigation: 'Implement resource optimization strategies'
      });
    }
    
    return effects;
  }

  private identifyRiskFactors(bottlenecks: any[], request: BottleneckDetectionRequest): any[] {
    const risks = [];
    
    const marketDemand = request.externalFactors.marketConditions.demand;
    if (marketDemand > 1.5 && bottlenecks.length > 0) {
      risks.push({
        risk: 'Inability to meet increased market demand',
        probability: 0.8,
        impact: 'high' as const,
        timeframe: '1-3 months'
      });
    }
    
    const criticalBottlenecks = bottlenecks.filter(b => b.severity === 'critical').length;
    if (criticalBottlenecks > 1) {
      risks.push({
        risk: 'System failure due to multiple critical bottlenecks',
        probability: 0.6,
        impact: 'critical' as const,
        timeframe: '2-6 weeks'
      });
    }
    
    return risks;
  }

  private identifyQuickWins(bottleneckAnalysis: any, request: BottleneckDetectionRequest): any[] {
    const quickWins = [];
    
    const minorBottlenecks = bottleneckAnalysis.identifiedBottlenecks.filter(b => b.severity === 'minor');
    for (const bottleneck of minorBottlenecks.slice(0, 3)) {
      quickWins.push({
        opportunity: `Optimize ${bottleneck.name}`,
        description: `Address minor inefficiencies in ${bottleneck.name}`,
        implementation: 'Process optimization and resource reallocation',
        effort: 'low' as const,
        impact: 0.3,
        timeframe: '1-2 weeks',
        cost: 5000,
        roi: 2.5
      });
    }
    
    return quickWins;
  }

  private identifyStrategicImprovements(bottleneckAnalysis: any, request: BottleneckDetectionRequest): any[] {
    const improvements = [];
    
    const majorBottlenecks = bottleneckAnalysis.identifiedBottlenecks.filter(b => b.severity === 'major' || b.severity === 'critical');
    for (const bottleneck of majorBottlenecks.slice(0, 2)) {
      improvements.push({
        improvement: `Strategic overhaul of ${bottleneck.name}`,
        description: `Comprehensive redesign and optimization of ${bottleneck.name}`,
        rationale: `${bottleneck.name} is a ${bottleneck.severity} bottleneck significantly impacting performance`,
        requirements: ['Investment in new technology', 'Process redesign', 'Staff training'],
        benefits: ['Significant throughput increase', 'Cost reduction', 'Quality improvement'],
        timeline: '3-6 months',
        investment: 50000,
        expectedReturn: 150000,
        riskLevel: 'medium' as const
      });
    }
    
    return improvements;
  }

  private identifyProcessOptimizations(bottleneckAnalysis: any, request: BottleneckDetectionRequest): any[] {
    const optimizations = [];
    
    for (const bottleneck of bottleneckAnalysis.identifiedBottlenecks.slice(0, 3)) {
      if (bottleneck.type === 'process') {
        optimizations.push({
          process: bottleneck.name,
          currentState: `${bottleneck.severity} bottleneck with ${(bottleneck.metrics.currentUtilization * 100).toFixed(1)}% utilization`,
          optimizedState: 'Optimized process with improved efficiency and reduced constraints',
          improvements: [
            {
              type: 'automation' as const,
              description: 'Implement automation to reduce manual tasks',
              impact: 0.4
            },
            {
              type: 'reorganization' as const,
              description: 'Reorganize workflow for better efficiency',
              impact: 0.3
            }
          ],
          metrics: {
            throughputIncrease: 0.3,
            efficiencyGain: 0.25,
            costReduction: 0.2,
            timeReduction: 0.35
          }
        });
      }
    }
    
    return optimizations;
  }

  private generateImmediateRecommendations(bottleneckAnalysis: any, optimizationOpportunities: any): any[] {
    const recommendations = [];
    
    const criticalBottlenecks = bottleneckAnalysis.identifiedBottlenecks.filter(b => b.severity === 'critical');
    for (const bottleneck of criticalBottlenecks) {
      recommendations.push({
        recommendation: `Address critical bottleneck: ${bottleneck.name}`,
        priority: 'critical' as const,
        targetBottleneck: bottleneck.id,
        action: 'Implement emergency measures to reduce utilization and improve efficiency',
        timeline: '24-48 hours',
        resources: ['Operations team', 'Management support', 'Emergency budget'],
        expectedOutcome: 'Immediate reduction in bottleneck severity'
      });
    }
    
    return recommendations;
  }

  private generateShortTermRecommendations(bottleneckAnalysis: any, optimizationOpportunities: any): any[] {
    const recommendations = [];
    
    for (const quickWin of optimizationOpportunities.quickWins.slice(0, 2)) {
      recommendations.push({
        recommendation: quickWin.opportunity,
        description: quickWin.description,
        benefits: [`ROI of ${quickWin.roi}x`, 'Quick implementation', 'Low risk'],
        implementation: {
          steps: [
            'Analyze current process',
            'Identify optimization opportunities',
            'Implement changes',
            'Monitor results'
          ],
          timeline: quickWin.timeframe,
          dependencies: ['Team availability', 'Management approval'],
          risks: ['Minimal operational disruption']
        },
        successMetrics: ['Efficiency improvement', 'Cost reduction', 'Throughput increase']
      });
    }
    
    return recommendations;
  }

  private generateLongTermRecommendations(bottleneckAnalysis: any, optimizationOpportunities: any): any[] {
    const recommendations = [];
    
    for (const improvement of optimizationOpportunities.strategicImprovements.slice(0, 1)) {
      recommendations.push({
        recommendation: improvement.improvement,
        strategicValue: 'Fundamental operational improvement with long-term competitive advantage',
        transformationalImpact: 'Complete elimination of major bottleneck and system optimization',
        investment: {
          financial: improvement.investment,
          time: improvement.timeline,
          resources: improvement.requirements
        },
        outcomes: {
          quantitative: [`ROI of ${(improvement.expectedReturn / improvement.investment).toFixed(1)}x`, 'Throughput increase', 'Cost reduction'],
          qualitative: ['Operational excellence', 'Competitive advantage', 'Scalability improvement']
        },
        milestones: [
          {
            milestone: 'Project initiation and planning',
            timeline: '2 weeks',
            success: 'Project plan approved and team assembled'
          },
          {
            milestone: 'Implementation phase 1',
            timeline: '6 weeks',
            success: 'Core improvements implemented'
          },
          {
            milestone: 'Full implementation and optimization',
            timeline: improvement.timeline,
            success: 'All improvements deployed and optimized'
          }
        ]
      });
    }
    
    return recommendations;
  }

  private defineKeyMetrics(bottleneckAnalysis: any): any[] {
    const metrics = [];
    
    for (const bottleneck of bottleneckAnalysis.identifiedBottlenecks.slice(0, 5)) {
      metrics.push({
        metric: `${bottleneck.name} Utilization`,
        currentValue: bottleneck.metrics.currentUtilization,
        targetValue: bottleneck.metrics.targetUtilization,
        monitoringFrequency: bottleneck.severity === 'critical' ? 'hourly' : 'daily',
        alertThresholds: {
          warning: bottleneck.metrics.targetUtilization * 0.9,
          critical: bottleneck.metrics.targetUtilization * 0.95
        }
      });
    }
    
    return metrics;
  }

  private createAlertSystem(bottleneckAnalysis: any): any {
    const triggers = [
      {
        condition: 'Critical bottleneck utilization > 95%',
        severity: 'critical' as const,
        action: 'Immediate intervention required',
        stakeholders: ['Operations Manager', 'CTO', 'CEO']
      },
      {
        condition: 'Major bottleneck efficiency < 60%',
        severity: 'warning' as const,
        action: 'Investigate and optimize',
        stakeholders: ['Operations Team', 'Process Manager']
      }
    ];
    
    const escalationProcedure = [
      {
        level: 1,
        timeframe: '15 minutes',
        stakeholder: 'Operations Team',
        action: 'Immediate assessment and response'
      },
      {
        level: 2,
        timeframe: '1 hour',
        stakeholder: 'Operations Manager',
        action: 'Management intervention and resource allocation'
      },
      {
        level: 3,
        timeframe: '4 hours',
        stakeholder: 'Executive Team',
        action: 'Strategic decision and emergency measures'
      }
    ];
    
    return {
      triggers,
      escalationProcedure
    };
  }

  private createReviewSchedule(request: BottleneckDetectionRequest): any {
    return {
      frequency: 'weekly' as const,
      participants: ['Operations Manager', 'Process Owners', 'Analysts'],
      agenda: [
        'Bottleneck status review',
        'Optimization progress update',
        'New bottleneck identification',
        'Action plan adjustments'
      ],
      outcomes: [
        'Updated bottleneck status',
        'Revised optimization priorities',
        'Resource allocation decisions',
        'Next week action items'
      ]
    };
  }

  /**
   * Get fallback detection result
   */
  private getFallbackDetectionResult(request: BottleneckDetectionRequest): BottleneckDetectionResult {
    return {
      bottleneckAnalysis: {
        identifiedBottlenecks: [],
        bottleneckMap: {
          processFlow: [],
          resourceAllocation: {},
          capacityAnalysis: {
            totalCapacity: 0,
            utilizedCapacity: 0,
            availableCapacity: 0,
            constrainedCapacity: 0,
            utilizationRate: 0
          }
        },
        impactAssessment: {
          overallImpact: {
            productivityLoss: 0,
            revenueImpact: 0,
            costImpact: 0,
            timeImpact: 0,
            customerImpact: 0
          },
          cascadingEffects: [],
          riskFactors: []
        }
      },
      optimizationOpportunities: {
        quickWins: [],
        strategicImprovements: [],
        processOptimizations: []
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: []
      },
      monitoringPlan: {
        keyMetrics: [],
        alertSystem: {
          triggers: [],
          escalationProcedure: []
        },
        reviewSchedule: {
          frequency: 'weekly',
          participants: [],
          agenda: [],
          outcomes: []
        }
      }
    };
  }

  /**
   * Initialize engines
   */
  private initializeEngines(): void {
    // Initialize bottleneck detection engines
    this.analysisEngine.set('process', this.analyzeProcessBottleneck.bind(this));
    this.analysisEngine.set('resource', this.analyzeResourceBottleneck.bind(this));
    this.analysisEngine.set('metric', this.analyzeMetricBottleneck.bind(this));
    
    this.optimizationEngine.set('quickwins', this.identifyQuickWins.bind(this));
    this.optimizationEngine.set('strategic', this.identifyStrategicImprovements.bind(this));
    this.optimizationEngine.set('process', this.identifyProcessOptimizations.bind(this));
    
    this.predictionEngine.set('impact', this.assessBottleneckImpact.bind(this));
    this.predictionEngine.set('cascading', this.identifyCascadingEffects.bind(this));
  }
}
