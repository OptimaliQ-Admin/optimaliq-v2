/**
 * OptimaliQ Market Intelligence Page
 * Comprehensive market intelligence with competitive analysis and trend monitoring
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
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus,
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
  Partnership,
  MapPin,
  Navigation,
  Compass,
  Map,
  Search as SearchIcon,
  Target as TargetIcon3,
  Users as UsersIcon2,
  BarChart3 as BarChart3Icon,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  Gauge as GaugeIcon
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

// Market Intelligence data
const marketIntelligenceData = {
  stats: {
    totalReports: 24,
    activeMonitors: 8,
    competitors: 12,
    marketSize: '$2.8B',
    growthRate: '+12.5%',
    improvement: '+8%'
  },
  marketReports: [
    {
      id: 1,
      title: 'Q3 2024 Market Analysis',
      description: 'Comprehensive analysis of market trends and opportunities',
      type: 'Market Analysis',
      status: 'published',
      publishDate: '2024-09-01',
      lastUpdated: '2 days ago',
      category: 'Market Trends',
      keyInsights: [
        'Market growth accelerated to 12.5% YoY',
        'New market segments emerging in AI/ML',
        'Customer acquisition costs increasing 15%'
      ],
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Competitive Landscape Review',
      description: 'Analysis of key competitors and their strategies',
      type: 'Competitive Analysis',
      status: 'draft',
      publishDate: null,
      lastUpdated: '1 week ago',
      category: 'Competitive Intelligence',
      keyInsights: [
        '3 new competitors entered the market',
        'Pricing strategies becoming more aggressive',
        'Feature parity gap narrowing'
      ],
      icon: <Target className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 3,
      title: 'Customer Behavior Trends',
      description: 'Analysis of changing customer preferences and behaviors',
      type: 'Customer Research',
      status: 'published',
      publishDate: '2024-08-25',
      lastUpdated: '1 week ago',
      category: 'Customer Insights',
      keyInsights: [
        'Mobile usage increased 25%',
        'Self-service preferences growing',
        'Integration requirements expanding'
      ],
      icon: <Users className="h-6 w-6" />,
      color: 'bg-purple-500'
    },
    {
      id: 4,
      title: 'Technology Adoption Report',
      description: 'Analysis of technology trends and adoption rates',
      type: 'Technology Research',
      status: 'published',
      publishDate: '2024-08-20',
      lastUpdated: '2 weeks ago',
      category: 'Technology Trends',
      keyInsights: [
        'AI adoption increased 40%',
        'Cloud migration accelerating',
        'Security concerns growing'
      ],
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-orange-500'
    }
  ],
  competitors: [
    {
      id: 1,
      name: 'TechCorp Solutions',
      marketShare: '18%',
      strength: 'high',
      recentActivity: 'Launched new AI features',
      lastUpdated: '3 days ago',
      category: 'Direct Competitor',
      icon: <Building className="h-6 w-6" />,
      color: 'bg-red-500'
    },
    {
      id: 2,
      name: 'InnovateTech',
      marketShare: '12%',
      strength: 'medium',
      recentActivity: 'Acquired smaller competitor',
      lastUpdated: '1 week ago',
      category: 'Direct Competitor',
      icon: <Rocket className="h-6 w-6" />,
      color: 'bg-blue-500'
    },
    {
      id: 3,
      name: 'Future Systems',
      marketShare: '8%',
      strength: 'low',
      recentActivity: 'Restructured pricing',
      lastUpdated: '2 weeks ago',
      category: 'Indirect Competitor',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-green-500'
    },
    {
      id: 4,
      name: 'NextGen Solutions',
      marketShare: '15%',
      strength: 'high',
      recentActivity: 'Expanded to new markets',
      lastUpdated: '4 days ago',
      category: 'Direct Competitor',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-purple-500'
    }
  ],
  marketTrends: [
    {
      id: 1,
      trend: 'AI/ML Integration',
      direction: 'up',
      impact: 'high',
      description: 'Increasing demand for AI-powered features',
      timeframe: '6-12 months',
      confidence: 85
    },
    {
      id: 2,
      trend: 'Cloud Migration',
      direction: 'up',
      impact: 'medium',
      description: 'Continued shift toward cloud-based solutions',
      timeframe: '12-18 months',
      confidence: 78
    },
    {
      id: 3,
      trend: 'Security Focus',
      direction: 'up',
      impact: 'high',
      description: 'Growing emphasis on cybersecurity features',
      timeframe: '3-6 months',
      confidence: 92
    },
    {
      id: 4,
      trend: 'Mobile First',
      direction: 'stable',
      impact: 'medium',
      description: 'Mobile usage stabilizing at high levels',
      timeframe: '6-12 months',
      confidence: 65
    }
  ],
  categories: [
    'All',
    'Market Trends',
    'Competitive Intelligence',
    'Customer Insights',
    'Technology Trends',
    'Industry Analysis',
    'Regulatory Changes',
    'Economic Factors',
    'Geographic Expansion',
    'Product Development'
  ]
}

export default function MarketIntelligencePage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All')
  const [selectedStatus, setSelectedStatus] = React.useState('All')
  const [searchQuery, setSearchQuery] = React.useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'review': return 'text-blue-600 bg-blue-100'
      case 'archived': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUpIcon className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDownIcon className="h-4 w-4 text-red-600" />
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
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

  const filteredReports = marketIntelligenceData.marketReports.filter(report => 
    (selectedCategory === 'All' || report.category === selectedCategory) &&
    (selectedStatus === 'All' || report.status === selectedStatus)
  )

  const filteredCompetitors = marketIntelligenceData.competitors.filter(competitor => 
    selectedCategory === 'All' || competitor.category === selectedCategory
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
            <span className="text-sm text-muted-foreground">Market Intelligence</span>
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
                <h1 className="text-3xl font-bold mb-2">Market Intelligence</h1>
                <p className="text-muted-foreground">
                  Monitor market trends, competitive landscape, and industry insights
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Reports
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
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
                title="Total Reports"
                value={marketIntelligenceData.stats.totalReports}
                subtitle="Market intelligence"
                icon={<FileText className="h-5 w-5" />}
                className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20"
              />
              <MetricCard
                title="Active Monitors"
                value={marketIntelligenceData.stats.activeMonitors}
                subtitle="Market tracking"
                icon={<Activity className="h-5 w-5" />}
                className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20"
              />
              <MetricCard
                title="Market Size"
                value={marketIntelligenceData.stats.marketSize}
                subtitle={marketIntelligenceData.stats.growthRate}
                icon={<BarChart3 className="h-5 w-5" />}
                trend="up"
                className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20"
              />
              <MetricCard
                title="Competitors"
                value={marketIntelligenceData.stats.competitors}
                subtitle="Tracked"
                icon={<Target className="h-5 w-5" />}
                className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20"
              />
            </Grid>
          </motion.div>

          {/* Market Reports */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Market Reports</h2>
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
                    options={marketIntelligenceData.categories.map(cat => ({ value: cat, label: cat }))}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                    options={[
                      { value: 'All', label: 'All' },
                      { value: 'published', label: 'Published' },
                      { value: 'draft', label: 'Draft' },
                      { value: 'review', label: 'Review' }
                    ]}
                  />
                </div>
              </div>

              {/* Reports Grid */}
              <Grid cols={2} gap={6}>
                {filteredReports.map((report) => (
                  <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${report.color} text-white rounded-lg`}>
                        {report.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{report.title}</h3>
                          <Badge variant="secondary" className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{report.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <h4 className="text-sm font-medium">Key Insights:</h4>
                          <ul className="space-y-1">
                            {report.keyInsights.map((insight, index) => (
                              <li key={index} className="text-xs text-muted-foreground flex items-start space-x-2">
                                <span className="text-primary">•</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-muted-foreground">
                            {report.publishDate ? `Published: ${report.publishDate}` : 'Draft'}
                          </div>
                          <span className="text-sm text-muted-foreground">{report.category}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
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

          {/* Competitive Landscape */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Competitive Landscape</h2>
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              <Grid cols={2} gap={6}>
                {filteredCompetitors.map((competitor) => (
                  <Card key={competitor.id} className="p-6 border-2 border-muted hover:border-primary/50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 ${competitor.color} text-white rounded-lg`}>
                        {competitor.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{competitor.name}</h3>
                          <Badge variant="secondary" className={getStrengthColor(competitor.strength)}>
                            {competitor.strength}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span>Market Share:</span>
                            <span className="font-medium text-primary">{competitor.marketShare}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Category:</span>
                            <span className="font-medium">{competitor.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Last Updated:</span>
                            <span className="font-medium">{competitor.lastUpdated}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Recent Activity:</h4>
                          <p className="text-sm text-muted-foreground">{competitor.recentActivity}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Compare
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </Grid>
            </Card>
          </motion.div>

          {/* Market Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Market Trends</h2>
              <Grid cols={2} gap={6}>
                {marketIntelligenceData.marketTrends.map((trend) => (
                  <div key={trend.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(trend.direction)}
                        <span className="text-sm font-medium">{trend.trend}</span>
                      </div>
                      <Badge variant="secondary" className={getImpactColor(trend.impact)}>
                        {trend.impact}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{trend.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span>Timeframe:</span>
                        <span className="font-medium">{trend.timeframe}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Confidence:</span>
                        <span className="font-medium">{trend.confidence}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    </div>
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
                  <Plus className="h-6 w-6" />
                  <span>Create Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col space-y-2">
                  <Target className="h-6 w-6" />
                  <span>Add Competitor</span>
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
