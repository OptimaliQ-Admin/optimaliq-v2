/**
 * AI Roadmap Generation for Growth Planning
 * Intelligent roadmap creation with milestones and optimization
 */

import { z } from 'zod';

// Roadmap Generation Schema
const RoadmapGenerationSchema = z.object({
  assessmentScores: z.record(z.number().finite()),
  industry: z.string(),
  companySize: z.string(),
  goals: z.array(z.string()),
  timeline: z.number().finite(), // months
  budget: z.number().finite().optional(),
  teamSize: z.number().finite().optional()
});

export type RoadmapGenerationRequest = z.infer<typeof RoadmapGenerationSchema>;

// Roadmap Item Schema
const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  priority: z.number().finite().min(1).max(5),
  effort: z.number().finite().min(1).max(5),
  timeline: z.number().finite(), // weeks
  dependencies: z.array(z.string()),
  estimatedCost: z.number().finite().optional(),
  requiredSkills: z.array(z.string()),
  successMetrics: z.array(z.string()),
  riskLevel: z.enum(['low', 'medium', 'high']),
  isCompleted: z.boolean().default(false)
});

export type RoadmapItem = z.infer<typeof RoadmapItemSchema>;

// Generated Roadmap Schema
const GeneratedRoadmapSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  items: z.array(RoadmapItemSchema),
  timeline: z.number().finite(),
  totalEffort: z.number().finite(),
  estimatedCost: z.number().finite(),
  successProbability: z.number().finite().min(0).max(1),
  criticalPath: z.array(z.string()),
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    items: z.array(z.string())
  })),
  insights: z.array(z.string())
});

export type GeneratedRoadmap = z.infer<typeof GeneratedRoadmapSchema>;

export class AIRoadmapGeneration {
  private industryTemplates: Record<string, any>;
  private bestPractices: Record<string, any>;

  constructor() {
    this.industryTemplates = this.loadIndustryTemplates();
    this.bestPractices = this.loadBestPractices();
  }

  /**
   * Generate AI-powered growth roadmap
   */
  async generateRoadmap(request: RoadmapGenerationRequest): Promise<GeneratedRoadmap> {
    try {
      // Validate input
      const validatedRequest = RoadmapGenerationSchema.parse(request);

      // Analyze assessment scores and identify gaps
      const gapAnalysis = this.analyzeGaps(validatedRequest.assessmentScores);
      
      // Generate roadmap items based on gaps and goals
      const roadmapItems = await this.generateRoadmapItems(validatedRequest, gapAnalysis);
      
      // Optimize timeline and dependencies
      const optimizedItems = this.optimizeTimeline(roadmapItems, validatedRequest.timeline);
      
      // Calculate critical path
      const criticalPath = this.calculateCriticalPath(optimizedItems);
      
      // Generate milestones
      const milestones = this.generateMilestones(optimizedItems, validatedRequest.timeline);
      
      // Calculate success probability
      const successProbability = this.calculateSuccessProbability(optimizedItems, validatedRequest);
      
      // Generate insights
      const insights = this.generateInsights(optimizedItems, gapAnalysis, validatedRequest);

      const roadmap: GeneratedRoadmap = {
        id: this.generateId(),
        title: `${validatedRequest.industry} Growth Roadmap`,
        description: `AI-generated roadmap for ${validatedRequest.industry} company growth`,
        items: optimizedItems,
        timeline: validatedRequest.timeline,
        totalEffort: this.calculateTotalEffort(optimizedItems),
        estimatedCost: this.calculateEstimatedCost(optimizedItems),
        successProbability,
        criticalPath,
        milestones,
        insights
      };

      return GeneratedRoadmapSchema.parse(roadmap);
    } catch (error) {
      throw new Error(`Roadmap generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze gaps based on assessment scores
   */
  private analyzeGaps(scores: Record<string, number>): Record<string, number> {
    const gaps: Record<string, number> = {};
    const targetScores: Record<string, number> = {
      strategy: 8.0,
      process: 7.5,
      technology: 8.5,
      team: 7.0,
      market: 7.5
    };

    Object.entries(scores).forEach(([category, score]) => {
      const target = targetScores[category] || 7.0;
      gaps[category] = Math.max(0, target - score);
    });

    return gaps;
  }

  /**
   * Generate roadmap items based on gaps and goals
   */
  private async generateRoadmapItems(request: RoadmapGenerationRequest, gaps: Record<string, number>): Promise<RoadmapItem[]> {
    const items: RoadmapItem[] = [];
    
    // Generate items for each category with gaps
    Object.entries(gaps).forEach(([category, gap]) => {
      if (gap > 1.0) { // Only address significant gaps
        const categoryItems = this.generateCategoryItems(category, gap, request);
        items.push(...categoryItems);
      }
    });

    // Add goal-specific items
    request.goals.forEach(goal => {
      const goalItems = this.generateGoalItems(goal, request);
      items.push(...goalItems);
    });

    // Add industry-specific items
    const industryItems = this.generateIndustryItems(request.industry, request);
    items.push(...industryItems);

    return items;
  }

  /**
   * Generate items for a specific category
   */
  private generateCategoryItems(category: string, gap: number, request: RoadmapGenerationRequest): RoadmapItem[] {
    const items: RoadmapItem[] = [];
    
    const categoryTemplates = this.industryTemplates[request.industry]?.[category] || this.industryTemplates.default[category];
    
    categoryTemplates.forEach((template: any, index: number) => {
      const priority = Math.min(5, Math.max(1, Math.ceil(gap * template.priorityMultiplier)));
      const effort = Math.min(5, Math.max(1, Math.ceil(template.baseEffort * (gap / 3))));
      
      items.push({
        id: `${category}-${index + 1}`,
        title: template.title,
        description: template.description,
        category,
        priority,
        effort,
        timeline: template.baseTimeline * (effort / 3), // weeks
        dependencies: template.dependencies || [],
        estimatedCost: template.baseCost * (effort / 3),
        requiredSkills: template.requiredSkills || [],
        successMetrics: template.successMetrics || [],
        riskLevel: template.riskLevel || 'medium',
        isCompleted: false
      });
    });

    return items;
  }

  /**
   * Generate items for specific goals
   */
  private generateGoalItems(goal: string, request: RoadmapGenerationRequest): RoadmapItem[] {
    const items: RoadmapItem[] = [];
    
    // Map common goals to specific roadmap items
    const goalMappings: Record<string, any[]> = {
      'increase revenue': [
        {
          title: 'Revenue Optimization Strategy',
          description: 'Develop comprehensive revenue optimization strategy',
          category: 'strategy',
          baseEffort: 4,
          baseTimeline: 8,
          baseCost: 15000,
          priorityMultiplier: 1.2
        }
      ],
      'improve efficiency': [
        {
          title: 'Process Optimization Initiative',
          description: 'Streamline operational processes for improved efficiency',
          category: 'process',
          baseEffort: 3,
          baseTimeline: 6,
          baseCost: 10000,
          priorityMultiplier: 1.1
        }
      ],
      'expand market': [
        {
          title: 'Market Expansion Strategy',
          description: 'Develop and execute market expansion plan',
          category: 'market',
          baseEffort: 5,
          baseTimeline: 12,
          baseCost: 25000,
          priorityMultiplier: 1.3
        }
      ]
    };

    const mappings = goalMappings[goal.toLowerCase()] || [];
    mappings.forEach((mapping, index) => {
      items.push({
        id: `goal-${goal.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
        title: mapping.title,
        description: mapping.description,
        category: mapping.category,
        priority: Math.ceil(mapping.priorityMultiplier * 3),
        effort: mapping.baseEffort,
        timeline: mapping.baseTimeline,
        dependencies: [],
        estimatedCost: mapping.baseCost,
        requiredSkills: [],
        successMetrics: [],
        riskLevel: 'medium',
        isCompleted: false
      });
    });

    return items;
  }

  /**
   * Generate industry-specific items
   */
  private generateIndustryItems(industry: string, request: RoadmapGenerationRequest): RoadmapItem[] {
    const items: RoadmapItem[] = [];
    
    const industrySpecific = this.industryTemplates[industry]?.specific || [];
    
    industrySpecific.forEach((item: any, index: number) => {
      items.push({
        id: `industry-${industry}-${index + 1}`,
        title: item.title,
        description: item.description,
        category: item.category,
        priority: item.priority,
        effort: item.effort,
        timeline: item.timeline,
        dependencies: item.dependencies || [],
        estimatedCost: item.estimatedCost,
        requiredSkills: item.requiredSkills || [],
        successMetrics: item.successMetrics || [],
        riskLevel: item.riskLevel || 'medium',
        isCompleted: false
      });
    });

    return items;
  }

  /**
   * Optimize timeline and dependencies
   */
  private optimizeTimeline(items: RoadmapItem[], maxTimeline: number): RoadmapItem[] {
    // Sort by priority and effort
    const sortedItems = [...items].sort((a, b) => {
      const priorityDiff = b.priority - a.priority;
      if (priorityDiff !== 0) return priorityDiff;
      return a.effort - b.effort; // Lower effort first for same priority
    });

    // Calculate dependencies and adjust timelines
    const optimizedItems = sortedItems.map(item => {
      const dependencies = this.calculateDependencies(item, sortedItems);
      const adjustedTimeline = Math.max(item.timeline, dependencies.maxDependencyEnd);
      
      return {
        ...item,
        dependencies: dependencies.dependencyIds,
        timeline: Math.min(adjustedTimeline, maxTimeline * 4) // Convert months to weeks, cap at max timeline
      };
    });

    return optimizedItems;
  }

  /**
   * Calculate dependencies for an item
   */
  private calculateDependencies(item: RoadmapItem, allItems: RoadmapItem[]): { dependencyIds: string[], maxDependencyEnd: number } {
    const dependencyIds: string[] = [];
    let maxDependencyEnd = 0;

    // Find items that should be completed before this one
    allItems.forEach(potentialDependency => {
      if (potentialDependency.id !== item.id) {
        // Check if this item depends on the potential dependency
        if (this.shouldDependOn(item, potentialDependency)) {
          dependencyIds.push(potentialDependency.id);
          maxDependencyEnd = Math.max(maxDependencyEnd, potentialDependency.timeline);
        }
      }
    });

    return { dependencyIds, maxDependencyEnd };
  }

  /**
   * Determine if one item should depend on another
   */
  private shouldDependOn(item: RoadmapItem, dependency: RoadmapItem): boolean {
    // Same category with higher priority
    if (item.category === dependency.category && dependency.priority > item.priority) {
      return true;
    }
    
    // Infrastructure dependencies
    if (item.category === 'technology' && dependency.category === 'process') {
      return true;
    }
    
    // Strategy dependencies
    if (item.category === 'market' && dependency.category === 'strategy') {
      return true;
    }

    return false;
  }

  /**
   * Calculate critical path
   */
  private calculateCriticalPath(items: RoadmapItem[]): string[] {
    // Simple critical path calculation based on longest duration
    const itemDurations = items.map(item => ({
      id: item.id,
      duration: item.timeline + this.calculateDependencyDelay(item, items)
    }));

    itemDurations.sort((a, b) => b.duration - a.duration);
    
    return itemDurations.slice(0, Math.min(5, itemDurations.length)).map(item => item.id);
  }

  /**
   * Calculate dependency delay for an item
   */
  private calculateDependencyDelay(item: RoadmapItem, allItems: RoadmapItem[]): number {
    let maxDelay = 0;
    
    item.dependencies.forEach(depId => {
      const dependency = allItems.find(item => item.id === depId);
      if (dependency) {
        maxDelay = Math.max(maxDelay, dependency.timeline);
      }
    });

    return maxDelay;
  }

  /**
   * Generate milestones
   */
  private generateMilestones(items: RoadmapItem[], timeline: number): GeneratedRoadmap['milestones'] {
    const milestones: GeneratedRoadmap['milestones'] = [];
    const timelineWeeks = timeline * 4; // Convert months to weeks
    
    // Create quarterly milestones
    const quarterWeeks = timelineWeeks / 4;
    
    for (let i = 1; i <= 4; i++) {
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + (quarterWeeks * 7 * i));
      
      const milestoneItems = items.filter(item => 
        item.timeline <= quarterWeeks * i && 
        item.timeline > quarterWeeks * (i - 1)
      );

      milestones.push({
        id: `milestone-${i}`,
        title: `Quarter ${i} Milestone`,
        date: milestoneDate.toISOString().split('T')[0],
        items: milestoneItems.map(item => item.id)
      });
    }

    return milestones;
  }

  /**
   * Calculate success probability
   */
  private calculateSuccessProbability(items: RoadmapItem[], request: RoadmapGenerationRequest): number {
    let baseProbability = 0.7; // Base 70% success rate
    
    // Adjust based on team size
    if (request.teamSize) {
      if (request.teamSize >= 10) baseProbability += 0.1;
      else if (request.teamSize < 5) baseProbability -= 0.1;
    }
    
    // Adjust based on budget
    if (request.budget) {
      const totalCost = this.calculateEstimatedCost(items);
      if (request.budget >= totalCost * 1.2) baseProbability += 0.1;
      else if (request.budget < totalCost * 0.8) baseProbability -= 0.2;
    }
    
    // Adjust based on risk levels
    const highRiskItems = items.filter(item => item.riskLevel === 'high');
    const riskPenalty = highRiskItems.length * 0.05;
    baseProbability -= riskPenalty;
    
    return Math.max(0.1, Math.min(0.95, baseProbability));
  }

  /**
   * Generate insights
   */
  private generateInsights(items: RoadmapItem[], gaps: Record<string, number>, request: RoadmapGenerationRequest): string[] {
    const insights: string[] = [];
    
    // Gap analysis insights
    const largestGap = Object.entries(gaps).reduce((max, [category, gap]) => 
      gap > max.gap ? { category, gap } : max, { category: '', gap: 0 }
    );
    
    if (largestGap.gap > 2) {
      insights.push(`${largestGap.category.charAt(0).toUpperCase() + largestGap.category.slice(1)} has the largest improvement opportunity (${largestGap.gap.toFixed(1)} points)`);
    }
    
    // Priority insights
    const highPriorityItems = items.filter(item => item.priority >= 4);
    if (highPriorityItems.length > 0) {
      insights.push(`${highPriorityItems.length} high-priority initiatives identified for immediate focus`);
    }
    
    // Timeline insights
    const totalTimeline = Math.max(...items.map(item => item.timeline));
    if (totalTimeline > request.timeline * 4) {
      insights.push(`Roadmap timeline (${(totalTimeline / 4).toFixed(1)} months) exceeds target timeline (${request.timeline} months)`);
    }
    
    // Cost insights
    const totalCost = this.calculateEstimatedCost(items);
    if (request.budget && totalCost > request.budget) {
      insights.push(`Estimated cost ($${totalCost.toLocaleString()}) exceeds budget ($${request.budget.toLocaleString()})`);
    }
    
    return insights;
  }

  // Helper methods
  private generateId(): string {
    return `roadmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateTotalEffort(items: RoadmapItem[]): number {
    return items.reduce((total, item) => total + item.effort, 0);
  }

  private calculateEstimatedCost(items: RoadmapItem[]): number {
    return items.reduce((total, item) => total + (item.estimatedCost || 0), 0);
  }

  private loadIndustryTemplates(): Record<string, any> {
    return {
      technology: {
        strategy: [
          {
            title: 'Digital Transformation Strategy',
            description: 'Develop comprehensive digital transformation roadmap',
            baseEffort: 4,
            baseTimeline: 8,
            baseCost: 20000,
            priorityMultiplier: 1.2
          }
        ],
        specific: [
          {
            title: 'Cloud Migration Planning',
            description: 'Plan and execute cloud infrastructure migration',
            category: 'technology',
            priority: 4,
            effort: 5,
            timeline: 12,
            estimatedCost: 30000,
            requiredSkills: ['Cloud Architecture', 'DevOps'],
            successMetrics: ['Migration completion', 'Performance improvement'],
            riskLevel: 'high'
          }
        ]
      },
      default: {
        strategy: [
          {
            title: 'Strategic Planning Framework',
            description: 'Develop strategic planning and execution framework',
            baseEffort: 3,
            baseTimeline: 6,
            baseCost: 15000,
            priorityMultiplier: 1.0
          }
        ]
      }
    };
  }

  private loadBestPractices(): Record<string, any> {
    return {
      timeline: {
        short: '3-6 months',
        medium: '6-12 months',
        long: '12+ months'
      },
      priorities: {
        critical: 'Must be completed first',
        high: 'Important for success',
        medium: 'Beneficial but not critical',
        low: 'Nice to have'
      }
    };
  }
}

