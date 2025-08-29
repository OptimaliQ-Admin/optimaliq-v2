/**
 * OptimaliQ Assessment Builder Page
 * Custom assessment creation with drag-and-drop interface and AI-powered suggestions
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
  Preview,
  Wand2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart, PieChart, BarChart as BarChartComponent, MetricCard } from '@/components/ui/charts'
import { Select, Checkbox, Input, RadioGroup, Slider } from '@/components/ui/form'

// Sample Assessment Builder Data
const builderData = {
  currentAssessment: {
    id: 'custom-assessment-1',
    title: 'Custom Strategic Assessment',
    description: 'A tailored assessment for mid-sized healthcare organizations',
    category: 'Strategy',
    estimatedTime: '15-20 minutes',
    totalQuestions: 0,
    status: 'draft',
    created: '2024-08-29',
    lastModified: '2024-08-29'
  },
  questionTypes: [
    {
      id: 'multiple-choice',
      name: 'Multiple Choice',
      description: 'Single selection from multiple options',
      icon: <RadioButton className="h-5 w-5" />,
      color: '#3b82f6',
      fields: ['question', 'options', 'correct_answer']
    },
    {
      id: 'scale',
      name: 'Rating Scale',
      description: '1-5 or 1-10 rating scale questions',
      icon: <Sliders className="h-5 w-5" />,
      color: '#10b981',
      fields: ['question', 'scale_min', 'scale_max', 'labels']
    },
    {
      id: 'text',
      name: 'Text Input',
      description: 'Open-ended text response',
      icon: <Type className="h-5 w-5" />,
      color: '#f59e0b',
      fields: ['question', 'placeholder', 'max_length']
    },
    {
      id: 'checkbox',
      name: 'Multiple Select',
      description: 'Multiple selections from options',
      icon: <CheckSquare className="h-5 w-5" />,
      color: '#8b5cf6',
      fields: ['question', 'options', 'min_selections', 'max_selections']
    },
    {
      id: 'dropdown',
      name: 'Dropdown',
      description: 'Single selection from dropdown list',
      icon: <List className="h-5 w-5" />,
      color: '#06b6d4',
      fields: ['question', 'options', 'placeholder']
    }
  ],
  questions: [
    {
      id: 1,
      type: 'scale',
      title: 'Strategic Vision Clarity',
      question: 'How clearly defined is your organization\'s strategic vision?',
      category: 'Strategy',
      required: true,
      weight: 1.0,
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
        question: 'What challenges do you face in communicating your vision?'
      },
      aiSuggestions: [
        'Consider adding a follow-up about vision communication',
        'This question could be weighted higher for strategic assessments',
        'Add branching logic based on low scores'
      ]
    },
    {
      id: 2,
      type: 'multiple-choice',
      title: 'Primary Growth Challenge',
      question: 'What is your organization\'s primary growth challenge?',
      category: 'Growth',
      required: true,
      weight: 1.2,
      options: {
        choices: [
          'Limited resources',
          'Market competition',
          'Technology constraints',
          'Team capacity',
          'Regulatory compliance'
        ]
      },
      followUp: {
        enabled: false
      },
      aiSuggestions: [
        'Consider adding "Other" option with text input',
        'This could trigger different question paths',
        'Add confidence rating for this question'
      ]
    }
  ],
  templates: [
    {
      id: 'strategic-template',
      name: 'Strategic Assessment Template',
      description: 'Comprehensive strategic planning assessment',
      category: 'Strategy',
      questions: 25,
      estimatedTime: '20 minutes',
      industries: ['Healthcare', 'Technology', 'Manufacturing']
    },
    {
      id: 'operational-template',
      name: 'Operational Excellence Template',
      description: 'Operations and process efficiency assessment',
      category: 'Operations',
      questions: 18,
      estimatedTime: '15 minutes',
      industries: ['All Industries']
    },
    {
      id: 'team-template',
      name: 'Team Performance Template',
      description: 'Team dynamics and culture assessment',
      category: 'Team',
      questions: 22,
      estimatedTime: '18 minutes',
      industries: ['All Industries']
    }
  ],
  aiSuggestions: [
    {
      type: 'question',
      title: 'Add Technology Assessment',
      description: 'Consider adding questions about technology infrastructure based on your industry focus',
      confidence: 85
    },
    {
      type: 'flow',
      title: 'Improve Question Flow',
      description: 'Reorganize questions to group related topics for better user experience',
      confidence: 78
    },
    {
      type: 'scoring',
      title: 'Enhance Scoring Logic',
      description: 'Add weighted scoring based on question importance and industry benchmarks',
      confidence: 92
    }
  ]
}

export default function AssessmentBuilderPage() {
  const searchParams = useSearchParams()
  const [selectedQuestionType, setSelectedQuestionType] = React.useState<string>('')
  const [draggedQuestion, setDraggedQuestion] = React.useState<number | null>(null)
  const [showPreview, setShowPreview] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAISuggestions, setShowAISuggestions] = React.useState(true)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''

  const handleAddQuestion = (type: string) => {
    console.log('Adding question of type:', type)
    // Implementation for adding questions
  }

  const handleDeleteQuestion = (id: number) => {
    console.log('Deleting question:', id)
    // Implementation for deleting questions
  }

  const handleSaveAssessment = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Assessment saved')
    } catch (error) {
      console.error('Failed to save assessment', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreviewAssessment = () => {
    setShowPreview(true)
    // Implementation for preview
  }

  const getQuestionTypeIcon = (type: string) => {
    const questionType = builderData.questionTypes.find(qt => qt.id === type)
    return questionType?.icon || <Type className="h-5 w-5" />
  }

  const getQuestionTypeColor = (type: string) => {
    const questionType = builderData.questionTypes.find(qt => qt.id === type)
    return questionType?.color || '#64748b'
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
            <span className="text-sm font-medium">Assessment Builder</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={handlePreviewAssessment}>
              <Preview className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm" onClick={handleSaveAssessment} loading={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-7xl">
          {/* Builder Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <StatusBadge status="primary" className="mb-4">
                  Custom Assessment Builder
                </StatusBadge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  Build Your Assessment
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                  Create custom assessments with our intuitive drag-and-drop builder. AI-powered suggestions help optimize your questions for better insights.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Assist
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Templates
                </Button>
              </div>
            </div>

            {/* Assessment Info */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Assessment Details</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Title</label>
                      <Input 
                        value={builderData.currentAssessment.title}
                        placeholder="Enter assessment title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea 
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                        value={builderData.currentAssessment.description}
                        placeholder="Enter assessment description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select
                        options={[
                          { value: 'strategy', label: 'Strategy' },
                          { value: 'operations', label: 'Operations' },
                          { value: 'team', label: 'Team' },
                          { value: 'growth', label: 'Growth' },
                          { value: 'technology', label: 'Technology' }
                        ]}
                        value={builderData.currentAssessment.category.toLowerCase()}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Assessment Stats</h2>
                  <Grid cols={2} gap={4}>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{builderData.questions.length}</div>
                      <div className="text-sm text-muted-foreground">Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{builderData.currentAssessment.estimatedTime}</div>
                      <div className="text-sm text-muted-foreground">Est. Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">Draft</div>
                      <div className="text-sm text-muted-foreground">Status</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-sm text-muted-foreground">Completion</div>
                    </div>
                  </Grid>
                </div>
              </div>
            </Card>
          </motion.div>

          <Grid cols={4} gap={8} className="items-start">
            {/* Question Types Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Question Types</h3>
                
                <div className="space-y-3">
                  {builderData.questionTypes.map((type, index) => (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleAddQuestion(type.id)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 rounded-lg" style={{ backgroundColor: `${type.color}20`, color: type.color }}>
                          {type.icon}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{type.name}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* AI Suggestions */}
              {showAISuggestions && (
                <Card className="p-6 mt-6">
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
                    {builderData.aiSuggestions.map((suggestion, index) => (
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
            </motion.div>

            {/* Main Builder Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2 space-y-6"
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Questions</h2>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </div>
                </div>

                {builderData.questions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-4">
                      <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No questions yet. Start by adding a question type from the sidebar.</p>
                    </div>
                    <Button variant="outline">
                      Add Your First Question
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {builderData.questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg" style={{ 
                              backgroundColor: `${getQuestionTypeColor(question.type)}20`, 
                              color: getQuestionTypeColor(question.type) 
                            }}>
                              {getQuestionTypeIcon(question.type)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium">{question.title}</h4>
                                {question.required && (
                                  <StatusBadge status="error" size="xs">Required</StatusBadge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{question.question}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <GripVertical className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <span className="ml-2 font-medium">{question.category}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Weight:</span>
                            <span className="ml-2 font-medium">{question.weight}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Follow-up:</span>
                            <span className="ml-2 font-medium">{question.followUp.enabled ? 'Yes' : 'No'}</span>
                          </div>
                        </div>

                        {question.aiSuggestions.length > 0 && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 mb-2">AI Suggestions:</div>
                            <div className="space-y-1">
                              {question.aiSuggestions.slice(0, 2).map((suggestion, suggestionIndex) => (
                                <div key={suggestionIndex} className="text-xs text-blue-600">
                                  • {suggestion}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Settings Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Assessment Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Scoring Method</label>
                    <Select
                      options={[
                        { value: 'weighted', label: 'Weighted Average' },
                        { value: 'simple', label: 'Simple Average' },
                        { value: 'custom', label: 'Custom Formula' }
                      ]}
                      value="weighted"
                      size="sm"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Randomize Questions</span>
                    <Checkbox />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Show Progress Bar</span>
                    <Checkbox checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Allow Back Navigation</span>
                    <Checkbox checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Time Limit</span>
                    <Checkbox />
                  </div>
                </div>
              </Card>

              {/* Templates */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Templates</h3>
                
                <div className="space-y-3">
                  {builderData.templates.map((template, index) => (
                    <div key={template.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">{template.name}</h4>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{template.questions} questions</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Preview className="h-4 w-4 mr-2" />
                    Preview Assessment
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share for Review
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export Assessment
                  </Button>
                </div>
              </Card>

              {/* Help & Support */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Need Help?
                </h3>
                
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Need help building your assessment or using AI suggestions?
                  </p>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="sm">
                    <Video className="h-4 w-4 mr-2" />
                    Watch Tutorial
                  </Button>
                </div>
              </Card>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
