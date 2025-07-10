import { aiService } from '../service'

export interface GrowthData {
  currentMetrics: {
    revenue: number
    customers: number
    growthRate: number
    churnRate: number
    [key: string]: number
  }
  historicalData: {
    date: string
    revenue: number
    customers: number
    growthRate: number
  }[]
  constraints: {
    budget: number
    timeline: string
    teamSize: number
    marketConditions: string
  }
  goals: {
    targetRevenue: number
    targetCustomers: number
    targetGrowthRate: number
    timeframe: string
  }
}

export interface GrowthLever {
  id: string
  name: string
  category: 'acquisition' | 'retention' | 'monetization' | 'efficiency'
  description: string
  currentValue: number
  potentialValue: number
  cost: number
  effort: 'low' | 'medium' | 'high'
  timeline: string
  dependencies: string[]
  risk: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
}

export interface SimulationResult {
  id: string
  scenario: string
  description: string
  levers: GrowthLever[]
  projections: {
    month: number
    revenue: number
    customers: number
    growthRate: number
    cumulativeCost: number
    roi: number
  }[]
  summary: {
    totalRevenue: number
    totalCustomers: number
    totalCost: number
    totalROI: number
    paybackPeriod: number
    riskLevel: 'low' | 'medium' | 'high'
  }
  assumptions: string[]
  risks: string[]
  recommendations: string[]
}

export interface OptimizationResult {
  id: string
  optimizedLevers: GrowthLever[]
  budgetAllocation: {
    leverId: string
    allocation: number
    percentage: number
  }[]
  expectedOutcomes: {
    revenue: number
    customers: number
    growthRate: number
    roi: number
  }
  timeline: {
    phase: string
    duration: string
    levers: string[]
    expectedResults: any
  }[]
  riskMitigation: string[]
  successMetrics: string[]
}

export interface Roadmap {
  id: string
  title: string
  description: string
  phases: {
    phase: string
    duration: string
    objectives: string[]
    levers: GrowthLever[]
    milestones: {
      milestone: string
      date: string
      criteria: string[]
    }[]
    expectedOutcomes: {
      revenue: number
      customers: number
      growthRate: number
    }
  }[]
  totalInvestment: number
  expectedROI: number
  timeline: string
  successCriteria: string[]
  riskFactors: string[]
}

export interface CompetitiveAnalysis {
  id: string
  competitors: {
    name: string
    strengths: string[]
    weaknesses: string[]
    marketShare: number
    growthRate: number
    strategies: string[]
  }[]
  marketPosition: {
    current: string
    target: string
    gap: string
  }
  opportunities: string[]
  threats: string[]
  recommendations: string[]
  differentiation: string[]
}

export class GrowthStudioAIService {
  private readonly userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Simulate different growth scenarios
   */
  async simulateGrowthScenarios(data: GrowthData): Promise<SimulationResult[]> {
    const prompt = this.buildSimulationPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 3000
    }, this.userId)

    return this.validateSimulationResults(response.content)
  }

  /**
   * Optimize growth levers for maximum impact
   */
  async optimizeGrowthLevers(levers: GrowthLever[]): Promise<OptimizationResult> {
    const prompt = this.buildOptimizationPrompt(levers)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2500
    }, this.userId)

    return this.validateOptimizationResult(response.content)
  }

  /**
   * Generate comprehensive growth roadmap
   */
  async generateRoadmap(goals: any[]): Promise<Roadmap> {
    const prompt = this.buildRoadmapPrompt(goals)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    }, this.userId)

    return this.validateRoadmap(response.content)
  }

  /**
   * Analyze competitive landscape
   */
  async analyzeCompetition(competitorData: any): Promise<CompetitiveAnalysis> {
    const prompt = this.buildCompetitiveAnalysisPrompt(competitorData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return this.validateCompetitiveAnalysis(response.content)
  }

  /**
   * Calculate ROI for different growth strategies
   */
  async calculateROI(strategies: any[]): Promise<any[]> {
    const prompt = this.buildROICalculationPrompt(strategies)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.2,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  /**
   * Identify growth opportunities
   */
  async identifyOpportunities(data: GrowthData): Promise<any[]> {
    const prompt = this.buildOpportunityIdentificationPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  /**
   * Generate market entry strategies
   */
  async generateMarketEntryStrategies(marketData: any): Promise<any[]> {
    const prompt = this.buildMarketEntryPrompt(marketData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return response.content
  }

  // Private helper methods for building prompts

  private buildSimulationPrompt(data: GrowthData): string {
    return `Simulate different growth scenarios based on the following data:

Growth Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with simulation results for different scenarios:
[
  {
    "id": "string",
    "scenario": "conservative|moderate|aggressive",
    "description": "string",
    "levers": [
      {
        "id": "string",
        "name": "string",
        "category": "acquisition|retention|monetization|efficiency",
        "description": "string",
        "currentValue": number,
        "potentialValue": number,
        "cost": number,
        "effort": "low|medium|high",
        "timeline": "string",
        "dependencies": ["string"],
        "risk": "low|medium|high",
        "impact": "low|medium|high"
      }
    ],
    "projections": [
      {
        "month": number,
        "revenue": number,
        "customers": number,
        "growthRate": number,
        "cumulativeCost": number,
        "roi": number
      }
    ],
    "summary": {
      "totalRevenue": number,
      "totalCustomers": number,
      "totalCost": number,
      "totalROI": number,
      "paybackPeriod": number,
      "riskLevel": "low|medium|high"
    },
    "assumptions": ["string"],
    "risks": ["string"],
    "recommendations": ["string"]
  }
]

Create realistic projections based on historical data and market conditions.`
  }

  private buildOptimizationPrompt(levers: GrowthLever[]): string {
    return `Optimize the following growth levers for maximum impact:

Growth Levers:
${JSON.stringify(levers, null, 2)}

Please provide a JSON response with optimization results:
{
  "id": "string",
  "optimizedLevers": [],
  "budgetAllocation": [
    {
      "leverId": "string",
      "allocation": number,
      "percentage": number
    }
  ],
  "expectedOutcomes": {
    "revenue": number,
    "customers": number,
    "growthRate": number,
    "roi": number
  },
  "timeline": [
    {
      "phase": "string",
      "duration": "string",
      "levers": ["string"],
      "expectedResults": {}
    }
  ],
  "riskMitigation": ["string"],
  "successMetrics": ["string"]
}

Optimize for maximum ROI while considering risk and resource constraints.`
  }

  private buildRoadmapPrompt(goals: any[]): string {
    return `Generate a comprehensive growth roadmap based on the following goals:

Goals:
${JSON.stringify(goals, null, 2)}

Please provide a JSON response with a detailed roadmap:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "phases": [
    {
      "phase": "string",
      "duration": "string",
      "objectives": ["string"],
      "levers": [],
      "milestones": [
        {
          "milestone": "string",
          "date": "string",
          "criteria": ["string"]
        }
      ],
      "expectedOutcomes": {
        "revenue": number,
        "customers": number,
        "growthRate": number
      }
    }
  ],
  "totalInvestment": number,
  "expectedROI": number,
  "timeline": "string",
  "successCriteria": ["string"],
  "riskFactors": ["string"]
}

Create a phased approach with clear milestones and success criteria.`
  }

  private buildCompetitiveAnalysisPrompt(competitorData: any): string {
    return `Analyze the competitive landscape based on the following data:

Competitor Data:
${JSON.stringify(competitorData, null, 2)}

Please provide a JSON response with competitive analysis:
{
  "id": "string",
  "competitors": [
    {
      "name": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "marketShare": number,
      "growthRate": number,
      "strategies": ["string"]
    }
  ],
  "marketPosition": {
    "current": "string",
    "target": "string",
    "gap": "string"
  },
  "opportunities": ["string"],
  "threats": ["string"],
  "recommendations": ["string"],
  "differentiation": ["string"]
}

Provide actionable insights for competitive positioning and differentiation.`
  }

  private buildROICalculationPrompt(strategies: any[]): string {
    return `Calculate ROI for the following growth strategies:

Strategies:
${JSON.stringify(strategies, null, 2)}

Please provide a JSON response with ROI calculations for each strategy, including payback period, risk assessment, and recommendations.`
  }

  private buildOpportunityIdentificationPrompt(data: GrowthData): string {
    return `Identify growth opportunities based on the following data:

Growth Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response identifying specific growth opportunities with potential impact, effort required, and implementation recommendations.`
  }

  private buildMarketEntryPrompt(marketData: any): string {
    return `Generate market entry strategies based on the following market data:

Market Data:
${JSON.stringify(marketData, null, 2)}

Please provide a JSON response with market entry strategies, including timing, approach, resource requirements, and risk mitigation.`
  }

  // Validation methods

  private validateSimulationResults(content: any): SimulationResult[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid simulation results response format')
    }

    return content.map(simulation => ({
      id: simulation.id || crypto.randomUUID(),
      scenario: simulation.scenario || 'moderate',
      description: simulation.description || '',
      levers: Array.isArray(simulation.levers) ? simulation.levers : [],
      projections: Array.isArray(simulation.projections) ? simulation.projections : [],
      summary: simulation.summary || {
        totalRevenue: 0,
        totalCustomers: 0,
        totalCost: 0,
        totalROI: 0,
        paybackPeriod: 0,
        riskLevel: 'medium'
      },
      assumptions: Array.isArray(simulation.assumptions) ? simulation.assumptions : [],
      risks: Array.isArray(simulation.risks) ? simulation.risks : [],
      recommendations: Array.isArray(simulation.recommendations) ? simulation.recommendations : []
    }))
  }

  private validateOptimizationResult(content: any): OptimizationResult {
    if (!content.optimizedLevers || !content.budgetAllocation) {
      throw new Error('Invalid optimization result response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      optimizedLevers: Array.isArray(content.optimizedLevers) ? content.optimizedLevers : [],
      budgetAllocation: Array.isArray(content.budgetAllocation) ? content.budgetAllocation : [],
      expectedOutcomes: content.expectedOutcomes || {
        revenue: 0,
        customers: 0,
        growthRate: 0,
        roi: 0
      },
      timeline: Array.isArray(content.timeline) ? content.timeline : [],
      riskMitigation: Array.isArray(content.riskMitigation) ? content.riskMitigation : [],
      successMetrics: Array.isArray(content.successMetrics) ? content.successMetrics : []
    }
  }

  private validateRoadmap(content: any): Roadmap {
    if (!content.phases || !Array.isArray(content.phases)) {
      throw new Error('Invalid roadmap response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      title: content.title || 'Growth Roadmap',
      description: content.description || '',
      phases: content.phases,
      totalInvestment: content.totalInvestment || 0,
      expectedROI: content.expectedROI || 0,
      timeline: content.timeline || '12 months',
      successCriteria: Array.isArray(content.successCriteria) ? content.successCriteria : [],
      riskFactors: Array.isArray(content.riskFactors) ? content.riskFactors : []
    }
  }

  private validateCompetitiveAnalysis(content: any): CompetitiveAnalysis {
    if (!content.competitors || !Array.isArray(content.competitors)) {
      throw new Error('Invalid competitive analysis response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      competitors: content.competitors,
      marketPosition: content.marketPosition || {
        current: 'unknown',
        target: 'unknown',
        gap: 'unknown'
      },
      opportunities: Array.isArray(content.opportunities) ? content.opportunities : [],
      threats: Array.isArray(content.threats) ? content.threats : [],
      recommendations: Array.isArray(content.recommendations) ? content.recommendations : [],
      differentiation: Array.isArray(content.differentiation) ? content.differentiation : []
    }
  }
} 