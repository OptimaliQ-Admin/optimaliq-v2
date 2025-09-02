/**
 * OptimaliQ Assessment Progress Tracking Page
 * Dedicated progress tracking with detailed analytics and insights
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Clock, 
  CheckCircle, 
  Target, 
  BarChart3, 
  TrendingUp,
  Zap,
  Award,
  Lightbulb,
  Shield,
  Save,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Timer,
  Activity,
  PieChart,
  LineChart,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { StatusBadge } from '@/components/ui/data-display'
import { Alert } from '@/components/ui/feedback'
import { Progress } from '@/components/ui/data-display'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

interface ProgressData {
  totalQuestions: number
  completedQuestions: number
  currentCategory: string
  timeSpent: number
  estimatedTimeRemaining: number
  categoryProgress: {
    name: string
    completed: number
    total: number
    percentage: number
  }[]
  timeHistory: {
    timestamp: string
    questionsCompleted: number
  }[]
  performanceMetrics: {
    averageTimePerQuestion: number
    accuracy: number
    confidence: number
  }
}

export default function AssessmentProgressPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const assessmentId = searchParams.get('id')
  
  const [progressData, setProgressData] = useState<ProgressData>({
    totalQuestions: 25,
    completedQuestions: 12,
    currentCategory: 'Strategy',
    timeSpent: 1800, // 30 minutes in seconds
    estimatedTimeRemaining: 1200, // 20 minutes in seconds
    categoryProgress: [
      { name: 'Strategy', completed: 5, total: 5, percentage: 100 },
      { name: 'Operations', completed: 3, total: 5, percentage: 60 },
      { name: 'Team', completed: 2, total: 5, percentage: 40 },
      { name: 'Growth', completed: 1, total: 5, percentage: 20 },
      { name: 'Technology', completed: 1, total: 5, percentage: 20 }
    ],
    timeHistory: [
      { timestamp: '09:00', questionsCompleted: 0 },
      { timestamp: '09:05', questionsCompleted: 2 },
      { timestamp: '09:10', questionsCompleted: 5 },
      { timestamp: '09:15', questionsCompleted: 8 },
      { timestamp: '09:20', questionsCompleted: 10 },
      { timestamp: '09:25', questionsCompleted: 12 }
    ],
    performanceMetrics: {
      averageTimePerQuestion: 150, // 2.5 minutes
      accuracy: 85,
      confidence: 78
    }
  })

  const [isPaused, setIsPaused] = useState(false)
  const [showInsights, setShowInsights] = useState(false)

  // Format time in MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate overall progress percentage
  const overallProgress = (progressData.completedQuestions / progressData.totalQuestions) * 100

  // Get category colors for charts
  const categoryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const handleContinue = () => {
    router.push(`/assessment/questions?id=${assessmentId}`)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleSave = () => {
    // Save progress to backend
    console.log('Saving progress...')
  }

  return (
    <Container size="lg" className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Section className="mb-8">
          <Flex direction="col" gap="lg" align="center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Target className="w-16 h-16 text-primary" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Assessment Progress
              </h1>
              <p className="text-lg text-gray-600">
                Track your progress and performance insights
              </p>
            </div>
          </Flex>
        </Section>

        {/* Progress Overview */}
        <Section className="mb-8">
          <Grid cols={3} gap="lg">
            {/* Overall Progress */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <Flex direction="col" gap="md" align="center">
                <div className="relative">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - overallProgress / 100)}`}
                      className="text-primary transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.round(overallProgress)}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Overall Progress</h3>
                  <p className="text-sm text-gray-600">
                    {progressData.completedQuestions} of {progressData.totalQuestions} questions
                  </p>
                </div>
              </Flex>
            </Card>

            {/* Time Tracking */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <Flex direction="col" gap="md" align="center">
                <Clock className="w-12 h-12 text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Time Spent</h3>
                  <p className="text-2xl font-bold text-primary">
                    {formatTime(progressData.timeSpent)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Est. remaining: {formatTime(progressData.estimatedTimeRemaining)}
                  </p>
                </div>
              </Flex>
            </Card>

            {/* Current Category */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
              <Flex direction="col" gap="md" align="center">
                <BarChart3 className="w-12 h-12 text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Current Category</h3>
                  <p className="text-xl font-bold text-primary">
                    {progressData.currentCategory}
                  </p>
                  <StatusBadge variant="primary" size="sm">
                    In Progress
                  </StatusBadge>
                </div>
              </Flex>
            </Card>
          </Grid>
        </Section>

        {/* Category Progress */}
        <Section className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Progress</h2>
            <Grid cols={2} gap="lg">
              {/* Progress Bars */}
              <div className="space-y-4">
                {progressData.categoryProgress.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <Flex justify="between" align="center">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className="text-sm text-gray-600">
                        {category.completed}/{category.total}
                      </span>
                    </Flex>
                    <Progress 
                      value={category.percentage} 
                      variant="primary"
                      className="h-2"
                    />
                  </div>
                ))}
              </div>

              {/* Pie Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={progressData.categoryProgress}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="completed"
                    >
                      {progressData.categoryProgress.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </Grid>
          </Card>
        </Section>

        {/* Performance Metrics */}
        <Section className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Insights</h2>
            <Grid cols={3} gap="lg">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Avg. Time/Question</h3>
                <p className="text-2xl font-bold text-primary">
                  {Math.round(progressData.performanceMetrics.averageTimePerQuestion / 60)}m
                </p>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Accuracy</h3>
                <p className="text-2xl font-bold text-primary">
                  {progressData.performanceMetrics.accuracy}%
                </p>
              </div>
              <div className="text-center">
                <Lightbulb className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">Confidence</h3>
                <p className="text-2xl font-bold text-primary">
                  {progressData.performanceMetrics.confidence}%
                </p>
              </div>
            </Grid>
          </Card>
        </Section>

        {/* Time History Chart */}
        <Section className="mb-8">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Progress Timeline</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={progressData.timeHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="questionsCompleted" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Section>

        {/* Action Buttons */}
        <Section>
          <Flex gap="md" justify="center" wrap="wrap">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePause}
              className="flex items-center gap-2"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Progress
            </Button>
            
            <Button
              variant="primary"
              size="lg"
              onClick={handleContinue}
              className="flex items-center gap-2"
            >
              Continue Assessment
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Flex>
        </Section>

        {/* Insights Alert */}
        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-6"
            >
              <Alert variant="info" className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Performance Insight</h4>
                  <p className="text-sm">
                    You're performing above average! Your accuracy of {progressData.performanceMetrics.accuracy}% 
                    is in the top 25% of users. Consider taking short breaks between categories to maintain focus.
                  </p>
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Container>
  )
}
