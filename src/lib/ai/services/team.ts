import { aiService } from '../service'

export interface TeamData {
  members: {
    id: string
    name: string
    role: string
    skills: string[]
    experience: number
    performance: number
    availability: number
    preferences: string[]
  }[]
  projects: {
    id: string
    name: string
    status: string
    priority: string
    deadline: string
    requirements: string[]
    assignedMembers: string[]
  }[]
  performance: {
    memberId: string
    metric: string
    value: number
    date: string
  }[]
  collaboration: {
    fromMember: string
    toMember: string
    interactionType: string
    frequency: number
    effectiveness: number
  }[]
}

export interface TeamAnalysis {
  id: string
  overallScore: number
  memberPerformance: {
    memberId: string
    name: string
    score: number
    strengths: string[]
    areas: string[]
    recommendations: string[]
  }[]
  teamDynamics: {
    collaboration: number
    communication: number
    efficiency: number
    innovation: number
  }
  insights: {
    type: 'strength' | 'weakness' | 'opportunity' | 'threat'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    recommendations: string[]
  }[]
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export interface DelegationSuggestion {
  id: string
  questionId: string
  question: string
  suggestedMembers: {
    memberId: string
    name: string
    role: string
    confidence: number
    reasoning: string
    availability: number
  }[]
  alternativeMembers: {
    memberId: string
    name: string
    role: string
    confidence: number
    reasoning: string
  }[]
  rationale: string
  expectedOutcome: string
  timeline: string
}

export interface TeamInsight {
  id: string
  type: 'performance' | 'collaboration' | 'efficiency' | 'innovation'
  title: string
  description: string
  category: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  data: {
    metric: string
    value: number
    change: number
    trend: 'up' | 'down' | 'stable'
  }
  recommendations: string[]
  affectedMembers: string[]
  timeframe: string
}

export interface WorkflowOptimization {
  id: string
  currentWorkflow: {
    step: string
    owner: string
    duration: number
    efficiency: number
    bottlenecks: string[]
  }[]
  optimizedWorkflow: {
    step: string
    owner: string
    duration: number
    efficiency: number
    improvements: string[]
  }[]
  improvements: {
    type: 'automation' | 'reassignment' | 'process' | 'tool'
    description: string
    impact: 'high' | 'medium' | 'low'
    effort: 'low' | 'medium' | 'high'
    timeline: string
    expectedBenefit: string
  }[]
  summary: {
    efficiencyGain: number
    timeSaved: number
    costReduction: number
    qualityImprovement: number
  }
}

export class TeamAIService {
  private readonly userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Analyze team performance and dynamics
   */
  async analyzeTeamPerformance(teamData: TeamData): Promise<TeamAnalysis> {
    const prompt = this.buildTeamAnalysisPrompt(teamData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    }, this.userId)

    return this.validateTeamAnalysis(response.content)
  }

  /**
   * Suggest optimal delegations for questions
   */
  async suggestDelegations(questions: any[]): Promise<DelegationSuggestion[]> {
    const prompt = this.buildDelegationPrompt(questions)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return this.validateDelegationSuggestions(response.content)
  }

  /**
   * Generate team insights from responses
   */
  async generateTeamInsights(teamResponses: any[]): Promise<TeamInsight[]> {
    const prompt = this.buildTeamInsightsPrompt(teamResponses)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return this.validateTeamInsights(response.content)
  }

  /**
   * Optimize team workflows
   */
  async optimizeWorkflow(workflowData: any): Promise<WorkflowOptimization> {
    const prompt = this.buildWorkflowOptimizationPrompt(workflowData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    }, this.userId)

    return this.validateWorkflowOptimization(response.content)
  }

  /**
   * Generate team collaboration recommendations
   */
  async generateCollaborationRecommendations(teamData: TeamData): Promise<any[]> {
    const prompt = this.buildCollaborationPrompt(teamData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  /**
   * Analyze skill gaps and training needs
   */
  async analyzeSkillGaps(teamData: TeamData): Promise<any> {
    const prompt = this.buildSkillGapPrompt(teamData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  /**
   * Generate team development plans
   */
  async generateDevelopmentPlans(teamData: TeamData): Promise<any[]> {
    const prompt = this.buildDevelopmentPlanPrompt(teamData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return response.content
  }

  // Private helper methods for building prompts

  private buildTeamAnalysisPrompt(teamData: TeamData): string {
    return `Analyze the following team data and provide comprehensive insights:

Team Data:
${JSON.stringify(teamData, null, 2)}

Please provide a JSON response with team analysis:
{
  "id": "string",
  "overallScore": number (0-100),
  "memberPerformance": [
    {
      "memberId": "string",
      "name": "string",
      "score": number (0-100),
      "strengths": ["string"],
      "areas": ["string"],
      "recommendations": ["string"]
    }
  ],
  "teamDynamics": {
    "collaboration": number (0-100),
    "communication": number (0-100),
    "efficiency": number (0-100),
    "innovation": number (0-100)
  },
  "insights": [
    {
      "type": "strength|weakness|opportunity|threat",
      "title": "string",
      "description": "string",
      "impact": "high|medium|low",
      "recommendations": ["string"]
    }
  ],
  "recommendations": {
    "immediate": ["string"],
    "shortTerm": ["string"],
    "longTerm": ["string"]
  }
}

Focus on identifying patterns, strengths, weaknesses, and actionable recommendations for team improvement.`
  }

  private buildDelegationPrompt(questions: any[]): string {
    return `Suggest optimal team member delegations for the following questions:

Questions:
${JSON.stringify(questions, null, 2)}

Please provide a JSON response with delegation suggestions:
[
  {
    "id": "string",
    "questionId": "string",
    "question": "string",
    "suggestedMembers": [
      {
        "memberId": "string",
        "name": "string",
        "role": "string",
        "confidence": number (0-1),
        "reasoning": "string",
        "availability": number (0-1)
      }
    ],
    "alternativeMembers": [
      {
        "memberId": "string",
        "name": "string",
        "role": "string",
        "confidence": number (0-1),
        "reasoning": "string"
      }
    ],
    "rationale": "string",
    "expectedOutcome": "string",
    "timeline": "string"
  }
]

Consider skills, experience, availability, and team dynamics when making suggestions.`
  }

  private buildTeamInsightsPrompt(teamResponses: any[]): string {
    return `Generate insights from the following team responses:

Team Responses:
${JSON.stringify(teamResponses, null, 2)}

Please provide a JSON response with team insights:
[
  {
    "id": "string",
    "type": "performance|collaboration|efficiency|innovation",
    "title": "string",
    "description": "string",
    "category": "string",
    "impact": "high|medium|low",
    "confidence": number (0-1),
    "data": {
      "metric": "string",
      "value": number,
      "change": number,
      "trend": "up|down|stable"
    },
    "recommendations": ["string"],
    "affectedMembers": ["string"],
    "timeframe": "string"
  }
]

Focus on identifying patterns, trends, and actionable insights that can improve team performance.`
  }

  private buildWorkflowOptimizationPrompt(workflowData: any): string {
    return `Optimize the following team workflow:

Workflow Data:
${JSON.stringify(workflowData, null, 2)}

Please provide a JSON response with workflow optimization:
{
  "id": "string",
  "currentWorkflow": [
    {
      "step": "string",
      "owner": "string",
      "duration": number,
      "efficiency": number (0-100),
      "bottlenecks": ["string"]
    }
  ],
  "optimizedWorkflow": [
    {
      "step": "string",
      "owner": "string",
      "duration": number,
      "efficiency": number (0-100),
      "improvements": ["string"]
    }
  ],
  "improvements": [
    {
      "type": "automation|reassignment|process|tool",
      "description": "string",
      "impact": "high|medium|low",
      "effort": "low|medium|high",
      "timeline": "string",
      "expectedBenefit": "string"
    }
  ],
  "summary": {
    "efficiencyGain": number,
    "timeSaved": number,
    "costReduction": number,
    "qualityImprovement": number
  }
}

Identify bottlenecks, inefficiencies, and opportunities for improvement.`
  }

  private buildCollaborationPrompt(teamData: TeamData): string {
    return `Generate collaboration recommendations based on the following team data:

Team Data:
${JSON.stringify(teamData, null, 2)}

Please provide a JSON response with collaboration recommendations to improve team dynamics, communication, and effectiveness.`
  }

  private buildSkillGapPrompt(teamData: TeamData): string {
    return `Analyze skill gaps and training needs based on the following team data:

Team Data:
${JSON.stringify(teamData, null, 2)}

Please provide a JSON response identifying skill gaps, training needs, and development opportunities for team members.`
  }

  private buildDevelopmentPlanPrompt(teamData: TeamData): string {
    return `Generate individual development plans based on the following team data:

Team Data:
${JSON.stringify(teamData, null, 2)}

Please provide a JSON response with personalized development plans for each team member, including goals, training recommendations, and timelines.`
  }

  // Validation methods

  private validateTeamAnalysis(content: any): TeamAnalysis {
    if (!content.overallScore || !content.memberPerformance) {
      throw new Error('Invalid team analysis response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      overallScore: Math.max(0, Math.min(100, content.overallScore)),
      memberPerformance: Array.isArray(content.memberPerformance) ? content.memberPerformance : [],
      teamDynamics: content.teamDynamics || {
        collaboration: 50,
        communication: 50,
        efficiency: 50,
        innovation: 50
      },
      insights: Array.isArray(content.insights) ? content.insights : [],
      recommendations: content.recommendations || {
        immediate: [],
        shortTerm: [],
        longTerm: []
      }
    }
  }

  private validateDelegationSuggestions(content: any): DelegationSuggestion[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid delegation suggestions response format')
    }

    return content.map(suggestion => ({
      id: suggestion.id || crypto.randomUUID(),
      questionId: suggestion.questionId || '',
      question: suggestion.question || '',
      suggestedMembers: Array.isArray(suggestion.suggestedMembers) ? suggestion.suggestedMembers : [],
      alternativeMembers: Array.isArray(suggestion.alternativeMembers) ? suggestion.alternativeMembers : [],
      rationale: suggestion.rationale || '',
      expectedOutcome: suggestion.expectedOutcome || '',
      timeline: suggestion.timeline || '1 week'
    }))
  }

  private validateTeamInsights(content: any): TeamInsight[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid team insights response format')
    }

    return content.map(insight => ({
      id: insight.id || crypto.randomUUID(),
      type: insight.type || 'performance',
      title: insight.title || 'Team Insight',
      description: insight.description || '',
      category: insight.category || 'general',
      impact: insight.impact || 'medium',
      confidence: Math.max(0, Math.min(1, insight.confidence || 0.8)),
      data: insight.data || {
        metric: 'unknown',
        value: 0,
        change: 0,
        trend: 'stable'
      },
      recommendations: Array.isArray(insight.recommendations) ? insight.recommendations : [],
      affectedMembers: Array.isArray(insight.affectedMembers) ? insight.affectedMembers : [],
      timeframe: insight.timeframe || '30 days'
    }))
  }

  private validateWorkflowOptimization(content: any): WorkflowOptimization {
    if (!content.currentWorkflow || !content.optimizedWorkflow) {
      throw new Error('Invalid workflow optimization response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      currentWorkflow: Array.isArray(content.currentWorkflow) ? content.currentWorkflow : [],
      optimizedWorkflow: Array.isArray(content.optimizedWorkflow) ? content.optimizedWorkflow : [],
      improvements: Array.isArray(content.improvements) ? content.improvements : [],
      summary: content.summary || {
        efficiencyGain: 0,
        timeSaved: 0,
        costReduction: 0,
        qualityImprovement: 0
      }
    }
  }
} 