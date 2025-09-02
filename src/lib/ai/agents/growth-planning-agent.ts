import { z } from 'zod';
import { BaseAgent, AgentRequest, AgentResponse, AgentTool } from './base-agent';
import { supabaseService } from '@/lib/supabase';
import { AITask } from '@/lib/ai-router';

// Growth Planning Response Schema
const GrowthPlanningResponseSchema = z.object({
  growthLevers: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    impact: z.number().finite().min(0).max(10),
    effort: z.number().finite().min(0).max(10),
    priority: z.number().finite().min(0).max(10),
    timeline: z.number().finite().min(1).max(12),
    dependencies: z.array(z.string()).default([])
  })),
  scenarios: z.array(z.object({
    name: z.string(),
    description: z.string(),
    projectedGrowth: z.number().finite(),
    confidence: z.number().finite().min(0).max(1),
    assumptions: z.array(z.string())
  })),
  milestones: z.array(z.object({
    title: z.string(),
    description: z.string(),
    targetDate: z.string(),
    metrics: z.record(z.number().finite()),
    dependencies: z.array(z.string())
  })),
  riskAssessment: z.object({
    risks: z.array(z.object({
      risk: z.string(),
      probability: z.number().finite().min(0).max(1),
      impact: z.number().finite().min(0).max(10),
      mitigation: z.string()
    })),
    overallRiskScore: z.number().finite().min(0).max(10)
  })
});

type GrowthPlanningResponse = z.infer<typeof GrowthPlanningResponseSchema>;

export interface GrowthPlanningRequest extends AgentRequest {
  currentScores: {
    strategy: number;
    process: number;
    technology: number;
    overall: number;
  };
  industry: string;
  companySize: string;
  revenueRange: string;
  previousPlans?: any[];
}

export class GrowthPlanningAgent extends BaseAgent {
  constructor() {
    super('GrowthPlanningAgent', 'Creates comprehensive growth plans, scenarios, and recommendations');
    this.registerTools();
  }

  private registerTools(): void {
    // Historical data tool
    const historicalDataTool: AgentTool = {
      name: 'getHistoricalData',
      description: 'Retrieve historical assessment and growth data',
      parameters: z.object({
        userId: z.string(),
        months: z.number().finite().default(12)
      }),
      execute: async (params) => {
        try {
          const assessments = await supabaseService.getUserAssessments(params.userId);
          const insights = await supabaseService.getDashboardInsights(params.userId);
          return { assessments, insights };
        } catch (error) {
          return { assessments: [], insights: null };
        }
      }
    };

    // Growth levers tool
    const growthLeversTool: AgentTool = {
      name: 'getExistingLevers',
      description: 'Get existing growth levers for the user',
      parameters: z.object({
        userId: z.string()
      }),
      execute: async (params) => {
        try {
          return await supabaseService.getGrowthLevers(params.userId);
        } catch (error) {
          return [];
        }
      }
    };

    // Industry insights tool
    const industryInsightsTool: AgentTool = {
      name: 'getIndustryInsights',
      description: 'Get industry-specific trends and insights',
      parameters: z.object({
        industry: z.string()
      }),
      execute: async (params) => {
        try {
          return await supabaseService.getMarketSnapshots(params.industry);
        } catch (error) {
          return [];
        }
      }
    };

    this.registerTool(historicalDataTool);
    this.registerTool(growthLeversTool);
    this.registerTool(industryInsightsTool);
  }

  async plan(request: GrowthPlanningRequest): Promise<string[]> {
    const plan = [
      'Analyze current performance scores and gaps',
      'Retrieve historical data and trends',
      'Get existing growth levers and progress',
      'Analyze industry context and opportunities',
      'Generate new growth levers and prioritize',
      'Create scenario planning and projections',
      'Develop milestone timeline',
      'Assess risks and mitigation strategies',
      'Format comprehensive growth plan'
    ];

    this.setMemory('currentScores', request.currentScores);
    this.setMemory('industry', request.industry);
    this.setMemory('companySize', request.companySize);
    this.setMemory('revenueRange', request.revenueRange);

    return plan;
  }

  async execute(_plan: string[], request: GrowthPlanningRequest): Promise<any> {
    const results: any = {};

    try {
      // Get historical data
      const historicalData = await this.executeTool('getHistoricalData', {
        userId: request.userId || 'default'
      });

      // Get existing growth levers
      const existingLevers = await this.executeTool('getExistingLevers', {
        userId: request.userId || 'default'
      });

      // Get industry insights
      const industryInsights = await this.executeTool('getIndustryInsights', {
        industry: request.industry
      });

      // Generate growth plan using AI
      const growthPlanPrompt = this.buildGrowthPlanPrompt(
        request.currentScores,
        request.industry,
        request.companySize,
        request.revenueRange,
        existingLevers,
        industryInsights
      );

      const aiResponse = await this.generateContent(growthPlanPrompt, AITask.REASONING);
      
      // Parse and validate AI response
      const parsedResponse = await this.validateAndRepairJSON(aiResponse, z.object({
        growthLevers: z.array(z.object({
          title: z.string(),
          description: z.string(),
          category: z.string(),
          impact: z.number().finite(),
          effort: z.number().finite(),
          priority: z.number().finite(),
          timeline: z.number().finite()
        })),
        scenarios: z.array(z.object({
          name: z.string(),
          description: z.string(),
          projectedGrowth: z.number().finite(),
          confidence: z.number().finite(),
          assumptions: z.array(z.string())
        })),
        milestones: z.array(z.object({
          title: z.string(),
          description: z.string(),
          targetDate: z.string(),
          metrics: z.record(z.number().finite())
        })),
        risks: z.array(z.object({
          risk: z.string(),
          probability: z.number().finite(),
          impact: z.number().finite(),
          mitigation: z.string()
        }))
      }));

      results.growthPlan = parsedResponse;
      results.historicalData = historicalData;

      return results;

    } catch (error) {
      throw new Error(`Growth planning execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validate(result: any): Promise<AgentResponse<GrowthPlanningResponse>> {
    try {
      const formattedResponse: GrowthPlanningResponse = {
        growthLevers: result.growthPlan.growthLevers.map((lever: any, index: number) => ({
          id: `lever_${index + 1}`,
          title: lever.title,
          description: lever.description,
          category: lever.category,
          impact: lever.impact,
          effort: lever.effort,
          priority: lever.priority,
          timeline: lever.timeline,
          dependencies: lever.dependencies || []
        })),
        scenarios: result.growthPlan.scenarios,
        milestones: result.growthPlan.milestones.map((milestone: any) => ({
          ...milestone,
          dependencies: milestone.dependencies || []
        })),
        riskAssessment: {
          risks: result.growthPlan.risks,
          overallRiskScore: this.calculateOverallRisk(result.growthPlan.risks)
        }
      };

      const validatedResponse = GrowthPlanningResponseSchema.parse(formattedResponse);

      return {
        success: true,
        data: validatedResponse,
        citations: []
      };

    } catch (error) {
      return {
        success: false,
        data: {} as GrowthPlanningResponse,
        errors: [error instanceof Error ? error.message : 'Growth planning validation failed']
      };
    }
  }

  // Build comprehensive growth planning prompt
  private buildGrowthPlanPrompt(
    scores: any,
    industry: string,
    companySize: string,
    revenueRange: string,
    existingLevers: any[],
    industryInsights: any[]
  ): string {
    return `
      You are a McKinsey-level business consultant creating a comprehensive 30-day growth plan.
      
      Company Context:
      - Industry: ${industry}
      - Company Size: ${companySize}
      - Revenue Range: ${revenueRange}
      
      Current Performance Scores:
      - Strategy: ${scores.strategy}/10
      - Process: ${scores.process}/10  
      - Technology: ${scores.technology}/10
      - Overall: ${scores.overall}/10
      
      Existing Growth Levers: ${JSON.stringify(existingLevers, null, 2)}
      
      Industry Insights: ${JSON.stringify(industryInsights, null, 2)}
      
      Create a comprehensive growth plan in JSON format with:
      
      1. **Growth Levers** (5-7 actionable initiatives):
         - Focus on highest impact, lowest effort items first
         - Consider current score gaps and industry benchmarks
         - Include specific, measurable actions
         
      2. **Scenarios** (3 scenarios: conservative, realistic, optimistic):
         - Project growth potential for each scenario
         - Include confidence levels and key assumptions
         
      3. **Milestones** (4-6 monthly milestones):
         - Specific, measurable targets
         - Clear success metrics
         
      4. **Roadmap** (detailed implementation timeline):
         - Phase-by-phase breakdown
         - Resource requirements
         - Success criteria
         
      5. **Risk Assessment** (potential risks and mitigation):
         - Identify key risks for each lever
         - Provide mitigation strategies
         - Include probability and impact scores
      4. **Risk Assessment**:
         - Identify 3-5 key risks to the growth plan
         - Assess probability and impact
         - Provide mitigation strategies
      
      Respond with only valid JSON matching this structure:
      {
        "growthLevers": [...],
        "scenarios": [...], 
        "milestones": [...],
        "risks": [...]
      }
    `;
  }

  // Calculate overall risk score
  private calculateOverallRisk(risks: any[]): number {
    if (risks.length === 0) return 0;
    
    const weightedRiskScore = risks.reduce((total, risk) => {
      return total + (risk.probability * risk.impact);
    }, 0) / risks.length;
    
    return Math.min(10, weightedRiskScore);
  }

  // Generate detailed implementation roadmap
  private generateRoadmap(growthLevers: any[], companySize: string, industry: string): any {
    const roadmap = {
      phases: [
        {
          name: 'Foundation Phase (Weeks 1-2)',
          description: 'Establish baseline and quick wins',
          levers: growthLevers.filter(lever => lever.effort <= 3 && lever.impact >= 7),
          duration: '2 weeks',
          resources: this.calculateResourceRequirements(growthLevers.filter(lever => lever.effort <= 3), companySize),
          successCriteria: [
            'Complete baseline assessment',
            'Implement 2-3 quick wins',
            'Establish measurement framework'
          ]
        },
        {
          name: 'Acceleration Phase (Weeks 3-4)',
          description: 'Implement core growth initiatives',
          levers: growthLevers.filter(lever => lever.effort > 3 && lever.effort <= 6),
          duration: '2 weeks',
          resources: this.calculateResourceRequirements(growthLevers.filter(lever => lever.effort > 3 && lever.effort <= 6), companySize),
          successCriteria: [
            'Launch 3-4 core initiatives',
            'Achieve 15-25% improvement in key metrics',
            'Establish feedback loops'
          ]
        },
        {
          name: 'Optimization Phase (Weeks 5-6)',
          description: 'Refine and scale successful initiatives',
          levers: growthLevers.filter(lever => lever.effort > 6),
          duration: '2 weeks',
          resources: this.calculateResourceRequirements(growthLevers.filter(lever => lever.effort > 6), companySize),
          successCriteria: [
            'Scale successful initiatives',
            'Achieve 30-50% improvement in key metrics',
            'Establish sustainable growth processes'
          ]
        }
      ],
      timeline: {
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(), // 6 weeks
        milestones: this.generateMilestones(growthLevers)
      },
      resourceAllocation: {
        team: this.estimateTeamRequirements(growthLevers, companySize),
        budget: this.estimateBudgetRequirements(growthLevers, companySize, industry),
        tools: this.identifyRequiredTools(growthLevers)
      }
    };

    return roadmap;
  }

  // Calculate resource requirements for a set of levers
  private calculateResourceRequirements(levers: any[], companySize: string): any {
    const totalEffort = levers.reduce((sum, lever) => sum + lever.effort, 0);
    const baseTeamSize = this.getBaseTeamSize(companySize);
    
    return {
      teamMembers: Math.ceil(totalEffort / 10 * baseTeamSize),
      hoursPerWeek: Math.ceil(totalEffort * 2),
      externalConsultants: totalEffort > 20 ? Math.ceil(totalEffort / 10) : 0,
      tools: this.identifyRequiredTools(levers)
    };
  }

  // Get base team size based on company size
  private getBaseTeamSize(companySize: string): number {
    const sizeMap: Record<string, number> = {
      '1-10': 2,
      '11-50': 4,
      '51-200': 8,
      '201-1000': 15,
      '1000+': 25
    };
    return sizeMap[companySize] || 4;
  }

  // Generate milestones based on growth levers
  private generateMilestones(levers: any[]): any[] {
    const milestones = [];
    const sortedLevers = levers.sort((a, b) => a.priority - b.priority);
    
    // Week 1 milestone
    milestones.push({
      week: 1,
      title: 'Foundation Complete',
      description: 'Complete baseline assessment and implement first quick wins',
      levers: sortedLevers.filter(lever => lever.effort <= 3).slice(0, 2),
      successCriteria: '2 quick wins implemented, baseline established'
    });

    // Week 3 milestone
    milestones.push({
      week: 3,
      title: 'Core Initiatives Launched',
      description: 'Launch primary growth initiatives',
      levers: sortedLevers.filter(lever => lever.effort > 3 && lever.effort <= 6).slice(0, 3),
      successCriteria: '3 core initiatives active, 20% metric improvement'
    });

    // Week 6 milestone
    milestones.push({
      week: 6,
      title: 'Growth Optimization',
      description: 'Scale successful initiatives and establish sustainable processes',
      levers: sortedLevers.filter(lever => lever.effort > 6),
      successCriteria: '40% metric improvement, sustainable processes established'
    });

    return milestones;
  }

  // Estimate team requirements
  private estimateTeamRequirements(levers: any[], companySize: string): any {
    const totalEffort = levers.reduce((sum, lever) => sum + lever.effort, 0);
    const baseTeamSize = this.getBaseTeamSize(companySize);
    
    return {
      coreTeam: Math.ceil(totalEffort / 15 * baseTeamSize),
      supportTeam: Math.ceil(totalEffort / 25 * baseTeamSize),
      externalSupport: totalEffort > 30 ? Math.ceil(totalEffort / 20) : 0,
      roles: this.identifyRequiredRoles(levers)
    };
  }

  // Estimate budget requirements
  private estimateBudgetRequirements(levers: any[], companySize: string, industry: string): any {
    const totalEffort = levers.reduce((sum, lever) => sum + lever.effort, 0);
    const baseBudget = this.getBaseBudget(companySize, industry);
    
    return {
      tools: Math.ceil(totalEffort * 100), // $100 per effort point
      consulting: totalEffort > 20 ? Math.ceil(totalEffort * 200) : 0, // $200 per effort point
      training: Math.ceil(totalEffort * 50), // $50 per effort point
      total: Math.ceil(totalEffort * 350) + baseBudget
    };
  }

  // Get base budget based on company size and industry
  private getBaseBudget(companySize: string, industry: string): number {
    const sizeMultiplier: Record<string, number> = {
      '1-10': 1000,
      '11-50': 2500,
      '51-200': 5000,
      '201-1000': 10000,
      '1000+': 25000
    };
    
    const industryMultiplier: Record<string, number> = {
      'technology': 1.2,
      'healthcare': 1.1,
      'finance': 1.3,
      'retail': 0.9,
      'manufacturing': 1.0
    };
    
    const base = sizeMultiplier[companySize] || 2500;
    const multiplier = industryMultiplier[industry] || 1.0;
    
    return Math.ceil(base * multiplier);
  }

  // Identify required tools for growth levers
  private identifyRequiredTools(levers: any[]): string[] {
    const tools = new Set<string>();
    
    levers.forEach(lever => {
      if (lever.category === 'marketing') {
        tools.add('Analytics Platform');
        tools.add('CRM System');
      }
      if (lever.category === 'process') {
        tools.add('Project Management');
        tools.add('Automation Tools');
      }
      if (lever.category === 'technology') {
        tools.add('Development Tools');
        tools.add('Cloud Services');
      }
    });
    
    return Array.from(tools);
  }

  // Identify required roles for growth levers
  private identifyRequiredRoles(levers: any[]): string[] {
    const roles = new Set<string>();
    
    levers.forEach(lever => {
      if (lever.category === 'marketing') {
        roles.add('Marketing Specialist');
        roles.add('Data Analyst');
      }
      if (lever.category === 'process') {
        roles.add('Process Manager');
        roles.add('Operations Specialist');
      }
      if (lever.category === 'technology') {
        roles.add('Developer');
        roles.add('DevOps Engineer');
      }
    });
    
    return Array.from(roles);
  }
}

// Export singleton instance
export const growthPlanningAgent = new GrowthPlanningAgent();
