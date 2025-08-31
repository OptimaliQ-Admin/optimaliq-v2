/**
 * OptimaliQ Dashboard Page
 * Comprehensive dashboard with key metrics, recent activity, and quick actions
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BarChart3,
  TrendingUp,
  Target,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Star,
  Award,
  Zap,
  Lightbulb,
  Rocket,
  TrendingDown,
  Activity,
  PieChart,
  LineChart,
  AreaChart,
  Gauge,
  Target as TargetIcon,
  CheckSquare,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  User,
  Building,
  Globe,
  Settings,
  Bell,
  HelpCircle,
  MessageSquare,
  FileText,
  Database,
  Cloud,
  Shield,
  Key,
  Lock,
  Unlock
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

// Dashboard data
const dashboardData = {
  user: {
    name: 'Jennifer Walsh',
    role: 'CEO & Executive Director',
    organization: 'HealthForward',
    avatar: '/avatars/jennifer.jpg',
    lastLogin: '2 hours ago'
  },
  metrics: {
    overallScore: 78,
    improvement: '+12%',
    assessments: 8,
    teamMembers: 12,
    actionItems: 24,
    completed: 18,
    pending: 6,
    nextReview: '3 days'
  },
  recentActivity: [
    {
      id: 1,
      type: 'assessment',
      title: 'Strategic Planning Assessment',
      status: 'completed',
      score: 82,
      date: '2 hours ago',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'action',
      title: 'Implement customer feedback system',
      status: 'in_progress',
      priority: 'high',
      date: '4 hours ago',
      icon: <Target className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'team',
      title: 'Sarah Chen joined team',
      status: 'new',
      role: 'Operations Manager',
      date: '1 day ago',
      icon: <Users className="h-4 w-4" />
    },
    {
      id: 4,
      type: 'milestone',
      title: 'Q3 goals achieved',
      status: 'completed',
      score: 94,
      date: '2 days ago',
      icon: <Award className="h-4 w-4" />
    }
  ],
  quickActions: [
    {
      id: 'new-assessment',
      title: 'Start New Assessment',
      description: 'Begin a new organizational assessment',
      icon: <Plus className="h-6 w-6" />,
      color: 'bg-blue-500',
      href: '/assessment'
    },
    {
      id: 'team-invite',
      title: 'Invite Team Member',
      description: 'Add new members to your organization',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500',
      href: '/team/invite'
    },
    {
      id: 'action-plan',
      title: 'Review Action Plan',
      description: 'Check progress on your growth plan',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-purple-500',
      href: '/action-plan'
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Explore detailed performance insights',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-orange-500',
      href: '/analytics'
    }
  ],
  insights: [
    {
      id: 1,
      type: 'positive',
      title: 'Strong Team Performance',
      description: 'Your team collaboration score increased by 15% this quarter',
      icon: <TrendingUp className="h-5 w-5" />,
      action: 'View team analytics'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Process Optimization Opportunity',
      description: 'Identify 3 key areas for operational efficiency improvements',
      icon: <Lightbulb className="h-5 w-5" />,
      action: 'Start process assessment'
    },
    {
      id: 3,
      type: 'info',
      title: 'Market Position Strengthening',
      description: 'Your competitive advantage score is above industry average',
      icon: <Star className="h-5 w-5" />,
      action: 'Review market analysis'
    }
  ],
  upcomingTasks: [
    {
      id: 1,
      title: 'Complete Q4 Strategic Review',
      dueDate: '2024-09-15',
      priority: 'high',
      category: 'Strategic Planning',
      progress: 60
    },
    {
      id: 2,
      title: 'Team Performance Review',
      dueDate: '2024-09-20',
      priority: 'medium',
      category: 'Team Management',
      progress: 30
    },
    {
      id: 3,
      title: 'Budget Planning Session',
      dueDate: '2024-09-25',
      priority: 'high',
      category: 'Financial Planning',
      progress: 45
    }
  ]
}

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = React.useState('30d')
  const [searchQuery, setSearchQuery] = React.useState('')

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'new': return 'text-purple-600 bg-purple-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600 bg-green-100 border-green-200'
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-100 border-blue-200'
      default: return 'text-gray-600 bg-gray-100 border-gray-200'
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
            <span className="text-sm text-muted-foreground">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium">{dashboardData.user.name}</div>
                <div className="text-xs text-muted-foreground">{dashboardData.user.role}</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {dashboardData.user.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">
                  Here's what's happening with {dashboardData.user.organization} today
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                  options={[
                    { value: '7d', label: 'Last 7 days' },
                    { value: '30d', label: 'Last 30 days' },
                    { value: '90d', label: 'Last 90 days' },
                    { value: '1y', label: 'Last year' }
                  ]}
                />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
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
                title="Overall Score"
                value={`${dashboardData.metrics.overallScore}`}
                subtitle={dashboardData.metrics.improvement}
                icon={<Target className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Assessments"
                value={dashboardData.metrics.assessments}
                subtitle="Completed this period"
                icon={<CheckCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Team Members"
                value={dashboardData.metrics.teamMembers}
                subtitle="Active participants"
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Action Items"
                value={`${dashboardData.metrics.completed}/${dashboardData.metrics.actionItems}`}
                subtitle="Completed"
                icon={<CheckSquare className="h-5 w-5" />}
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
              />
            </Grid>
          </motion.div>

          <Grid cols={3} gap={8}>
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  {dashboardData.quickActions.map((action) => (
                    <Link key={action.id} href={action.href}>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className={`p-2 ${action.color} text-white rounded-lg`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {dashboardData.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{activity.title}</div>
                        <div className="text-xs text-muted-foreground">{activity.date}</div>
                      </div>
                      {activity.score && (
                        <div className="text-sm font-medium text-primary">{activity.score}</div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
                <div className="space-y-3">
                  {dashboardData.insights.map((insight) => (
                    <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start space-x-3">
                        <div className="p-1 rounded-full bg-white/50">
                          {insight.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{insight.title}</div>
                          <div className="text-xs mb-2">{insight.description}</div>
                          <button className="text-xs font-medium hover:underline">
                            {insight.action}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </Grid>

          {/* Upcoming Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Upcoming Tasks</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {dashboardData.upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">{task.category}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {task.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{task.progress}% complete</span>
                        </div>
                      </div>
                      <Progress value={task.progress} className="mt-2" />
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Performance Overview</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Performance charts will be displayed here</p>
                  <p className="text-sm text-muted-foreground">Coming in Phase 5B</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
