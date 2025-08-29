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
    impact: z.number().min(0).max(10),
    effort: z.number().min(0).max(10),
    priority: z.number().min(0).max(10),
    timeline: z.number().min(1).max(12),
    dependencies: z.array(z.string()).default([])
  })),
  scenarios: z.array(z.object({
    name: z.string(),
    description: z.string(),
    projectedGrowth: z.number(),
    confidence: z.number().min(0).max(1),
    assumptions: z.array(z.string())
  })),
  milestones: z.array(z.object({
    title: z.string(),
    description: z.string(),
    targetDate: z.string(),
    metrics: z.record(z.number()),
    dependencies: z.array(z.string())
  })),
  riskAssessment: z.object({
    risks: z.array(z.object({
      risk: z.string(),
      probability: z.number().min(0).max(1),
      impact: z.number().min(0).max(10),
      mitigation: z.string()
    })),
    overallRiskScore: z.number().min(0).max(10)
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
        months: z.number().default(12)
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
          impact: z.number(),
          effort: z.number(),
          priority: z.number(),
          timeline: z.number()
        })),
        scenarios: z.array(z.object({
          name: z.string(),
          description: z.string(),
          projectedGrowth: z.number(),
          confidence: z.number(),
          assumptions: z.array(z.string())
        })),
        milestones: z.array(z.object({
          title: z.string(),
          description: z.string(),
          targetDate: z.string(),
          metrics: z.record(z.number())
        })),
        risks: z.array(z.object({
          risk: z.string(),
          probability: z.number(),
          impact: z.number(),
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
}

// Export singleton instance
export const growthPlanningAgent = new GrowthPlanningAgent();
