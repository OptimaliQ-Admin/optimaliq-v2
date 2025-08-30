/**
 * OptimaliQ Onboarding Flow Page
 * Guided onboarding experience with feature introduction and initial setup
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Target,
  Users,
  BarChart3,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Play,
  Award,
  Settings,
  Bell,
  Calendar,
  FileText,
  Video,
  BookOpen,
  MessageSquare,
  Shield,
  Clock,
  Star,
  Rocket,
  Compass,
  Map,
  Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { Checkbox } from '@/components/ui/form'

// Onboarding data
const onboardingData = {
  steps: [
    {
      id: 'welcome',
      title: 'Welcome to OptimaliQ',
      subtitle: 'Your AI-powered business intelligence platform',
      description: 'Get ready to transform your organization with data-driven insights and strategic guidance.',
      icon: <Rocket className="h-12 w-12" />,
      features: [
        'AI-powered assessments and insights',
        'Personalized growth recommendations',
        'Team collaboration tools',
        'Progress tracking and analytics'
      ]
    },
    {
      id: 'assessment',
      title: 'Start with an Assessment',
      subtitle: 'Understand your current state',
      description: 'Our AI-powered assessments provide a comprehensive view of your organization\'s strengths and opportunities.',
      icon: <Target className="h-12 w-12" />,
      features: [
        'Choose from 6 specialized assessment types',
        'Industry-specific questions and benchmarks',
        'Confidence ratings for answer quality',
        'Immediate insights and recommendations'
      ],
      demo: {
        title: 'Assessment Preview',
        questions: [
          'How clearly defined is your organization\'s strategic vision?',
          'How would you rate your operational efficiency?',
          'How effective is your team collaboration?'
        ]
      }
    },
    {
      id: 'insights',
      title: 'Get AI-Powered Insights',
      subtitle: 'Discover opportunities for growth',
      description: 'Our AI analyzes your responses against industry benchmarks to provide personalized recommendations.',
      icon: <Lightbulb className="h-12 w-12" />,
      features: [
        'Industry benchmark comparisons',
        'Personalized improvement recommendations',
        'Risk analysis and mitigation strategies',
        'Priority-based action planning'
      ],
      demo: {
        title: 'Sample Insights',
        insights: [
          'Your strategic clarity scores 15% above industry average',
          'Technology modernization could improve efficiency by 25%',
          'Team collaboration is a key organizational strength'
        ]
      }
    },
    {
      id: 'action-plan',
      title: 'Create Your Action Plan',
      subtitle: 'Turn insights into results',
      description: 'Transform insights into actionable 30-day plans with progress tracking and team collaboration.',
      icon: <Map className="h-12 w-12" />,
      features: [
        '30-day strategic action plans',
        'Task assignment and progress tracking',
        'Milestone monitoring and celebrations',
        'Automated follow-up reminders'
      ],
      demo: {
        title: 'Action Plan Preview',
        actions: [
          'Conduct technology infrastructure audit (Week 1)',
          'Implement process optimization initiatives (Week 2-3)',
          'Deploy team collaboration tools (Week 4)'
        ]
      }
    },
    {
      id: 'team',
      title: 'Collaborate with Your Team',
      subtitle: 'Scale your impact',
      description: 'Invite team members, assign assessments, and collaborate on growth initiatives together.',
      icon: <Users className="h-12 w-12" />,
      features: [
        'Team member invitations and management',
        'Collaborative assessment campaigns',
        'Shared dashboards and insights',
        'Team performance analytics'
      ],
      demo: {
        title: 'Team Features',
        capabilities: [
          'Invite unlimited team members',
          'Assign assessments via email links',
          'Compare team perspectives and alignment',
          'Track collective progress and achievements'
        ]
      }
    },
    {
      id: 'ready',
      title: 'You\'re All Set!',
      subtitle: 'Ready to transform your organization',
      description: 'Your OptimaliQ workspace is ready. Start your journey toward organizational excellence.',
      icon: <Flag className="h-12 w-12" />,
      features: [
        'Complete access to all OptimaliQ features',
        'Personalized dashboard and analytics',
        'Ongoing support and guidance',
        'Continuous improvement tracking'
      ]
    }
  ],
  quickStart: [
    {
      title: 'Take Your First Assessment',
      description: 'Complete a 15-20 minute assessment to get baseline insights',
      icon: <Target className="h-6 w-6" />,
      action: 'Start Assessment',
      href: '/assessment'
    },
    {
      title: 'Explore Your Dashboard',
      description: 'View your personalized analytics and progress tracking',
      icon: <BarChart3 className="h-6 w-6" />,
      action: 'View Dashboard',
      href: '/dashboard'
    },
    {
      title: 'Invite Your Team',
      description: 'Add team members and start collaborative assessments',
      icon: <Users className="h-6 w-6" />,
      action: 'Manage Team',
      href: '/team'
    },
    {
      title: 'Schedule a Demo',
      description: 'Get personalized guidance from our experts',
      icon: <Video className="h-6 w-6" />,
      action: 'Book Demo',
      href: '/demo'
    }
  ]
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const currentStepData = onboardingData.steps[currentStep]
  const isLastStep = currentStep === onboardingData.steps.length - 1

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
    
    if (currentStep < onboardingData.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to mark onboarding complete
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to dashboard
      window.location.href = '/dashboard?onboarding=complete'
    } catch (error) {
      console.error('Failed to complete onboarding', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepProgress = () => {
    return ((currentStep + 1) / onboardingData.steps.length) * 100
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
            <StatusBadge status="primary" size="sm">
              <Compass className="h-4 w-4 mr-1" />
              Onboarding
            </StatusBadge>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">Skip to Dashboard</Link>
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-20">
        <Container className="max-w-6xl">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-6">Welcome to OptimaliQ!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Let's get you set up for success with a quick tour of our platform.
            </p>
            
            <div className="max-w-2xl mx-auto">
              <Progress 
                value={getStepProgress()} 
                showLabel 
                labelPosition="top"
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {currentStep + 1} of {onboardingData.steps.length}</span>
                <span>{Math.round(getStepProgress())}% Complete</span>
              </div>
            </div>
          </motion.div>

          <Grid cols={4} gap={8} className="items-start">
            {/* Step Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold mb-4">Onboarding Steps</h3>
                <div className="space-y-3">
                  {onboardingData.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer ${
                        index === currentStep 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : completedSteps.includes(index)
                            ? 'bg-green-500/10 text-green-600' 
                            : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        index === currentStep 
                          ? 'bg-primary text-primary-foreground' 
                          : completedSteps.includes(index)
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted'
                      }`}>
                        {completedSteps.includes(index) ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs opacity-75">{step.subtitle}</div>
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8 lg:p-12">
                    <div className="text-center mb-8">
                      <div className="p-4 bg-primary/10 text-primary rounded-lg inline-flex mb-6">
                        {currentStepData.icon}
                      </div>
                      <h2 className="text-3xl font-bold mb-3">{currentStepData.title}</h2>
                      <p className="text-xl text-muted-foreground mb-6">{currentStepData.description}</p>
                    </div>

                    {/* Features List */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Key Features:</h3>
                      <Grid cols={1} gap={3}>
                        {currentStepData.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex items-center space-x-3"
                          >
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </Grid>
                    </div>

                    {/* Demo Content */}
                    {currentStepData.demo && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">{currentStepData.demo.title}</h3>
                        <Card className="p-6 bg-muted/30">
                          {currentStepData.demo.questions && (
                            <div className="space-y-3">
                              {currentStepData.demo.questions.map((question, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                    {index + 1}
                                  </div>
                                  <span className="text-sm">{question}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {currentStepData.demo.insights && (
                            <div className="space-y-3">
                              {currentStepData.demo.insights.map((insight, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{insight}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {currentStepData.demo.actions && (
                            <div className="space-y-3">
                              {currentStepData.demo.actions.map((action, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <Calendar className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{action}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {currentStepData.demo.capabilities && (
                            <div className="space-y-3">
                              {currentStepData.demo.capabilities.map((capability, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                  <Users className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                  <span className="text-sm">{capability}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card>
                      </div>
                    )}

                    {/* Last Step - Quick Start Options */}
                    {currentStep === onboardingData.steps.length - 1 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Quick Start Options</h3>
                        <Grid cols={2} gap={4}>
                          {onboardingData.quickStart.map((option, index) => (
                            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                                  {option.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium mb-2">{option.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                                  <Button size="sm" variant="outline" asChild>
                                    <Link href={option.href}>
                                      {option.action}
                                      <ArrowRight className="ml-2 h-3 w-3" />
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </Grid>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      {isLastStep ? (
                        <Button
                          onClick={handleComplete}
                          loading={isLoading}
                          loadingText="Setting up your workspace..."
                          className="group"
                        >
                          Complete Setup
                          <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      ) : (
                        <Button onClick={handleNext} className="group">
                          Next Step
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </Grid>
        </Container>
      </Section>

      {/* Help Section */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Need Help Getting Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Our support team is here to help you make the most of OptimaliQ from day one.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/demo">
                      <Video className="h-4 w-4 mr-2" />
                      Schedule Demo
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/faq">
                      <BookOpen className="h-4 w-4 mr-2" />
                      View FAQ
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </div>
  )
}
