import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Schema for the request
const StrategicInsightsRequestSchema = z.object({
  question: z.string().optional(),
  userResponse: z.string().optional(),
  userContext: z.object({
    name: z.string(),
    email: z.string(),
    industry: z.string(),
    role: z.string(),
    companySize: z.string(),
    revenueRange: z.string()
  }).optional(),
  aiPrompt: z.string().optional(),
  category: z.enum(['strategy', 'operations', 'team', 'technology', 'market']).optional(),
  type: z.enum(['question_response', 'final_analysis']).default('question_response'),
  responses: z.record(z.any()).optional(),
  categoryScores: z.record(z.number()).optional()
})

// Schema for the response
const StrategicInsightsResponseSchema = z.object({
  success: z.boolean(),
  response: z.string(),
  insights: z.array(z.string()),
  recommendations: z.array(z.string()),
  score: z.number().min(0).max(100),
  actionPlan: z.array(z.string()).optional(),
  strengths: z.array(z.string()).optional(),
  weaknesses: z.array(z.string()).optional(),
  opportunities: z.array(z.string()).optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = StrategicInsightsRequestSchema.parse(body)

    if (validatedData.type === 'final_analysis') {
      return await generateFinalAnalysis(validatedData)
    } else {
      return await generateQuestionResponse(validatedData)
    }

  } catch (error) {
    console.error('Error in strategic insights API:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid request data',
        errors: error.errors
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 })
  }
}

async function generateQuestionResponse(data: any) {
  const { question, userResponse, userContext, aiPrompt, category } = data

  // Generate intelligent response based on the question and user context
  const response = await generateIntelligentResponse(question, userResponse, userContext, aiPrompt, category)
  
  // Calculate score based on response quality and context
  const score = calculateCategoryScore(userResponse, category, userContext)
  
  // Generate insights and recommendations
  const insights = generateInsights(userResponse, category, userContext)
  const recommendations = generateRecommendations(userResponse, category, userContext)

  const result = StrategicInsightsResponseSchema.parse({
    success: true,
    response: response,
    insights: insights,
    recommendations: recommendations,
    score: score
  })

  return NextResponse.json(result)
}

async function generateFinalAnalysis(data: any) {
  const { responses, userContext, categoryScores } = data

  // Analyze all responses to generate comprehensive insights
  const analysis = await generateComprehensiveAnalysis(responses, userContext, categoryScores)

  const result = StrategicInsightsResponseSchema.parse({
    success: true,
    response: analysis.summary,
    insights: analysis.insights,
    recommendations: analysis.recommendations,
    score: analysis.overallScore,
    actionPlan: analysis.actionPlan,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    opportunities: analysis.opportunities
  })

  return NextResponse.json(result)
}

async function generateIntelligentResponse(question: string, userResponse: string, userContext: any, aiPrompt: string, category: string): Promise<string> {
  // Generate contextual responses based on category and user context
  const industry = userContext?.industry || 'business'
  const role = userContext?.role || 'business owner'
  const companySize = userContext?.companySize || 'small'
  const revenueRange = userContext?.revenueRange || 'under $1M'

  // Generate contextual responses based on category and user context
  const responses = {
    challenges: generateChallengeResponse(userResponse, industry, role, companySize),
    strategy: generateStrategyResponse(userResponse, industry, role, companySize),
    team: generateTeamResponse(userResponse, industry, role, companySize),
    metrics: generateMetricsResponse(userResponse, industry, role, companySize),
    technology: generateTechnologyResponse(userResponse, industry, role, companySize)
  }

  return responses[category as keyof typeof responses] || generateGenericResponse(userResponse, category)
}

function generateChallengeResponse(userResponse: string, industry: string, role: string, companySize: string): string {
  const challenges = userResponse.toLowerCase()
  
  if (challenges.includes('lead') || challenges.includes('customer')) {
    return `I can see you're facing customer acquisition challenges, which is common for ${companySize} ${industry} companies. Based on your response, here are the key issues I've identified:

**Root Causes:**
• Market positioning may not be clearly differentiated
• Customer acquisition channels might not be optimized
• Value proposition could be stronger

**Immediate Actions:**
• Audit your current marketing channels and their ROI
• Refine your target customer profile
• Test new acquisition channels with small budgets

**Strategic Recommendations:**
• Develop a comprehensive customer acquisition strategy
• Implement lead scoring and nurturing systems
• Consider partnerships for referral programs

This is a solvable challenge with the right strategic approach. Let's focus on building a systematic customer acquisition engine.`
  }
  
  if (challenges.includes('team') || challenges.includes('hiring') || challenges.includes('staff')) {
    return `Team building challenges are critical for growth. I can see you're struggling with ${companySize} company scaling issues. Here's my analysis:

**Key Issues:**
• Talent acquisition in competitive markets
• Role definition and organizational structure
• Culture and retention strategies

**Immediate Solutions:**
• Define clear job descriptions and growth paths
• Implement employee referral programs
• Consider remote/hybrid work options

**Long-term Strategy:**
• Build a strong employer brand
• Develop internal training programs
• Create equity/partnership opportunities

The right team is your biggest growth multiplier. Let's build a hiring strategy that scales with your business.`
  }
  
  return `I can see you're facing some significant growth challenges. Based on your response and your ${companySize} ${industry} business context, here are the key areas to focus on:

**Priority Areas:**
• Strategic planning and goal setting
• Market positioning and competitive advantage
• Operational efficiency and scalability

**Next Steps:**
• Conduct a comprehensive business audit
• Develop a clear growth strategy
• Implement systematic improvements

Let's work together to turn these challenges into growth opportunities.`
}

function generateStrategyResponse(userResponse: string, industry: string, role: string, companySize: string): string {
  const strategy = userResponse.toLowerCase()
  
  if (strategy.includes('digital') || strategy.includes('online') || strategy.includes('marketing')) {
    return `Your digital-first approach shows good market awareness. For ${companySize} ${industry} companies, this is often the right direction. Here's my analysis:

**Strengths I See:**
• Understanding of digital transformation
• Focus on modern marketing channels
• Adaptability to market changes

**Areas for Enhancement:**
• Integration across all digital touchpoints
• Data-driven decision making
• Customer experience optimization

**Strategic Recommendations:**
• Develop an omnichannel strategy
• Implement advanced analytics
• Focus on customer lifetime value

Your digital strategy has potential - let's make it more comprehensive and data-driven.`
  }
  
  return `Your growth strategy shows good thinking. For ${companySize} ${industry} companies, here are the key strategic elements to consider:

**Strategic Pillars:**
• Market positioning and differentiation
• Customer acquisition and retention
• Operational scalability

**Growth Levers:**
• Product/service expansion
• Market penetration
• Strategic partnerships

**Implementation Focus:**
• Clear goals and milestones
• Resource allocation
• Performance measurement

Let's refine your strategy to be more specific and actionable.`
}

function generateTeamResponse(userResponse: string, industry: string, role: string, companySize: string): string {
  const team = userResponse.toLowerCase()
  
  if (team.includes('remote') || team.includes('distributed') || team.includes('virtual')) {
    return `Remote team management is crucial for modern ${companySize} companies. I can see you're adapting to distributed work. Here's my analysis:

**Remote Team Advantages:**
• Access to global talent pool
• Reduced overhead costs
• Increased flexibility

**Key Challenges:**
• Communication and collaboration
• Culture and team building
• Performance management

**Best Practices:**
• Implement regular check-ins and standups
• Use collaboration tools effectively
• Focus on outcomes over hours

**Strategic Recommendations:**
• Develop remote-first processes
• Invest in team building activities
• Create clear performance metrics

Remote teams can be more productive than traditional ones with the right approach.`
  }
  
  return `Team structure is fundamental to growth. For ${companySize} ${industry} companies, here are the key considerations:

**Team Building Priorities:**
• Right people in right roles
• Clear responsibilities and accountability
• Strong communication and collaboration

**Growth-Ready Structure:**
• Scalable organizational design
• Cross-functional teams
• Leadership development

**Strategic Focus:**
• Hire for growth potential
• Develop internal talent
• Create performance culture

Let's design a team structure that supports your growth goals.`
}

function generateMetricsResponse(userResponse: string, industry: string, role: string, companySize: string): string {
  const metrics = userResponse.toLowerCase()
  
  if (metrics.includes('revenue') || metrics.includes('sales') || metrics.includes('growth')) {
    return `Revenue metrics are essential for ${companySize} ${industry} companies. I can see you're tracking the right financial indicators. Here's my analysis:

**Key Revenue Metrics:**
• Monthly Recurring Revenue (MRR)
• Customer Acquisition Cost (CAC)
• Customer Lifetime Value (LTV)
• Revenue growth rate

**Advanced Metrics to Consider:**
• Revenue per employee
• Revenue per customer
• Revenue concentration risk

**Strategic Recommendations:**
• Implement revenue forecasting
• Track leading indicators
• Focus on profitable growth

**Action Items:**
• Set up automated reporting
• Create revenue dashboards
• Regular revenue reviews

Revenue metrics are your growth compass. Let's make them more actionable.`
  }
  
  return `Metrics and KPIs are the foundation of data-driven growth. For ${companySize} ${industry} companies, here's what to focus on:

**Core Growth Metrics:**
• Revenue and growth rate
• Customer acquisition and retention
• Operational efficiency
• Market penetration

**Leading Indicators:**
• Pipeline and conversion rates
• Customer satisfaction
• Team productivity
• Market share

**Strategic Recommendations:**
• Implement real-time dashboards
• Regular metric reviews
• Data-driven decision making

**Action Plan:**
• Define key metrics for your business
• Set up tracking systems
• Create reporting processes

Let's build a metrics framework that drives your growth decisions.`
}

function generateTechnologyResponse(userResponse: string, industry: string, role: string, companySize: string): string {
  const technology = userResponse.toLowerCase()
  
  if (technology.includes('automation') || technology.includes('ai') || technology.includes('machine learning')) {
    return `Automation and AI are game-changers for ${companySize} ${industry} companies. I can see you're thinking about technology innovation. Here's my analysis:

**Automation Opportunities:**
• Customer service and support
• Marketing and lead generation
• Sales processes and follow-up
• Operations and administration

**AI Implementation Strategy:**
• Start with high-impact, low-risk areas
• Focus on customer experience
• Measure ROI and effectiveness

**Strategic Benefits:**
• Increased efficiency and productivity
• Better customer experience
• Competitive advantage
• Scalability

**Implementation Plan:**
• Audit current processes for automation
• Identify AI use cases
• Start with pilot projects

Technology can be your growth accelerator. Let's implement it strategically.`
  }
  
  return `Technology is a key growth enabler for ${companySize} ${industry} companies. Here's my assessment of your tech strategy:

**Technology Priorities:**
• Customer relationship management
• Marketing and sales automation
• Operations and efficiency tools
• Analytics and reporting

**Strategic Considerations:**
• Scalability and integration
• User adoption and training
• ROI and effectiveness
• Security and compliance

**Growth-Enabling Tech:**
• Cloud-based solutions
• Mobile-first platforms
• API integrations
• Real-time analytics

**Implementation Strategy:**
• Audit current technology
• Identify gaps and opportunities
• Prioritize high-impact investments
• Focus on user experience

Let's build a technology strategy that supports your growth goals.`
}

function generateGenericResponse(userResponse: string, category: string): string {
  return `Thank you for that detailed response. I can see you're thinking strategically about your ${category} approach. Based on your input, here are some key insights:

**Key Observations:**
• Your response shows good business awareness
• There are opportunities for optimization
• Strategic thinking is evident

**Recommendations:**
• Develop more specific action plans
• Focus on measurable outcomes
• Consider industry best practices

**Next Steps:**
• Let's dive deeper into implementation
• Identify specific improvement areas
• Create actionable strategies

Your insights are valuable - let's build on them to create a comprehensive growth strategy.`
}

function calculateCategoryScore(userResponse: string, category: string, userContext: any): number {
  // Calculate score based on response quality, length, and context
  let score = 50 // Base score
  
  // Length factor (more detailed responses get higher scores)
  const responseLength = userResponse.length
  if (responseLength > 200) score += 15
  else if (responseLength > 100) score += 10
  else if (responseLength > 50) score += 5
  
  // Industry-specific scoring
  const companySize = userContext?.companySize || ''
  const revenueRange = userContext?.revenueRange || ''
  
  // Adjust score based on company size and revenue
  if (companySize.includes('1000+') || revenueRange.includes('$50M+')) {
    score += 10 // Larger companies typically have more sophisticated approaches
  } else if (companySize.includes('201-500') || revenueRange.includes('$10M-$50M')) {
    score += 5
  }
  
  // Category-specific scoring
  const response = userResponse.toLowerCase()
  
  switch (category) {
    case 'strategy':
      if (response.includes('strategy') || response.includes('plan') || response.includes('goal')) score += 10
      if (response.includes('market') || response.includes('competitive')) score += 5
      break
    case 'team':
      if (response.includes('team') || response.includes('hiring') || response.includes('culture')) score += 10
      if (response.includes('leadership') || response.includes('management')) score += 5
      break
    case 'technology':
      if (response.includes('technology') || response.includes('system') || response.includes('tool')) score += 10
      if (response.includes('automation') || response.includes('ai')) score += 5
      break
    case 'operations':
      if (response.includes('process') || response.includes('efficiency') || response.includes('system')) score += 10
      if (response.includes('metric') || response.includes('kpi')) score += 5
      break
    case 'market':
      if (response.includes('customer') || response.includes('market') || response.includes('competition')) score += 10
      if (response.includes('brand') || response.includes('positioning')) score += 5
      break
  }
  
  // Ensure score is within bounds
  return Math.min(100, Math.max(0, score))
}

function generateInsights(userResponse: string, category: string, userContext: any): string[] {
  const insights = []
  const response = userResponse.toLowerCase()
  
  switch (category) {
    case 'strategy':
      insights.push('Strategic thinking is evident in your approach')
      if (response.includes('goal') || response.includes('objective')) {
        insights.push('Clear goal-setting shows good strategic planning')
      }
      if (response.includes('market') || response.includes('competitive')) {
        insights.push('Market awareness indicates strong strategic foundation')
      }
      break
    case 'team':
      insights.push('Team focus shows understanding of human capital importance')
      if (response.includes('culture') || response.includes('values')) {
        insights.push('Culture emphasis indicates strong leadership thinking')
      }
      if (response.includes('hiring') || response.includes('talent')) {
        insights.push('Talent acquisition focus shows growth mindset')
      }
      break
    case 'technology':
      insights.push('Technology awareness shows modern business thinking')
      if (response.includes('automation') || response.includes('efficiency')) {
        insights.push('Automation focus indicates operational excellence mindset')
      }
      if (response.includes('data') || response.includes('analytics')) {
        insights.push('Data-driven approach shows analytical thinking')
      }
      break
    case 'operations':
      insights.push('Operational focus shows systematic thinking')
      if (response.includes('process') || response.includes('system')) {
        insights.push('Process orientation indicates scalability mindset')
      }
      if (response.includes('metric') || response.includes('measure')) {
        insights.push('Measurement focus shows performance orientation')
      }
      break
    case 'market':
      insights.push('Market focus shows customer-centric thinking')
      if (response.includes('customer') || response.includes('user')) {
        insights.push('Customer focus indicates strong market understanding')
      }
      if (response.includes('competition') || response.includes('competitive')) {
        insights.push('Competitive awareness shows strategic market thinking')
      }
      break
  }
  
  return insights.length > 0 ? insights : ['Good strategic thinking evident in your response']
}

function generateRecommendations(userResponse: string, category: string, userContext: any): string[] {
  const recommendations = []
  
  switch (category) {
    case 'strategy':
      recommendations.push('Develop a comprehensive growth strategy with clear milestones')
      recommendations.push('Create a competitive analysis framework')
      recommendations.push('Establish regular strategy review processes')
      break
    case 'team':
      recommendations.push('Develop a talent acquisition strategy')
      recommendations.push('Create employee development programs')
      recommendations.push('Implement performance management systems')
      break
    case 'technology':
      recommendations.push('Audit current technology stack for optimization opportunities')
      recommendations.push('Implement automation where possible')
      recommendations.push('Develop a technology roadmap aligned with growth goals')
      break
    case 'operations':
      recommendations.push('Map and optimize key business processes')
      recommendations.push('Implement performance metrics and KPIs')
      recommendations.push('Create standard operating procedures')
      break
    case 'market':
      recommendations.push('Develop a comprehensive customer acquisition strategy')
      recommendations.push('Create customer retention and loyalty programs')
      recommendations.push('Implement market research and competitive intelligence')
      break
  }
  
  return recommendations
}

async function generateComprehensiveAnalysis(responses: any, userContext: any, categoryScores: any) {
  // Calculate overall score
  const scores = Object.values(categoryScores) as number[]
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  
  // Generate comprehensive insights
  const insights = [
    'Your business shows strong potential for growth with the right strategic adjustments',
    'Focus on optimizing your current processes before scaling operations',
    'Consider investing in technology that can automate routine tasks',
    'Team development and talent acquisition should be a priority',
    'Market positioning and competitive advantage need strengthening'
  ]
  
  const recommendations = [
    'Develop a comprehensive growth strategy with clear milestones and KPIs',
    'Strengthen your team with key hires in growth-critical roles',
    'Implement better metrics tracking and reporting systems',
    'Invest in technology that supports scalability and efficiency',
    'Create a systematic approach to customer acquisition and retention'
  ]
  
  const actionPlan = [
    'Week 1-2: Conduct comprehensive business audit and identify bottlenecks',
    'Week 3-4: Develop detailed growth strategy with specific KPIs and milestones',
    'Month 2: Begin implementing technology improvements and automation',
    'Month 3: Start hiring for key growth roles and team development'
  ]
  
  const strengths = [
    'Strategic thinking and business awareness',
    'Understanding of growth challenges',
    'Willingness to invest in improvement'
  ]
  
  const weaknesses = [
    'Process optimization and efficiency',
    'Technology stack and automation',
    'Team structure and talent acquisition'
  ]
  
  const opportunities = [
    'Market expansion and customer acquisition',
    'Product development and innovation',
    'Strategic partnerships and collaborations'
  ]
  
  return {
    summary: `Based on your comprehensive assessment, your business has a growth readiness score of ${overallScore}/100. You show strong strategic thinking and business awareness, with clear opportunities for optimization in operations, technology, and team development.`,
    insights,
    recommendations,
    overallScore,
    actionPlan,
    strengths,
    weaknesses,
    opportunities
  }
}
