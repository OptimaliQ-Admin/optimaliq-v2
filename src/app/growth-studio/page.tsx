/**
 * OptimaliQ Growth Studio Page
 * Comprehensive growth planning and action management system
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
  Flag,
  Timer,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus,
  Plus as PlusIcon,
  X,
  Check,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share,
  Bookmark,
  Download as DownloadIcon,
  Upload,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Move,
  Copy,
  Scissors,
  Link as LinkIcon,
  Unlink,
  Lock as LockIcon,
  Unlock as UnlockIcon,
  Eye as EyeIcon,
  EyeOff,
  Shield as ShieldIcon,
  Key as KeyIcon,
  Database as DatabaseIcon,
  Server,
  Cloud as CloudIcon,
  Network,
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Camera,
  Video,
  Music,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Mail,
  Send,
  Inbox,
  Archive,
  Trash,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  Image,
  Video as VideoIcon,
  Audio,
  Code,
  Terminal,
  Command,
  Power,
  PowerOff,
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Bluetooth,
  BluetoothOff,
  Radio,
  RadioOff,
  Satellite,
  SatelliteOff,
  Navigation,
  NavigationOff,
  Compass,
  Map,
  MapPin,
  MapPinOff,
  Navigation2,
  Navigation2Off,
  Compass as CompassIcon,
  Map as MapIcon,
  MapPin as MapPinIcon,
  MapPinOff as MapPinOffIcon,
  Navigation as NavigationIcon,
  NavigationOff as NavigationOffIcon,
  Navigation2 as Navigation2Icon,
  Navigation2Off as Navigation2OffIcon,
  Compass as CompassIcon2,
  Map as MapIcon2,
  MapPin as MapPinIcon2,
  MapPinOff as MapPinOffIcon2,
  Navigation as NavigationIcon2,
  NavigationOff as NavigationOffIcon2,
  Navigation2 as Navigation2Icon2,
  Navigation2Off as Navigation2OffIcon2
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

// Growth Studio data
const growthStudioData = {
  stats: {
    totalGoals: 12,
    completed: 5,
    inProgress: 4,
    pending: 3,
    averageProgress: 68,
    improvement: '+15%'
  },
  growthAreas: [
    {
      id: 1,
      title: 'Strategic Planning',
      description: 'Develop comprehensive strategic planning capabilities',
      category: 'Leadership',
      priority: 'high',
      status: 'in_progress',
      progress: 75,
      targetDate: '2024-12-31',
      milestones: [
        { id: 1, title: 'Define strategic objectives', completed: true },
        { id: 2, title: 'Conduct market analysis', completed: true },
        { id: 3, title: 'Develop action plan', completed: false },
        { id: 4, title: 'Implement monitoring system', completed: false }
      ],
      icon: <Target className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Team Development',
      description: 'Enhance team collaboration and performance',
      category: 'Team Management',
      priority: 'medium',
      status: 'in_progress',
      progress: 60,
      targetDate: '2024-11-30',
      milestones: [
        { id: 1, title: 'Assess current team dynamics', completed: true },
        { id: 2, title: 'Identify skill gaps', completed: true },
        { id: 3, title: 'Create training programs', completed: false },
        { id: 4, title: 'Implement feedback systems', completed: false }
      ],
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Process Optimization',
      description: 'Streamline operational processes for efficiency',
      category: 'Operations',
      priority: 'high',
      status: 'pending',
      progress: 25,
      targetDate: '2025-01-15',
      milestones: [
        { id: 1, title: 'Map current processes', completed: true },
        { id: 2, title: 'Identify bottlenecks', completed: false },
        { id: 3, title: 'Design improved workflows', completed: false },
        { id: 4, title: 'Implement changes', completed: false }
      ],
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Customer Experience',
      description: 'Improve customer satisfaction and retention',
      category: 'Customer Success',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      targetDate: '2024-10-31',
      milestones: [
        { id: 1, title: 'Customer feedback collection', completed: true },
        { id: 2, title: 'Pain point identification', completed: true },
        { id: 3, title: 'Solution implementation', completed: true },
        { id: 4, title: 'Results measurement', completed: true }
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ],
  actionItems: [
    {
      id: 1,
      title: 'Review Q4 strategic objectives',
      description: 'Analyze progress and adjust goals for Q4',
      priority: 'high',
      status: 'pending',
      dueDate: '2024-09-20',
      assignedTo: 'Jennifer Walsh',
      category: 'Strategic Planning',
      estimatedHours: 4,
      dependencies: ['Market analysis complete', 'Team feedback gathered']
    },
    {
      id: 2,
      title: 'Implement customer feedback system',
      description: 'Deploy new customer feedback collection platform',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2024-09-25',
      assignedTo: 'Sarah Chen',
      category: 'Customer Success',
      estimatedHours: 8,
      dependencies: ['Platform selection', 'Training materials ready']
    },
    {
      id: 3,
      title: 'Conduct team performance review',
      description: 'Evaluate individual and team performance metrics',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-09-30',
      assignedTo: 'Michael Rodriguez',
      category: 'Team Management',
      estimatedHours: 6,
      dependencies: ['Performance data collected', 'Review framework established']
    }
  ],
  insights: [
    {
      id: 1,
      type: 'positive',
      title: 'Strong Progress in Strategic Planning',
      description: 'Your strategic planning initiative is 75% complete, ahead of schedule',
      metric: '75%',
      trend: 'up',
      action: 'Review next milestones'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Process Optimization Behind Schedule',
      description: 'Process optimization is only 25% complete, consider resource reallocation',
      metric: '25%',
      trend: 'down',
      action: 'Reassess timeline'
    },
    {
      id: 3,
      type: 'info',
      title: 'Team Development on Track',
      description: 'Team development is progressing well at 60% completion',
      metric: '60%',
      trend: 'stable',
      action: 'Continue current approach'
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

export default function GrowthStudioPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [selectedStatus, setSelectedStatus] = React.useState('All')
  const [viewMode, setViewMode] = React.useState('grid')

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
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-600" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const filteredGrowthAreas = growthStudioData.growthAreas.filter(area => 
    (selectedCategory === 'All' || area.category === selectedCategory) &&
    (selectedStatus === 'All' || area.status === selectedStatus)
  )

  const filteredActionItems = growthStudioData.actionItems.filter(item => 
    selectedCategory === 'All' || item.category === selectedCategory
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
            <span className="text-sm text-muted-foreground">Growth Studio</span>
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
                <h1 className="text-3xl font-bold mb-2">Growth Studio</h1>
                <p className="text-muted-foreground">
                  Plan, track, and accelerate your organizational growth
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Plan
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Growth Area
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
                title="Total Goals"
                value={growthStudioData.stats.totalGoals}
                subtitle="Growth areas"
                icon={<Target className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Completed"
                value={growthStudioData.stats.completed}
                subtitle={`${Math.round((growthStudioData.stats.completed / growthStudioData.stats.totalGoals) * 100)}%`}
                icon={<CheckCircle className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="In Progress"
                value={growthStudioData.stats.inProgress}
                subtitle="Active initiatives"
                icon={<Clock className="h-5 w-5" />}
                className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20"
              />
              <MetricCard
                title="Average Progress"
                value={`${growthStudioData.stats.averageProgress}%`}
                subtitle={growthStudioData.stats.improvement}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
            </Grid>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Growth Areas</h2>
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

              {/* Category and Status Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Category:</span>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    options={growthStudioData.categories.map(cat => ({ value: cat, label: cat }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    options={[
                      { value: 'All', label: 'All' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'in_progress', label: 'In Progress' },
                      { value: 'pending', label: 'Pending' }
                    ]}
                  />
                </div>
              </div>

              {/* Growth Areas Grid */}
              <Grid cols={2} gap={6}>
                {filteredGrowthAreas.map((area) => (
                  <Card key={area.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${area.color} text-white rounded-lg`}>
                        {area.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{area.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getPriorityColor(area.priority)}>
                              {area.priority}
                            </Badge>
                            <Badge variant="secondary" className={getStatusColor(area.status)}>
                              {area.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{area.description}</p>
                        
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{area.progress}%</span>
                          </div>
                          <Progress value={area.progress} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-muted-foreground">
                            Target: {area.targetDate}
                          </div>
                          <span className="text-sm text-muted-foreground">{area.category}</span>
                        </div>

                        {/* Milestones */}
                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium">Milestones</h4>
                          {area.milestones.map((milestone) => (
                            <div key={milestone.id} className="flex items-center space-x-2">
                              {milestone.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-gray-400" />
                              )}
                              <span className={`text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
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

          {/* Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Action Items</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {filteredActionItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge variant="secondary" className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Badge variant="secondary" className={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{item.category}</span>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{item.assignedTo}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {item.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{item.estimatedHours}h</span>
                        </div>
                      </div>

                      {item.dependencies.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Dependencies:</span> {item.dependencies.join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
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

          {/* Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Growth Insights</h2>
              <Grid cols={3} gap={6}>
                {growthStudioData.insights.map((insight) => (
                  <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(insight.trend)}
                        <span className="text-sm font-medium">{insight.title}</span>
                      </div>
                      <span className="text-2xl font-bold">{insight.metric}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                    <button className="text-sm font-medium hover:underline">
                      {insight.action}
                    </button>
                  </div>
                ))}
              </Grid>
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
                  <Target className="h-6 w-6" />
                  <span>Set New Goal</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <CheckSquare className="h-6 w-6" />
                  <span>Add Action Item</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>View Analytics</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Share2 className="h-6 w-6" />
                  <span>Share Progress</span>
                </Button>
              </Grid>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
