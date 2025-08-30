/**
 * OptimaliQ Results Preview Page
 * Limited results preview to drive full assessment conversions
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Star,
  Lightbulb,
  Shield,
  Clock,
  Gift,
  Sparkles,
  AlertTriangle,
  Info,
  Crown,
  Rocket,
  Calendar,
  Download,
  Share2,
  Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, MetricCard } from '@/components/ui/charts'

// Sample preview results data
const previewData = {
  overallScore: 72,
  categoryScores: [
    { name: 'Strategy', value: 78, color: '#3b82f6', visible: true },
    { name: 'Operations', value: 65, color: '#10b981', visible: true },
    { name: 'Team', value: 85, color: '#f59e0b', visible: false },
    { name: 'Growth', value: 70, color: '#06b6d4', visible: false },
    { name: 'Technology', value: 60, color: '#8b5cf6', visible: false }
  ],
  visibleInsights: [
    'Your strategic vision is well-defined and above industry average',
    'Operational processes show room for efficiency improvements'
  ],
  lockedInsights: [
    'Team collaboration analysis and recommendations',
    'Growth strategy optimization opportunities',
    'Technology modernization roadmap',
    'Risk assessment and mitigation strategies',
    'Competitive positioning analysis',
    'Resource allocation optimization'
  ],
  visibleRecommendations: [
    {
      title: 'Strategic Planning Enhancement',
      description: 'Implement quarterly strategic reviews to maintain alignment',
      priority: 'Medium',
      impact: 'High'
    }
  ],
  lockedRecommendations: 5,
  benchmarkData: [
    { category: 'Strategy', yourScore: 78, industryAvg: 72, visible: true },
    { category: 'Operations', yourScore: 65, industryAvg: 70, visible: true },
    { category: 'Team', yourScore: 85, industryAvg: 75, visible: false },
    { category: 'Growth', yourScore: 70, industryAvg: 68, visible: false },
    { category: 'Technology', yourScore: 60, industryAvg: 72, visible: false }
  ],
  upgradeFeatures: [
    'Complete assessment results across all categories',
    'Detailed AI-powered insights and analysis',
    'Comprehensive 30-day action plan',
    'Industry benchmark comparisons',
    'Progress tracking and follow-up assessments',
    'Team collaboration and sharing features',
    'Downloadable reports and documentation',
    'Priority email support'
  ],
  limitedFeatures: [
    'Basic assessment results (2 out of 5 categories)',
    'Limited insights and recommendations',
    'No action plan or progress tracking',
    'No team collaboration features',
    'No downloadable reports'
  ]
}

export default function ResultsPreviewPage() {
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState('strategy')

  const visibleCategories = previewData.categoryScores.filter(cat => cat.visible)
  const lockedCategories = previewData.categoryScores.filter(cat => !cat.visible)

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
            <StatusBadge status="warning" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              Preview Results
            </StatusBadge>
            <Button asChild>
              <Link href="/assessment">Unlock Full Results</Link>
            </Button>
          </div>
        </Container>
      </header>

      {/* Results Header */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Sample Results Preview
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Your Assessment{' '}
              <span className="text-primary">Results Preview</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              This is a sample of what your complete assessment results would look like. 
              Unlock the full analysis to get comprehensive insights and actionable recommendations.
            </p>

            <Alert
              variant="info"
              title="Limited Preview"
              description="You're seeing 2 out of 5 assessment categories. Complete the full assessment to unlock all insights, recommendations, and action planning features."
              className="max-w-2xl mx-auto"
            />
          </motion.div>
        </Container>
      </Section>

      {/* Preview Results */}
      <Section className="pb-20">
        <Container className="max-w-6xl">
          <Grid cols={2} gap={12} className="items-start">
            {/* Visible Results */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-8">
                {/* Overall Score */}
                <Card className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Sample Overall Score</h2>
                    <div className="w-32 h-32 mx-auto mb-4 relative">
                      <div className="w-full h-full rounded-full border-8 border-muted flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-primary">{previewData.overallScore}</div>
                          <div className="text-sm text-muted-foreground">/ 100</div>
                        </div>
                      </div>
                    </div>
                    <StatusBadge status="warning">Good Performance</StatusBadge>
                  </div>
                </Card>

                {/* Visible Categories */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Available Categories (2/5)</h3>
                  <div className="space-y-4">
                    {visibleCategories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between">
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
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Visible Insights */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    Sample Insights (2 of 8+)
                  </h3>
                  <div className="space-y-3">
                    {previewData.visibleInsights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{insight}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Visible Recommendations */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Sample Recommendation (1 of 6+)
                  </h3>
                  {previewData.visibleRecommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <StatusBadge status="warning" size="sm">
                          {rec.priority} Priority
                        </StatusBadge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                  ))}
                </Card>
              </div>
            </motion.div>

            {/* Locked Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                {/* Upgrade Prompt */}
                <Card className="p-8 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
                  <div className="text-center">
                    <Crown className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-4">Unlock Complete Results</h3>
                    <p className="text-muted-foreground mb-6">
                      Get access to all assessment categories, detailed insights, and your personalized action plan.
                    </p>
                    <Button className="w-full mb-4" asChild>
                      <Link href="/assessment">
                        <Unlock className="h-4 w-4 mr-2" />
                        Start Full Assessment
                      </Link>
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      100% free • No credit card required
                    </div>
                  </div>
                </Card>

                {/* Locked Categories */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Locked Categories (3/5)
                  </h3>
                  <div className="space-y-3">
                    {lockedCategories.map((category, index) => (
                      <div key={category.name} className="flex items-center justify-between opacity-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 rounded-full bg-muted" />
                          <span className="font-medium">{category.name}</span>
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">Hidden</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Locked Insights */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Additional Insights (6+)
                  </h3>
                  <div className="space-y-3">
                    {previewData.lockedInsights.map((insight, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{insight}</span>
                        </div>
                        <StatusBadge status="warning" size="xs">Locked</StatusBadge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Locked Features */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">What You'll Get with Full Assessment</h3>
                  <div className="space-y-3">
                    {previewData.upgradeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Gift className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">100% Free</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Complete assessment with full results, insights, and action plan at no cost.
                    </p>
                  </div>
                </Card>

                {/* Comparison */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Preview vs Full Assessment</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2">Preview (Current)</h4>
                        <div className="space-y-2 text-sm">
                          {previewData.limitedFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <EyeOff className="h-3 w-3 text-yellow-500" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Full Assessment</h4>
                        <div className="space-y-2 text-sm">
                          {previewData.upgradeFeatures.slice(0, 5).map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Social Proof */}
      <Section className="py-20 bg-muted/30">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-6">Join Thousands of Organizations</h2>
            <p className="text-xl text-muted-foreground">
              See why organizations choose OptimaliQ for their strategic planning and growth initiatives.
            </p>
          </motion.div>

          <Grid cols={3} gap={6} className="mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Organizations Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-sm text-muted-foreground">Assessments Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">96%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </div>
          </Grid>

          <Card className="p-8">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <span className="font-semibold">4.9/5 Average Rating</span>
            </div>
            <blockquote className="text-lg italic mb-4">
              "OptimaliQ's assessment gave us clarity we'd been searching for. The insights were 
              incredibly accurate and the action plan was exactly what we needed to move forward."
            </blockquote>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">CEO, TechForward Solutions</div>
              </div>
            </div>
          </Card>
        </Container>
      </Section>

      {/* Unlock CTA */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready for Your Complete Analysis?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Unlock all 5 assessment categories, detailed insights, personalized recommendations, 
                and your comprehensive 30-day action plan.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>15-20 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Completely secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-green-500" />
                  <span>100% free</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Unlock Full Assessment
                    <Unlock className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">
                    Schedule Demo First
                    <Calendar className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 text-sm text-muted-foreground">
                <p>Join 500+ organizations already using OptimaliQ to drive growth and success</p>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
            
            <nav className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
