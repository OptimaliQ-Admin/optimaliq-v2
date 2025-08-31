/**
 * OptimaliQ Pulse Surveys Page
 * Comprehensive pulse survey management with creation, distribution, and analytics
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
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Smartphone,
  Tablet,
  Monitor,
  Globe as GlobeIcon,
  Building as BuildingIcon,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Star as StarIcon,
  Award as AwardIcon,
  Trophy,
  Medal,
  Ribbon,
  Certificate,
  Diploma,
  Scroll,
  Book,
  BookOpen,
  Library,
  School,
  University,
  College,
  Academy,
  Institute,
  Organization,
  Company,
  Corporation,
  Partnership
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

// Pulse Survey data
const pulseSurveyData = {
  stats: {
    totalSurveys: 18,
    activeSurveys: 6,
    completedSurveys: 12,
    totalResponses: 847,
    averageResponseRate: 78,
    improvement: '+15%'
  },
  surveys: [
    {
      id: 1,
      title: 'Weekly Team Pulse Check',
      description: 'Quick check-in on team morale and productivity',
      type: 'Team Morale',
      status: 'active',
      responseRate: 85,
      totalParticipants: 24,
      responses: 20,
      lastSent: '2 days ago',
      nextScheduled: '2024-09-05',
      frequency: 'Weekly',
      category: 'Team Management',
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Customer Satisfaction Survey',
      description: 'Monthly customer experience feedback collection',
      type: 'Customer Feedback',
      status: 'active',
      responseRate: 72,
      totalParticipants: 150,
      responses: 108,
      lastSent: '1 week ago',
      nextScheduled: '2024-09-15',
      frequency: 'Monthly',
      category: 'Customer Success',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Process Improvement Ideas',
      description: 'Collecting suggestions for operational improvements',
      type: 'Process Feedback',
      status: 'draft',
      responseRate: 0,
      totalParticipants: 45,
      responses: 0,
      lastSent: 'Never',
      nextScheduled: '2024-09-10',
      frequency: 'Quarterly',
      category: 'Operations',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Leadership Effectiveness',
      description: 'Anonymous feedback on leadership and management',
      type: 'Leadership Feedback',
      status: 'completed',
      responseRate: 91,
      totalParticipants: 32,
      responses: 29,
      lastSent: '2 weeks ago',
      nextScheduled: '2024-10-01',
      frequency: 'Quarterly',
      category: 'Leadership',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ],
  templates: [
    {
      id: 1,
      title: 'Team Morale Check',
      description: 'Quick 5-question survey for team pulse',
      questions: 5,
      duration: '3 min',
      category: 'Team Management',
      popularity: 4.7,
      uses: 234,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Customer Experience',
      description: 'Comprehensive customer satisfaction survey',
      questions: 12,
      duration: '8 min',
      category: 'Customer Success',
      popularity: 4.5,
      uses: 156,
      icon: <Star className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Process Feedback',
      description: 'Operational improvement suggestions',
      questions: 8,
      duration: '5 min',
      category: 'Operations',
      popularity: 4.3,
      uses: 89,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Leadership Assessment',
      description: 'Anonymous leadership effectiveness feedback',
      questions: 10,
      duration: '7 min',
      category: 'Leadership',
      popularity: 4.6,
      uses: 123,
      icon: <Target className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ],
  recentResponses: [
    {
      id: 1,
      surveyTitle: 'Weekly Team Pulse Check',
      respondent: 'Anonymous',
      department: 'Engineering',
      responseTime: '2 hours ago',
      sentiment: 'positive',
      keyFeedback: 'Team collaboration is improving, but need more structured meetings'
    },
    {
      id: 2,
      surveyTitle: 'Customer Satisfaction Survey',
      respondent: 'Sarah M.',
      company: 'TechCorp Inc.',
      responseTime: '4 hours ago',
      sentiment: 'positive',
      keyFeedback: 'Great product, but support response time could be faster'
    },
    {
      id: 3,
      surveyTitle: 'Weekly Team Pulse Check',
      respondent: 'Anonymous',
      department: 'Marketing',
      responseTime: '6 hours ago',
      sentiment: 'neutral',
      keyFeedback: 'Workload is manageable, communication is clear'
    }
  ],
  categories: [
    'All',
    'Team Management',
    'Customer Success',
    'Operations',
    'Leadership',
    'Product Development',
    'Sales Performance',
    'Employee Engagement',
    'Process Improvement',
    'Innovation'
  ]
}

export default function PulseSurveysPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [selectedStatus, setSelectedStatus] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-blue-600 bg-blue-100'
      case 'paused': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100'
      case 'neutral': return 'text-yellow-600 bg-yellow-100'
      case 'negative': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly': return 'text-blue-600 bg-blue-100'
      case 'Monthly': return 'text-green-600 bg-green-100'
      case 'Quarterly': return 'text-purple-600 bg-purple-100'
      case 'Annually': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredSurveys = pulseSurveyData.surveys.filter(survey => 
    (selectedCategory === 'All' || survey.category === selectedCategory) &&
    (selectedStatus === 'All' || survey.status === selectedStatus)
  )

  const filteredTemplates = pulseSurveyData.templates.filter(template => 
    selectedCategory === 'All' || template.category === selectedCategory
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
            <span className="text-sm text-muted-foreground">Pulse Surveys</span>
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
                <h1 className="text-3xl font-bold mb-2">Pulse Surveys</h1>
                <p className="text-muted-foreground">
                  Create, distribute, and analyze quick pulse surveys
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Survey
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
                title="Total Surveys"
                value={pulseSurveyData.stats.totalSurveys}
                subtitle="All time"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Active Surveys"
                value={pulseSurveyData.stats.activeSurveys}
                subtitle="Currently running"
                icon={<Play className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Total Responses"
                value={pulseSurveyData.stats.totalResponses}
                subtitle="All surveys"
                icon={<MessageCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Response Rate"
                value={`${pulseSurveyData.stats.averageResponseRate}%`}
                subtitle={pulseSurveyData.stats.improvement}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
              />
            </Grid>
          </motion.div>

          {/* Survey Templates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Survey Templates</h2>
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
                {pulseSurveyData.categories.map((category) => (
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
                          <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                            {template.category}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <TargetIcon className="h-3 w-3" />
                            <span>{template.questions} questions</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <ClockIcon className="h-3 w-3" />
                            <span>{template.duration}</span>
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

          {/* Active Surveys */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Active Surveys</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <Grid cols={2} gap={6}>
                {filteredSurveys.filter(s => s.status === 'active').map((survey) => (
                  <Card key={survey.id} className="p-6 border-2 border-green-200 hover:border-green-300 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${survey.color} text-white rounded-lg`}>
                        {survey.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{survey.title}</h3>
                          <Badge variant="secondary" className={getStatusColor(survey.status)}>
                            {survey.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{survey.description}</p>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Response Rate:</span>
                            <span className="font-medium text-green-600">{survey.responseRate}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Responses:</span>
                            <span className="font-medium">{survey.responses}/{survey.totalParticipants}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Next Scheduled:</span>
                            <span className="font-medium">{survey.nextScheduled}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className={getFrequencyColor(survey.frequency)}>
                            {survey.frequency}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{survey.category}</span>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Results
                          </Button>
                          <Button size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </motion.div>

          {/* Recent Responses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Responses</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {pulseSurveyData.recentResponses.map((response) => (
                  <div key={response.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{response.surveyTitle}</h3>
                        <Badge variant="secondary" className={getSentimentColor(response.sentiment)}>
                          {response.sentiment}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {response.respondent}
                          {response.department && ` • ${response.department}`}
                          {response.company && ` • ${response.company}`}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2">{response.keyFeedback}</p>
                      
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-3 w-3" />
                        <span>{response.responseTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
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
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <Grid cols={4} gap={4}>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Create Survey</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Send className="h-6 w-6" />
                  <span>Send Survey</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Download className="h-6 w-6" />
                  <span>Export Data</span>
                </Button>
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
