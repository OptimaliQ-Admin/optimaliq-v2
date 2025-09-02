/**
 * AI-Powered Action Planning AI
 * Intelligent action planning and prioritization for growth strategies
 */

import { z } from 'zod';

// Action Planning Request Schema
const ActionPlanningRequestSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  goals: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    deadline: z.string(),
    dependencies: z.array(z.string()),
    successCriteria: z.array(z.string()),
    impact: z.number().finite().min(0).max(1)
  })),
  availableResources: z.object({
    team: z.array(z.object({
      id: z.string(),
      name: z.string(),
      skills: z.array(z.string()),
      availability: z.number().finite().min(0).max(1),
      capacity: z.number().finite() // hours per week
    })),
    budget: z.number().finite(),
    timeAvailable: z.number().finite(), // weeks
    tools: z.array(z.object({
      name: z.string(),
      cost: z.number().finite(),
      capabilities: z.array(z.string())
    }))
  }),
  constraints: z.object({
    timeline: z.object({
      startDate: z.string(),
      endDate: z.string(),
      milestones: z.array(z.object({
        id: z.string(),
        name: z.string(),
        date: z.string(),
        dependencies: z.array(z.string())
      }))
    }),
    budget: z.object({
      total: z.number().finite(),
      allocated: z.number().finite(),
      remaining: z.number().finite()
    }),
    risks: z.array(z.object({
      id: z.string(),
      description: z.string(),
      probability: z.number().finite().min(0).max(1),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      mitigation: z.string()
    }))
  }),
  planningSettings: z.object({
    optimizationStrategy: z.enum(['time', 'cost', 'quality', 'balanced']),
    riskTolerance: z.enum(['low', 'medium', 'high']),
    flexibility: z.enum(['rigid', 'moderate', 'flexible']),
    collaboration: z.boolean().default(true)
  })
});

export type ActionPlanningRequest = z.infer<typeof ActionPlanningRequestSchema>;

// Action Planning Result Schema
const ActionPlanningResultSchema = z.object({
  actionPlan: z.object({
    phases: z.array(z.object({
      phaseId: z.string(),
      name: z.string(),
      description: z.string(),
      duration: z.number().finite(), // weeks
      actions: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'critical']),
        effort: z.number().finite(), // hours
        dependencies: z.array(z.string()),
        assignee: z.string().optional(),
        deadline: z.string(),
        successCriteria: z.array(z.string()),
        resources: z.array(z.object({
          type: z.string(),
          name: z.string(),
          cost: z.number().finite()
        }))
      })),
      milestones: z.array(z.object({
        id: z.string(),
        name: z.string(),
        date: z.string(),
        criteria: z.array(z.string())
      }))
    })),
    timeline: z.object({
      startDate: z.string(),
      endDate: z.string(),
      criticalPath: z.array(z.string()),
      slackTime: z.record(z.number().finite())
    }),
    resourceAllocation: z.object({
      teamAssignments: z.array(z.object({
        memberId: z.string(),
        memberName: z.string(),
        actions: z.array(z.string()),
        totalHours: z.number().finite(),
        utilization: z.number().finite().min(0).max(1)
      })),
      budgetAllocation: z.record(z.number().finite()),
      toolAllocation: z.array(z.object({
        tool: z.string(),
        actions: z.array(z.string()),
        cost: z.number().finite()
      }))
    })
  }),
  prioritization: z.object({
    priorityMatrix: z.array(z.object({
      action: z.string(),
      urgency: z.number().finite().min(0).max(1),
      importance: z.number().finite().min(0).max(1),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      rationale: z.string()
    })),
    dependencies: z.array(z.object({
      action: z.string(),
      dependsOn: z.array(z.string()),
      blocks: z.array(z.string()),
      criticality: z.enum(['low', 'medium', 'high', 'critical'])
    })),
    optimization: z.object({
      efficiency: z.number().finite().min(0).max(1),
      riskMitigation: z.number().finite().min(0).max(1),
      resourceUtilization: z.number().finite().min(0).max(1),
      recommendations: z.array(z.string())
    })
  }),
  recommendations: z.object({
    immediate: z.array(z.object({
      action: z.string(),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      rationale: z.string(),
      expectedOutcome: z.string(),
      timeline: z.string()
    })),
    shortTerm: z.array(z.object({
      action: z.string(),
      timeframe: z.string(),
      rationale: z.string(),
      successMetrics: z.array(z.string())
    })),
    longTerm: z.array(z.object({
      action: z.string(),
      timeframe: z.string(),
      rationale: z.string(),
      milestones: z.array(z.string())
    }))
  }),
  insights: z.object({
    keyInsights: z.array(z.object({
      insight: z.string(),
      category: z.string(),
      impact: z.enum(['high', 'medium', 'low']),
      confidence: z.number().finite().min(0).max(1)
    })),
    risks: z.array(z.object({
      risk: z.string(),
      probability: z.number().finite().min(0).max(1),
      impact: z.enum(['low', 'medium', 'high', 'critical']),
      mitigation: z.string()
    })),
    opportunities: z.array(z.object({
      opportunity: z.string(),
      probability: z.number().finite().min(0).max(1),
      potential: z.number().finite().min(0).max(1),
      timeframe: z.string()
    }))
  })
});

export type ActionPlanningResult = z.infer<typeof ActionPlanningResultSchema>;

export class ActionPlanningAI {
  private planningEngine: Map<string, any>;
  private prioritizationEngine: Map<string, any>;
  private optimizationEngine: Map<string, any>;

  constructor() {
    this.planningEngine = new Map();
    this.prioritizationEngine = new Map();
    this.optimizationEngine = new Map();
    this.initializeEngines();
  }

  /**
   * Generate intelligent action plan
   */
  async generateActionPlan(request: ActionPlanningRequest): Promise<ActionPlanningResult> {
    try {
      const validatedRequest = ActionPlanningRequestSchema.parse(request);
      
      // Generate action plan
      const actionPlan = this.generateActionPlanStructure(validatedRequest);
      
      // Generate prioritization
      const prioritization = this.generatePrioritization(validatedRequest, actionPlan);
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(validatedRequest, actionPlan, prioritization);
      
      // Generate insights
      const insights = this.generateInsights(validatedRequest, actionPlan, prioritization);
      
      const result: ActionPlanningResult = {
        actionPlan,
        prioritization,
        recommendations,
        insights
      };

      return ActionPlanningResultSchema.parse(result);
    } catch (error) {
      console.error('Error generating action plan:', error);
      return this.getFallbackActionPlanResult(request);
    }
  }

  /**
   * Generate action plan structure
   */
  private generateActionPlanStructure(request: ActionPlanningRequest): any {
    const phases = this.createPhases(request);
    const timeline = this.createTimeline(request, phases);
    const resourceAllocation = this.allocateResources(request, phases);

    return {
      phases,
      timeline,
      resourceAllocation
    };
  }

  /**
   * Generate prioritization
   */
  private generatePrioritization(request: ActionPlanningRequest, actionPlan: any): any {
    const priorityMatrix = this.createPriorityMatrix(request, actionPlan);
    const dependencies = this.analyzeDependencies(request, actionPlan);
    const optimization = this.optimizePrioritization(request, actionPlan, priorityMatrix);

    return {
      priorityMatrix,
      dependencies,
      optimization
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: ActionPlanningRequest, actionPlan: any, prioritization: any): any {
    const immediate = this.generateImmediateRecommendations(request, actionPlan, prioritization);
    const shortTerm = this.generateShortTermRecommendations(request, actionPlan, prioritization);
    const longTerm = this.generateLongTermRecommendations(request, actionPlan, prioritization);

    return {
      immediate,
      shortTerm,
      longTerm
    };
  }

  /**
   * Generate insights
   */
  private generateInsights(request: ActionPlanningRequest, actionPlan: any, prioritization: any): any {
    const keyInsights = this.extractKeyInsights(request, actionPlan, prioritization);
    const risks = this.identifyRisks(request, actionPlan, prioritization);
    const opportunities = this.identifyOpportunities(request, actionPlan, prioritization);

    return {
      keyInsights,
      risks,
      opportunities
    };
  }

  // Helper methods
  private createPhases(request: ActionPlanningRequest): any[] {
    const phases = [];
    const goals = request.goals;
    const totalDuration = request.constraints.timeline.endDate && request.constraints.timeline.startDate ? 
      this.calculateWeeksBetween(request.constraints.timeline.startDate, request.constraints.timeline.endDate) : 12;
    
    // Phase 1: Foundation (25% of time)
    const foundationDuration = Math.ceil(totalDuration * 0.25);
    phases.push({
      phaseId: 'phase_1',
      name: 'Foundation',
      description: 'Establish project foundation and critical infrastructure',
      duration: foundationDuration,
      actions: this.generateFoundationActions(request, foundationDuration),
      milestones: this.generateFoundationMilestones(foundationDuration)
    });

    // Phase 2: Development (50% of time)
    const developmentDuration = Math.ceil(totalDuration * 0.5);
    phases.push({
      phaseId: 'phase_2',
      name: 'Development',
      description: 'Core development and implementation phase',
      duration: developmentDuration,
      actions: this.generateDevelopmentActions(request, developmentDuration),
      milestones: this.generateDevelopmentMilestones(developmentDuration)
    });

    // Phase 3: Optimization (25% of time)
    const optimizationDuration = Math.ceil(totalDuration * 0.25);
    phases.push({
      phaseId: 'phase_3',
      name: 'Optimization',
      description: 'Final optimization and launch preparation',
      duration: optimizationDuration,
      actions: this.generateOptimizationActions(request, optimizationDuration),
      milestones: this.generateOptimizationMilestones(optimizationDuration)
    });

    return phases;
  }

  private createTimeline(request: ActionPlanningRequest, phases: any[]): any {
    const startDate = new Date(request.constraints.timeline.startDate);
    let currentDate = new Date(startDate);
    const criticalPath = [];
    const slackTime = {};

    phases.forEach(phase => {
      const phaseEndDate = new Date(currentDate);
      phaseEndDate.setDate(phaseEndDate.getDate() + (phase.duration * 7));
      
      // Identify critical actions
      const criticalActions = phase.actions.filter(action => action.priority === 'critical');
      criticalActions.forEach(action => {
        criticalPath.push(action.id);
      });
      
      currentDate = phaseEndDate;
    });

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: currentDate.toISOString().split('T')[0],
      criticalPath,
      slackTime
    };
  }

  private allocateResources(request: ActionPlanningRequest, phases: any[]): any {
    const teamAssignments = [];
    const budgetAllocation = {};
    const toolAllocation = [];

    // Allocate team members
    request.availableResources.team.forEach(member => {
      const assignedActions = [];
      let totalHours = 0;

      phases.forEach(phase => {
        phase.actions.forEach(action => {
          if (this.canAssignAction(member, action)) {
            assignedActions.push(action.id);
            totalHours += action.effort;
          }
        });
      });

      teamAssignments.push({
        memberId: member.id,
        memberName: member.name,
        actions: assignedActions,
        totalHours,
        utilization: totalHours / (member.capacity * phases.reduce((sum, p) => sum + p.duration, 0))
      });
    });

    // Allocate budget
    const totalBudget = request.availableResources.budget;
    budgetAllocation['foundation'] = totalBudget * 0.25;
    budgetAllocation['development'] = totalBudget * 0.5;
    budgetAllocation['optimization'] = totalBudget * 0.25;

    // Allocate tools
    request.availableResources.tools.forEach(tool => {
      toolAllocation.push({
        tool: tool.name,
        actions: this.identifyToolActions(tool, phases),
        cost: tool.cost
      });
    });

    return {
      teamAssignments,
      budgetAllocation,
      toolAllocation
    };
  }

  private createPriorityMatrix(request: ActionPlanningRequest, actionPlan: any[]): any[] {
    const priorityMatrix = [];

    actionPlan.forEach(phase => {
      phase.actions.forEach(action => {
        const urgency = this.calculateUrgency(action, request);
        const importance = this.calculateImportance(action, request);
        const priority = this.determinePriority(urgency, importance);
        const rationale = this.generatePriorityRationale(action, urgency, importance);

        priorityMatrix.push({
          action: action.id,
          urgency,
          importance,
          priority,
          rationale
        });
      });
    });

    return priorityMatrix.sort((a, b) => {
      const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  private analyzeDependencies(request: ActionPlanningRequest, actionPlan: any[]): any[] {
    const dependencies = [];

    actionPlan.forEach(phase => {
      phase.actions.forEach(action => {
        const dependsOn = this.identifyDependencies(action, actionPlan);
        const blocks = this.identifyBlockedActions(action, actionPlan);
        const criticality = this.calculateDependencyCriticality(action, dependsOn, blocks);

        dependencies.push({
          action: action.id,
          dependsOn,
          blocks,
          criticality
        });
      });
    });

    return dependencies;
  }

  private optimizePrioritization(request: ActionPlanningRequest, actionPlan: any[], priorityMatrix: any[]): any {
    const efficiency = this.calculateEfficiency(request, actionPlan, priorityMatrix);
    const riskMitigation = this.calculateRiskMitigation(request, actionPlan);
    const resourceUtilization = this.calculateResourceUtilization(request, actionPlan);
    const recommendations = this.generateOptimizationRecommendations(request, actionPlan, priorityMatrix);

    return {
      efficiency,
      riskMitigation,
      resourceUtilization,
      recommendations
    };
  }

  private generateImmediateRecommendations(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const recommendations = [];

    // Critical actions recommendation
    const criticalActions = prioritization.priorityMatrix.filter(item => item.priority === 'critical');
    if (criticalActions.length > 0) {
      recommendations.push({
        action: `Prioritize ${criticalActions.length} critical actions`,
        priority: 'critical' as const,
        rationale: 'Critical actions require immediate attention to avoid project delays',
        expectedOutcome: 'Ensure project stays on track and meets key milestones',
        timeline: 'This week'
      });
    }

    // Resource allocation recommendation
    const underutilizedResources = actionPlan.flatMap(phase => phase.resourceAllocation.teamAssignments)
      .filter(assignment => assignment.utilization < 0.7);
    if (underutilizedResources.length > 0) {
      recommendations.push({
        action: 'Optimize resource allocation for underutilized team members',
        priority: 'high' as const,
        rationale: 'Underutilized resources indicate inefficient allocation',
        expectedOutcome: 'Improved resource utilization and project efficiency',
        timeline: 'Next 2 weeks'
      });
    }

    return recommendations;
  }

  private generateShortTermRecommendations(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const recommendations = [];

    // Risk mitigation recommendation
    const highRiskActions = prioritization.dependencies.filter(dep => dep.criticality === 'critical');
    if (highRiskActions.length > 0) {
      recommendations.push({
        action: 'Implement risk mitigation strategies for critical dependencies',
        timeframe: 'Next month',
        rationale: 'Critical dependencies pose significant project risks',
        successMetrics: ['Reduced risk exposure', 'Improved project stability', 'Better contingency planning']
      });
    }

    return recommendations;
  }

  private generateLongTermRecommendations(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const recommendations = [];

    // Process optimization recommendation
    recommendations.push({
      action: 'Implement continuous improvement processes',
      timeframe: 'Next 3 months',
      rationale: 'Long-term optimization requires systematic process improvement',
      milestones: ['Establish improvement framework', 'Implement monitoring systems', 'Achieve efficiency targets']
    });

    return recommendations;
  }

  private extractKeyInsights(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const insights = [];

    // Resource utilization insight
    const avgUtilization = actionPlan.flatMap(phase => phase.resourceAllocation.teamAssignments)
      .reduce((sum, assignment) => sum + assignment.utilization, 0) / 
      actionPlan.flatMap(phase => phase.resourceAllocation.teamAssignments).length;
    
    if (avgUtilization < 0.7) {
      insights.push({
        insight: 'Low resource utilization indicates optimization opportunities',
        category: 'resources',
        impact: 'medium' as const,
        confidence: 0.8
      });
    }

    // Critical path insight
    const criticalActions = prioritization.priorityMatrix.filter(item => item.priority === 'critical');
    if (criticalActions.length > 5) {
      insights.push({
        insight: 'High number of critical actions increases project risk',
        category: 'risk',
        impact: 'high' as const,
        confidence: 0.9
      });
    }

    return insights;
  }

  private identifyRisks(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const risks = [];

    // Timeline risk
    const totalDuration = actionPlan.reduce((sum, phase) => sum + phase.duration, 0);
    const availableTime = request.availableResources.timeAvailable;
    if (totalDuration > availableTime) {
      risks.push({
        risk: 'Project timeline exceeds available time',
        probability: 0.8,
        impact: 'critical' as const,
        mitigation: 'Optimize action plan and increase resource allocation'
      });
    }

    // Budget risk
    const totalCost = actionPlan.flatMap(phase => phase.actions)
      .reduce((sum, action) => sum + action.resources.reduce((rSum, resource) => rSum + resource.cost, 0), 0);
    if (totalCost > request.availableResources.budget) {
      risks.push({
        risk: 'Project cost exceeds available budget',
        probability: 0.7,
        impact: 'high' as const,
        mitigation: 'Optimize resource allocation and reduce scope'
      });
    }

    return risks;
  }

  private identifyOpportunities(request: ActionPlanningRequest, actionPlan: any[], prioritization: any): any[] {
    const opportunities = [];

    // Efficiency opportunity
    const efficiency = prioritization.optimization.efficiency;
    if (efficiency < 0.8) {
      opportunities.push({
        opportunity: 'Improve action plan efficiency through optimization',
        probability: 0.8,
        potential: 0.7,
        timeframe: 'Next 2 months'
      });
    }

    // Resource optimization opportunity
    const resourceUtilization = prioritization.optimization.resourceUtilization;
    if (resourceUtilization < 0.8) {
      opportunities.push({
        opportunity: 'Optimize resource allocation for better utilization',
        probability: 0.7,
        potential: 0.6,
        timeframe: 'Next month'
      });
    }

    return opportunities;
  }

  // Additional helper methods
  private calculateWeeksBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  private generateFoundationActions(request: ActionPlanningRequest, duration: number): any[] {
    return [
      {
        id: 'foundation_1',
        title: 'Project Setup',
        description: 'Initialize project infrastructure and tools',
        priority: 'critical' as const,
        effort: duration * 20,
        dependencies: [],
        deadline: this.calculateDeadline(duration, 1),
        successCriteria: ['Project repository created', 'Development environment setup', 'Team access configured'],
        resources: [{ type: 'tool', name: 'Project Management Tool', cost: 100 }]
      },
      {
        id: 'foundation_2',
        title: 'Requirements Analysis',
        description: 'Define detailed project requirements and specifications',
        priority: 'high' as const,
        effort: duration * 30,
        dependencies: ['foundation_1'],
        deadline: this.calculateDeadline(duration, 2),
        successCriteria: ['Requirements documented', 'Stakeholder approval received', 'Scope finalized'],
        resources: [{ type: 'tool', name: 'Documentation Tool', cost: 50 }]
      }
    ];
  }

  private generateDevelopmentActions(request: ActionPlanningRequest, duration: number): any[] {
    return [
      {
        id: 'development_1',
        title: 'Core Development',
        description: 'Implement core project features and functionality',
        priority: 'critical' as const,
        effort: duration * 40,
        dependencies: ['foundation_2'],
        deadline: this.calculateDeadline(duration, 3),
        successCriteria: ['Core features implemented', 'Unit tests written', 'Code review completed'],
        resources: [{ type: 'tool', name: 'Development Environment', cost: 200 }]
      }
    ];
  }

  private generateOptimizationActions(request: ActionPlanningRequest, duration: number): any[] {
    return [
      {
        id: 'optimization_1',
        title: 'Testing and Quality Assurance',
        description: 'Comprehensive testing and quality assurance',
        priority: 'high' as const,
        effort: duration * 25,
        dependencies: ['development_1'],
        deadline: this.calculateDeadline(duration, 4),
        successCriteria: ['All tests passing', 'Quality standards met', 'Performance optimized'],
        resources: [{ type: 'tool', name: 'Testing Framework', cost: 150 }]
      }
    ];
  }

  private generateFoundationMilestones(duration: number): any[] {
    return [
      {
        id: 'milestone_1',
        name: 'Project Foundation Complete',
        date: this.calculateDeadline(duration, 1),
        criteria: ['Project setup complete', 'Requirements finalized']
      }
    ];
  }

  private generateDevelopmentMilestones(duration: number): any[] {
    return [
      {
        id: 'milestone_2',
        name: 'Core Development Complete',
        date: this.calculateDeadline(duration, 3),
        criteria: ['Core features implemented', 'Basic functionality working']
      }
    ];
  }

  private generateOptimizationMilestones(duration: number): any[] {
    return [
      {
        id: 'milestone_3',
        name: 'Project Complete',
        date: this.calculateDeadline(duration, 4),
        criteria: ['All features implemented', 'Testing complete', 'Ready for launch']
      }
    ];
  }

  private calculateDeadline(duration: number, week: number): string {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + (week * 7));
    return deadline.toISOString().split('T')[0];
  }

  private canAssignAction(member: any, action: any): boolean {
    // Simplified assignment logic
    return member.availability > 0.5 && member.capacity > action.effort;
  }

  private identifyToolActions(tool: any, phases: any[]): string[] {
    const actions = [];
    phases.forEach(phase => {
      phase.actions.forEach(action => {
        if (action.resources.some(resource => resource.name === tool.name)) {
          actions.push(action.id);
        }
      });
    });
    return actions;
  }

  private calculateUrgency(action: any, request: ActionPlanningRequest): number {
    const deadline = new Date(action.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 7) return 1.0;
    if (daysUntilDeadline <= 14) return 0.8;
    if (daysUntilDeadline <= 30) return 0.6;
    return 0.4;
  }

  private calculateImportance(action: any, request: ActionPlanningRequest): number {
    const priorityWeights = { 'critical': 1.0, 'high': 0.8, 'medium': 0.6, 'low': 0.4 };
    return priorityWeights[action.priority] || 0.5;
  }

  private determinePriority(urgency: number, importance: number): 'low' | 'medium' | 'high' | 'critical' {
    const score = (urgency + importance) / 2;
    if (score >= 0.9) return 'critical';
    if (score >= 0.7) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  private generatePriorityRationale(action: any, urgency: number, importance: number): string {
    if (urgency > 0.8 && importance > 0.8) {
      return 'High urgency and importance - critical for project success';
    } else if (urgency > 0.6) {
      return 'Time-sensitive action requiring immediate attention';
    } else if (importance > 0.6) {
      return 'Important action with significant project impact';
    }
    return 'Standard priority action';
  }

  private identifyDependencies(action: any, actionPlan: any[]): string[] {
    return action.dependencies || [];
  }

  private identifyBlockedActions(action: any, actionPlan: any[]): string[] {
    const blocked = [];
    actionPlan.forEach(phase => {
      phase.actions.forEach(otherAction => {
        if (otherAction.dependencies && otherAction.dependencies.includes(action.id)) {
          blocked.push(otherAction.id);
        }
      });
    });
    return blocked;
  }

  private calculateDependencyCriticality(action: any, dependsOn: string[], blocks: string[]): 'low' | 'medium' | 'high' | 'critical' {
    const totalDependencies = dependsOn.length + blocks.length;
    if (totalDependencies >= 5) return 'critical';
    if (totalDependencies >= 3) return 'high';
    if (totalDependencies >= 1) return 'medium';
    return 'low';
  }

  private calculateEfficiency(request: ActionPlanningRequest, actionPlan: any[], priorityMatrix: any[]): number {
    const criticalActions = priorityMatrix.filter(item => item.priority === 'critical').length;
    const totalActions = priorityMatrix.length;
    return Math.min(1, criticalActions / Math.max(1, totalActions * 0.3)); // Optimal: 30% critical actions
  }

  private calculateRiskMitigation(request: ActionPlanningRequest, actionPlan: any[]): number {
    const risks = request.constraints.risks;
    const mitigatedRisks = risks.filter(risk => risk.mitigation && risk.mitigation.length > 0).length;
    return risks.length > 0 ? mitigatedRisks / risks.length : 1;
  }

  private calculateResourceUtilization(request: ActionPlanningRequest, actionPlan: any[]): number {
    const teamAssignments = actionPlan.flatMap(phase => phase.resourceAllocation.teamAssignments);
    if (teamAssignments.length === 0) return 0;
    
    const avgUtilization = teamAssignments.reduce((sum, assignment) => sum + assignment.utilization, 0) / teamAssignments.length;
    return avgUtilization;
  }

  private generateOptimizationRecommendations(request: ActionPlanningRequest, actionPlan: any[], priorityMatrix: any[]): string[] {
    const recommendations = [];

    const efficiency = this.calculateEfficiency(request, actionPlan, priorityMatrix);
    if (efficiency < 0.7) {
      recommendations.push('Reduce number of critical actions to improve efficiency');
    }

    const resourceUtilization = this.calculateResourceUtilization(request, actionPlan);
    if (resourceUtilization < 0.7) {
      recommendations.push('Optimize resource allocation for better utilization');
    }

    return recommendations;
  }

  /**
   * Get fallback action plan result
   */
  private getFallbackActionPlanResult(request: ActionPlanningRequest): ActionPlanningResult {
    return {
      actionPlan: {
        phases: [],
        timeline: {
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          criticalPath: [],
          slackTime: {}
        },
        resourceAllocation: {
          teamAssignments: [],
          budgetAllocation: {},
          toolAllocation: []
        }
      },
      prioritization: {
        priorityMatrix: [],
        dependencies: [],
        optimization: {
          efficiency: 0,
          riskMitigation: 0,
          resourceUtilization: 0,
          recommendations: []
        }
      },
      recommendations: {
        immediate: [],
        shortTerm: [],
        longTerm: []
      },
      insights: {
        keyInsights: [],
        risks: [],
        opportunities: []
      }
    };
  }

  /**
   * Initialize engines
   */
  private initializeEngines(): void {
    // Initialize action planning engines
    this.planningEngine.set('structure', this.generateActionPlanStructure.bind(this));
    this.planningEngine.set('prioritization', this.generatePrioritization.bind(this));
    this.planningEngine.set('recommendations', this.generateRecommendations.bind(this));
  }
}


