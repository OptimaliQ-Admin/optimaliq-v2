/**
 * Optimal Resource Allocation Recommendations for Growth Planning
 * AI-powered resource optimization, capacity planning, and allocation strategies
 */

import { z } from 'zod';

// Resource Allocation Request Schema
const ResourceAllocationRequestSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  allocationScope: z.object({
    resourceTypes: z.array(z.enum(['financial', 'human', 'technological', 'physical', 'time', 'intellectual'])),
    allocationPeriod: z.enum(['quarterly', 'annual', 'multi_year', 'project_based']),
    optimizationGoals: z.array(z.enum(['efficiency', 'growth', 'risk_mitigation', 'innovation', 'sustainability', 'flexibility'])),
    constraints: z.array(z.enum(['budget', 'headcount', 'timeline', 'skills', 'compliance', 'capacity']))
  }),
  availableResources: z.object({
    financial: z.object({
      totalBudget: z.number().finite(),
      allocatedBudget: z.number().finite(),
      availableBudget: z.number().finite(),
      budgetCategories: z.record(z.object({
        allocated: z.number().finite(),
        available: z.number().finite(),
        constraints: z.array(z.string())
      })),
      costCenters: z.array(z.object({
        id: z.string(),
        name: z.string(),
        budget: z.number().finite(),
        utilized: z.number().finite(),
        efficiency: z.number().finite().min(0).max(1)
      }))
    }),
    human: z.object({
      totalHeadcount: z.number().finite(),
      availableHeadcount: z.number().finite(),
      departments: z.array(z.object({
        id: z.string(),
        name: z.string(),
        currentSize: z.number().finite(),
        capacity: z.number().finite().min(0).max(1),
        skillsets: z.array(z.object({
          skill: z.string(),
          level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
          count: z.number().finite(),
          demand: z.number().finite()
        })),
        utilizationRate: z.number().finite().min(0).max(1),
        efficiency: z.number().finite().min(0).max(1)
      })),
      contractors: z.object({
        available: z.number().finite(),
        hourlyRates: z.record(z.number().finite()),
        skills: z.array(z.string()),
        capacity: z.number().finite()
      })
    }),
    technological: z.object({
      infrastructure: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['hardware', 'software', 'platform', 'service']),
        capacity: z.number().finite().min(0).max(1),
        utilization: z.number().finite().min(0).max(1),
        scalability: z.enum(['low', 'medium', 'high']),
        cost: z.number().finite(),
        lifecycle: z.string()
      })),
      licenses: z.array(z.object({
        software: z.string(),
        total: z.number().finite(),
        used: z.number().finite(),
        cost: z.number().finite(),
        expiry: z.string()
      })),
      developmentTools: z.array(z.object({
        tool: z.string(),
        capacity: z.number().finite(),
        teams: z.array(z.string()),
        efficiency: z.number().finite().min(0).max(1)
      }))
    }),
    physical: z.object({
      facilities: z.array(z.object({
        location: z.string(),
        capacity: z.number().finite(),
        utilization: z.number().finite().min(0).max(1),
        cost: z.number().finite(),
        amenities: z.array(z.string())
      })),
      equipment: z.array(z.object({
        type: z.string(),
        quantity: z.number().finite(),
        utilization: z.number().finite().min(0).max(1),
        condition: z.enum(['excellent', 'good', 'fair', 'poor']),
        replacement: z.string()
      }))
    })
  }),
  allocationRequests: z.array(z.object({
    id: z.string(),
    requestor: z.string(),
    project: z.object({
      id: z.string(),
      name: z.string(),
      priority: z.enum(['critical', 'high', 'medium', 'low']),
      type: z.enum(['strategic', 'operational', 'maintenance', 'innovation']),
      timeline: z.object({
        start: z.string(),
        end: z.string(),
        duration: z.number().finite()
      }),
      businessValue: z.object({
        revenue: z.number().finite(),
        cost_savings: z.number().finite(),
        strategic_value: z.number().finite().min(1).max(10),
        risk_mitigation: z.number().finite().min(1).max(10)
      })
    }),
    resourceRequirements: z.object({
      financial: z.object({
        total: z.number().finite(),
        breakdown: z.record(z.number().finite()),
        timing: z.array(z.object({
          period: z.string(),
          amount: z.number().finite()
        })),
        contingency: z.number().finite().min(0).max(1)
      }),
      human: z.object({
        roles: z.array(z.object({
          role: z.string(),
          count: z.number().finite(),
          skills: z.array(z.string()),
          level: z.enum(['junior', 'mid', 'senior', 'expert']),
          duration: z.number().finite(),
          utilization: z.number().finite().min(0).max(1)
        })),
        contractors: z.array(z.object({
          skill: z.string(),
          hours: z.number().finite(),
          rate: z.number().finite(),
          duration: z.string()
        }))
      }),
      technological: z.object({
        infrastructure: z.array(z.object({
          resource: z.string(),
          capacity: z.number().finite(),
          duration: z.string(),
          specifications: z.array(z.string())
        })),
        software: z.array(z.object({
          name: z.string(),
          licenses: z.number().finite(),
          cost: z.number().finite(),
          duration: z.string()
        })),
        development: z.array(z.object({
          tool: z.string(),
          capacity: z.number().finite(),
          teams: z.number().finite()
        }))
      }),
      physical: z.object({
        space: z.array(z.object({
          type: z.string(),
          area: z.number().finite(),
          duration: z.string(),
          requirements: z.array(z.string())
        })),
        equipment: z.array(z.object({
          type: z.string(),
          quantity: z.number().finite(),
          duration: z.string(),
          specifications: z.array(z.string())
        }))
      })
    }),
    dependencies: z.array(z.object({
      type: z.enum(['resource', 'project', 'external', 'regulatory']),
      description: z.string(),
      impact: z.enum(['blocking', 'high', 'medium', 'low']),
      timeline: z.string()
    })),
    constraints: z.array(z.object({
      type: z.enum(['budget', 'timeline', 'resource', 'compliance', 'quality']),
      description: z.string(),
      severity: z.enum(['strict', 'flexible', 'negotiable']),
      impact: z.string()
    })),
    alternatives: z.array(z.object({
      alternative: z.string(),
      impact: z.string(),
      tradeoffs: z.array(z.string()),
      feasibility: z.number().finite().min(0).max(1)
    }))
  })),
  allocationConstraints: z.object({
    organizational: z.object({
      maxProjectsParallel: z.number().finite(),
      minResourceBuffer: z.number().finite().min(0).max(1),
      riskTolerance: z.enum(['low', 'medium', 'high']),
      changeCapacity: z.enum(['low', 'medium', 'high'])
    }),
    financial: z.object({
      budgetVariance: z.number().finite().min(0).max(1),
      approvalLimits: z.record(z.number().finite()),
      costThresholds: z.object({
        warning: z.number().finite().min(0).max(1),
        critical: z.number().finite().min(0).max(1)
      })
    }),
    operational: z.object({
      capacityLimits: z.record(z.number().finite().min(0).max(1)),
      utilizationTargets: z.object({
        minimum: z.number().finite().min(0).max(1),
        optimal: z.number().finite().min(0).max(1),
        maximum: z.number().finite().min(0).max(1)
      }),
      skillConstraints: z.array(z.object({
        skill: z.string(),
        availability: z.number().finite(),
        critical: z.boolean()
      }))
    }),
    compliance: z.object({
      regulations: z.array(z.string()),
      auditRequirements: z.array(z.string()),
      documentationLevel: z.enum(['minimal', 'standard', 'comprehensive'])
    })
  }),
  optimizationCriteria: z.object({
    objectives: z.array(z.object({
      objective: z.enum(['maximize_value', 'minimize_cost', 'balance_risk', 'optimize_utilization', 'ensure_flexibility']),
      weight: z.number().finite().min(0).max(1),
      priority: z.enum(['primary', 'secondary', 'tertiary'])
    })),
    tradeoffs: z.object({
      costVsSpeed: z.enum(['cost_focused', 'balanced', 'speed_focused']),
      qualityVsQuantity: z.enum(['quality_focused', 'balanced', 'quantity_focused']),
      stabilityVsInnovation: z.enum(['stability_focused', 'balanced', 'innovation_focused'])
    }),
    timeHorizon: z.enum(['immediate', 'quarterly', 'annual', 'strategic']),
    riskAppetite: z.enum(['conservative', 'moderate', 'aggressive'])
  }),
  historicalData: z.object({
    allocationHistory: z.array(z.object({
      period: z.string(),
      projectId: z.string(),
      allocatedResources: z.record(z.number().finite()),
      actualUtilization: z.record(z.number().finite()),
      outcomes: z.object({
        delivered: z.boolean(),
        onTime: z.boolean(),
        onBudget: z.boolean(),
        qualityMet: z.boolean(),
        value: z.number().finite()
      }),
      lessons: z.array(z.string())
    })),
    utilizationTrends: z.array(z.object({
      period: z.string(),
      resourceType: z.string(),
      planned: z.number().finite().min(0).max(1),
      actual: z.number().finite().min(0).max(1),
      efficiency: z.number().finite().min(0).max(1)
    })),
    performanceMetrics: z.object({
      averageUtilization: z.number().finite().min(0).max(1),
      allocationAccuracy: z.number().finite().min(0).max(1),
      resourceEfficiency: z.number().finite().min(0).max(1),
      projectSuccessRate: z.number().finite().min(0).max(1)
    })
  })
});

export type ResourceAllocationRequest = z.infer<typeof ResourceAllocationRequestSchema>;

// Resource Allocation Result Schema
const ResourceAllocationResultSchema = z.object({
  allocationAnalysis: z.object({
    currentState: z.object({
      utilizationSummary: z.record(z.object({
        total: z.number().finite(),
        allocated: z.number().finite(),
        available: z.number().finite(),
        utilization: z.number().finite().min(0).max(1),
        efficiency: z.number().finite().min(0).max(1)
      })),
      bottlenecks: z.array(z.object({
        resource: z.string(),
        type: z.enum(['capacity', 'skills', 'timing', 'cost']),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        impact: z.string(),
        recommendation: z.string()
      })),
      opportunities: z.array(z.object({
        resource: z.string(),
        opportunity: z.string(),
        potential: z.number().finite().min(0).max(10),
        effort: z.enum(['low', 'medium', 'high']),
        timeline: z.string()
      }))
    }),
    demandAnalysis: z.object({
      totalDemand: z.record(z.number().finite()),
      demandPeaks: z.array(z.object({
        period: z.string(),
        resource: z.string(),
        demand: z.number().finite(),
        capacity: z.number().finite(),
        gap: z.number().finite()
      })),
      conflictingRequests: z.array(z.object({
        requestIds: z.array(z.string()),
        resource: z.string(),
        overlap: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        resolution: z.string()
      })),
      priorityMapping: z.array(z.object({
        requestId: z.string(),
        priority: z.enum(['critical', 'high', 'medium', 'low']),
        businessValue: z.number().finite(),
        strategicAlignment: z.number().finite().min(0).max(10),
        urgency: z.number().finite().min(0).max(10)
      }))
    }),
    gapAnalysis: z.object({
      resourceGaps: z.array(z.object({
        resource: z.string(),
        gap: z.number().finite(),
        impact: z.enum(['low', 'medium', 'high', 'critical']),
        timeframe: z.string(),
        options: z.array(z.object({
          option: z.string(),
          cost: z.number().finite(),
          timeline: z.string(),
          feasibility: z.number().finite().min(0).max(1)
        }))
      })),
      skillGaps: z.array(z.object({
        skill: z.string(),
        currentLevel: z.enum(['none', 'basic', 'intermediate', 'advanced', 'expert']),
        requiredLevel: z.enum(['basic', 'intermediate', 'advanced', 'expert']),
        gap: z.number().finite(),
        urgency: z.enum(['immediate', 'short_term', 'medium_term', 'long_term']),
        solutions: z.array(z.object({
          solution: z.enum(['hire', 'train', 'contract', 'outsource', 'partner']),
          cost: z.number().finite(),
          timeline: z.string(),
          risk: z.enum(['low', 'medium', 'high'])
        }))
      })),
      capacityGaps: z.array(z.object({
        area: z.string(),
        currentCapacity: z.number().finite(),
        requiredCapacity: z.number().finite(),
        gap: z.number().finite(),
        impactedProjects: z.array(z.string()),
        mitigationOptions: z.array(z.string())
      }))
    })
  }),
  optimizedAllocation: z.object({
    allocationPlan: z.array(z.object({
      requestId: z.string(),
      decision: z.enum(['approve', 'partial', 'defer', 'reject']),
      rationale: z.string(),
      allocatedResources: z.object({
        financial: z.object({
          amount: z.number().finite(),
          breakdown: z.record(z.number().finite()),
          timeline: z.array(z.object({
            period: z.string(),
            amount: z.number().finite()
          })),
          contingency: z.number().finite()
        }),
        human: z.object({
          roles: z.array(z.object({
            role: z.string(),
            count: z.number().finite(),
            allocation: z.number().finite().min(0).max(1),
            timeline: z.object({
              start: z.string(),
              end: z.string()
            }),
            alternatives: z.array(z.string())
          })),
          contractors: z.array(z.object({
            skill: z.string(),
            hours: z.number().finite(),
            rate: z.number().finite(),
            provider: z.string()
          }))
        }),
        technological: z.object({
          infrastructure: z.array(z.object({
            resource: z.string(),
            capacity: z.number().finite(),
            allocation: z.number().finite().min(0).max(1),
            timeline: z.string()
          })),
          software: z.array(z.object({
            name: z.string(),
            licenses: z.number().finite(),
            timeline: z.string()
          }))
        }),
        physical: z.object({
          space: z.array(z.object({
            location: z.string(),
            area: z.number().finite(),
            timeline: z.string()
          })),
          equipment: z.array(z.object({
            type: z.string(),
            quantity: z.number().finite(),
            timeline: z.string()
          }))
        })
      }),
      conditions: z.array(z.object({
        condition: z.string(),
        type: z.enum(['milestone', 'approval', 'dependency', 'performance']),
        deadline: z.string(),
        consequence: z.string()
      })),
      riskMitigation: z.array(z.object({
        risk: z.string(),
        probability: z.number().finite().min(0).max(1),
        impact: z.enum(['low', 'medium', 'high', 'critical']),
        mitigation: z.string(),
        contingency: z.string()
      })),
      successMetrics: z.array(z.object({
        metric: z.string(),
        target: z.number().finite(),
        measurement: z.string(),
        frequency: z.enum(['weekly', 'monthly', 'quarterly'])
      }))
    })),
    portfolioOptimization: z.object({
      selectedProjects: z.array(z.string()),
      deferredProjects: z.array(z.object({
        projectId: z.string(),
        reason: z.string(),
        suggestedTiming: z.string(),
        prerequisites: z.array(z.string())
      })),
      alternativeScenarios: z.array(z.object({
        scenario: z.string(),
        description: z.string(),
        tradeoffs: z.array(z.string()),
        benefits: z.array(z.string()),
        risks: z.array(z.string()),
        feasibility: z.number().finite().min(0).max(1)
      })),
      portfolioMetrics: z.object({
        totalValue: z.number().finite(),
        riskScore: z.number().finite().min(0).max(10),
        resourceUtilization: z.number().finite().min(0).max(1),
        strategicAlignment: z.number().finite().min(0).max(10),
        diversification: z.number().finite().min(0).max(1)
      })
    }),
    resourceOptimization: z.object({
      reallocation: z.array(z.object({
        from: z.string(),
        to: z.string(),
        resource: z.string(),
        amount: z.number().finite(),
        rationale: z.string(),
        impact: z.string(),
        timeline: z.string()
      })),
      efficiency: z.array(z.object({
        area: z.string(),
        currentEfficiency: z.number().finite().min(0).max(1),
        targetEfficiency: z.number().finite().min(0).max(1),
        improvement: z.array(z.string()),
        investment: z.number().finite(),
        payback: z.string()
      })),
      scaling: z.array(z.object({
        resource: z.string(),
        scalingOption: z.enum(['hire', 'contract', 'outsource', 'automate', 'optimize']),
        capacity: z.number().finite(),
        cost: z.number().finite(),
        timeline: z.string(),
        risks: z.array(z.string())
      }))
    })
  }),
  implementationPlan: z.object({
    phases: z.array(z.object({
      phase: z.string(),
      duration: z.string(),
      objectives: z.array(z.string()),
      allocations: z.array(z.string()),
      milestones: z.array(z.object({
        milestone: z.string(),
        date: z.string(),
        criteria: z.array(z.string()),
        deliverables: z.array(z.string())
      })),
      risks: z.array(z.object({
        risk: z.string(),
        mitigation: z.string(),
        contingency: z.string(),
        owner: z.string()
      })),
      resources: z.object({
        budget: z.number().finite(),
        personnel: z.array(z.string()),
        technology: z.array(z.string()),
        external: z.array(z.string())
      }),
      successCriteria: z.array(z.string())
    })),
    changeManagement: z.object({
      stakeholders: z.array(z.object({
        stakeholder: z.string(),
        impact: z.enum(['high', 'medium', 'low']),
        influence: z.enum(['high', 'medium', 'low']),
        strategy: z.string(),
        engagement: z.array(z.string()),
        communication: z.string()
      })),
      communication: z.array(z.object({
        audience: z.string(),
        message: z.string(),
        channel: z.string(),
        frequency: z.string(),
        timeline: z.string(),
        feedback: z.string()
      })),
      training: z.array(z.object({
        program: z.string(),
        audience: z.string(),
        content: z.array(z.string()),
        method: z.string(),
        duration: z.string(),
        success: z.array(z.string())
      })),
      resistance: z.array(z.object({
        source: z.string(),
        concern: z.string(),
        strategy: z.string(),
        timeline: z.string(),
        owner: z.string()
      }))
    }),
    monitoring: z.object({
      metrics: z.array(z.object({
        metric: z.string(),
        target: z.number().finite(),
        frequency: z.enum(['daily', 'weekly', 'monthly']),
        owner: z.string(),
        escalation: z.string()
      })),
      checkpoints: z.array(z.object({
        checkpoint: z.string(),
        date: z.string(),
        criteria: z.array(z.string()),
        stakeholders: z.array(z.string()),
        format: z.string()
      })),
      reporting: z.object({
        frequency: z.enum(['weekly', 'bi_weekly', 'monthly']),
        audience: z.array(z.string()),
        format: z.enum(['dashboard', 'report', 'presentation']),
        content: z.array(z.string()),
        distribution: z.array(z.string())
      }),
      adjustment: z.object({
        triggers: z.array(z.string()),
        process: z.array(z.string()),
        approval: z.string(),
        timeline: z.string()
      })
    })
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      recommendation: z.string(),
      rationale: z.string(),
      urgency: z.enum(['critical', 'high', 'medium', 'low']),
      effort: z.enum(['low', 'medium', 'high']),
      impact: z.string(),
      timeline: z.string(),
      dependencies: z.array(z.string()),
      risks: z.array(z.string()),
      owner: z.string()
    })),
    strategic: z.array(z.object({
      recommendation: z.string(),
      strategicValue: z.string(),
      implementation: z.object({
        approach: z.string(),
        phases: z.array(z.string()),
        timeline: z.string(),
        investment: z.number().finite(),
        roi: z.number().finite(),
        payback: z.string()
      }),
      benefits: z.array(z.string()),
      risks: z.array(z.string()),
      successMeasures: z.array(z.string()),
      alternatives: z.array(z.string())
    })),
    operational: z.array(z.object({
      recommendation: z.string(),
      operationalArea: z.string(),
      improvement: z.string(),
      implementation: z.string(),
      timeline: z.string(),
      resources: z.array(z.string()),
      metrics: z.array(z.string()),
      benefits: z.array(z.string())
    }))
  })
});

export type ResourceAllocationResult = z.infer<typeof ResourceAllocationResultSchema>;

export class ResourceAllocationEngine {
  private allocationEngine: Map<string, any>;
  private optimizationEngine: Map<string, any>;
  private analysisEngine: Map<string, any>;

  constructor() {
    this.allocationEngine = new Map();
    this.optimizationEngine = new Map();
    this.analysisEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Generate optimal resource allocation recommendations
   */
  async optimizeResourceAllocation(request: ResourceAllocationRequest): Promise<ResourceAllocationResult> {
    try {
      const validatedRequest = ResourceAllocationRequestSchema.parse(request);
      
      // Analyze current allocation state
      const allocationAnalysis = this.analyzeCurrentAllocation(validatedRequest);
      
      // Optimize resource allocation
      const optimizedAllocation = this.generateOptimizedAllocation(validatedRequest, allocationAnalysis);
      
      // Create implementation plan
      const implementationPlan = this.createImplementationPlan(validatedRequest, optimizedAllocation);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, allocationAnalysis, optimizedAllocation);
      
      const result: ResourceAllocationResult = {
        allocationAnalysis,
        optimizedAllocation,
        implementationPlan,
        recommendations
      };

      return ResourceAllocationResultSchema.parse(result);
    } catch (error) {
      console.error('Error optimizing resource allocation:', error);
      return this.getFallbackAllocationResult(request);
    }
  }

  /**
   * Analyze current allocation state
   */
  private analyzeCurrentAllocation(request: ResourceAllocationRequest): any {
    const currentState = this.analyzeCurrentState(request);
    const demandAnalysis = this.analyzeDemand(request);
    const gapAnalysis = this.analyzeGaps(request);

    return {
      currentState,
      demandAnalysis,
      gapAnalysis
    };
  }

  /**
   * Analyze current state
   */
  private analyzeCurrentState(request: ResourceAllocationRequest): any {
    const { availableResources } = request;
    const utilizationSummary = {};
    
    // Financial utilization
    utilizationSummary['financial'] = {
      total: availableResources.financial.totalBudget,
      allocated: availableResources.financial.allocatedBudget,
      available: availableResources.financial.availableBudget,
      utilization: availableResources.financial.allocatedBudget / availableResources.financial.totalBudget,
      efficiency: this.calculateFinancialEfficiency(availableResources.financial)
    };
    
    // Human resource utilization
    utilizationSummary['human'] = {
      total: availableResources.human.totalHeadcount,
      allocated: availableResources.human.totalHeadcount - availableResources.human.availableHeadcount,
      available: availableResources.human.availableHeadcount,
      utilization: (availableResources.human.totalHeadcount - availableResources.human.availableHeadcount) / availableResources.human.totalHeadcount,
      efficiency: this.calculateHumanEfficiency(availableResources.human)
    };
    
    // Technology utilization
    const techUtilization = this.calculateTechnologyUtilization(availableResources.technological);
    utilizationSummary['technological'] = techUtilization;
    
    // Identify bottlenecks
    const bottlenecks = this.identifyBottlenecks(request);
    
    // Identify opportunities
    const opportunities = this.identifyOpportunities(request);
    
    return {
      utilizationSummary,
      bottlenecks,
      opportunities
    };
  }

  /**
   * Calculate financial efficiency
   */
  private calculateFinancialEfficiency(financial: any): number {
    const costCenters = financial.costCenters;
    if (costCenters.length === 0) return 0.8; // Default efficiency
    
    const totalEfficiency = costCenters.reduce((sum, center) => sum + center.efficiency, 0);
    return totalEfficiency / costCenters.length;
  }

  /**
   * Calculate human efficiency
   */
  private calculateHumanEfficiency(human: any): number {
    const departments = human.departments;
    if (departments.length === 0) return 0.8; // Default efficiency
    
    const totalEfficiency = departments.reduce((sum, dept) => sum + dept.efficiency, 0);
    return totalEfficiency / departments.length;
  }

  /**
   * Calculate technology utilization
   */
  private calculateTechnologyUtilization(tech: any): any {
    const infrastructure = tech.infrastructure;
    
    if (infrastructure.length === 0) {
      return {
        total: 100,
        allocated: 60,
        available: 40,
        utilization: 0.6,
        efficiency: 0.8
      };
    }
    
    const totalCapacity = infrastructure.length * 100; // Normalized capacity
    const totalUtilized = infrastructure.reduce((sum, infra) => sum + (infra.utilization * 100), 0);
    const averageEfficiency = infrastructure.reduce((sum, infra) => {
      // Calculate efficiency based on utilization vs capacity
      return sum + Math.min(1, infra.utilization / infra.capacity);
    }, 0) / infrastructure.length;
    
    return {
      total: totalCapacity,
      allocated: totalUtilized,
      available: totalCapacity - totalUtilized,
      utilization: totalUtilized / totalCapacity,
      efficiency: averageEfficiency
    };
  }

  /**
   * Identify bottlenecks
   */
  private identifyBottlenecks(request: ResourceAllocationRequest): any[] {
    const bottlenecks = [];
    const { availableResources, allocationRequests } = request;
    
    // Financial bottlenecks
    const totalDemand = allocationRequests.reduce((sum, req) => 
      sum + req.resourceRequirements.financial.total, 0
    );
    
    if (totalDemand > availableResources.financial.availableBudget) {
      bottlenecks.push({
        resource: 'Budget',
        type: 'capacity' as const,
        severity: totalDemand > availableResources.financial.availableBudget * 1.5 ? 'critical' as const : 'high' as const,
        impact: `Demand (${totalDemand}) exceeds available budget (${availableResources.financial.availableBudget})`,
        recommendation: 'Prioritize projects, seek additional funding, or defer lower-priority initiatives'
      });
    }
    
    // Skill bottlenecks
    const skillDemand = new Map<string, number>();
    allocationRequests.forEach(req => {
      req.resourceRequirements.human.roles.forEach(role => {
        role.skills.forEach(skill => {
          skillDemand.set(skill, (skillDemand.get(skill) || 0) + role.count);
        });
      });
    });
    
    availableResources.human.departments.forEach(dept => {
      dept.skillsets.forEach(skillset => {
        const demand = skillDemand.get(skillset.skill) || 0;
        if (demand > skillset.count) {
          bottlenecks.push({
            resource: `${skillset.skill} Skills`,
            type: 'skills' as const,
            severity: demand > skillset.count * 1.5 ? 'high' as const : 'medium' as const,
            impact: `Skill demand (${demand}) exceeds availability (${skillset.count})`,
            recommendation: 'Hire additional talent, provide training, or engage contractors'
          });
        }
      });
    });
    
    // Capacity bottlenecks
    availableResources.human.departments.forEach(dept => {
      if (dept.capacity > 0.9) {
        bottlenecks.push({
          resource: `${dept.name} Department`,
          type: 'capacity' as const,
          severity: dept.capacity > 0.95 ? 'high' as const : 'medium' as const,
          impact: `Department operating at ${(dept.capacity * 100).toFixed(1)}% capacity`,
          recommendation: 'Increase capacity, redistribute workload, or defer non-critical work'
        });
      }
    });
    
    return bottlenecks.sort((a, b) => {
      const severityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }

  /**
   * Identify opportunities
   */
  private identifyOpportunities(request: ResourceAllocationRequest): any[] {
    const opportunities = [];
    const { availableResources } = request;
    
    // Under-utilized resources
    availableResources.human.departments.forEach(dept => {
      if (dept.capacity < 0.7) {
        opportunities.push({
          resource: `${dept.name} Department`,
          opportunity: 'Under-utilized capacity available for additional projects',
          potential: 8,
          effort: 'low' as const,
          timeline: 'Immediate'
        });
      }
    });
    
    // Technology optimization
    availableResources.technological.infrastructure.forEach(infra => {
      if (infra.utilization < 0.6 && infra.scalability === 'high') {
        opportunities.push({
          resource: infra.name,
          opportunity: 'Scale up utilization or consolidate resources',
          potential: 6,
          effort: 'medium' as const,
          timeline: '1-2 months'
        });
      }
    });
    
    // Cost optimization
    availableResources.financial.costCenters.forEach(center => {
      if (center.efficiency < 0.7) {
        opportunities.push({
          resource: center.name,
          opportunity: 'Improve cost center efficiency and reduce waste',
          potential: 7,
          effort: 'medium' as const,
          timeline: '2-3 months'
        });
      }
    });
    
    return opportunities.sort((a, b) => b.potential - a.potential);
  }

  /**
   * Analyze demand
   */
  private analyzeDemand(request: ResourceAllocationRequest): any {
    const { allocationRequests } = request;
    
    // Calculate total demand by resource type
    const totalDemand = {
      financial: allocationRequests.reduce((sum, req) => sum + req.resourceRequirements.financial.total, 0),
      human: allocationRequests.reduce((sum, req) => 
        sum + req.resourceRequirements.human.roles.reduce((roleSum, role) => roleSum + role.count, 0), 0),
      technological: allocationRequests.length, // Simplified metric
      physical: allocationRequests.reduce((sum, req) => 
        sum + req.resourceRequirements.physical.space.reduce((spaceSum, space) => spaceSum + space.area, 0), 0)
    };
    
    // Identify demand peaks
    const demandPeaks = this.identifyDemandPeaks(request);
    
    // Identify conflicting requests
    const conflictingRequests = this.identifyConflictingRequests(request);
    
    // Create priority mapping
    const priorityMapping = allocationRequests.map(req => ({
      requestId: req.id,
      priority: req.project.priority,
      businessValue: req.project.businessValue.revenue + req.project.businessValue.cost_savings,
      strategicAlignment: req.project.businessValue.strategic_value,
      urgency: this.calculateUrgency(req)
    }));
    
    return {
      totalDemand,
      demandPeaks,
      conflictingRequests,
      priorityMapping
    };
  }

  /**
   * Calculate urgency score
   */
  private calculateUrgency(request: any): number {
    const startDate = new Date(request.project.timeline.start);
    const now = new Date();
    const daysToStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysToStart <= 30) return 10; // Very urgent
    if (daysToStart <= 90) return 8;  // Urgent
    if (daysToStart <= 180) return 6; // Moderate
    if (daysToStart <= 365) return 4; // Low
    return 2; // Very low
  }

  /**
   * Identify demand peaks
   */
  private identifyDemandPeaks(request: ResourceAllocationRequest): any[] {
    // Simplified peak analysis - would need more sophisticated timeline analysis
    const peaks = [];
    
    request.allocationRequests.forEach(req => {
      const timeline = req.project.timeline;
      const demand = req.resourceRequirements.financial.total;
      
      peaks.push({
        period: `${timeline.start} to ${timeline.end}`,
        resource: 'Financial',
        demand: demand,
        capacity: request.availableResources.financial.availableBudget,
        gap: Math.max(0, demand - request.availableResources.financial.availableBudget)
      });
    });
    
    return peaks.filter(peak => peak.gap > 0);
  }

  /**
   * Identify conflicting requests
   */
  private identifyConflictingRequests(request: ResourceAllocationRequest): any[] {
    const conflicts = [];
    const requests = request.allocationRequests;
    
    // Check for timeline overlaps with same resource requirements
    for (let i = 0; i < requests.length; i++) {
      for (let j = i + 1; j < requests.length; j++) {
        const req1 = requests[i];
        const req2 = requests[j];
        
        // Check timeline overlap
        const start1 = new Date(req1.project.timeline.start);
        const end1 = new Date(req1.project.timeline.end);
        const start2 = new Date(req2.project.timeline.start);
        const end2 = new Date(req2.project.timeline.end);
        
        if (start1 <= end2 && start2 <= end1) {
          // Check resource conflicts
          const budget1 = req1.resourceRequirements.financial.total;
          const budget2 = req2.resourceRequirements.financial.total;
          const available = request.availableResources.financial.availableBudget;
          
          if (budget1 + budget2 > available) {
            conflicts.push({
              requestIds: [req1.id, req2.id],
              resource: 'Budget',
              overlap: `${Math.max(start1.getTime(), start2.getTime())} to ${Math.min(end1.getTime(), end2.getTime())}`,
              severity: budget1 + budget2 > available * 1.5 ? 'critical' as const : 'high' as const,
              resolution: 'Prioritize based on business value or adjust timelines'
            });
          }
        }
      }
    }
    
    return conflicts;
  }

  /**
   * Analyze gaps
   */
  private analyzeGaps(request: ResourceAllocationRequest): any {
    const resourceGaps = this.identifyResourceGaps(request);
    const skillGaps = this.identifySkillGaps(request);
    const capacityGaps = this.identifyCapacityGaps(request);
    
    return {
      resourceGaps,
      skillGaps,
      capacityGaps
    };
  }

  /**
   * Identify resource gaps
   */
  private identifyResourceGaps(request: ResourceAllocationRequest): any[] {
    const gaps = [];
    const { availableResources, allocationRequests } = request;
    
    // Financial gap
    const totalDemand = allocationRequests.reduce((sum, req) => sum + req.resourceRequirements.financial.total, 0);
    const availableBudget = availableResources.financial.availableBudget;
    
    if (totalDemand > availableBudget) {
      const gap = totalDemand - availableBudget;
      gaps.push({
        resource: 'Budget',
        gap: gap,
        impact: gap > availableBudget * 0.5 ? 'critical' as const : 'high' as const,
        timeframe: 'Immediate',
        options: [
          {
            option: 'Secure additional funding',
            cost: 0,
            timeline: '2-4 weeks',
            feasibility: 0.6
          },
          {
            option: 'Defer lower priority projects',
            cost: gap * 0.8, // Opportunity cost
            timeline: 'Immediate',
            feasibility: 0.9
          },
          {
            option: 'Phase project implementation',
            cost: gap * 0.3,
            timeline: '1-2 weeks',
            feasibility: 0.8
          }
        ]
      });
    }
    
    return gaps;
  }

  /**
   * Identify skill gaps
   */
  private identifySkillGaps(request: ResourceAllocationRequest): any[] {
    const gaps = [];
    const skillDemand = new Map<string, number>();
    
    // Calculate skill demand
    request.allocationRequests.forEach(req => {
      req.resourceRequirements.human.roles.forEach(role => {
        role.skills.forEach(skill => {
          skillDemand.set(skill, (skillDemand.get(skill) || 0) + role.count);
        });
      });
    });
    
    // Compare with available skills
    request.availableResources.human.departments.forEach(dept => {
      dept.skillsets.forEach(skillset => {
        const demand = skillDemand.get(skillset.skill) || 0;
        if (demand > skillset.count) {
          gaps.push({
            skill: skillset.skill,
            currentLevel: this.mapSkillLevel(skillset.level),
            requiredLevel: 'advanced' as const, // Assume advanced for simplicity
            gap: demand - skillset.count,
            urgency: demand > skillset.count * 2 ? 'immediate' as const : 'short_term' as const,
            solutions: [
              {
                solution: 'hire' as const,
                cost: 100000 * (demand - skillset.count),
                timeline: '3-6 months',
                risk: 'medium' as const
              },
              {
                solution: 'train' as const,
                cost: 10000 * skillset.count,
                timeline: '2-4 months',
                risk: 'low' as const
              },
              {
                solution: 'contract' as const,
                cost: 150000 * (demand - skillset.count),
                timeline: '2-4 weeks',
                risk: 'high' as const
              }
            ]
          });
        }
      });
    });
    
    return gaps;
  }

  /**
   * Map skill level
   */
  private mapSkillLevel(level: string): 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert' {
    const mapping = {
      'beginner': 'basic' as const,
      'intermediate': 'intermediate' as const,
      'advanced': 'advanced' as const,
      'expert': 'expert' as const
    };
    return mapping[level] || 'basic';
  }

  /**
   * Identify capacity gaps
   */
  private identifyCapacityGaps(request: ResourceAllocationRequest): any[] {
    const gaps = [];
    
    request.availableResources.human.departments.forEach(dept => {
      const totalRoles = request.allocationRequests.reduce((sum, req) => {
        return sum + req.resourceRequirements.human.roles
          .filter(role => dept.skillsets.some(skill => role.skills.includes(skill.skill)))
          .reduce((roleSum, role) => roleSum + role.count, 0);
      }, 0);
      
      if (totalRoles > dept.currentSize * dept.capacity) {
        const requiredCapacity = totalRoles;
        const currentCapacity = dept.currentSize * dept.capacity;
        
        gaps.push({
          area: dept.name,
          currentCapacity: currentCapacity,
          requiredCapacity: requiredCapacity,
          gap: requiredCapacity - currentCapacity,
          impactedProjects: request.allocationRequests
            .filter(req => req.resourceRequirements.human.roles
              .some(role => dept.skillsets.some(skill => role.skills.includes(skill.skill))))
            .map(req => req.id),
          mitigationOptions: [
            'Hire additional staff',
            'Improve productivity through training',
            'Outsource non-core activities',
            'Implement automation tools'
          ]
        });
      }
    });
    
    return gaps;
  }

  /**
   * Placeholder methods for core functionality
   */
  private generateOptimizedAllocation(request: ResourceAllocationRequest, analysis: any): any { return {}; }
  private createImplementationPlan(request: ResourceAllocationRequest, allocation: any): any { return {}; }
  private generateRecommendations(request: ResourceAllocationRequest, analysis: any, allocation: any): any { return {}; }

  /**
   * Get fallback allocation result
   */
  private getFallbackAllocationResult(request: ResourceAllocationRequest): ResourceAllocationResult {
    return {
      allocationAnalysis: {
        currentState: {
          utilizationSummary: {},
          bottlenecks: [],
          opportunities: []
        },
        demandAnalysis: {
          totalDemand: {},
          demandPeaks: [],
          conflictingRequests: [],
          priorityMapping: []
        },
        gapAnalysis: {
          resourceGaps: [],
          skillGaps: [],
          capacityGaps: []
        }
      },
      optimizedAllocation: {
        allocationPlan: [],
        portfolioOptimization: {
          selectedProjects: [],
          deferredProjects: [],
          alternativeScenarios: [],
          portfolioMetrics: {
            totalValue: 0,
            riskScore: 5,
            resourceUtilization: 0.8,
            strategicAlignment: 5,
            diversification: 0.5
          }
        },
        resourceOptimization: {
          reallocation: [],
          efficiency: [],
          scaling: []
        }
      },
      implementationPlan: {
        phases: [],
        changeManagement: { stakeholders: [], communication: [], training: [], resistance: [] },
        monitoring: { metrics: [], checkpoints: [], reporting: { frequency: 'monthly', audience: [], format: 'dashboard', content: [], distribution: [] }, adjustment: { triggers: [], process: [], approval: '', timeline: '' } }
      },
      recommendations: { immediate: [], strategic: [], operational: [] }
    };
  }

  /**
   * Initialize allocation engines
   */
  private initializeEngines(): void {
    this.allocationEngine.set('analysis', this.analyzeCurrentAllocation.bind(this));
    this.allocationEngine.set('optimization', this.generateOptimizedAllocation.bind(this));
    
    this.analysisEngine.set('state', this.analyzeCurrentState.bind(this));
    this.analysisEngine.set('demand', this.analyzeDemand.bind(this));
    this.analysisEngine.set('gaps', this.analyzeGaps.bind(this));
    
    this.optimizationEngine.set('allocation', this.generateOptimizedAllocation.bind(this));
    this.optimizationEngine.set('implementation', this.createImplementationPlan.bind(this));
  }
}
