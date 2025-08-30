/**
 * OptimaliQ Custom Questions Management Page
 * Advanced question creation and management with AI assistance
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
  Target,
  Users,
  BarChart3,
  Zap,
  Type,
  List,
  Radio,
  CheckSquare,
  Sliders,
  Image,
  Upload,
  Download,
  Eye,
  Settings,
  Wand2,
  Lightbulb,
  Star,
  Clock,
  Tag,
  Folder,
  BookOpen,
  FileText,
  Brain,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Select, Checkbox, RadioGroup } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Custom questions data
const customQuestionsData = {
  categories: [
    { id: 'all', name: 'All Questions', count: 45 },
    { id: 'strategy', name: 'Strategy', count: 12 },
    { id: 'operations', name: 'Operations', count: 10 },
    { id: 'team', name: 'Team & Culture', count: 8 },
    { id: 'growth', name: 'Growth & Innovation', count: 9 },
    { id: 'technology', name: 'Technology', count: 6 }
  ],
  questionTypes: [
    { id: 'multiple-choice', name: 'Multiple Choice', icon: <Radio className="h-4 w-4" /> },
    { id: 'scale', name: 'Rating Scale', icon: <Sliders className="h-4 w-4" /> },
    { id: 'text', name: 'Text Input', icon: <Type className="h-4 w-4" /> },
    { id: 'checkbox', name: 'Multiple Select', icon: <CheckSquare className="h-4 w-4" /> },
    { id: 'dropdown', name: 'Dropdown', icon: <List className="h-4 w-4" /> }
  ],
  questions: [
    {
      id: 1,
      title: 'Strategic Vision Clarity',
      question: 'How clearly defined is your organization\'s strategic vision and long-term goals?',
      type: 'scale',
      category: 'Strategy',
      industry: 'All',
      difficulty: 'Beginner',
      weight: 1.2,
      required: true,
      tags: ['vision', 'strategy', 'planning'],
      options: {
        scale_min: 1,
        scale_max: 5,
        labels: {
          1: 'Not defined at all',
          5: 'Very clearly defined'
        }
      },
      followUp: {
        enabled: true,
        question: 'What are the main challenges in communicating your vision to stakeholders?'
      },
      aiSuggestions: [
        'Consider adding branching logic for low scores',
        'This question could benefit from industry-specific examples',
        'Add confidence rating to improve data quality'
      ],
      usage: 156,
      performance: {
        avgScore: 3.4,
        responseRate: 98,
        skipRate: 2
      },
      created: '2024-08-15',
      lastModified: '2024-08-25',
      author: 'OptimaliQ Team'
    },
    {
      id: 2,
      title: 'Technology Infrastructure Assessment',
      question: 'Which of the following best describes your current technology infrastructure?',
      type: 'multiple-choice',
      category: 'Technology',
      industry: 'Technology',
      difficulty: 'Intermediate',
      weight: 1.0,
      required: true,
      tags: ['technology', 'infrastructure', 'systems'],
      options: {
        choices: [
          'Legacy systems with minimal cloud adoption',
          'Hybrid infrastructure with some cloud services',
          'Primarily cloud-based with modern tools',
          'Cutting-edge infrastructure with AI/ML integration',
          'Not sure about our current state'
        ]
      },
      followUp: {
        enabled: true,
        question: 'What are your main technology challenges or priorities?'
      },
      aiSuggestions: [
        'Add follow-up about budget constraints',
        'Consider industry-specific technology options',
        'This could trigger different assessment paths'
      ],
      usage: 89,
      performance: {
        avgScore: 2.8,
        responseRate: 95,
        skipRate: 5
      },
      created: '2024-08-10',
      lastModified: '2024-08-20',
      author: 'Michael Rodriguez'
    },
    {
      id: 3,
      title: 'Team Collaboration Effectiveness',
      question: 'How would you describe the overall effectiveness of collaboration within your team?',
      type: 'scale',
      category: 'Team',
      industry: 'All',
      difficulty: 'Beginner',
      weight: 1.1,
      required: false,
      tags: ['collaboration', 'teamwork', 'communication'],
      options: {
        scale_min: 1,
        scale_max: 10,
        labels: {
          1: 'Very poor collaboration',
          10: 'Exceptional collaboration'
        }
      },
      followUp: {
        enabled: true,
        question: 'What tools or processes does your team currently use for collaboration?'
      },
      aiSuggestions: [
        'Consider adding remote work context',
        'This question works well with team size segmentation',
        'Add examples of collaboration tools'
      ],
      usage: 234,
      performance: {
        avgScore: 6.7,
        responseRate: 92,
        skipRate: 8
      },
      created: '2024-08-05',
      lastModified: '2024-08-18',
      author: 'Emily Johnson'
    }
  ],
  templates: [
    {
      id: 'strategy-template',
      name: 'Strategic Planning Questions',
      description: 'Comprehensive set of strategy-focused questions',
      questions: 15,
      category: 'Strategy',
      usage: 89
    },
    {
      id: 'operations-template',
      name: 'Operations Excellence Questions',
      description: 'Questions focused on operational efficiency and processes',
      questions: 12,
      category: 'Operations',
      usage: 67
    },
    {
      id: 'team-template',
      name: 'Team Dynamics Questions',
      description: 'Questions about team collaboration and culture',
      questions: 10,
      category: 'Team',
      usage: 134
    }
  ],
  aiSuggestions: [
    {
      type: 'new-question',
      title: 'Add Risk Management Question',
      description: 'Based on your industry focus, consider adding questions about risk assessment and mitigation strategies.',
      confidence: 87,
      category: 'Strategy'
    },
    {
      type: 'improve-question',
      title: 'Enhance Technology Question',
      description: 'Question #2 could benefit from more specific technology categories and current trends.',
      confidence: 92,
      questionId: 2
    },
    {
      type: 'optimize-flow',
      title: 'Optimize Question Order',
      description: 'Consider reordering questions to group related topics for better user experience.',
      confidence: 78,
      category: 'All'
    }
  ]
}

export default function CustomQuestionsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all')
  const [selectedType, setSelectedType] = React.useState('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showAddQuestion, setShowAddQuestion] = React.useState(false)
  const [editingQuestion, setEditingQuestion] = React.useState<number | null>(null)
  const [showAISuggestions, setShowAISuggestions] = React.useState(true)

  const filteredQuestions = customQuestionsData.questions.filter(question => {
    const categoryMatch = selectedCategory === 'all' || question.category.toLowerCase() === selectedCategory
    const typeMatch = selectedType === 'all' || question.type === selectedType
    const searchMatch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return categoryMatch && typeMatch && searchMatch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'success'
      case 'Intermediate': return 'warning'
      case 'Advanced': return 'error'
      default: return 'info'
    }
  }

  const getTypeIcon = (type: string) => {
    const typeData = customQuestionsData.questionTypes.find(t => t.id === type)
    return typeData?.icon || <Type className="h-4 w-4" />
  }

  const handleDeleteQuestion = (id: number) => {
    console.log('Deleting question:', id)
    // Implementation for deleting questions
  }

  const handleDuplicateQuestion = (id: number) => {
    console.log('Duplicating question:', id)
    // Implementation for duplicating questions
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessment
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Custom Questions</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={() => setShowAddQuestion(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  Question Library
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Custom Questions Management
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Create, edit, and manage custom assessment questions with AI-powered suggestions 
                  and performance analytics.
                </p>
              </div>
            </div>

            {/* Filters */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select
                    options={[
                      { value: 'all', label: 'All Categories' },
                      ...customQuestionsData.categories.slice(1).map(cat => ({
                        value: cat.id,
                        label: `${cat.name} (${cat.count})`
                      }))
                    ]}
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    size="sm"
                  />
                  
                  <Select
                    options={[
                      { value: 'all', label: 'All Types' },
                      ...customQuestionsData.questionTypes.map(type => ({
                        value: type.id,
                        label: type.name
                      }))
                    ]}
                    value={selectedType}
                    onValueChange={setSelectedType}
                    size="sm"
                  />
                  
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <Grid cols={4} gap={8} className="items-start">
            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Categories */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {customQuestionsData.categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{category.name}</span>
                        <span className="text-xs text-muted-foreground">{category.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Question Types */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Question Types</h3>
                <div className="space-y-2">
                  {customQuestionsData.questionTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-lg">
                      <div className="p-1 bg-primary/10 text-primary rounded">
                        {type.icon}
                      </div>
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* AI Suggestions */}
              {showAISuggestions && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Wand2 className="h-5 w-5 mr-2" />
                      AI Suggestions
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowAISuggestions(false)}>
                      ×
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {customQuestionsData.aiSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{suggestion.title}</h4>
                          <StatusBadge status="info" size="xs">
                            {suggestion.confidence}%
                          </StatusBadge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{suggestion.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          Apply Suggestion
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Templates */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Question Templates</h3>
                <div className="space-y-3">
                  {customQuestionsData.templates.map((template) => (
                    <div key={template.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{template.questions} questions</span>
                        <span>{template.usage} uses</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-3"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {filteredQuestions.length} Questions Found
                </h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Bulk Actions
                  </Button>
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Type className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or create a new custom question.
                  </p>
                  <Button onClick={() => setShowAddQuestion(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Question
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredQuestions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                {getTypeIcon(question.type)}
                              </div>
                              <div>
                                <h3 className="font-semibold">{question.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <StatusBadge status="info" size="xs">{question.category}</StatusBadge>
                                  <StatusBadge status={getDifficultyColor(question.difficulty) as any} size="xs">
                                    {question.difficulty}
                                  </StatusBadge>
                                  {question.required && (
                                    <StatusBadge status="error" size="xs">Required</StatusBadge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{question.question}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDuplicateQuestion(question.id)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question.id)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="ml-2 font-medium">{question.weight}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Usage:</span>
                            <span className="ml-2 font-medium">{question.usage} times</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg Score:</span>
                            <span className="ml-2 font-medium">{question.performance.avgScore}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Response Rate:</span>
                            <span className="ml-2 font-medium">{question.performance.responseRate}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="px-2 py-1 bg-muted rounded-full text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {question.aiSuggestions.length > 0 && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                              <Brain className="h-4 w-4 mr-2" />
                              AI Suggestions:
                            </div>
                            <div className="space-y-1">
                              {question.aiSuggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                                <div key={suggestionIndex} className="text-xs text-blue-600">
                                  • {suggestion}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-4 border-t">
                          <span>Created: {question.created}</span>
                          <span>Modified: {question.lastModified}</span>
                          <span>Author: {question.author}</span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
