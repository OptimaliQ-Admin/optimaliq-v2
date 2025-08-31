/**
 * OptimaliQ Assessments Page
 * Comprehensive assessment management with templates, progress tracking, and results
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Share2,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  Calendar,
  Target,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  Award,
  Zap,
  Lightbulb,
  Rocket,
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
  Unlock,
  ArrowRight,
  ArrowUpRight,
  Clock as ClockIcon2,
  Users as UsersIcon,
  Target as TargetIcon2,
  CheckCircle as CheckCircleIcon,
  AlertCircle,
  Info,
  ExternalLink
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

// Assessment data
const assessmentData = {
  stats: {
    total: 24,
    completed: 18,
    inProgress: 4,
    pending: 2,
    averageScore: 76,
    improvement: '+8%'
  },
  recentAssessments: [
    {
      id: 1,
      title: 'Strategic Planning Assessment',
      type: 'Strategic Planning',
      status: 'completed',
      score: 82,
      participants: 8,
      lastUpdated: '2 hours ago',
      dueDate: '2024-09-15',
      priority: 'high',
      category: 'Leadership',
      progress: 100,
      icon: <Target className="h-5 w-5" />
    },
    {
      id: 2,
      title: 'Team Performance Review',
      type: 'Team Assessment',
      status: 'in_progress',
      score: null,
      participants: 12,
      lastUpdated: '4 hours ago',
      dueDate: '2024-09-20',
      priority: 'medium',
      category: 'Team Management',
      progress: 65,
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 3,
      title: 'Operational Efficiency Audit',
      type: 'Process Assessment',
      status: 'pending',
      score: null,
      participants: 6,
      lastUpdated: '1 day ago',
      dueDate: '2024-09-25',
      priority: 'high',
      category: 'Operations',
      progress: 0,
      icon: <Activity className="h-5 w-5" />
    },
    {
      id: 4,
      title: 'Customer Experience Survey',
      type: 'Customer Assessment',
      status: 'completed',
      score: 78,
      participants: 45,
      lastUpdated: '3 days ago',
      dueDate: '2024-09-10',
      priority: 'medium',
      category: 'Customer Success',
      progress: 100,
      icon: <Star className="h-5 w-5" />
    }
  ],
  templates: [
    {
      id: 1,
      title: 'Strategic Planning',
      description: 'Comprehensive strategic planning assessment for organizations',
      category: 'Leadership',
      questions: 45,
      duration: '60 min',
      difficulty: 'Advanced',
      popularity: 4.8,
      uses: 1247,
      icon: <Target className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Team Performance',
      description: 'Evaluate team dynamics, collaboration, and effectiveness',
      category: 'Team Management',
      questions: 32,
      duration: '45 min',
      difficulty: 'Intermediate',
      popularity: 4.6,
      uses: 892,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Process Optimization',
      description: 'Identify operational inefficiencies and improvement opportunities',
      category: 'Operations',
      questions: 38,
      duration: '50 min',
      difficulty: 'Intermediate',
      popularity: 4.4,
      uses: 567,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Customer Experience',
      description: 'Measure customer satisfaction and experience quality',
      category: 'Customer Success',
      questions: 28,
      duration: '35 min',
      difficulty: 'Beginner',
      popularity: 4.7,
      uses: 1034,
      icon: <Star className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ],
  categories: [
    'All',
    'Leadership',
    'Team Management',
    'Operations',
    'Customer Success',
    'Financial Planning',
    'Marketing Strategy',
    'Technology',
    'Human Resources',
    'Compliance'
  ]
}

export default function AssessmentsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState('grid')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-blue-600 bg-blue-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100'
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100'
      case 'Advanced': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredTemplates = assessmentData.templates.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
  )

  const filteredAssessments = assessmentData.recentAssessments.filter(assessment => 
    selectedCategory === 'All' || assessment.category === selectedCategory
  )

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
            <span className="text-sm text-muted-foreground">Assessments</span>
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
                <h1 className="text-3xl font-bold mb-2">Assessments</h1>
                <p className="text-muted-foreground">
                  Manage your organizational assessments and track progress
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Grid cols={4} gap={6}>
              <MetricCard
                title="Total Assessments"
                value={assessmentData.stats.total}
                subtitle="All time"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Completed"
                value={assessmentData.stats.completed}
                subtitle={`${Math.round((assessmentData.stats.completed / assessmentData.stats.total) * 100)}%`}
                icon={<CheckCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="In Progress"
                value={assessmentData.stats.inProgress}
                subtitle="Active assessments"
                icon={<Clock className="h-5 w-5" />}
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
              />
              <MetricCard
                title="Average Score"
                value={`${assessmentData.stats.averageScore}`}
                subtitle={assessmentData.stats.improvement}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
            </Grid>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Assessment Templates</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
                {assessmentData.categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <Grid cols={2} gap={6}>
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${template.color} text-white rounded-lg`}>
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{template.title}</h3>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{template.popularity}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                        
                        <div className="flex items-center space-x-4 mb-4">
                          <Badge variant="secondary" className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <ClockIcon className="h-3 w-3" />
                            <span>{template.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <TargetIcon className="h-3 w-3" />
                            <span>{template.questions} questions</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Used {template.uses.toLocaleString()} times
                          </div>
                          <Button size="sm">
                            Use Template
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </motion.div>

          {/* Recent Assessments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Assessments</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {filteredAssessments.map((assessment) => (
                  <div key={assessment.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className={`p-3 rounded-lg ${assessment.icon.props.className.includes('h-5') ? 'bg-primary/10' : 'bg-primary/10'}`}>
                      {assessment.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{assessment.title}</h3>
                        <Badge variant="secondary" className={getStatusColor(assessment.status)}>
                          {assessment.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="secondary" className={getPriorityColor(assessment.priority)}>
                          {assessment.priority}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{assessment.category}</span>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <UsersIcon className="h-3 w-3" />
                          <span>{assessment.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {assessment.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon2 className="h-3 w-3" />
                          <span>Updated {assessment.lastUpdated}</span>
                        </div>
                      </div>

                      {assessment.status === 'in_progress' && (
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{assessment.progress}%</span>
                            </div>
                            <Progress value={assessment.progress} className="h-2" />
                          </div>
                        </div>
                      )}

                      {assessment.score && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">Score:</span>
                          <span className="text-lg font-semibold text-primary">{assessment.score}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {assessment.status === 'pending' && (
                        <Button size="sm">
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {assessment.status === 'in_progress' && (
                        <Button variant="outline" size="sm">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
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
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <Grid cols={3} gap={4}>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Create Custom Assessment</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Import Assessment</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Share2 className="h-6 w-6" />
                  <span>Share Results</span>
                </Button>
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
