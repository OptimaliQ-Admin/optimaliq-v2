import { aiService } from '../service'
import { AIAnalysis, AIResponse } from '../client'

export interface AssessmentResponse {
  questionId: string
  question: string
  answer: string
  category: string
  weight: number
}

export interface AssessmentScore {
  overall: number
  strategy: number
  process: number
  technology: number
  people: number
  confidence: number
  breakdown: {
    category: string
    score: number
    maxScore: number
    percentage: number
  }[]
}

export interface AssessmentInsight {
  id: string
  type: 'strength' | 'weakness' | 'opportunity' | 'threat'
  category: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  evidence: string[]
  recommendations: string[]
}

export interface Recommendation {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  impact: 'high' | 'medium' | 'low'
  timeline: 'immediate' | 'short-term' | 'long-term'
  resources: string[]
  successMetrics: string[]
}

export interface ActionPlan {
  id: string
  title: string
  description: string
  phases: {
    phase: string
    duration: string
    objectives: string[]
    actions: {
      title: string
      description: string
      owner: string
      timeline: string
      dependencies: string[]
    }[]
  }[]
  successCriteria: string[]
  riskMitigation: string[]
}

export class AssessmentAIService {
  private readonly userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Analyze assessment responses and generate comprehensive insights
   */
  async analyzeResponses(responses: AssessmentResponse[]): Promise<AIAnalysis> {
    const prompt = this.buildAnalysisPrompt(responses)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2000
    }, this.userId)

    return this.validateAnalysis(response.content)
  }

  /**
   * Score assessment responses using AI analysis
   */
  async scoreAssessment(responses: AssessmentResponse[]): Promise<AssessmentScore> {
    const prompt = this.buildScoringPrompt(responses)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.2,
      maxTokens: 1500
    }, this.userId)

    return this.validateScore(response.content)
  }

  /**
   * Generate insights from assessment data
   */
  async generateInsights(assessmentData: any): Promise<AssessmentInsight[]> {
    const prompt = this.buildInsightsPrompt(assessmentData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return this.validateInsights(response.content)
  }

  /**
   * Generate recommendations based on assessment analysis
   */
  async generateRecommendations(analysis: AIAnalysis): Promise<Recommendation[]> {
    const prompt = this.buildRecommendationsPrompt(analysis)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return this.validateRecommendations(response.content)
  }

  /**
   * Create comprehensive action plan from recommendations
   */
  async createActionPlan(recommendations: Recommendation[]): Promise<ActionPlan> {
    const prompt = this.buildActionPlanPrompt(recommendations)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    }, this.userId)

    return this.validateActionPlan(response.content)
  }

  /**
   * Compare assessment results with industry benchmarks
   */
  async compareWithBenchmarks(assessmentData: any, industry: string): Promise<any> {
    const prompt = this.buildBenchmarkPrompt(assessmentData, industry)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 1500
    }, this.userId)

    return response.content
  }

  /**
   * Generate personalized growth recommendations
   */
  async generateGrowthRecommendations(assessmentData: any, companySize: string, industry: string): Promise<any> {
    const prompt = this.buildGrowthPrompt(assessmentData, companySize, industry)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  // Private helper methods for building prompts

  private buildAnalysisPrompt(responses: AssessmentResponse[]): string {
    const categorizedResponses = this.categorizeResponses(responses)
    
    return `Analyze the following business assessment responses and provide a comprehensive analysis.

Assessment Responses by Category:
${Object.entries(categorizedResponses).map(([category, responses]) => `
${category}:
${responses.map(r => `- ${r.question}: ${r.answer}`).join('\n')}
`).join('\n')}

Please provide a JSON response with the following structure:
{
  "scores": {
    "strategy": number (1-5),
    "process": number (1-5),
    "technology": number (1-5),
    "people": number (1-5),
    "overall": number (1-5)
  },
  "insights": [
    {
      "type": "strength|weakness|opportunity|threat",
      "category": "string",
      "description": "string",
      "impact": "high|medium|low"
    }
  ],
  "recommendations": [
    {
      "category": "string",
      "priority": "high|medium|low",
      "description": "string"
    }
  ],
  "confidence": number (0-1)
}

Focus on providing actionable insights and specific recommendations based on the assessment responses.`
  }

  private buildScoringPrompt(responses: AssessmentResponse[]): string {
    const categorizedResponses = this.categorizeResponses(responses)
    
    return `Score the following assessment responses on a scale of 1-5 for each category.

Assessment Responses:
${Object.entries(categorizedResponses).map(([category, responses]) => `
${category}:
${responses.map(r => `- ${r.question}: ${r.answer}`).join('\n')}
`).join('\n')}

Please provide a JSON response with the following structure:
{
  "overall": number (1-5),
  "strategy": number (1-5),
  "process": number (1-5),
  "technology": number (1-5),
  "people": number (1-5),
  "confidence": number (0-1),
  "breakdown": [
    {
      "category": "string",
      "score": number (1-5),
      "maxScore": number,
      "percentage": number (0-100)
    }
  ]
}

Consider the quality, completeness, and strategic thinking demonstrated in each response.`
  }

  private buildInsightsPrompt(assessmentData: any): string {
    return `Generate detailed insights from the following assessment data:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Please provide a JSON response with an array of insights:
[
  {
    "id": "string",
    "type": "strength|weakness|opportunity|threat",
    "category": "string",
    "title": "string",
    "description": "string",
    "impact": "high|medium|low",
    "evidence": ["string"],
    "recommendations": ["string"]
  }
]

Focus on identifying patterns, trends, and actionable insights that can drive business improvement.`
  }

  private buildRecommendationsPrompt(analysis: AIAnalysis): string {
    return `Based on the following assessment analysis, generate specific, actionable recommendations:

Analysis:
${JSON.stringify(analysis, null, 2)}

Please provide a JSON response with an array of recommendations:
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "high|medium|low",
    "effort": "low|medium|high",
    "impact": "high|medium|low",
    "timeline": "immediate|short-term|long-term",
    "resources": ["string"],
    "successMetrics": ["string"]
  }
]

Prioritize recommendations based on impact and effort, focusing on high-impact, low-effort improvements first.`
  }

  private buildActionPlanPrompt(recommendations: Recommendation[]): string {
    return `Create a comprehensive action plan based on the following recommendations:

Recommendations:
${JSON.stringify(recommendations, null, 2)}

Please provide a JSON response with the following structure:
{
  "id": "string",
  "title": "string",
  "description": "string",
  "phases": [
    {
      "phase": "string",
      "duration": "string",
      "objectives": ["string"],
      "actions": [
        {
          "title": "string",
          "description": "string",
          "owner": "string",
          "timeline": "string",
          "dependencies": ["string"]
        }
      ]
    }
  ],
  "successCriteria": ["string"],
  "riskMitigation": ["string"]
}

Create a phased approach with clear objectives, timelines, and success criteria.`
  }

  private buildBenchmarkPrompt(assessmentData: any, industry: string): string {
    return `Compare the following assessment results with industry benchmarks for ${industry}:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Please provide a JSON response comparing the results with industry standards and identifying areas of strength and improvement opportunities.`
  }

  private buildGrowthPrompt(assessmentData: any, companySize: string, industry: string): string {
    return `Generate personalized growth recommendations for a ${companySize} company in the ${industry} industry based on the following assessment data:

Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Please provide a JSON response with growth-focused recommendations tailored to the company's size and industry.`
  }

  // Helper methods for categorizing and validating responses

  private categorizeResponses(responses: AssessmentResponse[]): Record<string, AssessmentResponse[]> {
    return responses.reduce((acc, response) => {
      if (!acc[response.category]) {
        acc[response.category] = []
      }
      acc[response.category].push(response)
      return acc
    }, {} as Record<string, AssessmentResponse[]>)
  }

  private validateAnalysis(content: any): AIAnalysis {
    if (!content.scores || !content.insights || !content.recommendations) {
      throw new Error('Invalid analysis response format')
    }

    return {
      scores: {
        strategy: Math.max(1, Math.min(5, content.scores.strategy || 3)),
        process: Math.max(1, Math.min(5, content.scores.process || 3)),
        technology: Math.max(1, Math.min(5, content.scores.technology || 3)),
        overall: Math.max(1, Math.min(5, content.scores.overall || 3))
      },
      insights: Array.isArray(content.insights) ? content.insights : [],
      recommendations: Array.isArray(content.recommendations) ? content.recommendations : [],
      confidence: Math.max(0, Math.min(1, content.confidence || 0.8))
    }
  }

  private validateScore(content: any): AssessmentScore {
    if (!content.overall || !content.breakdown) {
      throw new Error('Invalid score response format')
    }

    return {
      overall: Math.max(1, Math.min(5, content.overall)),
      strategy: Math.max(1, Math.min(5, content.strategy || 3)),
      process: Math.max(1, Math.min(5, content.process || 3)),
      technology: Math.max(1, Math.min(5, content.technology || 3)),
      people: Math.max(1, Math.min(5, content.people || 3)),
      confidence: Math.max(0, Math.min(1, content.confidence || 0.8)),
      breakdown: Array.isArray(content.breakdown) ? content.breakdown : []
    }
  }

  private validateInsights(content: any): AssessmentInsight[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid insights response format')
    }

    return content.map(insight => ({
      id: insight.id || crypto.randomUUID(),
      type: insight.type || 'opportunity',
      category: insight.category || 'general',
      title: insight.title || 'Insight',
      description: insight.description || '',
      impact: insight.impact || 'medium',
      evidence: Array.isArray(insight.evidence) ? insight.evidence : [],
      recommendations: Array.isArray(insight.recommendations) ? insight.recommendations : []
    }))
  }

  private validateRecommendations(content: any): Recommendation[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid recommendations response format')
    }

    return content.map(rec => ({
      id: rec.id || crypto.randomUUID(),
      title: rec.title || 'Recommendation',
      description: rec.description || '',
      category: rec.category || 'general',
      priority: rec.priority || 'medium',
      effort: rec.effort || 'medium',
      impact: rec.impact || 'medium',
      timeline: rec.timeline || 'short-term',
      resources: Array.isArray(rec.resources) ? rec.resources : [],
      successMetrics: Array.isArray(rec.successMetrics) ? rec.successMetrics : []
    }))
  }

  private validateActionPlan(content: any): ActionPlan {
    if (!content.phases || !Array.isArray(content.phases)) {
      throw new Error('Invalid action plan response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      title: content.title || 'Action Plan',
      description: content.description || '',
      phases: content.phases,
      successCriteria: Array.isArray(content.successCriteria) ? content.successCriteria : [],
      riskMitigation: Array.isArray(content.riskMitigation) ? content.riskMitigation : []
    }
  }
} 