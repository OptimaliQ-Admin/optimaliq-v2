/**
 * OptimaliQ Analytics Page
 * Comprehensive analytics with data visualization and performance insights
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BarChart3, TrendingUp, TrendingDown, Users, Target, Activity,
  Calendar, Clock, Download, Share2, Filter, Search, Eye,
  ArrowRight, Zap, Settings, Bell, HelpCircle, MessageSquare,
  FileText, Database, Cloud, Shield, Key, Lock, Unlock,
  PieChart, LineChart, AreaChart, Gauge, Target as TargetIcon,
  CheckSquare, Clock as ClockIcon, Calendar as CalendarIcon,
  User, Building, Globe, Star, Award, Rocket, Lightbulb
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { MetricCard } from '@/components/ui/charts'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/form'
import { Badge } from '@/components/ui/badge'

// Analytics data
const analyticsData = {
  stats: {
    totalAssessments: 847,
    activeUsers: 234,
    completionRate: 78,
    averageScore: 76,
    improvement: '+12%',
    growth: '+8%'
  },
  timeframes: [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ],
  performanceMetrics: [
    {
      id: 1,
      name: 'Strategic Planning',
      score: 82,
      trend: 'up',
      change: '+8%',
      participants: 45,
      category: 'Leadership'
    },
    {
      id: 2,
      name: 'Team Performance',
      score: 76,
      trend: 'up',
      change: '+5%',
      participants: 67,
      category: 'Team Management'
    },
    {
      id: 3,
      name: 'Process Optimization',
      score: 71,
      trend: 'down',
      change: '-3%',
      participants: 34,
      category: 'Operations'
    },
    {
      id: 4,
      name: 'Customer Experience',
      score: 79,
      trend: 'up',
      change: '+12%',
      participants: 89,
      category: 'Customer Success'
    }
  ],
  userEngagement: [
    { month: 'Jan', users: 120, assessments: 45, score: 72 },
    { month: 'Feb', users: 135, assessments: 52, score: 74 },
    { month: 'Mar', users: 142, assessments: 58, score: 76 },
    { month: 'Apr', users: 156, assessments: 64, score: 78 },
    { month: 'May', users: 168, assessments: 71, score: 79 },
    { month: 'Jun', users: 189, assessments: 78, score: 81 }
  ],
  topInsights: [
    {
      id: 1,
      title: 'Team Collaboration Improving',
      description: 'Team performance scores increased 15% this quarter',
      impact: 'high',
      category: 'Team Management',
      trend: 'positive'
    },
    {
      id: 2,
      title: 'Process Efficiency Declining',
      description: 'Process optimization scores dropped 8% - needs attention',
      impact: 'medium',
      category: 'Operations',
      trend: 'negative'
    },
    {
      id: 3,
      title: 'Customer Satisfaction Rising',
      description: 'Customer experience metrics show 12% improvement',
      impact: 'high',
      category: 'Customer Success',
      trend: 'positive'
    }
  ]
}

export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('30d')
  const [selectedCategory, setSelectedCategory] = React.useState('All')

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
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
            <span className="text-sm text-muted-foreground">Analytics</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive insights into your organizational performance
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  value={selectedTimeframe}
                  onValueChange={setSelectedTimeframe}
                  options={analyticsData.timeframes}
                />
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Key Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total Assessments"
                value={analyticsData.stats.totalAssessments}
                subtitle="All time"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Active Users"
                value={analyticsData.stats.activeUsers}
                subtitle="This period"
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Completion Rate"
                value={`${analyticsData.stats.completionRate}%`}
                subtitle={analyticsData.stats.improvement}
                icon={<Target className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Average Score"
                value={`${analyticsData.stats.averageScore}`}
                subtitle={analyticsData.stats.growth}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
              />
            </Grid>
          </motion.div>

          {/* Performance Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {analyticsData.performanceMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{metric.name}</h3>
                      <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                        {metric.category}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="text-2xl font-bold">{metric.score}</div>
                      <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{metric.participants} participants</span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* User Engagement Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">User Engagement Trends</h2>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
              
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">User engagement chart will be displayed here</p>
                  <p className="text-sm text-muted-foreground">Coming in Phase 5B</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Top Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-6">Top Insights</h2>
              <div className="space-y-4">
                {analyticsData.topInsights.map((insight) => (
                  <div key={insight.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className={getImpactColor(insight.impact)}>
                          {insight.impact}
                        </Badge>
                        <Badge variant="secondary" className={
                          insight.trend === 'positive' 
                            ? 'text-green-600 bg-green-100' 
                            : 'text-red-600 bg-red-100'
                        }>
                          {insight.trend}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{insight.category}</span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Create Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Export Data</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Share2 className="h-6 w-6" />
                  <span>Share Insights</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Settings className="h-6 w-6" />
                  <span>Configure</span>
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
