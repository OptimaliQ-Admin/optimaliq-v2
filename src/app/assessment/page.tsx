/**
 * OptimaliQ Assessment Selection Page
 * AI-powered assessment selection with comprehensive configuration and personalization
 */

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Target, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Lightbulb, 
  Shield, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Award,
  Play,
  Settings,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Select, Checkbox } from '@/components/ui/form'
import { Progress } from '@/components/ui/data-display'

// Assessment Types Data
const assessmentTypes = [
  {
    id: 'strategic',
    title: 'Strategic Assessment',
    description: 'Comprehensive evaluation of your organization\'s strategy, vision, and competitive positioning.',
    duration: '15-20 minutes',
    questions: 25,
    category: 'Strategy',
    icon: <Target className="h-8 w-8" />,
    color: 'primary',
    features: [
      'Strategic vision analysis',
      'Competitive positioning',
      'Market opportunity assessment',
      'Resource allocation review',
      'Risk evaluation'
    ],
    benefits: [
      'Clear strategic direction',
      'Identified growth opportunities',
      'Resource optimization insights',
      'Risk mitigation strategies'
    ],
    popular: true
  },
  {
    id: 'operational',
    title: 'Operational Excellence',
    description: 'Evaluate your operational processes, efficiency, and performance optimization opportunities.',
    duration: '12-15 minutes',
    questions: 20,
    category: 'Operations',
    icon: <BarChart3 className="h-8 w-8" />,
    color: 'success',
    features: [
      'Process efficiency analysis',
      'Performance metrics review',
      'Technology utilization assessment',
      'Workflow optimization',
      'Quality management evaluation'
    ],
    benefits: [
      'Improved operational efficiency',
      'Cost reduction opportunities',
      'Technology optimization insights',
      'Quality improvement strategies'
    ],
    popular: false
  },
  {
    id: 'team',
    title: 'Team & Culture Assessment',
    description: 'Analyze your team dynamics, culture, leadership, and organizational health.',
    duration: '10-12 minutes',
    questions: 18,
    category: 'People',
    icon: <Users className="h-8 w-8" />,
    color: 'warning',
    features: [
      'Team dynamics analysis',
      'Culture assessment',
      'Leadership effectiveness',
      'Communication patterns',
      'Employee engagement'
    ],
    benefits: [
      'Enhanced team collaboration',
      'Improved organizational culture',
      'Leadership development insights',
      'Employee retention strategies'
    ],
    popular: false
  },
  {
    id: 'growth',
    title: 'Growth & Innovation',
    description: 'Evaluate your growth strategies, innovation capabilities, and market expansion potential.',
    duration: '15-18 minutes',
    questions: 22,
    category: 'Growth',
    icon: <TrendingUp className="h-8 w-8" />,
    color: 'info',
    features: [
      'Growth strategy evaluation',
      'Innovation capability assessment',
      'Market expansion analysis',
      'Product development review',
      'Customer acquisition strategies'
    ],
    benefits: [
      'Scalable growth strategies',
      'Innovation roadmap',
      'Market expansion opportunities',
      'Customer acquisition optimization'
    ],
    popular: false
  },
  {
    id: 'technology',
    title: 'Technology & Digital',
    description: 'Assess your technology infrastructure, digital transformation readiness, and tech optimization.',
    duration: '12-15 minutes',
    questions: 20,
    category: 'Technology',
    icon: <Zap className="h-8 w-8" />,
    color: 'purple',
    features: [
      'Technology infrastructure review',
      'Digital transformation readiness',
      'Data analytics capabilities',
      'Cybersecurity assessment',
      'Technology ROI analysis'
    ],
    benefits: [
      'Technology optimization roadmap',
      'Digital transformation strategy',
      'Data-driven decision making',
      'Enhanced cybersecurity posture'
    ],
    popular: false
  },
  {
    id: 'comprehensive',
    title: 'Comprehensive Assessment',
    description: 'Complete evaluation across all areas for a holistic view of your organization.',
    duration: '25-30 minutes',
    questions: 35,
    category: 'Full Assessment',
    icon: <Award className="h-8 w-8" />,
    color: 'error',
    features: [
      'All assessment areas covered',
      'Cross-functional analysis',
      'Integrated insights',
      'Comprehensive recommendations',
      'Priority action planning'
    ],
    benefits: [
      'Complete organizational view',
      'Integrated growth strategy',
      'Comprehensive action plan',
      'Priority-based recommendations'
    ],
    popular: false
  }
]

// Organization Sizes
const organizationSizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-1000', label: '201-1000 employees' },
  { value: '1000+', label: '1000+ employees' }
]

// Industries
const industries = [
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'environment', label: 'Environment' },
  { value: 'social_services', label: 'Social Services' },
  { value: 'arts_culture', label: 'Arts & Culture' },
  { value: 'youth_development', label: 'Youth Development' },
  { value: 'community_development', label: 'Community Development' },
  { value: 'international_aid', label: 'International Aid' },
  { value: 'research', label: 'Research' },
  { value: 'other', label: 'Other' }
]

export default function AssessmentSelectionPage() {
  const [selectedAssessment, setSelectedAssessment] = React.useState<string>('')
  const [organizationSize, setOrganizationSize] = React.useState<string>('')
  const [industry, setIndustry] = React.useState<string>('')
  const [includeTeamAssessment, setIncludeTeamAssessment] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const selectedAssessmentData = assessmentTypes.find(a => a.id === selectedAssessment)

  const handleStartAssessment = async () => {
    if (!selectedAssessment || !organizationSize || !industry) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to assessment with parameters
      const params = new URLSearchParams({
        type: selectedAssessment,
        size: organizationSize,
        industry: industry,
        team: includeTeamAssessment.toString()
      })
      
      window.location.href = `/assessment/questions?${params.toString()}`
    } catch (error) {
      console.error('Failed to start assessment', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-green-500/10 text-green-600 border-green-500/20',
      warning: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      info: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      error: 'bg-red-500/10 text-red-600 border-red-500/20'
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.primary
  }

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
            <span className="text-sm text-muted-foreground">Free Assessment</span>
            <StatusBadge status="success" size="sm">No Credit Card Required</StatusBadge>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-6xl">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-4">
              AI-Powered Assessment
            </StatusBadge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Choose Your Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Select the assessment that best fits your organization's needs. Our AI will personalize the questions based on your industry and size.
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-md mx-auto">
              <Progress 
                value={25} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Assessment Selection</span>
                <span>Questions</span>
                <span>Results</span>
                <span>Action Plan</span>
              </div>
            </div>
          </motion.div>

          <Grid cols={2} gap={12} className="items-start">
            {/* Assessment Types */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6">Assessment Types</h2>
                
                <Grid cols={1} gap={4}>
                  {assessmentTypes.map((assessment, index) => (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card 
                        className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          selectedAssessment === assessment.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedAssessment(assessment.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${getColorClasses(assessment.color)}`}>
                            {assessment.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">{assessment.title}</h3>
                              {assessment.popular && (
                                <StatusBadge status="primary" size="sm">Most Popular</StatusBadge>
                              )}
                            </div>
                            
                            <p className="text-muted-foreground mb-4">{assessment.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-4">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{assessment.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-4 w-4" />
                                <span>{assessment.questions} questions</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="h-4 w-4" />
                                <span>{assessment.category}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Key Features:</h4>
                              <div className="grid grid-cols-1 gap-1">
                                {assessment.features.slice(0, 3).map((feature, featureIndex) => (
                                  <div key={featureIndex} className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </Grid>
              </div>
            </motion.div>

            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="space-y-8">
                {/* Selected Assessment Details */}
                {selectedAssessmentData && (
                  <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${getColorClasses(selectedAssessmentData.color)}`}>
                        {selectedAssessmentData.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{selectedAssessmentData.title}</h3>
                        <p className="text-sm text-muted-foreground">{selectedAssessmentData.category}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">What you'll get:</h4>
                        <Stack spacing={2}>
                          {selectedAssessmentData.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </Stack>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Configuration Form */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Customize Your Assessment</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Organization Size
                      </label>
                      <Select
                        options={organizationSizes}
                        placeholder="Select your organization size"
                        value={organizationSize}
                        onValueChange={setOrganizationSize}
                        fullWidth
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Industry
                      </label>
                      <Select
                        options={industries}
                        placeholder="Select your industry"
                        value={industry}
                        onValueChange={setIndustry}
                        fullWidth
                      />
                    </div>

                    <div>
                      <Checkbox
                        id="team-assessment"
                        checked={includeTeamAssessment}
                        onCheckedChange={(checked) => setIncludeTeamAssessment(checked as boolean)}
                        label="Include team assessment questions"
                        description="Get additional insights about your team dynamics and culture"
                      />
                    </div>
                  </div>
                </Card>

                {/* Start Assessment Button */}
                <Button 
                  onClick={handleStartAssessment}
                  disabled={!selectedAssessment || !organizationSize || !industry}
                  className="w-full group"
                  size="lg"
                  loading={isLoading}
                  loadingText="Preparing assessment..."
                >
                  Start Assessment
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Trust Indicators */}
                <div className="space-y-4">
                  <Alert
                    variant="info"
                    title="Free & Secure"
                    description="This assessment is completely free. Your data is protected with enterprise-grade security."
                    icon={<Shield className="h-4 w-4" />}
                  />
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">15-30</div>
                      <div className="text-sm text-muted-foreground">Minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">Instant</div>
                      <div className="text-sm text-muted-foreground">Results</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Organizations</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
