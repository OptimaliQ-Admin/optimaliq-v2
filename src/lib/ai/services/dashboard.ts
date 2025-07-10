import { aiService } from '../service'

export interface DashboardData {
  metrics: {
    revenue: number
    growth: number
    customers: number
    churn: number
    [key: string]: number
  }
  trends: {
    date: string
    value: number
    metric: string
  }[]
  insights: {
    id: string
    type: string
    title: string
    description: string
    impact: number
  }[]
  goals: {
    id: string
    title: string
    target: number
    current: number
    deadline: string
  }[]
}

export interface Insight {
  id: string
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk' | 'performance'
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
  timeframe: string
}

export interface TrendPrediction {
  id: string
  metric: string
  currentValue: number
  predictedValue: number
  confidence: number
  timeframe: string
  factors: {
    factor: string
    impact: 'positive' | 'negative' | 'neutral'
    weight: number
  }[]
  scenarios: {
    optimistic: number
    realistic: number
    pessimistic: number
  }
}

export interface ActionSuggestion {
  id: string
  title: string
  description: string
  category: string
  priority: 'high' | 'medium' | 'low'
  impact: 'high' | 'medium' | 'low'
  effort: 'low' | 'medium' | 'high'
  timeframe: string
  expectedOutcome: string
  successMetrics: string[]
  dependencies: string[]
}

export interface PerformanceAnalysis {
  id: string
  overallScore: number
  categories: {
    category: string
    score: number
    weight: number
    trends: {
      period: string
      value: number
      change: number
    }[]
  }[]
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export interface Report {
  id: string
  title: string
  type: 'executive' | 'operational' | 'analytical' | 'comparative'
  summary: string
  period: string
  sections: {
    title: string
    content: string
    data: any
    visualizations: {
      type: 'chart' | 'table' | 'metric'
      data: any
      config: any
    }[]
  }[]
  insights: Insight[]
  recommendations: ActionSuggestion[]
  nextSteps: string[]
}

// New interfaces for enhanced analytics
export interface ExecutiveSummary {
  id: string
  period: string
  keyMetrics: {
    metric: string
    value: number
    change: number
    trend: 'up' | 'down' | 'stable'
    status: 'excellent' | 'good' | 'warning' | 'critical'
  }[]
  strategicHighlights: {
    title: string
    description: string
    impact: 'positive' | 'negative' | 'neutral'
    priority: 'high' | 'medium' | 'low'
  }[]
  businessNarrative: string
  nextQuarterOutlook: {
    scenario: 'optimistic' | 'realistic' | 'pessimistic'
    probability: number
    keyDrivers: string[]
    risks: string[]
  }
  executiveRecommendations: {
    immediate: string[]
    strategic: string[]
    longTerm: string[]
  }
}

export interface PredictiveAnalytics {
  id: string
  metric: string
  predictions: {
    timeframe: string
    value: number
    confidence: number
    factors: {
      factor: string
      impact: number
      confidence: number
    }[]
  }[]
  seasonality: {
    pattern: 'trending' | 'seasonal' | 'cyclical' | 'random'
    strength: number
    peaks: string[]
    troughs: string[]
  }
  riskAssessment: {
    highRisk: string[]
    mediumRisk: string[]
    lowRisk: string[]
    mitigationStrategies: string[]
  }
}

export interface StrategicInsight {
  id: string
  category: 'market' | 'competitive' | 'operational' | 'financial' | 'technology'
  title: string
  description: string
  evidence: {
    dataPoints: string[]
    trends: string[]
    benchmarks: string[]
  }
  implications: {
    shortTerm: string[]
    longTerm: string[]
    strategic: string[]
  }
  confidence: number
  timeframe: string
  stakeholders: string[]
}

export interface CompetitiveAnalysis {
  id: string
  competitors: {
    name: string
    position: 'leader' | 'challenger' | 'follower' | 'niche'
    strengths: string[]
    weaknesses: string[]
    marketShare: number
    growthRate: number
  }[]
  marketPosition: {
    current: string
    target: string
    gap: string
    opportunities: string[]
  }
  competitiveAdvantages: string[]
  threats: string[]
  strategicMoves: {
    offensive: string[]
    defensive: string[]
    neutral: string[]
  }
}

export class DashboardAIService {
  private readonly userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Generate insights from dashboard data
   */
  async generateInsights(data: DashboardData): Promise<Insight[]> {
    const prompt = this.buildInsightsPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2500
    }, this.userId)

    return this.validateInsights(response.content)
  }

  /**
   * Predict trends based on historical data
   */
  async predictTrends(historicalData: any[]): Promise<TrendPrediction[]> {
    const prompt = this.buildTrendPredictionPrompt(historicalData)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2000
    }, this.userId)

    return this.validateTrendPredictions(response.content)
  }

  /**
   * Suggest actions based on insights
   */
  async suggestActions(insights: Insight[]): Promise<ActionSuggestion[]> {
    const prompt = this.buildActionSuggestionPrompt(insights)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return this.validateActionSuggestions(response.content)
  }

  /**
   * Analyze performance across different categories
   */
  async analyzePerformance(metrics: any[]): Promise<PerformanceAnalysis> {
    const prompt = this.buildPerformanceAnalysisPrompt(metrics)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2500
    }, this.userId)

    return this.validatePerformanceAnalysis(response.content)
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(data: any): Promise<Report[]> {
    const prompt = this.buildReportGenerationPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 3000
    }, this.userId)

    return this.validateReports(response.content)
  }

  /**
   * Generate executive summary with strategic insights
   */
  async generateExecutiveSummary(data: DashboardData, period: string = 'Q4 2024'): Promise<ExecutiveSummary> {
    const prompt = this.buildExecutiveSummaryPrompt(data, period)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 3000
    }, this.userId)

    return this.validateExecutiveSummary(response.content)
  }

  /**
   * Generate predictive analytics with advanced forecasting
   */
  async generatePredictiveAnalytics(data: DashboardData, metric: string): Promise<PredictiveAnalytics> {
    const prompt = this.buildPredictiveAnalyticsPrompt(data, metric)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2500
    }, this.userId)

    return this.validatePredictiveAnalytics(response.content)
  }

  /**
   * Generate strategic insights for business decision making
   */
  async generateStrategicInsights(data: DashboardData, industry: string): Promise<StrategicInsight[]> {
    const prompt = this.buildStrategicInsightsPrompt(data, industry)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.5,
      maxTokens: 3000
    }, this.userId)

    return this.validateStrategicInsights(response.content)
  }

  /**
   * Generate competitive analysis and market positioning
   */
  async generateCompetitiveAnalysis(data: DashboardData, industry: string): Promise<CompetitiveAnalysis> {
    const prompt = this.buildCompetitiveAnalysisPrompt(data, industry)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 3000
    }, this.userId)

    return this.validateCompetitiveAnalysis(response.content)
  }

  /**
   * Generate business narrative and storytelling
   */
  async generateBusinessNarrative(data: DashboardData, context: string): Promise<string> {
    const prompt = this.buildBusinessNarrativePrompt(data, context)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'text',
      temperature: 0.7,
      maxTokens: 1500
    }, this.userId)

    return response.content
  }

  /**
   * Generate scenario planning and what-if analysis
   */
  async generateScenarioPlanning(data: DashboardData, scenarios: string[]): Promise<any> {
    const prompt = this.buildScenarioPlanningPrompt(data, scenarios)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.6,
      maxTokens: 3000
    }, this.userId)

    return this.validateScenarioPlanning(response.content)
  }

  /**
   * Identify anomalies in dashboard data
   */
  async detectAnomalies(data: DashboardData): Promise<any[]> {
    const prompt = this.buildAnomalyDetectionPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.2,
      maxTokens: 1500
    }, this.userId)

    return response.content
  }

  /**
   * Generate KPI recommendations
   */
  async generateKPIRecommendations(data: DashboardData): Promise<any[]> {
    const prompt = this.buildKPIRecommendationPrompt(data)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.4,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  /**
   * Compare performance with benchmarks
   */
  async compareWithBenchmarks(data: DashboardData, industry: string): Promise<any> {
    const prompt = this.buildBenchmarkComparisonPrompt(data, industry)
    
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4o-mini',
      responseFormat: 'json',
      temperature: 0.3,
      maxTokens: 2000
    }, this.userId)

    return response.content
  }

  // Private helper methods for building prompts

  private buildInsightsPrompt(data: DashboardData): string {
    return `Analyze the following dashboard data and generate actionable insights:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with an array of insights:
[
  {
    "id": "string",
    "type": "trend|anomaly|opportunity|risk|performance",
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
    "timeframe": "string"
  }
]

Focus on identifying patterns, trends, and actionable insights that can drive business improvement.`
  }

  private buildTrendPredictionPrompt(historicalData: any[]): string {
    return `Based on the following historical data, predict future trends:

Historical Data:
${JSON.stringify(historicalData, null, 2)}

Please provide a JSON response with trend predictions:
[
  {
    "id": "string",
    "metric": "string",
    "currentValue": number,
    "predictedValue": number,
    "confidence": number (0-1),
    "timeframe": "string",
    "factors": [
      {
        "factor": "string",
        "impact": "positive|negative|neutral",
        "weight": number (0-1)
      }
    ],
    "scenarios": {
      "optimistic": number,
      "realistic": number,
      "pessimistic": number
    }
  }
]

Consider seasonal patterns, growth trends, and external factors in your predictions.`
  }

  private buildActionSuggestionPrompt(insights: Insight[]): string {
    return `Based on the following insights, suggest specific actions:

Insights:
${JSON.stringify(insights, null, 2)}

Please provide a JSON response with action suggestions:
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "priority": "high|medium|low",
    "impact": "high|medium|low",
    "effort": "low|medium|high",
    "timeframe": "string",
    "expectedOutcome": "string",
    "successMetrics": ["string"],
    "dependencies": ["string"]
  }
]

Prioritize actions based on impact and effort, focusing on high-impact, low-effort improvements first.`
  }

  private buildPerformanceAnalysisPrompt(metrics: any[]): string {
    return `Analyze the performance across different categories:

Metrics:
${JSON.stringify(metrics, null, 2)}

Please provide a JSON response with performance analysis:
{
  "id": "string",
  "overallScore": number (0-100),
  "categories": [
    {
      "category": "string",
      "score": number (0-100),
      "weight": number (0-1),
      "trends": [
        {
          "period": "string",
          "value": number,
          "change": number
        }
      ]
    }
  ],
  "strengths": ["string"],
  "weaknesses": ["string"],
  "opportunities": ["string"],
  "threats": ["string"],
  "recommendations": {
    "immediate": ["string"],
    "shortTerm": ["string"],
    "longTerm": ["string"]
  }
}

Provide a comprehensive analysis with actionable recommendations.`
  }

  private buildReportGenerationPrompt(data: any): string {
    return `Generate comprehensive reports based on the following data:

Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with reports:
[
  {
    "id": "string",
    "title": "string",
    "type": "executive|operational|analytical|comparative",
    "summary": "string",
    "period": "string",
    "sections": [
      {
        "title": "string",
        "content": "string",
        "data": {},
        "visualizations": [
          {
            "type": "chart|table|metric",
            "data": {},
            "config": {}
          }
        ]
      }
    ],
    "insights": [],
    "recommendations": [],
    "nextSteps": ["string"]
  }
]

Create different types of reports for different audiences and purposes.`
  }

  private buildAnomalyDetectionPrompt(data: DashboardData): string {
    return `Detect anomalies in the following dashboard data:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response identifying anomalies, outliers, and unusual patterns in the data.`
  }

  private buildKPIRecommendationPrompt(data: DashboardData): string {
    return `Based on the following dashboard data, recommend additional KPIs and metrics:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with KPI recommendations that would provide additional value and insights.`
  }

  private buildBenchmarkComparisonPrompt(data: DashboardData, industry: string): string {
    return `Compare the following dashboard data with industry benchmarks for ${industry}:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response comparing the performance with industry standards and identifying areas of strength and improvement opportunities.`
  }

  // Validation methods

  private validateInsights(content: any): Insight[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid insights response format')
    }

    return content.map(insight => ({
      id: insight.id || crypto.randomUUID(),
      type: insight.type || 'trend',
      title: insight.title || 'Insight',
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
      timeframe: insight.timeframe || '30 days'
    }))
  }

  private validateTrendPredictions(content: any): TrendPrediction[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid trend predictions response format')
    }

    return content.map(prediction => ({
      id: prediction.id || crypto.randomUUID(),
      metric: prediction.metric || 'unknown',
      currentValue: prediction.currentValue || 0,
      predictedValue: prediction.predictedValue || 0,
      confidence: Math.max(0, Math.min(1, prediction.confidence || 0.8)),
      timeframe: prediction.timeframe || '30 days',
      factors: Array.isArray(prediction.factors) ? prediction.factors : [],
      scenarios: prediction.scenarios || {
        optimistic: 0,
        realistic: 0,
        pessimistic: 0
      }
    }))
  }

  private validateActionSuggestions(content: any): ActionSuggestion[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid action suggestions response format')
    }

    return content.map(action => ({
      id: action.id || crypto.randomUUID(),
      title: action.title || 'Action',
      description: action.description || '',
      category: action.category || 'general',
      priority: action.priority || 'medium',
      impact: action.impact || 'medium',
      effort: action.effort || 'medium',
      timeframe: action.timeframe || '30 days',
      expectedOutcome: action.expectedOutcome || '',
      successMetrics: Array.isArray(action.successMetrics) ? action.successMetrics : [],
      dependencies: Array.isArray(action.dependencies) ? action.dependencies : []
    }))
  }

  private validatePerformanceAnalysis(content: any): PerformanceAnalysis {
    if (!content.overallScore || !content.categories) {
      throw new Error('Invalid performance analysis response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      overallScore: Math.max(0, Math.min(100, content.overallScore)),
      categories: Array.isArray(content.categories) ? content.categories : [],
      strengths: Array.isArray(content.strengths) ? content.strengths : [],
      weaknesses: Array.isArray(content.weaknesses) ? content.weaknesses : [],
      opportunities: Array.isArray(content.opportunities) ? content.opportunities : [],
      threats: Array.isArray(content.threats) ? content.threats : [],
      recommendations: content.recommendations || {
        immediate: [],
        shortTerm: [],
        longTerm: []
      }
    }
  }

  private validateReports(content: any): Report[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid reports response format')
    }

    return content.map(report => ({
      id: report.id || crypto.randomUUID(),
      title: report.title || 'Report',
      type: report.type || 'analytical',
      summary: report.summary || '',
      period: report.period || '30 days',
      sections: Array.isArray(report.sections) ? report.sections : [],
      insights: Array.isArray(report.insights) ? report.insights : [],
      recommendations: Array.isArray(report.recommendations) ? report.recommendations : [],
      nextSteps: Array.isArray(report.nextSteps) ? report.nextSteps : []
    }))
  }

  // New prompt building methods for enhanced analytics

  private buildExecutiveSummaryPrompt(data: DashboardData, period: string): string {
    return `Generate an executive summary for ${period} based on the following dashboard data:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with an executive summary:
{
  "id": "string",
  "period": "${period}",
  "keyMetrics": [
    {
      "metric": "string",
      "value": number,
      "change": number,
      "trend": "up|down|stable",
      "status": "excellent|good|warning|critical"
    }
  ],
  "strategicHighlights": [
    {
      "title": "string",
      "description": "string",
      "impact": "positive|negative|neutral",
      "priority": "high|medium|low"
    }
  ],
  "businessNarrative": "string",
  "nextQuarterOutlook": {
    "scenario": "optimistic|realistic|pessimistic",
    "probability": number (0-1),
    "keyDrivers": ["string"],
    "risks": ["string"]
  },
  "executiveRecommendations": {
    "immediate": ["string"],
    "strategic": ["string"],
    "longTerm": ["string"]
  }
}

Focus on high-level strategic insights and actionable recommendations for executive decision-making.`
  }

  private buildPredictiveAnalyticsPrompt(data: DashboardData, metric: string): string {
    return `Generate predictive analytics for ${metric} based on the following dashboard data:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with predictive analytics:
{
  "id": "string",
  "metric": "${metric}",
  "predictions": [
    {
      "timeframe": "string",
      "value": number,
      "confidence": number (0-1),
      "factors": [
        {
          "factor": "string",
          "impact": number (-1 to 1),
          "confidence": number (0-1)
        }
      ]
    }
  ],
  "seasonality": {
    "pattern": "trending|seasonal|cyclical|random",
    "strength": number (0-1),
    "peaks": ["string"],
    "troughs": ["string"]
  },
  "riskAssessment": {
    "highRisk": ["string"],
    "mediumRisk": ["string"],
    "lowRisk": ["string"],
    "mitigationStrategies": ["string"]
  }
}

Use advanced forecasting techniques and consider multiple scenarios and risk factors.`
  }

  private buildStrategicInsightsPrompt(data: DashboardData, industry: string): string {
    return `Generate strategic insights for ${industry} industry based on the following dashboard data:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with strategic insights:
[
  {
    "id": "string",
    "category": "market|competitive|operational|financial|technology",
    "title": "string",
    "description": "string",
    "evidence": {
      "dataPoints": ["string"],
      "trends": ["string"],
      "benchmarks": ["string"]
    },
    "implications": {
      "shortTerm": ["string"],
      "longTerm": ["string"],
      "strategic": ["string"]
    },
    "confidence": number (0-1),
    "timeframe": "string",
    "stakeholders": ["string"]
  }
]

Focus on strategic implications and long-term business impact.`
  }

  private buildCompetitiveAnalysisPrompt(data: DashboardData, industry: string): string {
    return `Generate competitive analysis for ${industry} industry based on the following dashboard data:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Please provide a JSON response with competitive analysis:
{
  "id": "string",
  "competitors": [
    {
      "name": "string",
      "position": "leader|challenger|follower|niche",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "marketShare": number (0-1),
      "growthRate": number
    }
  ],
  "marketPosition": {
    "current": "string",
    "target": "string",
    "gap": "string",
    "opportunities": ["string"]
  },
  "competitiveAdvantages": ["string"],
  "threats": ["string"],
  "strategicMoves": {
    "offensive": ["string"],
    "defensive": ["string"],
    "neutral": ["string"]
  }
}

Analyze competitive landscape and provide strategic positioning recommendations.`
  }

  private buildBusinessNarrativePrompt(data: DashboardData, context: string): string {
    return `Generate a compelling business narrative based on the following dashboard data and context:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Context: ${context}

Please provide a narrative that tells the story of the business performance, challenges, opportunities, and strategic direction. Focus on creating a compelling narrative that would resonate with stakeholders, investors, and team members.

Write in a clear, professional tone that balances data-driven insights with strategic vision.`
  }

  private buildScenarioPlanningPrompt(data: DashboardData, scenarios: string[]): string {
    return `Generate scenario planning analysis based on the following dashboard data and scenarios:

Dashboard Data:
${JSON.stringify(data, null, 2)}

Scenarios: ${scenarios.join(', ')}

Please provide a JSON response with scenario analysis:
{
  "scenarios": [
    {
      "name": "string",
      "description": "string",
      "probability": number (0-1),
      "impact": "high|medium|low",
      "outcomes": {
        "revenue": number,
        "growth": number,
        "risks": ["string"],
        "opportunities": ["string"]
      },
      "requiredActions": ["string"],
      "timeline": "string"
    }
  ],
  "recommendations": {
    "preparation": ["string"],
    "monitoring": ["string"],
    "response": ["string"]
  }
}

Analyze each scenario and provide actionable recommendations for preparation and response.`
  }

  // New validation methods for enhanced analytics

  private validateExecutiveSummary(content: any): ExecutiveSummary {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid executive summary response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      period: content.period || 'Q4 2024',
      keyMetrics: Array.isArray(content.keyMetrics) ? content.keyMetrics : [],
      strategicHighlights: Array.isArray(content.strategicHighlights) ? content.strategicHighlights : [],
      businessNarrative: content.businessNarrative || '',
      nextQuarterOutlook: content.nextQuarterOutlook || {
        scenario: 'realistic',
        probability: 0.5,
        keyDrivers: [],
        risks: []
      },
      executiveRecommendations: content.executiveRecommendations || {
        immediate: [],
        strategic: [],
        longTerm: []
      }
    }
  }

  private validatePredictiveAnalytics(content: any): PredictiveAnalytics {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid predictive analytics response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      metric: content.metric || 'unknown',
      predictions: Array.isArray(content.predictions) ? content.predictions : [],
      seasonality: content.seasonality || {
        pattern: 'trending',
        strength: 0.5,
        peaks: [],
        troughs: []
      },
      riskAssessment: content.riskAssessment || {
        highRisk: [],
        mediumRisk: [],
        lowRisk: [],
        mitigationStrategies: []
      }
    }
  }

  private validateStrategicInsights(content: any): StrategicInsight[] {
    if (!Array.isArray(content)) {
      throw new Error('Invalid strategic insights response format')
    }

    return content.map(insight => ({
      id: insight.id || crypto.randomUUID(),
      category: insight.category || 'market',
      title: insight.title || 'Strategic Insight',
      description: insight.description || '',
      evidence: insight.evidence || {
        dataPoints: [],
        trends: [],
        benchmarks: []
      },
      implications: insight.implications || {
        shortTerm: [],
        longTerm: [],
        strategic: []
      },
      confidence: Math.max(0, Math.min(1, insight.confidence || 0.8)),
      timeframe: insight.timeframe || '90 days',
      stakeholders: Array.isArray(insight.stakeholders) ? insight.stakeholders : []
    }))
  }

  private validateCompetitiveAnalysis(content: any): CompetitiveAnalysis {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid competitive analysis response format')
    }

    return {
      id: content.id || crypto.randomUUID(),
      competitors: Array.isArray(content.competitors) ? content.competitors : [],
      marketPosition: content.marketPosition || {
        current: 'unknown',
        target: 'unknown',
        gap: 'unknown',
        opportunities: []
      },
      competitiveAdvantages: Array.isArray(content.competitiveAdvantages) ? content.competitiveAdvantages : [],
      threats: Array.isArray(content.threats) ? content.threats : [],
      strategicMoves: content.strategicMoves || {
        offensive: [],
        defensive: [],
        neutral: []
      }
    }
  }

  private validateScenarioPlanning(content: any): any {
    if (!content || typeof content !== 'object') {
      throw new Error('Invalid scenario planning response format')
    }

    return {
      scenarios: Array.isArray(content.scenarios) ? content.scenarios : [],
      recommendations: content.recommendations || {
        preparation: [],
        monitoring: [],
        response: []
      }
    }
  }
} 