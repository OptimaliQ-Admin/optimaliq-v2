/**
 * OptimaliQ Assessment Template Library Page
 * Pre-built assessment templates with industry-specific customizations
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
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  CalendarDays,
  Flag,
  CheckSquare,
  Square,
  Filter,
  Search,
  RefreshCw,
  Info,
  HelpCircle,
  Settings,
  Bell,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Send,
  Phone,
  Smartphone,
  AtSign,
  Globe,
  Repeat,
  Timer,
  Archive,
  Copy,
  Move,
  GripVertical,
  Type,
  List,
  RadioButton,
  ToggleLeft,
  Sliders,
  Image,
  Upload,
  Save,
  Eye as PreviewIcon,
  Wand2,
  Building,
  Stethoscope,
  Laptop,
  Factory,
  GraduationCap,
  Heart,
  Leaf,
  Palette,
  Globe2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, BarChart as BarChartComponent, MetricCard } from '@/components/ui/charts'
import { Select, Checkbox, RadioGroup, Slider } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Sample Template Library Data
const templateData = {
  categories: [
    { id: 'all', name: 'All Templates', count: 24 },
    { id: 'strategy', name: 'Strategy', count: 6 },
    { id: 'operations', name: 'Operations', count: 5 },
    { id: 'team', name: 'Team & Culture', count: 4 },
    { id: 'growth', name: 'Growth & Innovation', count: 5 },
    { id: 'technology', name: 'Technology', count: 4 }
  ],
  industries: [
    { id: 'all', name: 'All Industries', icon: <Globe2 className="h-4 w-4" /> },
    { id: 'healthcare', name: 'Healthcare', icon: <Stethoscope className="h-4 w-4" /> },
    { id: 'technology', name: 'Technology', icon: <Laptop className="h-4 w-4" /> },
    { id: 'manufacturing', name: 'Manufacturing', icon: <Factory className="h-4 w-4" /> },
    { id: 'education', name: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'nonprofit', name: 'Non-Profit', icon: <Heart className="h-4 w-4" /> },
    { id: 'environment', name: 'Environment', icon: <Leaf className="h-4 w-4" /> },
    { id: 'creative', name: 'Creative', icon: <Palette className="h-4 w-4" /> }
  ],
  templates: [
    {
      id: 'strategic-healthcare',
      title: 'Healthcare Strategic Assessment',
      description: 'Comprehensive strategic planning assessment tailored for healthcare organizations',
      category: 'Strategy',
      industry: 'Healthcare',
      questions: 28,
      estimatedTime: '20-25 minutes',
      difficulty: 'Intermediate',
      rating: 4.8,
      reviews: 156,
      downloads: 1240,
      featured: true,
      preview: {
        sampleQuestions: [
          'How well does your organization adapt to healthcare regulations?',
          'What is your competitive advantage in patient care?',
          'How effectively do you manage healthcare technology investments?'
        ]
      },
      tags: ['patient-care', 'compliance', 'technology', 'strategic-planning'],
      lastUpdated: '2024-08-15',
      author: 'OptimaliQ Healthcare Team',
      languages: ['English', 'Spanish']
    },
    {
      id: 'operational-manufacturing',
      title: 'Manufacturing Operations Excellence',
      description: 'Operations and process efficiency assessment for manufacturing organizations',
      category: 'Operations',
      industry: 'Manufacturing',
      questions: 32,
      estimatedTime: '25-30 minutes',
      difficulty: 'Advanced',
      rating: 4.9,
      reviews: 203,
      downloads: 987,
      featured: true,
      preview: {
        sampleQuestions: [
          'How efficient are your production line processes?',
          'What is your approach to quality control and assurance?',
          'How do you manage supply chain disruptions?'
        ]
      },
      tags: ['production', 'quality-control', 'supply-chain', 'efficiency'],
      lastUpdated: '2024-08-20',
      author: 'OptimaliQ Operations Team',
      languages: ['English', 'German', 'Chinese']
    },
    {
      id: 'team-tech-startup',
      title: 'Tech Startup Team Assessment',
      description: 'Team dynamics and culture assessment designed for fast-growing technology startups',
      category: 'Team',
      industry: 'Technology',
      questions: 24,
      estimatedTime: '15-20 minutes',
      difficulty: 'Beginner',
      rating: 4.7,
      reviews: 89,
      downloads: 654,
      featured: false,
      preview: {
        sampleQuestions: [
          'How well does your team adapt to rapid changes?',
          'What is the communication style in your organization?',
          'How do you handle remote and hybrid work arrangements?'
        ]
      },
      tags: ['startup', 'remote-work', 'communication', 'agility'],
      lastUpdated: '2024-08-10',
      author: 'OptimaliQ Tech Team',
      languages: ['English']
    },
    {
      id: 'growth-nonprofit',
      title: 'Non-Profit Growth Strategy',
      description: 'Growth and sustainability assessment for non-profit organizations',
      category: 'Growth',
      industry: 'Non-Profit',
      questions: 26,
      estimatedTime: '18-22 minutes',
      difficulty: 'Intermediate',
      rating: 4.6,
      reviews: 127,
      downloads: 432,
      featured: false,
      preview: {
        sampleQuestions: [
          'How diversified are your funding sources?',
          'What is your approach to community engagement?',
          'How do you measure social impact effectiveness?'
        ]
      },
      tags: ['funding', 'impact-measurement', 'community', 'sustainability'],
      lastUpdated: '2024-08-05',
      author: 'OptimaliQ Non-Profit Team',
      languages: ['English', 'French']
    },
    {
      id: 'technology-education',
      title: 'EdTech Innovation Assessment',
      description: 'Technology adoption and innovation assessment for educational institutions',
      category: 'Technology',
      industry: 'Education',
      questions: 30,
      estimatedTime: '22-28 minutes',
      difficulty: 'Advanced',
      rating: 4.5,
      reviews: 78,
      downloads: 321,
      featured: false,
      preview: {
        sampleQuestions: [
          'How effectively do you integrate technology in learning?',
          'What is your approach to digital literacy training?',
          'How do you ensure data privacy and security?'
        ]
      },
      tags: ['edtech', 'digital-literacy', 'privacy', 'innovation'],
      lastUpdated: '2024-07-28',
      author: 'OptimaliQ Education Team',
      languages: ['English', 'Spanish', 'Portuguese']
    },
    {
      id: 'comprehensive-sme',
      title: 'SME Comprehensive Assessment',
      description: 'Complete business assessment for small and medium enterprises across all areas',
      category: 'Strategy',
      industry: 'All Industries',
      questions: 45,
      estimatedTime: '35-40 minutes',
      difficulty: 'Advanced',
      rating: 4.8,
      reviews: 234,
      downloads: 1876,
      featured: true,
      preview: {
        sampleQuestions: [
          'How well-defined is your business strategy?',
          'What are your main operational challenges?',
          'How do you manage and develop your team?'
        ]
      },
      tags: ['sme', 'comprehensive', 'business-strategy', 'all-areas'],
      lastUpdated: '2024-08-25',
      author: 'OptimaliQ Strategy Team',
      languages: ['English', 'Spanish', 'French', 'German']
    }
  ],
  stats: {
    totalTemplates: 24,
    totalDownloads: 15420,
    avgRating: 4.7,
    activeUsers: 3240
  }
}

export default function TemplateLibraryPage() {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [selectedIndustry, setSelectedIndustry] = React.useState<string>('all')
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const [sortBy, setSortBy] = React.useState<string>('featured')
  const [isLoading, setIsLoading] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success'
      case 'Intermediate': return 'warning'
      case 'Advanced': return 'error'
      default: return 'info'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Strategy': return <Target className="h-5 w-5" />
      case 'Operations': return <BarChart3 className="h-5 w-5" />
      case 'Team': return <Users className="h-5 w-5" />
      case 'Growth': return <TrendingUp className="h-5 w-5" />
      case 'Technology': return <Zap className="h-5 w-5" />
      default: return <FileText className="h-5 w-5" />
    }
  }

  const filteredTemplates = templateData.templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category.toLowerCase() === selectedCategory
    const industryMatch = selectedIndustry === 'all' || template.industry.toLowerCase() === selectedIndustry || template.industry === 'All Industries'
    const searchMatch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return categoryMatch && industryMatch && searchMatch
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'featured':
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      case 'rating':
        return b.rating - a.rating
      case 'downloads':
        return b.downloads - a.downloads
      case 'newest':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      default:
        return 0
    }
  })

  const handleUseTemplate = (templateId: string) => {
    console.log('Using template:', templateId)
    // Implementation for using template
  }

  const handlePreviewTemplate = (templateId: string) => {
    console.log('Previewing template:', templateId)
    // Implementation for preview
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builder
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Template Library</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Template
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Library Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  Assessment Template Library
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Pre-built Assessment Templates
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Choose from our library of professionally designed assessment templates. Each template is industry-specific and ready to customize for your organization.
                </p>
              </div>
            </div>

            {/* Stats Overview */}
            <Grid cols={4} gap={6} className="mb-8">
              <MetricCard
                title="Total Templates"
                value={templateData.stats.totalTemplates}
                icon={<FileText className="h-6 w-6" />}
              />
              <MetricCard
                title="Total Downloads"
                value={templateData.stats.totalDownloads.toLocaleString()}
                icon={<Download className="h-6 w-6" />}
              />
              <MetricCard
                title="Average Rating"
                value={templateData.stats.avgRating}
                icon={<Star className="h-6 w-6" />}
              />
              <MetricCard
                title="Active Users"
                value={templateData.stats.activeUsers.toLocaleString()}
                icon={<Users className="h-6 w-6" />}
              />
            </Grid>
          </motion.div>

          <Grid cols={4} gap={8} className="items-start">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {/* Categories */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  
                  <div className="space-y-2">
                    {templateData.categories.map((category, index) => (
                      <div
                        key={category.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{category.name}</span>
                          <span className="text-xs text-muted-foreground">{category.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Industries */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Industries</h3>
                  
                  <div className="space-y-2">
                    {templateData.industries.map((industry, index) => (
                      <div
                        key={industry.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedIndustry === industry.id 
                            ? 'bg-primary/10 text-primary border border-primary/20' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedIndustry(industry.id)}
                      >
                        <div className="flex items-center space-x-3">
                          {industry.icon}
                          <span className="font-medium text-sm">{industry.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Sort Options */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sort By</h3>
                  
                  <Select
                    options={[
                      { value: 'featured', label: 'Featured First' },
                      { value: 'rating', label: 'Highest Rated' },
                      { value: 'downloads', label: 'Most Downloaded' },
                      { value: 'newest', label: 'Newest First' }
                    ]}
                    value={sortBy}
                    onValueChange={setSortBy}
                  />
                </Card>
              </div>
            </motion.div>

            {/* Templates Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-3"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {sortedTemplates.length} Templates Found
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {sortedTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 text-primary rounded-lg">
                            {getCategoryIcon(template.category)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{template.title}</h3>
                              {template.featured && (
                                <StatusBadge status="primary" size="xs">Featured</StatusBadge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.industry}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-sm">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{template.rating}</span>
                          <span className="text-muted-foreground">({template.reviews})</span>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4">{template.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{template.estimatedTime}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{template.questions} questions</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <StatusBadge status={getDifficultyColor(template.difficulty) as any} size="xs">
                            {template.difficulty}
                          </StatusBadge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Download className="h-4 w-4 text-muted-foreground" />
                          <span>{template.downloads.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Sample Questions:</h4>
                        <div className="space-y-1">
                          {template.preview.sampleQuestions.slice(0, 2).map((question, questionIndex) => (
                            <div key={questionIndex} className="text-xs text-muted-foreground">
                              • {question}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-muted rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-muted rounded-full text-xs">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>Updated: {template.lastUpdated}</span>
                        <span>By: {template.author}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button 
                          className="flex-1" 
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          Use Template
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                                                onClick={() => handlePreviewTemplate(template.id)}
                    >
                      <PreviewIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {sortedTemplates.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Templates Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms to find relevant templates.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSelectedCategory('all')
                    setSelectedIndustry('all')
                    setSearchQuery('')
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
