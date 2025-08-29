/**
 * OptimaliQ Assessment Questions Page
 * AI-powered question flow with progress tracking and dynamic content
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Target, 
  BarChart3, 
  Users, 
  TrendingUp,
  Zap,
  Award,
  Lightbulb,
  Shield,
  Save,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { RadioGroup, Slider } from '@/components/ui/form'
import { Progress } from '@/components/ui/data-display'

// Sample Questions Data (in real app, this would come from AI)
const questions = [
  {
    id: 1,
    category: 'Strategy',
    question: 'How clearly defined is your organization\'s mission and vision?',
    type: 'scale',
    options: [
      { value: '1', label: 'Not defined at all' },
      { value: '2', label: 'Somewhat defined' },
      { value: '3', label: 'Moderately defined' },
      { value: '4', label: 'Well defined' },
      { value: '5', label: 'Very clearly defined' }
    ],
    followUp: 'What specific challenges do you face in communicating your mission to stakeholders?'
  },
  {
    id: 2,
    category: 'Operations',
    question: 'How would you rate your organization\'s operational efficiency?',
    type: 'scale',
    options: [
      { value: '1', label: 'Very inefficient' },
      { value: '2', label: 'Somewhat inefficient' },
      { value: '3', label: 'Average efficiency' },
      { value: '4', label: 'Good efficiency' },
      { value: '5', label: 'Highly efficient' }
    ],
    followUp: 'Which operational areas do you believe need the most improvement?'
  },
  {
    id: 3,
    category: 'Team',
    question: 'How would you describe your team\'s collaboration and communication?',
    type: 'scale',
    options: [
      { value: '1', label: 'Poor communication' },
      { value: '2', label: 'Limited collaboration' },
      { value: '3', label: 'Moderate collaboration' },
      { value: '4', label: 'Good collaboration' },
      { value: '5', label: 'Excellent collaboration' }
    ],
    followUp: 'What communication tools and processes do you currently use?'
  },
  {
    id: 4,
    category: 'Growth',
    question: 'How confident are you in your organization\'s growth strategy?',
    type: 'scale',
    options: [
      { value: '1', label: 'Not confident at all' },
      { value: '2', label: 'Somewhat confident' },
      { value: '3', label: 'Moderately confident' },
      { value: '4', label: 'Confident' },
      { value: '5', label: 'Very confident' }
    ],
    followUp: 'What are your primary growth objectives for the next 12 months?'
  },
  {
    id: 5,
    category: 'Technology',
    question: 'How effectively does your organization leverage technology?',
    type: 'scale',
    options: [
      { value: '1', label: 'Not leveraging technology' },
      { value: '2', label: 'Minimal technology use' },
      { value: '3', label: 'Basic technology adoption' },
      { value: '4', label: 'Good technology utilization' },
      { value: '5', label: 'Advanced technology integration' }
    ],
    followUp: 'What technology investments are you planning in the next year?'
  }
]

// Category Icons
const categoryIcons = {
  Strategy: <Target className="h-5 w-5" />,
  Operations: <BarChart3 className="h-5 w-5" />,
  Team: <Users className="h-5 w-5" />,
  Growth: <TrendingUp className="h-5 w-5" />,
  Technology: <Zap className="h-5 w-5" />
}

export default function AssessmentQuestionsPage() {
  const searchParams = useSearchParams()
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, any>>({})
  const [confidence, setConfidence] = React.useState<Record<number, number>>({})
  const [isLoading, setIsLoading] = React.useState(false)
  const [timeSpent, setTimeSpent] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  // Get assessment parameters
  const assessmentType = searchParams.get('type') || 'strategic'
  const organizationSize = searchParams.get('size') || ''
  const industry = searchParams.get('industry') || ''
  const includeTeam = searchParams.get('team') === 'true'

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Timer effect
  React.useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setTimeSpent(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleConfidence = (questionId: number, value: number) => {
    setConfidence(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    if (isLastQuestion) {
      await handleComplete()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call to submit assessment
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Navigate to results page
      const params = new URLSearchParams({
        type: assessmentType,
        size: organizationSize,
        industry: industry,
        team: includeTeam.toString(),
        time: timeSpent.toString(),
        answers: JSON.stringify(answers),
        confidence: JSON.stringify(confidence)
      })
      
      window.location.href = `/assessment/results?${params.toString()}`
    } catch (error) {
      console.error('Failed to complete assessment', error)
    } finally {
      setIsLoading(false)
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-6 w-px bg-border" />
            <span className="text-sm font-medium">Assessment in Progress</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeSpent)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-12">
        <Container className="max-w-4xl">
          {/* Progress Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Assessment Questions</h1>
                <p className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              <StatusBadge status={getCategoryColor(currentQuestion.category) as any} size="sm">
                {currentQuestion.category}
              </StatusBadge>
            </div>
            
            <Progress 
              value={progress} 
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
          </motion.div>

          <Grid cols={3} gap={8} className="items-start">
            {/* Question Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="col-span-2"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-8">
                    {/* Question Header */}
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-2 rounded-lg bg-${getCategoryColor(currentQuestion.category)}/10 text-${getCategoryColor(currentQuestion.category)}`}>
                        {categoryIcons[currentQuestion.category as keyof typeof categoryIcons]}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{currentQuestion.question}</h2>
                        <p className="text-sm text-muted-foreground">{currentQuestion.category} Assessment</p>
                      </div>
                    </div>

                    {/* Answer Options */}
                    <div className="space-y-6">
                      <RadioGroup
                        options={currentQuestion.options}
                        value={answers[currentQuestion.id]?.value}
                        onValueChange={(value) => handleAnswer(currentQuestion.id, { value, confidence: confidence[currentQuestion.id] || 3 })}
                      />

                      {/* Confidence Slider */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">How confident are you in this answer?</label>
                          <span className="text-sm text-muted-foreground">
                            {confidence[currentQuestion.id] || 3}/5
                          </span>
                        </div>
                        <Slider
                          value={[confidence[currentQuestion.id] || 3]}
                          onValueChange={(value) => handleConfidence(currentQuestion.id, value[0])}
                          min={1}
                          max={5}
                          step={1}
                          showValue={false}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Not confident</span>
                          <span>Very confident</span>
                        </div>
                      </div>

                      {/* Follow-up Question */}
                      {answers[currentQuestion.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          transition={{ duration: 0.3 }}
                          className="space-y-3"
                        >
                          <h4 className="font-medium text-sm">{currentQuestion.followUp}</h4>
                          <textarea
                            className="w-full p-3 border rounded-lg resize-none"
                            rows={3}
                            placeholder="Share your thoughts..."
                            value={answers[currentQuestion.id]?.followUp || ''}
                            onChange={(e) => handleAnswer(currentQuestion.id, { 
                              ...answers[currentQuestion.id], 
                              followUp: e.target.value 
                            })}
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      <Button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        loading={isLoading}
                        loadingText={isLastQuestion ? "Completing..." : "Next"}
                        className="group"
                      >
                        {isLastQuestion ? (
                          <>
                            Complete Assessment
                            <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                          </>
                        ) : (
                          <>
                            Next Question
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-6">
                {/* Assessment Info */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Assessment Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{assessmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="font-medium">{organizationSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Industry:</span>
                      <span className="font-medium capitalize">{industry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Team Questions:</span>
                      <span className="font-medium">{includeTeam ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </Card>

                {/* Progress Summary */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Questions Completed:</span>
                      <span className="font-medium">{Object.keys(answers).length}/{questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Time Spent:</span>
                      <span className="font-medium">{formatTime(timeSpent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Time Left:</span>
                      <span className="font-medium">
                        {formatTime(Math.max(0, (questions.length - Object.keys(answers).length) * 60))}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Tips */}
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Tips
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>• Answer honestly - this helps us provide better insights</p>
                    <p>• Take your time to think through each question</p>
                    <p>• Your answers are confidential and secure</p>
                    <p>• You can pause and resume at any time</p>
                  </div>
                </Card>

                {/* Save Progress */}
                <Button variant="outline" className="w-full" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </motion.div>
          </Grid>
        </Container>
      </Section>
    </div>
  )
}
