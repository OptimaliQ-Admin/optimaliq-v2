/**
 * OptimaliQ Market Intelligence AI
 * AI-powered market analysis, trend prediction, and competitive intelligence
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, Target, BarChart3, TrendingUp, Sparkles, ArrowRight,
  CheckCircle, Clock, HelpCircle, Settings, Zap, Bell,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp,
  ThumbsDown, RefreshCw, Volume2, VolumeX, Mic, MicOff,
  Lightbulb, Award, Star, Rocket, Gauge, Activity, PieChart,
  LineChart, AreaChart, Target as TargetIcon, CheckSquare,
  Clock as ClockIcon, Calendar as CalendarIcon, User, Building,
  Globe, TrendingDown, AlertTriangle, Eye, Search, Filter,
  Download, Share2, ExternalLink, MapPin, DollarSign, Percent
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import { Select } from '@/components/ui/form'

// Market intelligence data types
interface MarketTrend {
  id: string
  name: string
  description: string
  category: string
  confidence: number
  impact: 'high' | 'medium' | 'low'
  timeframe: string
  direction: 'up' | 'down' | 'stable'
  aiInsights: string[]
  recommendations: string[]
}

interface Competitor {
  id: string
  name: string
  marketShare: number
  strength: number
  weakness: string[]
  opportunities: string[]
  threats: string[]
  aiAnalysis: string
  riskLevel: 'high' | 'medium' | 'low'
}

interface MarketPrediction {
  id: string
  metric: string
  currentValue: number
  predictedValue: number
  timeframe: string
  confidence: number
  factors: string[]
  impact: 'positive' | 'negative' | 'neutral'
}

// Market intelligence data
const marketIntelligenceData = {
  trends: [
    {
      id: '1',
      name: 'Remote Work Acceleration',
      description: 'Continued growth in remote work adoption and hybrid models',
      category: 'Workplace',
      confidence: 0.94,
      impact: 'high',
      timeframe: '6-12 months',
      direction: 'up',
      aiInsights: [
        '85% of companies planning hybrid work models',
        'Increased demand for collaboration tools',
        'Shift in office space requirements'
      ],
      recommendations: [
        'Invest in remote collaboration tools',
        'Develop hybrid work policies',
        'Optimize digital workflows'
      ]
    },
    {
      id: '2',
      name: 'AI Integration Surge',
      description: 'Rapid adoption of AI technologies across industries',
      category: 'Technology',
      confidence: 0.91,
      impact: 'high',
      timeframe: '3-6 months',
      direction: 'up',
      aiInsights: [
        '67% of organizations increasing AI investment',
        'Focus on automation and efficiency',
        'Growing demand for AI talent'
      ],
      recommendations: [
        'Develop AI strategy and roadmap',
        'Invest in AI training programs',
        'Identify automation opportunities'
      ]
    },
    {
      id: '3',
      name: 'Sustainability Focus',
      description: 'Increased emphasis on environmental responsibility',
      category: 'Environmental',
      confidence: 0.88,
      impact: 'medium',
      timeframe: '12-18 months',
      direction: 'up',
      aiInsights: [
        'Regulatory pressure increasing',
        'Consumer demand for green products',
        'ESG investment growth'
      ],
      recommendations: [
        'Develop sustainability strategy',
        'Implement green initiatives',
        'Track ESG metrics'
      ]
    }
  ],
  competitors: [
    {
      id: '1',
      name: 'Competitor A',
      marketShare: 25,
      strength: 78,
      weakness: ['Slow innovation', 'Limited digital presence'],
      opportunities: ['Market expansion', 'Digital transformation'],
      threats: ['New entrants', 'Technology disruption'],
      aiAnalysis: 'Strong market position but vulnerable to digital disruption',
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Competitor B',
      marketShare: 18,
      strength: 65,
      weakness: ['High costs', 'Complex processes'],
      opportunities: ['Cost optimization', 'Process improvement'],
      threats: ['Price competition', 'Regulatory changes'],
      aiAnalysis: 'Efficiency-focused but struggling with cost structure',
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'Competitor C',
      marketShare: 12,
      strength: 82,
      weakness: ['Limited scale', 'Resource constraints'],
      opportunities: ['Partnerships', 'Niche markets'],
      threats: ['Market consolidation', 'Resource competition'],
      aiAnalysis: 'Innovative but needs strategic partnerships for growth',
      riskLevel: 'low'
    }
  ],
  predictions: [
    {
      id: '1',
      metric: 'Market Size',
      currentValue: 2.4,
      predictedValue: 3.1,
      timeframe: '12 months',
      confidence: 0.87,
      factors: ['Technology adoption', 'Market expansion', 'Regulatory changes'],
      impact: 'positive'
    },
    {
      id: '2',
      metric: 'Customer Acquisition Cost',
      currentValue: 150,
      predictedValue: 135,
      timeframe: '6 months',
      confidence: 0.82,
      factors: ['Digital marketing efficiency', 'Automation', 'Market saturation'],
      impact: 'positive'
    },
    {
      id: '3',
      metric: 'Competition Intensity',
      currentValue: 7.2,
      predictedValue: 8.1,
      timeframe: '9 months',
      confidence: 0.79,
      factors: ['New entrants', 'Technology disruption', 'Market consolidation'],
      impact: 'negative'
    }
  ],
  aiInsights: {
    marketOpportunities: [
      'Digital transformation services',
      'AI-powered analytics',
      'Remote work solutions',
      'Sustainability consulting'
    ],
    riskFactors: [
      'Economic uncertainty',
      'Regulatory changes',
      'Technology disruption',
      'Talent shortage'
    ],
    strategicRecommendations: [
      'Focus on digital innovation',
      'Develop AI capabilities',
      'Expand remote work offerings',
      'Build sustainability expertise'
    ]
  }
}

export default function MarketIntelligenceAIPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [showAIInsights, setShowAIInsights] = React.useState(true)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPredictionColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600'
      case 'negative': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm text-muted-foreground">AI Market Intelligence</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">AI Market Intelligence</h1>
                  <p className="text-muted-foreground">
                    AI-powered market analysis, trend prediction, and competitive intelligence
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                  <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Run AI Analysis
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-2 space-y-8"
              >
                {/* Market Trends */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">AI-Detected Market Trends</h2>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                      options={[
                        { value: 'all', label: 'All Categories' },
                        { value: 'workplace', label: 'Workplace' },
                        { value: 'technology', label: 'Technology' },
                        { value: 'environmental', label: 'Environmental' }
                      ]}
                    />
                  </div>

                  <div className="space-y-6">
                    {marketIntelligenceData.trends.map((trend) => (
                      <div key={trend.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium">{trend.name}</h3>
                              <div className="flex items-center space-x-1">
                                {getDirectionIcon(trend.direction)}
                                <Badge variant="secondary" className={getImpactColor(trend.impact)}>
                                  {trend.impact} impact
                                </Badge>
                                <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                                  AI: {Math.round(trend.confidence * 100)}%
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{trend.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Category: {trend.category}</span>
                              <span>Timeframe: {trend.timeframe}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">AI Insights</h4>
                            <ul className="space-y-1">
                              {trend.aiInsights.map((insight, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                  <span>{insight}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                              {trend.recommendations.map((rec, index) => (
                                <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                                  <span>{rec}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Competitive Analysis */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">AI Competitive Intelligence</h2>
                  
                  <div className="space-y-6">
                    {marketIntelligenceData.competitors.map((competitor) => (
                      <div key={competitor.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium">{competitor.name}</h3>
                              <Badge variant="secondary" className={getRiskColor(competitor.riskLevel)}>
                                Risk: {competitor.riskLevel}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{competitor.marketShare}%</div>
                                <div className="text-xs text-muted-foreground">Market Share</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{competitor.strength}</div>
                                <div className="text-xs text-muted-foreground">Strength Score</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{competitor.weakness.length}</div>
                                <div className="text-xs text-muted-foreground">Weaknesses</div>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">{competitor.aiAnalysis}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Opportunities</h4>
                            <div className="space-y-1">
                              {competitor.opportunities.map((opp, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-green-600 bg-green-100 mr-1 mb-1">
                                  {opp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Threats</h4>
                            <div className="space-y-1">
                              {competitor.threats.map((threat, index) => (
                                <Badge key={index} variant="secondary" className="text-xs text-red-600 bg-red-100 mr-1 mb-1">
                                  {threat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Market Predictions */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold mb-6">AI Market Predictions</h2>
                  
                  <div className="space-y-4">
                    {marketIntelligenceData.predictions.map((prediction) => (
                      <div key={prediction.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{prediction.metric}</h3>
                            <p className="text-sm text-muted-foreground">Timeframe: {prediction.timeframe}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <div className="text-sm font-medium">Current</div>
                              <div className="text-lg font-bold">{prediction.currentValue}</div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="text-right">
                              <div className="text-sm font-medium">Predicted</div>
                              <div className={`text-lg font-bold ${getPredictionColor(prediction.impact)}`}>
                                {prediction.predictedValue}
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                              AI: {Math.round(prediction.confidence * 100)}%
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Confidence Level</span>
                            <span>{Math.round(prediction.confidence * 100)}%</span>
                          </div>
                          <Progress value={prediction.confidence * 100} className="h-2" />
                        </div>

                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">Key Factors</h4>
                          <div className="flex flex-wrap gap-1">
                            {prediction.factors.map((factor, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Market Opportunities */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">AI Market Opportunities</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAIInsights(!showAIInsights)}
                    >
                      {showAIInsights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>

                  {showAIInsights && (
                    <div className="space-y-3">
                      {marketIntelligenceData.aiInsights.marketOpportunities.map((opportunity, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium">{opportunity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Risk Factors */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Risk Assessment</h3>
                  <div className="space-y-3">
                    {marketIntelligenceData.aiInsights.riskFactors.map((risk, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium">{risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Strategic Recommendations */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">AI Strategic Recommendations</h3>
                  <div className="space-y-3">
                    {marketIntelligenceData.aiInsights.strategicRecommendations.map((rec, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{rec}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      View Detailed Analysis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Insights
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure Alerts
                    </Button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
