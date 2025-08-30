/**
 * OptimaliQ Assessment Teaser Page
 * Assessment preview with sample questions to drive conversions
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  Star,
  Shield,
  Lightbulb,
  Eye,
  Lock,
  Unlock,
  Gift,
  Sparkles,
  Brain,
  Rocket,
  Globe,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { RadioGroup } from '@/components/ui/form'

// Sample assessment data
const assessmentTeaser = {
  sampleQuestions: [
    {
      id: 1,
      category: 'Strategy',
      question: 'How clearly defined is your organization\'s mission and strategic direction?',
      options: [
        { value: '1', label: 'Not defined at all' },
        { value: '2', label: 'Somewhat defined' },
        { value: '3', label: 'Moderately defined' },
        { value: '4', label: 'Well defined' },
        { value: '5', label: 'Very clearly defined' }
      ],
      insight: 'Organizations with clearly defined missions are 3x more likely to achieve their growth goals.',
      locked: false
    },
    {
      id: 2,
      category: 'Operations',
      question: 'How would you rate your organization\'s operational efficiency?',
      options: [
        { value: '1', label: 'Very inefficient' },
        { value: '2', label: 'Somewhat inefficient' },
        { value: '3', label: 'Average efficiency' },
        { value: '4', label: 'Good efficiency' },
        { value: '5', label: 'Highly efficient' }
      ],
      insight: 'Operational efficiency improvements of 25-40% are typical with our recommendations.',
      locked: false
    },
    {
      id: 3,
      category: 'Team',
      question: 'How effective is communication within your organization?',
      options: [
        { value: '1', label: 'Poor communication' },
        { value: '2', label: 'Limited effectiveness' },
        { value: '3', label: 'Moderate effectiveness' },
        { value: '4', label: 'Good communication' },
        { value: '5', label: 'Excellent communication' }
      ],
      insight: 'Strong communication correlates with 45% higher employee satisfaction and retention.',
      locked: true
    },
    {
      id: 4,
      category: 'Growth',
      question: 'How confident are you in your organization\'s growth strategy?',
      options: [
        { value: '1', label: 'Not confident' },
        { value: '2', label: 'Somewhat confident' },
        { value: '3', label: 'Moderately confident' },
        { value: '4', label: 'Confident' },
        { value: '5', label: 'Very confident' }
      ],
      insight: 'Data-driven growth strategies show 2.5x better results than intuition-based approaches.',
      locked: true
    },
    {
      id: 5,
      category: 'Technology',
      question: 'How effectively does your organization leverage technology?',
      options: [
        { value: '1', label: 'Not leveraging' },
        { value: '2', label: 'Minimal use' },
        { value: '3', label: 'Basic adoption' },
        { value: '4', label: 'Good utilization' },
        { value: '5', label: 'Advanced integration' }
      ],
      insight: 'Technology optimization can improve overall organizational efficiency by up to 50%.',
      locked: true
    }
  ],
  benefits: [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your responses against industry benchmarks'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Personalized Insights',
      description: 'Customized recommendations based on your industry and organization size'
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Actionable Plans',
      description: '30-day action plans with specific steps and progress tracking'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Confidential',
      description: 'Enterprise-grade security protects your sensitive information'
    }
  ],
  stats: {
    organizations: '500+',
    assessments: '10,000+',
    avgImprovement: '45%',
    satisfaction: '96%'
  },
  testimonials: [
    {
      quote: 'The assessment immediately identified our biggest opportunities. We saw results within 30 days.',
      author: 'Jennifer Walsh',
      role: 'CEO, HealthForward',
      improvement: '40% efficiency gain'
    },
    {
      quote: 'OptimaliQ\'s insights helped us scale from 50 to 200 employees while maintaining our culture.',
      author: 'Marcus Thompson',
      role: 'Director, EduTech Solutions',
      improvement: '120% revenue growth'
    },
    {
      quote: 'The AI recommendations were spot-on. We implemented 8 out of 10 suggestions immediately.',
      author: 'Lisa Rodriguez',
      role: 'Executive Director, Community Impact',
      improvement: '180% impact increase'
    }
  ]
}

export default function AssessmentTeaserPage() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, string>>({})
  const [showInsight, setShowInsight] = React.useState<Record<number, boolean>>({})

  const question = assessmentTeaser.sampleQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / assessmentTeaser.sampleQuestions.length) * 100

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setShowInsight(prev => ({ ...prev, [questionId]: true }))
  }

  const handleNext = () => {
    if (currentQuestion < assessmentTeaser.sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getCategoryColor = (category: string) => {
    const colorMap = {
      Strategy: 'primary',
      Operations: 'success',
      Team: 'warning',
      Growth: 'info',
      Technology: 'purple'
    }
    return colorMap[category as keyof typeof colorMap] || 'primary'
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
            <StatusBadge status="success" size="sm">
              <Gift className="h-4 w-4 mr-1" />
              Free Preview
            </StatusBadge>
            <Button asChild>
              <Link href="/assessment">Start Full Assessment</Link>
            </Button>
          </div>
        </Container>
      </header>

      {/* Hero Section */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <StatusBadge status="primary" className="mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              Assessment Preview
            </StatusBadge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Experience the Power of{' '}
              <span className="text-primary">AI-Driven Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Try a sample of our comprehensive assessment to see how OptimaliQ can transform 
              your organization's performance and strategic planning.
            </p>

            {/* Stats */}
            <Grid cols={4} gap={6} className="max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{assessmentTeaser.stats.organizations}</div>
                <div className="text-sm text-muted-foreground">Organizations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{assessmentTeaser.stats.assessments}</div>
                <div className="text-sm text-muted-foreground">Assessments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{assessmentTeaser.stats.avgImprovement}</div>
                <div className="text-sm text-muted-foreground">Avg Improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{assessmentTeaser.stats.satisfaction}</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </Grid>
          </motion.div>
        </Container>
      </Section>

      {/* Sample Assessment */}
      <Section className="pb-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <Card className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Sample Assessment Questions</h2>
                <p className="text-muted-foreground mb-6">
                  Answer these sample questions to see how our AI provides personalized insights.
                </p>
                
                <Progress 
                  value={progress} 
                  showLabel 
                  labelPosition="top"
                  className="max-w-md mx-auto"
                />
              </div>

              <div className="max-w-2xl mx-auto">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <StatusBadge status={getCategoryColor(question.category) as any} size="sm">
                        {question.category}
                      </StatusBadge>
                      <span className="text-sm text-muted-foreground">
                        Question {currentQuestion + 1} of {assessmentTeaser.sampleQuestions.length}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
                    
                    {question.locked ? (
                      <div className="text-center py-8">
                        <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h4 className="font-semibold mb-2">Unlock Full Assessment</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          See all questions and get comprehensive insights with the full assessment.
                        </p>
                        <Button asChild>
                          <Link href="/assessment">
                            <Unlock className="h-4 w-4 mr-2" />
                            Start Full Assessment
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <RadioGroup
                          options={question.options}
                          value={answers[question.id]}
                          onValueChange={(value) => handleAnswer(question.id, value)}
                        />
                        
                        {showInsight[question.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                            className="mt-4"
                          >
                            <Alert
                              variant="info"
                              title="AI Insight"
                              description={question.insight}
                              icon={<Lightbulb className="h-4 w-4" />}
                            />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentQuestion < assessmentTeaser.sampleQuestions.length - 1 ? (
                    <Button
                      onClick={handleNext}
                      disabled={!answers[question.id] && !question.locked}
                    >
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button asChild>
                      <Link href="/assessment">
                        Start Full Assessment
                        <Play className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Benefits */}
      <Section className="pb-20 bg-muted/30">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Why Organizations Choose OptimaliQ</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See what makes our AI-powered assessments the preferred choice for organizational excellence.
            </p>
          </motion.div>

          <Grid cols={2} gap={8}>
            {assessmentTeaser.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Testimonials */}
      <Section className="py-20">
        <Container className="max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground">
              Real results from organizations that started with our assessment.
            </p>
          </motion.div>

          <Grid cols={1} gap={8}>
            {assessmentTeaser.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                    <div className="lg:col-span-2">
                      <div className="flex items-start space-x-4">
                        <Quote className="h-8 w-8 text-primary flex-shrink-0" />
                        <div>
                          <p className="text-lg mb-4">"{testimonial.quote}"</p>
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold">{testimonial.author}</div>
                              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {testimonial.improvement}
                      </div>
                      <div className="text-sm text-muted-foreground">Achieved with OptimaliQ</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20">
        <Container className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Card className="p-12 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <h2 className="text-3xl font-bold mb-6">Ready for Your Complete Assessment?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Get comprehensive insights, personalized recommendations, and a 30-day action plan 
                tailored specifically to your organization's needs.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground mb-8">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>15-20 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Completely secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="h-4 w-4 text-green-500" />
                  <span>100% free</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/assessment">
                    Start Complete Assessment
                    <Target className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/demo">
                    Schedule a Demo
                    <Calendar className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <Container className="py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">OptimaliQ</span>
            </div>
            
            <nav className="flex items-center space-x-6 mb-4 md:mb-0">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
            
            <div className="text-sm text-muted-foreground">
              © 2024 OptimaliQ. All rights reserved.
            </div>
          </div>
        </Container>
      </footer>
    </div>
  )
}
