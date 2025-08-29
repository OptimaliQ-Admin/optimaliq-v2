/**
 * OptimaliQ Assessment Detailed Analysis Page
 * Deep dive into assessment results with benchmarks, trends, and comprehensive insights
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Zap, 
  Award, 
  Lightbulb, 
  Shield,
  ArrowLeft,
  ArrowRight,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Star,
  Clock,
  Eye,
  Download as DownloadIcon,
  Mail,
  MessageSquare,
  TrendingDown,
  Activity,
  PieChart as PieChartIcon,
  BarChart,
  LineChart as LineChartIcon,
  Filter,
  Search,
  RefreshCw,
  Info,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, BarChart as BarChartComponent, MetricCard } from '@/components/ui/charts'
import { Select, Checkbox } from '@/components/ui/form'

// Sample Detailed Analysis Data
const analysisData = {
  overallScore: 72,
  industryBenchmark: 68,
  peerComparison: 75,
  historicalTrend: [
    { month: 'Jan', score: 65, benchmark: 68 },
    { month: 'Feb', score: 68, benchmark: 68 },
    { month: 'Mar', score: 72, benchmark: 68 },
    { month: 'Apr', score: 75, benchmark: 68 },
    { month: 'May', score: 78, benchmark: 68 },
    { month: 'Jun', score: 72, benchmark: 68 }
  ],
  categoryAnalysis: [
    {
      name: 'Strategy',
      score: 78,
      benchmark: 72,
      trend: 'up',
      insights: [
        'Strong strategic vision and direction',
        'Effective goal setting and planning',
        'Good stakeholder alignment',
        'Room for improvement in execution tracking'
      ],
      recommendations: [
        'Implement quarterly strategic reviews',
        'Develop KPI tracking system',
        'Enhance communication of strategic priorities'
      ]
    },
    {
      name: 'Operations',
      score: 65,
      benchmark: 70,
      trend: 'down',
      insights: [
        'Process efficiency needs improvement',
        'Technology utilization is below average',
        'Good quality management practices',
        'Opportunity for automation'
      ],
      recommendations: [
        'Conduct process optimization audit',
        'Implement workflow automation',
        'Enhance performance metrics tracking'
      ]
    },
    {
      name: 'Team',
      score: 85,
      benchmark: 75,
      trend: 'up',
      insights: [
        'Excellent team collaboration',
        'Strong leadership effectiveness',
        'Good communication patterns',
        'High employee engagement'
      ],
      recommendations: [
        'Leverage team strengths for other areas',
        'Document best practices for scaling',
        'Consider team development programs'
      ]
    },
    {
      name: 'Growth',
      score: 70,
      benchmark: 68,
      trend: 'stable',
      insights: [
        'Good growth strategy foundation',
        'Innovation capabilities are developing',
        'Market positioning is strong',
        'Need for data-driven decision making'
      ],
      recommendations: [
        'Enhance data analytics capabilities',
        'Develop innovation framework',
        'Strengthen market research processes'
      ]
    },
    {
      name: 'Technology',
      score: 60,
      benchmark: 72,
      trend: 'down',
      insights: [
        'Technology infrastructure needs modernization',
        'Digital transformation opportunities exist',
        'Data security practices are adequate',
        'Integration capabilities are limited'
      ],
      recommendations: [
        'Develop technology roadmap',
        'Implement cloud-based solutions',
        'Enhance data analytics platform'
      ]
    }
  ],
  benchmarkComparison: {
    industry: 'Healthcare',
    size: '51-200 employees',
    region: 'North America',
    dataPoints: [
      { metric: 'Strategy', yourScore: 78, industryAvg: 72, topQuartile: 85 },
      { metric: 'Operations', yourScore: 65, industryAvg: 70, topQuartile: 82 },
      { metric: 'Team', yourScore: 85, industryAvg: 75, topQuartile: 88 },
      { metric: 'Growth', yourScore: 70, industryAvg: 68, topQuartile: 80 },
      { metric: 'Technology', yourScore: 60, industryAvg: 72, topQuartile: 85 }
    ]
  },
  riskAnalysis: [
    {
      category: 'Technology',
      risk: 'High',
      impact: 'Medium',
      probability: 'High',
      description: 'Outdated technology infrastructure may limit growth and efficiency',
      mitigation: 'Implement technology modernization plan within 6 months'
    },
    {
      category: 'Operations',
      risk: 'Medium',
      impact: 'High',
      probability: 'Medium',
      description: 'Process inefficiencies could impact scalability and cost management',
      mitigation: 'Conduct operational audit and implement process improvements'
    },
    {
      category: 'Growth',
      risk: 'Low',
      impact: 'High',
      probability: 'Low',
      description: 'Limited data analytics capabilities may slow decision making',
      mitigation: 'Develop data analytics strategy and invest in tools'
    }
  ]
}

export default function AssessmentAnalysisPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [timeRange, setTimeRange] = React.useState<string>('6months')
  const [isLoading, setIsLoading] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'info'
    }
  }

  const filteredCategories = selectedCategory === 'all' 
    ? analysisData.categoryAnalysis 
    : analysisData.categoryAnalysis.filter(cat => cat.name.toLowerCase() === selectedCategory.toLowerCase())

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Detailed Analysis</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Analysis Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  Deep Dive Analysis
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Detailed Assessment Analysis
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Comprehensive analysis of your organization's performance with industry benchmarks, trends, and actionable insights.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Analysis
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Category:</label>
                <Select
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'strategy', label: 'Strategy' },
                    { value: 'operations', label: 'Operations' },
                    { value: 'team', label: 'Team' },
                    { value: 'growth', label: 'Growth' },
                    { value: 'technology', label: 'Technology' }
                  ]}
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  size="sm"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Time Range:</label>
                <Select
                  options={[
                    { value: '3months', label: '3 Months' },
                    { value: '6months', label: '6 Months' },
                    { value: '12months', label: '12 Months' }
                  ]}
                  value={timeRange}
                  onValueChange={setTimeRange}
                  size="sm"
                />
              </div>
            </div>
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Main Analysis Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="col-span-2 space-y-8"
            >
              {/* Performance Overview */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
                
                <Grid cols={3} gap={6} className="mb-8">
                  <MetricCard
                    title="Your Score"
                    value={analysisData.overallScore}
                    change={{ value: 4, type: 'increase', period: 'vs last month' }}
                    icon={<Target className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Industry Benchmark"
                    value={analysisData.industryBenchmark}
                    change={{ value: 4, type: 'increase', period: 'vs your score' }}
                    icon={<BarChart3 className="h-6 w-6" />}
                  />
                  <MetricCard
                    title="Peer Comparison"
                    value={analysisData.peerComparison}
                    change={{ value: -3, type: 'decrease', period: 'vs your score' }}
                    icon={<Users className="h-6 w-6" />}
                  />
                </Grid>

                <div className="h-80">
                  <LineChart
                    data={analysisData.historicalTrend}
                    lines={[
                      { key: 'score', color: '#3b82f6', strokeWidth: 3, name: 'Your Score' },
                      { key: 'benchmark', color: '#64748b', strokeWidth: 2, strokeDasharray: '5 5', name: 'Industry Benchmark' }
                    ]}
                    showGrid={true}
                    showTooltip={true}
                    showLegend={true}
                  />
                </div>
              </Card>

              {/* Category Analysis */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Category Analysis</h2>
                
                <div className="space-y-6">
                  {filteredCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="border rounded-lg p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold">{category.name}</h3>
                          {getTrendIcon(category.trend)}
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{category.score}</div>
                            <div className="text-sm text-muted-foreground">Your Score</div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-medium">{category.benchmark}</div>
                            <div className="text-sm text-muted-foreground">Benchmark</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3 text-green-600">Key Insights</h4>
                          <Stack spacing={2}>
                            {category.insights.map((insight, insightIndex) => (
                              <div key={insightIndex} className="flex items-start space-x-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{insight}</span>
                              </div>
                            ))}
                          </Stack>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3 text-blue-600">Recommendations</h4>
                          <Stack spacing={2}>
                            {category.recommendations.map((rec, recIndex) => (
                              <div key={recIndex} className="flex items-start space-x-2 text-sm">
                                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </Stack>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Benchmark Comparison */}
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Industry Benchmark Comparison</h2>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Industry: {analysisData.benchmarkComparison.industry}</span>
                    <span>Size: {analysisData.benchmarkComparison.size}</span>
                    <span>Region: {analysisData.benchmarkComparison.region}</span>
                  </div>
                </div>

                <div className="h-80">
                  <BarChartComponent
                    data={analysisData.benchmarkComparison.dataPoints}
                    bars={[
                      { key: 'yourScore', color: '#3b82f6', name: 'Your Score' },
                      { key: 'industryAvg', color: '#64748b', name: 'Industry Average' },
                      { key: 'topQuartile', color: '#10b981', name: 'Top Quartile' }
                    ]}
                    showGrid={true}
                    showTooltip={true}
                    showLegend={true}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Risk Analysis */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Risk Analysis
                </h3>
                
                <div className="space-y-4">
                  {analysisData.riskAnalysis.map((risk, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{risk.category}</h4>
                        <StatusBadge status={getRiskColor(risk.risk) as any} size="sm">
                          {risk.risk} Risk
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{risk.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Impact:</span>
                          <StatusBadge status={getRiskColor(risk.impact) as any} size="xs">
                            {risk.impact}
                          </StatusBadge>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Probability:</span>
                          <StatusBadge status={getRiskColor(risk.probability) as any} size="xs">
                            {risk.probability}
                          </StatusBadge>
                        </div>
                      </div>
                      <div className="mt-3 text-xs">
                        <span className="font-medium">Mitigation:</span>
                        <p className="text-muted-foreground mt-1">{risk.mitigation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Share with Team
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Target className="h-4 w-4 mr-2" />
                    Create Action Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Track Progress
                  </Button>
                </div>
              </Card>

              {/* Help & Support */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Need Help?
                </h3>
                
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Understanding your analysis results or need help with implementation?
                  </p>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
