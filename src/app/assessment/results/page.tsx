/**
 * OptimaliQ Assessment Results Page
 * AI-powered results with comprehensive insights, recommendations, and action planning
 */

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
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, MetricCard } from '@/components/ui/charts'

// Sample Results Data (in real app, this would come from AI analysis)
const results = {
  overallScore: 72,
  categoryScores: [
    { name: 'Strategy', value: 78, color: '#3b82f6' },
    { name: 'Operations', value: 65, color: '#10b981' },
    { name: 'Team', value: 85, color: '#f59e0b' },
    { name: 'Growth', value: 70, color: '#06b6d4' },
    { name: 'Technology', value: 60, color: '#8b5cf6' }
  ],
  strengths: [
    'Strong team collaboration and communication',
    'Clear strategic vision and direction',
    'Effective leadership and decision-making',
    'Good stakeholder relationships'
  ],
  opportunities: [
    'Technology infrastructure needs modernization',
    'Operational processes could be more efficient',
    'Data analytics capabilities need enhancement',
    'Digital transformation opportunities exist'
  ],
  recommendations: [
    {
      category: 'Technology',
      priority: 'High',
      title: 'Modernize Technology Infrastructure',
      description: 'Invest in cloud-based solutions and modern software tools to improve efficiency and collaboration.',
      impact: 'High',
      effort: 'Medium',
      timeline: '3-6 months',
      actions: [
        'Conduct technology audit and gap analysis',
        'Research and evaluate cloud solutions',
        'Develop implementation roadmap',
        'Train team on new tools and processes'
      ]
    },
    {
      category: 'Operations',
      priority: 'Medium',
      title: 'Optimize Operational Processes',
      description: 'Streamline workflows and implement process improvements to increase efficiency and reduce costs.',
      impact: 'Medium',
      effort: 'Low',
      timeline: '1-3 months',
      actions: [
        'Map current processes and identify bottlenecks',
        'Implement process automation where possible',
        'Establish performance metrics and KPIs',
        'Train staff on new procedures'
      ]
    },
    {
      category: 'Growth',
      priority: 'High',
      title: 'Enhance Data Analytics Capabilities',
      description: 'Develop data-driven decision making capabilities to support growth and strategic planning.',
      impact: 'High',
      effort: 'High',
      timeline: '6-12 months',
      actions: [
        'Assess current data infrastructure',
        'Implement analytics tools and platforms',
        'Develop data governance policies',
        'Train team on data analysis and interpretation'
      ]
    }
  ]
}

// Sample Chart Data
const performanceData = [
  { month: 'Jan', score: 65, benchmark: 70 },
  { month: 'Feb', score: 68, benchmark: 70 },
  { month: 'Mar', score: 72, benchmark: 70 },
  { month: 'Apr', score: 75, benchmark: 70 },
  { month: 'May', score: 78, benchmark: 70 },
  { month: 'Jun', score: 72, benchmark: 70 }
]

export default function AssessmentResultsPage() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''
  const timeSpent = searchParams.get('time') || '0'

  const formatTime = (seconds: string) => {
    const secs = parseInt(seconds)
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  const handleDownloadReport = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      // Simulate download
      console.log('Downloading report...')
    } catch (error) {
      console.error('Failed to download report', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareResults = () => {
    // Implement share functionality
    console.log('Sharing results...')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">OptimaliQ</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handleDownloadReport} loading={isLoading}>
              <DownloadIcon className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" size="sm" onClick={handleShareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-6xl">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <StatusBadge status="success" className="mb-4">
              Assessment Complete
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Your Assessment Results
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Based on your responses, here's a comprehensive analysis of your organization's performance and strategic recommendations.
            </p>
            
            {/* Assessment Summary */}
            <div className="grid grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{assessmentType}</div>
                <div className="text-sm text-muted-foreground">Assessment Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{organizationSize}</div>
                <div className="text-sm text-muted-foreground">Organization Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary capitalize">{industry}</div>
                <div className="text-sm text-muted-foreground">Industry</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{formatTime(timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
              </div>
            </div>
          </motion.div>

          <Grid cols={2} gap={12} className="items-start">
            {/* Main Results */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                {/* Overall Score */}
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Overall Performance Score</h2>
                    <p className="text-muted-foreground">Your organization's comprehensive performance rating</p>
                  </div>
                  
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full border-8 border-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{results.overallScore}</div>
                          <div className="text-sm text-muted-foreground">/ 100</div>
                        </div>
                      </div>
                      <div 
                        className="absolute inset-0 rounded-full border-8 border-primary"
                        style={{
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + (results.overallScore * 3.6)}% 0%, ${50 + (results.overallScore * 3.6)}% 50%)`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <StatusBadge status={getScoreColor(results.overallScore) as any} className="mb-2">
                      {getScoreLabel(results.overallScore)}
                    </StatusBadge>
                    <p className="text-sm text-muted-foreground">
                      Your organization is performing well with room for strategic improvements
                    </p>
                  </div>
                </Card>

                {/* Category Breakdown */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Performance by Category</h3>
                  <div className="space-y-4">
                    {results.categoryScores.map((category, index) => (
                      <motion.div
                        key={category.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="h-2 rounded-full"
                              style={{ 
                                width: `${category.value}%`,
                                backgroundColor: category.color 
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{category.value}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Performance Trend */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Performance Trend</h3>
                  <div className="h-64">
                    <LineChart
                      data={performanceData}
                      lines={[
                        { key: 'score', color: '#3b82f6', strokeWidth: 3 },
                        { key: 'benchmark', color: '#64748b', strokeWidth: 2, strokeDasharray: '5 5' }
                      ]}
                      showGrid={true}
                      showTooltip={true}
                      showLegend={true}
                    />
                  </div>
                </Card>
              </div>
            </motion.div>

            {/* Insights & Recommendations */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                {/* Key Insights */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Key Insights
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 text-green-600">Strengths</h4>
                      <Stack spacing={2}>
                        {results.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </div>
                        ))}
                      </Stack>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 text-yellow-600">Opportunities</h4>
                      <Stack spacing={2}>
                        {results.opportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start space-x-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{opportunity}</span>
                          </div>
                        ))}
                      </Stack>
                    </div>
                  </div>
                </Card>

                {/* Top Recommendations */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Top Recommendations
                  </h3>
                  
                  <div className="space-y-4">
                    {results.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <StatusBadge status={rec.priority === 'High' ? 'error' : 'warning'} size="sm">
                            {rec.priority} Priority
                          </StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm font-medium">Impact</div>
                            <StatusBadge status={rec.impact === 'High' ? 'error' : 'warning'} size="sm">
                              {rec.impact}
                            </StatusBadge>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Effort</div>
                            <StatusBadge status={rec.effort === 'High' ? 'error' : 'warning'} size="sm">
                              {rec.effort}
                            </StatusBadge>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium">Timeline</div>
                            <div className="text-sm font-medium">{rec.timeline}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Key Actions:</div>
                          <div className="space-y-1">
                            {rec.actions.slice(0, 2).map((action, actionIndex) => (
                              <div key={actionIndex} className="flex items-center space-x-2 text-xs">
                                <div className="w-1 h-1 bg-primary rounded-full" />
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Next Steps */}
                <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-sm">Get your detailed 30-day action plan</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-sm">Invite your team for collaborative planning</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span className="text-sm">Track progress with our analytics dashboard</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button className="w-full group">
                      Get Your Action Plan
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Results
                    </Button>
                  </div>
                </Card>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
