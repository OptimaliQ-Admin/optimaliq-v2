/**
 * OptimaliQ Intelligent Assessment Engine
 * AI-powered adaptive questioning and intelligent scoring
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, Target, BarChart3, TrendingUp, Sparkles, ArrowRight,
  CheckCircle, Clock, HelpCircle, Settings, Zap, Bell,
  ChevronDown, ChevronUp, Loader2, Smile, ThumbsUp,
  ThumbsDown, RefreshCw, Volume2, VolumeX, Mic, MicOff,
  Lightbulb, Award, Star, Rocket, Gauge, Activity, PieChart,
  LineChart, AreaChart, Target as TargetIcon, CheckSquare,
  Clock as ClockIcon, Calendar as CalendarIcon, User, Building,
  Pause
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container, Section, Grid, Flex, Stack } from '@/components/ui/layout'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/data-display'
import { Select } from '@/components/ui/form'

// Assessment question types
interface AssessmentQuestion {
  id: string
  type: 'multiple_choice' | 'rating' | 'text' | 'adaptive'
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  aiScore?: number
  confidence?: number
  followUpQuestions?: string[]
  context?: any
}

// AI analysis data
interface AIAnalysis {
  competency: string
  score: number
  confidence: number
  insights: string[]
  recommendations: string[]
  nextQuestions: string[]
}

// Intelligent assessment data
const intelligentAssessmentData = {
  currentQuestion: {
    id: '1',
    type: 'adaptive',
    question: 'How would you rate your organization\'s ability to adapt to market changes?',
    category: 'Adaptability',
    difficulty: 'medium',
    aiScore: 0.75,
    confidence: 0.82
  },
  progress: {
    current: 5,
    total: 12,
    percentage: 42,
    timeRemaining: '8:30'
  },
  aiAnalysis: {
    competencies: [
      {
        name: 'Strategic Planning',
        score: 78,
        confidence: 0.85,
        trend: 'up',
        insights: ['Strong long-term vision', 'Clear goal setting process'],
        recommendations: ['Focus on execution', 'Improve measurement systems']
      },
      {
        name: 'Team Collaboration',
        score: 65,
        confidence: 0.72,
        trend: 'down',
        insights: ['Communication gaps identified', 'Cross-functional challenges'],
        recommendations: ['Implement collaboration tools', 'Enhance team training']
      },
      {
        name: 'Innovation',
        score: 82,
        confidence: 0.91,
        trend: 'up',
        insights: ['Creative problem-solving', 'Open to new ideas'],
        recommendations: ['Scale innovation processes', 'Invest in R&D']
      }
    ],
    adaptiveQuestions: [
      'What specific challenges do you face in team communication?',
      'How do you measure the success of your strategic initiatives?',
      'What processes do you have for capturing and implementing new ideas?'
    ]
  },
  confidenceLevels: [
    { level: 'High', count: 8, percentage: 67 },
    { level: 'Medium', count: 3, percentage: 25 },
    { level: 'Low', count: 1, percentage: 8 }
  ]
}

export default function IntelligentAssessmentPage() {
  const [currentAnswer, setCurrentAnswer] = React.useState('')
  const [confidence, setConfidence] = React.useState(3)
  const [showAIInsights, setShowAIInsights] = React.useState(true)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)

  const handleAnswerSubmit = () => {
    if (!currentAnswer.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      // Update progress and move to next question
    }, 2000)
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />
    }
  }

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
            <span className="text-sm text-muted-foreground">AI Assessment</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="text-green-600 bg-green-100">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </header>

      <Section className="py-8">
        <Container>
          <div className="max-w-6xl mx-auto">
            {/* Progress Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Intelligent Assessment</h1>
                  <p className="text-muted-foreground">
                    AI-powered adaptive questioning for deeper insights
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Time Remaining</p>
                    <p className="text-lg font-bold text-primary">
                      {intelligentAssessmentData.progress.timeRemaining}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    Question {intelligentAssessmentData.progress.current} of {intelligentAssessmentData.progress.total}
                  </span>
                </div>
                <Progress value={intelligentAssessmentData.progress.percentage} className="h-3" />
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-8">
              {/* Main Assessment Area */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-2"
              >
                <Card className="p-6">
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">Adaptive Question</h2>
                        <p className="text-sm text-muted-foreground">
                          Category: {intelligentAssessmentData.currentQuestion.category}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-blue-600 bg-blue-100">
                        AI Confidence: {Math.round(intelligentAssessmentData.currentQuestion.confidence * 100)}%
                      </Badge>
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="mb-6">
                    <h3 className="text-xl font-medium mb-4">
                      {intelligentAssessmentData.currentQuestion.question}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Answer</label>
                        <textarea
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder="Provide your detailed response..."
                          className="w-full p-3 border rounded-lg resize-none"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">Confidence Level</label>
                        <div className="flex items-center space-x-4">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() => setConfidence(level)}
                              className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                                confidence === level
                                  ? 'border-primary bg-primary/10 text-primary'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                            >
                              <span className="text-sm font-medium">{level}</span>
                              <span className="text-xs text-muted-foreground">
                                {level === 1 ? 'Very Low' : 
                                 level === 2 ? 'Low' : 
                                 level === 3 ? 'Medium' : 
                                 level === 4 ? 'High' : 'Very High'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Need Help?
                    </Button>
                    <div className="flex items-center space-x-3">
                      <Button variant="outline">
                        <Clock className="h-4 w-4 mr-2" />
                        Save Progress
                      </Button>
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={!currentAnswer.trim() || isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Submit & Continue
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* AI Insights Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-6">
                  {/* AI Analysis */}
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">AI Analysis</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAIInsights(!showAIInsights)}
                      >
                        {showAIInsights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </div>

                    {showAIInsights && (
                      <div className="space-y-4">
                        {intelligentAssessmentData.aiAnalysis.competencies.map((competency, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-sm">{competency.name}</h4>
                              <div className="flex items-center space-x-1">
                                {getTrendIcon(competency.trend)}
                                <span className="text-sm font-bold">{competency.score}</span>
                              </div>
                            </div>
                            <Progress value={competency.score} className="h-2 mb-2" />
                            <div className="text-xs text-muted-foreground">
                              Confidence: {Math.round(competency.confidence * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Next Questions */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Adaptive Questions</h3>
                    <div className="space-y-3">
                      {intelligentAssessmentData.aiAnalysis.adaptiveQuestions.map((question, index) => (
                        <div key={index} className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm font-medium mb-2">Question {index + 1}</p>
                          <p className="text-xs text-muted-foreground">{question}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Confidence Distribution */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Confidence Distribution</h3>
                    <div className="space-y-3">
                      {intelligentAssessmentData.confidenceLevels.map((level, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={getConfidenceColor(level.level)}>
                              {level.level}
                            </Badge>
                            <span className="text-sm">{level.count} questions</span>
                          </div>
                          <span className="text-sm font-medium">{level.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Get AI Insights
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Progress
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="h-4 w-4 mr-2" />
                        Assessment Settings
                      </Button>
                    </div>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
