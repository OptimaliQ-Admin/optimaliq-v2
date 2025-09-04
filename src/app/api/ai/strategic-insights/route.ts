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
  category: z.enum(['challenges', 'strategy', 'operations', 'team', 'technology', 'market', 'metrics']).optional(),
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
  try {
    // Use real AI models for intelligent responses
    const industry = userContext?.industry || 'business'
    const role = userContext?.role || 'business owner'
    const companySize = userContext?.companySize || 'small'
    const revenueRange = userContext?.revenueRange || 'under $1M'

    const prompt = `You are an expert business growth strategist analyzing a ${category} question for a ${companySize} ${industry} company.

Question: ${question}
User Response: ${userResponse}
User Context: ${role} at a ${companySize} company with ${revenueRange} revenue in the ${industry} industry

${aiPrompt}

Please provide a detailed, actionable response that:
1. Shows you understand their specific situation
2. Identifies key insights and opportunities
3. Provides specific, actionable recommendations
4. Uses their industry and company size context
5. Demonstrates strategic business thinking

Keep the response professional but conversational, around 200-300 words.`

    // For now, use the enhanced template-based approach
    // TODO: Integrate with actual AI models when environment is ready
    return generateEnhancedResponse(question, userResponse, userContext, aiPrompt, category)

  } catch (error) {
    console.error('Error generating AI response:', error)
    return generateFallbackResponse(userResponse, category, userContext?.industry, userContext?.companySize)
  }
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

function generateEnhancedResponse(question: string, userResponse: string, userContext: any, aiPrompt: string, category: string): string {
  const industry = userContext?.industry || 'business'
  const role = userContext?.role || 'business owner'
  const companySize = userContext?.companySize || 'small'
  const revenueRange = userContext?.revenueRange || 'under $1M'

  // Generate highly contextual responses based on category and user context
  const responses = {
    challenges: generateChallengeResponse(userResponse, industry, role, companySize),
    strategy: generateStrategyResponse(userResponse, industry, role, companySize),
    team: generateTeamResponse(userResponse, industry, role, companySize),
    metrics: generateMetricsResponse(userResponse, industry, role, companySize),
    technology: generateTechnologyResponse(userResponse, industry, role, companySize)
  }

  return responses[category as keyof typeof responses] || generateFallbackResponse(userResponse, category, industry, companySize)
}

function generateEnhancedAnalysis(responses: any, userContext: any, categoryScores: any, overallScore: number) {
  const industry = userContext?.industry || 'business'
  const role = userContext?.role || 'business owner'
  const companySize = userContext?.companySize || 'small'
  const revenueRange = userContext?.revenueRange || 'under $1M'

  // Generate comprehensive analysis based on user context
  const insights = generateContextualInsights(responses, industry, companySize, role)
  const recommendations = generateContextualRecommendations(responses, industry, companySize, role)
  const actionPlan = generateContextualActionPlan(industry, companySize, overallScore)
  const strengths = generateContextualStrengths(responses, industry, companySize)
  const weaknesses = generateContextualWeaknesses(responses, industry, companySize)
  const opportunities = generateContextualOpportunities(industry, companySize, revenueRange)

  return {
    summary: `Based on your comprehensive assessment, your ${companySize} ${industry} company has a growth readiness score of ${overallScore}/100. You demonstrate strong strategic thinking and business awareness, with clear opportunities for optimization in operations, technology, and team development.`,
    insights,
    recommendations,
    overallScore,
    actionPlan,
    strengths,
    weaknesses,
    opportunities
  }
}

function generateContextualInsights(responses: any, industry: string, companySize: string, role: string): string[] {
  const insights = []
  
  insights.push(`Strategic thinking is evident in your ${role} approach`)
  
  if (industry === 'SaaS') {
    insights.push('SaaS growth patterns show focus on recurring revenue and customer success')
    insights.push('Technology stack optimization is critical for SaaS scalability')
  } else if (industry === 'E-commerce') {
    insights.push('E-commerce growth requires strong customer acquisition and retention strategies')
    insights.push('Digital marketing and conversion optimization are key growth drivers')
  } else if (industry === 'Technology') {
    insights.push('Technology companies benefit from innovation and market positioning')
    insights.push('Team scaling and talent acquisition are critical success factors')
  }
  
  if (companySize.includes('11-50')) {
    insights.push('Mid-stage companies need to balance growth with operational efficiency')
  } else if (companySize.includes('51-200')) {
    insights.push('Growing companies require systematic processes and team development')
  } else if (companySize.includes('201-500')) {
    insights.push('Established companies need strategic focus and market expansion')
  }
  
  return insights
}

function generateContextualRecommendations(responses: any, industry: string, companySize: string, role: string): string[] {
  const recommendations = []
  
  if (industry === 'SaaS') {
    recommendations.push('Implement customer success metrics and retention strategies')
    recommendations.push('Develop product-led growth initiatives')
    recommendations.push('Optimize your technology stack for scalability')
  } else if (industry === 'E-commerce') {
    recommendations.push('Enhance customer acquisition through multi-channel marketing')
    recommendations.push('Implement advanced analytics and conversion optimization')
    recommendations.push('Develop customer retention and loyalty programs')
  } else if (industry === 'Technology') {
    recommendations.push('Focus on innovation and competitive differentiation')
    recommendations.push('Build strategic partnerships and market positioning')
    recommendations.push('Invest in talent acquisition and team development')
  }
  
  if (companySize.includes('11-50')) {
    recommendations.push('Establish systematic processes and operational frameworks')
    recommendations.push('Focus on team scaling and role specialization')
  } else if (companySize.includes('51-200')) {
    recommendations.push('Implement advanced analytics and performance tracking')
    recommendations.push('Develop strategic partnerships and market expansion')
  }
  
  recommendations.push('Create comprehensive growth strategy with clear milestones')
  recommendations.push('Implement regular performance reviews and optimization cycles')
  
  return recommendations
}

function generateContextualActionPlan(industry: string, companySize: string, overallScore: number): string[] {
  const actionPlan = []
  
  if (overallScore < 60) {
    actionPlan.push('Week 1-2: Conduct comprehensive business audit and identify critical gaps')
    actionPlan.push('Week 3-4: Develop foundational processes and systems')
  } else if (overallScore < 80) {
    actionPlan.push('Week 1-2: Optimize existing processes and identify improvement opportunities')
    actionPlan.push('Week 3-4: Implement strategic initiatives and team development')
  } else {
    actionPlan.push('Week 1-2: Focus on advanced optimization and market expansion')
    actionPlan.push('Week 3-4: Implement scaling strategies and strategic partnerships')
  }
  
  actionPlan.push('Month 2: Begin implementing technology improvements and automation')
  actionPlan.push('Month 3: Start strategic hiring and team development initiatives')
  
  return actionPlan
}

function generateContextualStrengths(responses: any, industry: string, companySize: string): string[] {
  const strengths = ['Strategic thinking and business awareness', 'Understanding of growth challenges']
  
  if (industry === 'SaaS') {
    strengths.push('Technology focus and innovation mindset')
  } else if (industry === 'E-commerce') {
    strengths.push('Customer-centric approach and market understanding')
  } else if (industry === 'Technology') {
    strengths.push('Technical expertise and innovation capabilities')
  }
  
  if (companySize.includes('11-50')) {
    strengths.push('Agility and rapid decision-making capabilities')
  } else if (companySize.includes('51-200')) {
    strengths.push('Established processes and team structure')
  }
  
  return strengths
}

function generateContextualWeaknesses(responses: any, industry: string, companySize: string): string[] {
  const weaknesses = ['Process optimization and efficiency', 'Technology stack and automation']
  
  if (industry === 'SaaS') {
    weaknesses.push('Customer success and retention strategies')
  } else if (industry === 'E-commerce') {
    weaknesses.push('Advanced analytics and conversion optimization')
  } else if (industry === 'Technology') {
    weaknesses.push('Market positioning and competitive differentiation')
  }
  
  if (companySize.includes('11-50')) {
    weaknesses.push('Systematic processes and operational frameworks')
  } else if (companySize.includes('51-200')) {
    weaknesses.push('Advanced analytics and performance tracking')
  }
  
  return weaknesses
}

function generateContextualOpportunities(industry: string, companySize: string, revenueRange: string): string[] {
  const opportunities = []
  
  if (industry === 'SaaS') {
    opportunities.push('Product-led growth and customer success expansion')
    opportunities.push('Market expansion and international growth')
  } else if (industry === 'E-commerce') {
    opportunities.push('Omnichannel expansion and customer experience enhancement')
    opportunities.push('Advanced personalization and AI-driven marketing')
  } else if (industry === 'Technology') {
    opportunities.push('Innovation and new product development')
    opportunities.push('Strategic partnerships and market positioning')
  }
  
  if (revenueRange.includes('$1M-$10M')) {
    opportunities.push('Scaling operations and team expansion')
  } else if (revenueRange.includes('$10M+')) {
    opportunities.push('Market leadership and strategic acquisitions')
  }
  
  opportunities.push('Technology automation and efficiency improvements')
  
  return opportunities
}

function generateFallbackResponse(userResponse: string, category: string, industry?: string, companySize?: string): string {
  const industryContext = industry ? ` in the ${industry} industry` : ''
  const sizeContext = companySize ? ` for a ${companySize} company` : ''
  
  return `Thank you for that detailed response. I can see you're thinking strategically about your ${category} approach${industryContext}${sizeContext}. Based on your input, here are some key insights:

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
  try {
    // Calculate overall score
    const scores = Object.values(categoryScores) as number[]
    const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    
    const industry = userContext?.industry || 'business'
    const role = userContext?.role || 'business owner'
    const companySize = userContext?.companySize || 'small'
    const revenueRange = userContext?.revenueRange || 'under $1M'

    // Use AI to generate comprehensive analysis
    const analysisPrompt = `You are a senior business consultant analyzing a comprehensive growth assessment for a ${companySize} ${industry} company.

Company Context:
- Industry: ${industry}
- Company Size: ${companySize}
- Revenue Range: ${revenueRange}
- Role: ${role}
- Overall Growth Readiness Score: ${overallScore}/100

Category Scores:
${Object.entries(categoryScores).map(([category, score]) => `- ${category}: ${score}/100`).join('\n')}

Assessment Responses:
${Object.entries(responses).map(([question, response]: [string, any]) => 
  `Question: ${question}\nResponse: ${response.answer || response}\n`
).join('\n')}

Please provide a comprehensive business analysis including:

1. **Executive Summary** (2-3 sentences about their growth readiness)
2. **Key Insights** (5 specific insights about their business)
3. **Strategic Recommendations** (5 actionable recommendations)
4. **30-Day Action Plan** (4 weekly milestones)
5. **Strengths** (3 key strengths)
6. **Weaknesses** (3 areas for improvement)
7. **Opportunities** (3 growth opportunities)

Format your response as JSON with these exact keys: summary, insights, recommendations, actionPlan, strengths, weaknesses, opportunities.`

    // For now, use enhanced template-based analysis
    // TODO: Integrate with actual AI models when environment is ready
    return generateEnhancedAnalysis(responses, userContext, categoryScores, overallScore)
  } catch (error) {
    console.error('Error generating AI analysis:', error)
  }

  // Fallback to template-based analysis
  const scores = Object.values(categoryScores) as number[]
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  
  return {
    summary: `Based on your comprehensive assessment, your business has a growth readiness score of ${overallScore}/100. You show strong strategic thinking and business awareness, with clear opportunities for optimization in operations, technology, and team development.`,
    insights: [
      'Your business shows strong potential for growth with the right strategic adjustments',
      'Focus on optimizing your current processes before scaling operations',
      'Consider investing in technology that can automate routine tasks',
      'Team development and talent acquisition should be a priority',
      'Market positioning and competitive advantage need strengthening'
    ],
    recommendations: [
      'Develop a comprehensive growth strategy with clear milestones and KPIs',
      'Strengthen your team with key hires in growth-critical roles',
      'Implement better metrics tracking and reporting systems',
      'Invest in technology that supports scalability and efficiency',
      'Create a systematic approach to customer acquisition and retention'
    ],
    overallScore,
    actionPlan: [
      'Week 1-2: Conduct comprehensive business audit and identify bottlenecks',
      'Week 3-4: Develop detailed growth strategy with specific KPIs and milestones',
      'Month 2: Begin implementing technology improvements and automation',
      'Month 3: Start hiring for key growth roles and team development'
    ],
    strengths: [
      'Strategic thinking and business awareness',
      'Understanding of growth challenges',
      'Willingness to invest in improvement'
    ],
    weaknesses: [
      'Process optimization and efficiency',
      'Technology stack and automation',
      'Team structure and talent acquisition'
    ],
    opportunities: [
      'Market expansion and customer acquisition',
      'Product development and innovation',
      'Strategic partnerships and collaborations'
    ]
  }
}
