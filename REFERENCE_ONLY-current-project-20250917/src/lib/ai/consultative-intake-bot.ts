import { z } from 'zod'

// Capability Maturity Model (CMM) Levels
export enum MaturityLevel {
  INITIAL = 1,        // Ad-hoc, chaotic processes
  REPEATABLE = 2,     // Basic processes established
  DEFINED = 3,        // Standardized processes
  MANAGED = 4,        // Measured and controlled
  OPTIMIZING = 5      // Continuous improvement
}

// Industry benchmarks for different company sizes and industries
export interface IndustryBenchmark {
  industry: string
  companySize: string
  averageScores: {
    strategy: number
    operations: number
    team: number
    technology: number
    market: number
  }
  maturityDistribution: {
    [MaturityLevel.INITIAL]: number
    [MaturityLevel.REPEATABLE]: number
    [MaturityLevel.DEFINED]: number
    [MaturityLevel.MANAGED]: number
    [MaturityLevel.OPTIMIZING]: number
  }
}

// User response analysis
export interface ResponseAnalysis {
  keywords: string[]
  sentiment: 'positive' | 'neutral' | 'negative' | 'frustrated'
  confidence: number
  insights: string[]
  followUpQuestions: string[]
  maturityIndicators: {
    [key: string]: number
  }
}

// Conversation context
export interface ConversationContext {
  userId?: string
  industry: string
  companySize: string
  role: string
  responses: Record<string, string>
  currentPhase: 'discovery' | 'diagnostic' | 'solution' | 'validation'
  rapportLevel: number
  emotionalState: 'curious' | 'engaged' | 'frustrated' | 'excited' | 'skeptical'
  maturityScores: {
    strategy: number
    operations: number
    team: number
    technology: number
    market: number
  }
  industryBenchmark?: IndustryBenchmark
}

// Bot response
export interface ConsultativeResponse {
  message: string
  insights: string[]
  nextQuestion?: string
  maturityUpdate?: Partial<ConversationContext['maturityScores']>
  industryInsight?: string
  confidence: number
  rapportBuilding: string
}

export class ConsultativeIntakeBot {
  private industryBenchmarks: Map<string, IndustryBenchmark>
  private maturityKeywords: Map<string, { [key: string]: number }>
  private conversationTemplates: Map<string, string[]>

  constructor() {
    this.initializeIndustryBenchmarks()
    this.initializeMaturityKeywords()
    this.initializeConversationTemplates()
  }

  // Main conversation processing
  async processUserInput(
    userInput: string,
    context: ConversationContext
  ): Promise<ConsultativeResponse> {
    // 1. Analyze user response
    const analysis = this.analyzeUserResponse(userInput, context)
    
    // 2. Update maturity scores
    const maturityUpdate = this.updateMaturityScores(analysis, context)
    
    // 3. Generate industry insights
    const industryInsight = this.generateIndustryInsight(context, maturityUpdate)
    
    // 4. Build rapport and generate response
    const response = this.generateConsultativeResponse(analysis, context, maturityUpdate)
    
    // 5. Determine next question
    const nextQuestion = this.determineNextQuestion(context, analysis)
    
    return {
      message: response,
      insights: analysis.insights,
      nextQuestion,
      maturityUpdate,
      industryInsight,
      confidence: analysis.confidence,
      rapportBuilding: this.buildRapport(context, analysis)
    }
  }

  // Analyze user response for maturity indicators and insights
  private analyzeUserResponse(input: string, context: ConversationContext): ResponseAnalysis {
    const keywords = this.extractKeywords(input)
    const sentiment = this.analyzeSentiment(input)
    const confidence = this.calculateConfidence(input, context)
    const insights = this.generateInsights(input, context, keywords)
    const followUpQuestions = this.generateFollowUpQuestions(input, context)
    const maturityIndicators = this.analyzeMaturityIndicators(input, keywords)

    return {
      keywords,
      sentiment,
      confidence,
      insights,
      followUpQuestions,
      maturityIndicators
    }
  }

  // Extract keywords that indicate maturity level
  private extractKeywords(input: string): string[] {
    const text = input.toLowerCase()
    const keywords: string[] = []
    
    // Strategy keywords
    if (text.includes('strategy') || text.includes('strategic')) keywords.push('strategy')
    if (text.includes('plan') || text.includes('planning')) keywords.push('planning')
    if (text.includes('goal') || text.includes('objectives')) keywords.push('goals')
    if (text.includes('vision') || text.includes('mission')) keywords.push('vision')
    
    // Operations keywords
    if (text.includes('process') || text.includes('processes')) keywords.push('processes')
    if (text.includes('workflow') || text.includes('automation')) keywords.push('automation')
    if (text.includes('efficiency') || text.includes('optimization')) keywords.push('efficiency')
    if (text.includes('standard') || text.includes('standardized')) keywords.push('standardization')
    
    // Team keywords
    if (text.includes('team') || text.includes('hiring')) keywords.push('team')
    if (text.includes('training') || text.includes('development')) keywords.push('development')
    if (text.includes('culture') || text.includes('values')) keywords.push('culture')
    if (text.includes('leadership') || text.includes('management')) keywords.push('leadership')
    
    // Technology keywords
    if (text.includes('technology') || text.includes('tech')) keywords.push('technology')
    if (text.includes('system') || text.includes('platform')) keywords.push('systems')
    if (text.includes('data') || text.includes('analytics')) keywords.push('data')
    if (text.includes('integration') || text.includes('api')) keywords.push('integration')
    
    // Market keywords
    if (text.includes('customer') || text.includes('client')) keywords.push('customer')
    if (text.includes('market') || text.includes('competition')) keywords.push('market')
    if (text.includes('growth') || text.includes('scaling')) keywords.push('growth')
    if (text.includes('revenue') || text.includes('sales')) keywords.push('revenue')
    
    return keywords
  }

  // Analyze sentiment from user input
  private analyzeSentiment(input: string): 'positive' | 'neutral' | 'negative' | 'frustrated' {
    const text = input.toLowerCase()
    
    // Positive indicators
    if (text.includes('great') || text.includes('excellent') || text.includes('amazing') || 
        text.includes('working well') || text.includes('successful') || text.includes('happy')) {
      return 'positive'
    }
    
    // Frustrated indicators
    if (text.includes('struggling') || text.includes('frustrated') || text.includes('difficult') ||
        text.includes('challenging') || text.includes('problem') || text.includes('issue') ||
        text.includes('not working') || text.includes('failing')) {
      return 'frustrated'
    }
    
    // Negative indicators
    if (text.includes('bad') || text.includes('terrible') || text.includes('awful') ||
        text.includes('disappointed') || text.includes('concerned') || text.includes('worried')) {
      return 'negative'
    }
    
    return 'neutral'
  }

  // Calculate confidence in user response
  private calculateConfidence(input: string, context: ConversationContext): number {
    let confidence = 0.5 // Base confidence
    
    // Length of response
    if (input.length > 100) confidence += 0.2
    else if (input.length > 50) confidence += 0.1
    else if (input.length < 20) confidence -= 0.2
    
    // Specificity indicators
    if (/\$[\d,]+/.test(input)) confidence += 0.1 // Contains dollar amounts
    if (/\d+%/.test(input)) confidence += 0.1 // Contains percentages
    if (/\d+\.\d+/.test(input)) confidence += 0.1 // Contains decimals
    
    // Industry-specific terms
    const industryTerms = this.getIndustryTerms(context.industry)
    const hasIndustryTerms = industryTerms.some(term => input.toLowerCase().includes(term))
    if (hasIndustryTerms) confidence += 0.1
    
    // Role-specific terms
    const roleTerms = this.getRoleTerms(context.role)
    const hasRoleTerms = roleTerms.some(term => input.toLowerCase().includes(term))
    if (hasRoleTerms) confidence += 0.1
    
    return Math.min(1, Math.max(0, confidence))
  }

  // Generate insights from user response
  private generateInsights(input: string, context: ConversationContext, keywords: string[]): string[] {
    const insights: string[] = []
    
    // Strategy insights
    if (keywords.includes('strategy') || keywords.includes('planning')) {
      if (input.toLowerCase().includes('not sure') || input.toLowerCase().includes('don\'t know')) {
        insights.push('Strategy development appears to be an area for improvement')
      } else {
        insights.push('Strategic thinking is evident in your approach')
      }
    }
    
    // Operations insights
    if (keywords.includes('processes') || keywords.includes('automation')) {
      if (input.toLowerCase().includes('manual') || input.toLowerCase().includes('ad-hoc')) {
        insights.push('Process standardization could improve efficiency')
      } else {
        insights.push('Operational focus shows systematic thinking')
      }
    }
    
    // Team insights
    if (keywords.includes('team') || keywords.includes('hiring')) {
      if (input.toLowerCase().includes('struggling') || input.toLowerCase().includes('difficult')) {
        insights.push('Team building and development may need attention')
      } else {
        insights.push('Team focus shows understanding of human capital importance')
      }
    }
    
    // Technology insights
    if (keywords.includes('technology') || keywords.includes('systems')) {
      if (input.toLowerCase().includes('outdated') || input.toLowerCase().includes('old')) {
        insights.push('Technology modernization could drive growth')
      } else {
        insights.push('Technology awareness indicates forward thinking')
      }
    }
    
    // Market insights
    if (keywords.includes('customer') || keywords.includes('market')) {
      if (input.toLowerCase().includes('not sure') || input.toLowerCase().includes('unclear')) {
        insights.push('Market understanding could be strengthened')
      } else {
        insights.push('Customer focus shows market orientation')
      }
    }
    
    return insights
  }

  // Generate follow-up questions
  private generateFollowUpQuestions(input: string, context: ConversationContext): string[] {
    const questions: string[] = []
    const text = input.toLowerCase()
    
    // If user mentions challenges, ask for specifics
    if (text.includes('challenge') || text.includes('struggling') || text.includes('problem')) {
      questions.push('What specific aspect of this challenge is having the biggest impact on your business?')
      questions.push('What have you tried so far to address this challenge?')
    }
    
    // If user mentions metrics, ask for context
    if (/\$[\d,]+/.test(input) || /\d+%/.test(input)) {
      questions.push('How does this compare to your target or industry average?')
      questions.push('What\'s driving this number, and how has it changed over time?')
    }
    
    // If user mentions team, ask about structure
    if (text.includes('team') || text.includes('hiring') || text.includes('people')) {
      questions.push('How is your team structured, and what roles are you looking to add?')
      questions.push('What\'s your biggest team challenge right now?')
    }
    
    return questions
  }

  // Analyze maturity indicators from keywords
  private analyzeMaturityIndicators(input: string, keywords: string[]): { [key: string]: number } {
    const indicators: { [key: string]: number } = {}
    const text = input.toLowerCase()
    
    // Strategy maturity
    if (keywords.includes('strategy') || keywords.includes('planning')) {
      if (text.includes('comprehensive') || text.includes('detailed') || text.includes('long-term')) {
        indicators.strategy = 4 // Managed
      } else if (text.includes('basic') || text.includes('simple')) {
        indicators.strategy = 2 // Repeatable
      } else {
        indicators.strategy = 3 // Defined
      }
    }
    
    // Operations maturity
    if (keywords.includes('processes') || keywords.includes('automation')) {
      if (text.includes('automated') || text.includes('optimized') || text.includes('efficient')) {
        indicators.operations = 4 // Managed
      } else if (text.includes('manual') || text.includes('ad-hoc')) {
        indicators.operations = 1 // Initial
      } else {
        indicators.operations = 3 // Defined
      }
    }
    
    // Team maturity
    if (keywords.includes('team') || keywords.includes('hiring')) {
      if (text.includes('structured') || text.includes('organized') || text.includes('trained')) {
        indicators.team = 4 // Managed
      } else if (text.includes('struggling') || text.includes('difficult')) {
        indicators.team = 2 // Repeatable
      } else {
        indicators.team = 3 // Defined
      }
    }
    
    // Technology maturity
    if (keywords.includes('technology') || keywords.includes('systems')) {
      if (text.includes('modern') || text.includes('integrated') || text.includes('advanced')) {
        indicators.technology = 4 // Managed
      } else if (text.includes('outdated') || text.includes('old')) {
        indicators.technology = 2 // Repeatable
      } else {
        indicators.technology = 3 // Defined
      }
    }
    
    // Market maturity
    if (keywords.includes('customer') || keywords.includes('market')) {
      if (text.includes('data-driven') || text.includes('analytics') || text.includes('insights')) {
        indicators.market = 4 // Managed
      } else if (text.includes('not sure') || text.includes('unclear')) {
        indicators.market = 2 // Repeatable
      } else {
        indicators.market = 3 // Defined
      }
    }
    
    return indicators
  }

  // Update maturity scores based on analysis
  private updateMaturityScores(analysis: ResponseAnalysis, context: ConversationContext): Partial<ConversationContext['maturityScores']> {
    const updates: Partial<ConversationContext['maturityScores']> = {}
    
    // Update scores based on maturity indicators
    Object.entries(analysis.maturityIndicators).forEach(([key, value]) => {
      const currentScore = context.maturityScores[key as keyof ConversationContext['maturityScores']] || 0
      // Weighted average with existing score
      updates[key as keyof ConversationContext['maturityScores']] = 
        Math.round((currentScore * 0.7 + value * 0.3) * 10) / 10
    })
    
    return updates
  }

  // Generate industry insight
  private generateIndustryInsight(context: ConversationContext, maturityUpdate: Partial<ConversationContext['maturityScores']>): string {
    const benchmark = this.industryBenchmarks.get(`${context.industry}-${context.companySize}`)
    if (!benchmark) return ''
    
    const currentScores = { ...context.maturityScores, ...maturityUpdate }
    const avgScore = Object.values(currentScores).reduce((a, b) => a + b, 0) / Object.values(currentScores).length
    const industryAvg = Object.values(benchmark.averageScores).reduce((a, b) => a + b, 0) / Object.values(benchmark.averageScores).length
    
    if (avgScore > industryAvg) {
      return `Your maturity level is above average for ${context.industry} companies your size. This gives you a competitive advantage.`
    } else if (avgScore < industryAvg) {
      return `There's significant opportunity to improve your maturity level compared to industry peers. This could unlock substantial growth potential.`
    } else {
      return `Your maturity level aligns with industry standards. Focus on specific areas could drive differentiation.`
    }
  }

  // Generate consultative response
  private generateConsultativeResponse(
    analysis: ResponseAnalysis,
    context: ConversationContext,
    maturityUpdate: Partial<ConversationContext['maturityScores']>
  ): string {
    const templates = this.conversationTemplates.get(context.currentPhase) || []
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // Replace placeholders with actual content
    let response = template
      .replace('{insight}', analysis.insights[0] || '')
      .replace('{sentiment}', analysis.sentiment)
      .replace('{confidence}', Math.round(analysis.confidence * 100))
    
    return response
  }

  // Determine next question based on context
  private determineNextQuestion(context: ConversationContext, analysis: ResponseAnalysis): string {
    const questions = [
      "What's your biggest growth opportunity right now?",
      "How do you currently measure success in your business?",
      "What's your biggest operational challenge?",
      "How is your team structured for growth?",
      "What technology tools are you using to drive growth?",
      "What's your biggest market challenge?",
      "How do you currently acquire new customers?",
      "What's your biggest competitive advantage?"
    ]
    
    // Return a random question for now
    return questions[Math.floor(Math.random() * questions.length)]
  }

  // Build rapport
  private buildRapport(context: ConversationContext, analysis: ResponseAnalysis): string {
    const rapportPhrases = [
      "I can see you're really thinking about this strategically.",
      "That's a great insight - many founders struggle with that.",
      "I appreciate you sharing that - it helps me understand your situation better.",
      "That makes total sense - you're not alone in facing that challenge.",
      "I can tell you're passionate about growing your business."
    ]
    
    return rapportPhrases[Math.floor(Math.random() * rapportPhrases.length)]
  }

  // Initialize industry benchmarks
  private initializeIndustryBenchmarks(): void {
    this.industryBenchmarks = new Map()
    
    // SaaS benchmarks
    this.industryBenchmarks.set('SaaS-1-10', {
      industry: 'SaaS',
      companySize: '1-10',
      averageScores: { strategy: 2.8, operations: 2.5, team: 2.3, technology: 3.2, market: 2.7 },
      maturityDistribution: { 1: 15, 2: 35, 3: 30, 4: 15, 5: 5 }
    })
    
    this.industryBenchmarks.set('SaaS-11-50', {
      industry: 'SaaS',
      companySize: '11-50',
      averageScores: { strategy: 3.2, operations: 3.0, team: 3.1, technology: 3.5, market: 3.0 },
      maturityDistribution: { 1: 10, 2: 25, 3: 35, 4: 25, 5: 5 }
    })
    
    // E-commerce benchmarks
    this.industryBenchmarks.set('E-commerce-1-10', {
      industry: 'E-commerce',
      companySize: '1-10',
      averageScores: { strategy: 2.6, operations: 2.8, team: 2.4, technology: 2.9, market: 3.1 },
      maturityDistribution: { 1: 20, 2: 30, 3: 25, 4: 20, 5: 5 }
    })
    
    // Add more industries as needed
  }

  // Initialize maturity keywords
  private initializeMaturityKeywords(): void {
    this.maturityKeywords = new Map()
    
    // Strategy keywords
    this.maturityKeywords.set('strategy', {
      'comprehensive': 4,
      'detailed': 4,
      'long-term': 4,
      'basic': 2,
      'simple': 2,
      'not sure': 1,
      'don\'t know': 1
    })
    
    // Operations keywords
    this.maturityKeywords.set('operations', {
      'automated': 4,
      'optimized': 4,
      'efficient': 4,
      'manual': 1,
      'ad-hoc': 1,
      'standardized': 3,
      'process': 3
    })
    
    // Add more categories as needed
  }

  // Initialize conversation templates
  private initializeConversationTemplates(): void {
    this.conversationTemplates = new Map()
    
    this.conversationTemplates.set('discovery', [
      "I can see you're thinking about {insight}. That's actually a common challenge in your industry. Tell me more about how this is impacting your business.",
      "That's interesting - {insight}. Many companies in your position face similar challenges. What's your biggest concern about this?",
      "I appreciate you sharing that. {insight}. What would you say is the root cause of this challenge?"
    ])
    
    this.conversationTemplates.set('diagnostic', [
      "Based on what you've told me, {insight}. This suggests there might be an opportunity to improve your {sentiment} approach. What do you think?",
      "That's a great point. {insight}. How are you currently measuring success in this area?",
      "I can see the challenge. {insight}. What have you tried so far to address this?"
    ])
    
    this.conversationTemplates.set('solution', [
      "Given what you've shared, {insight}. This is actually a common pattern I see with companies at your stage. What would success look like for you?",
      "That makes sense. {insight}. What's your biggest priority right now in terms of growth?",
      "I understand. {insight}. What would you say is holding you back from achieving your goals?"
    ])
  }

  // Get industry-specific terms
  private getIndustryTerms(industry: string): string[] {
    const terms: { [key: string]: string[] } = {
      'SaaS': ['mrr', 'arr', 'churn', 'cac', 'ltv', 'activation', 'retention', 'conversion'],
      'E-commerce': ['aov', 'conversion', 'cart abandonment', 'checkout', 'inventory', 'fulfillment'],
      'Consulting': ['billable hours', 'utilization', 'pipeline', 'proposals', 'clients', 'projects'],
      'Manufacturing': ['production', 'inventory', 'supply chain', 'quality', 'efficiency', 'throughput']
    }
    
    return terms[industry] || []
  }

  // Get role-specific terms
  private getRoleTerms(role: string): string[] {
    const terms: { [key: string]: string[] } = {
      'CEO': ['strategy', 'vision', 'growth', 'team', 'culture', 'funding'],
      'CTO': ['technology', 'architecture', 'scalability', 'security', 'integration'],
      'CMO': ['marketing', 'brand', 'campaigns', 'leads', 'conversion', 'analytics'],
      'COO': ['operations', 'processes', 'efficiency', 'team', 'systems', 'workflow']
    }
    
    return terms[role] || []
  }
}
