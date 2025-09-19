'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp as ChartLine, 
  Shield, 
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Target,
  Users,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

// Question data matching GMF structure
const questions = [
  {
    id: 'challenges',
    question: 'What are your biggest growth challenges right now?',
    type: 'multiple',
    options: [
      'Finding new customers',
      'Scaling operations efficiently',
      'Managing cash flow',
      'Hiring the right talent',
      'Keeping up with competition',
      'Technology limitations',
      'Market saturation',
      'Customer retention'
    ],
    category: 'strategy'
  },
  {
    id: 'strategy',
    question: 'How would you describe your current growth strategy?',
    type: 'single',
    options: [
      'We have a clear, documented strategy',
      'We have a general direction but need more structure',
      'We\'re mostly reactive to opportunities',
      'We\'re still figuring out our approach',
      'We have multiple strategies but they\'re not aligned'
    ],
    category: 'strategy'
  },
  {
    id: 'process',
    question: 'How well-defined are your growth processes?',
    type: 'single',
    options: [
      'Highly documented and optimized',
      'Well-documented with room for improvement',
      'Somewhat documented but inconsistent',
      'Minimally documented, mostly informal',
      'Not documented at all'
    ],
    category: 'process'
  },
  {
    id: 'customers',
    question: 'How well do you understand your target customers?',
    type: 'single',
    options: [
      'Very well - detailed personas and data',
      'Well - good understanding of needs',
      'Moderately - some insights but gaps exist',
      'Minimally - basic understanding',
      'Not well - unclear target market'
    ],
    category: 'customers'
  },
  {
    id: 'technology',
    question: 'How would you rate your technology stack for growth?',
    type: 'single',
    options: [
      'Excellent - modern, scalable, integrated',
      'Good - solid foundation with some gaps',
      'Average - works but needs optimization',
      'Below average - outdated or fragmented',
      'Poor - major technology constraints'
    ],
    category: 'technology'
  }
]

// ProgressIndicator component
function ProgressIndicator({ currentStep, totalSteps, className = "" }: {
  currentStep: number
  totalSteps: number
  className?: string
}) {
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Question {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
    </div>
  )
}

// QuestionCard component
function QuestionCard({ 
  question, 
  type, 
  options, 
  value, 
  onChange, 
  onNext, 
  onPrevious, 
  isFirst, 
  isLast, 
  isLoading 
}: {
  question: string
  type: 'single' | 'multiple'
  options: string[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  onNext: () => void
  onPrevious: () => void
  isFirst: boolean
  isLast: boolean
  isLoading: boolean
}) {
  const handleSingleChange = (selectedValue: string) => {
    onChange(selectedValue)
  }

  const handleMultipleChange = (option: string) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValues = currentValues.includes(option)
      ? currentValues.filter(v => v !== option)
      : [...currentValues, option]
    onChange(newValues)
  }

  const canProceed = type === 'single' 
    ? value && value !== ''
    : Array.isArray(value) && value.length > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-white/80 backdrop-blur-sm shadow-xl border border-white/20">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {question}
          </CardTitle>
          <p className="text-gray-600">
            {type === 'multiple' 
              ? 'Select all that apply' 
              : 'Choose the option that best describes your situation'
            }
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {type === 'single' ? (
            <RadioGroup
              value={value as string}
              onValueChange={handleSingleChange}
              className="space-y-4"
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-4">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    id={`option-${index}`}
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={() => handleMultipleChange(option)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={isFirst}
              className="px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={onNext}
              disabled={!canProceed || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : isLast ? (
                <>
                  Complete Assessment
                  <CheckCircle className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Main component
export default function GrowthAssessmentStep2() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [isLoading, setIsLoading] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isFirst = currentQuestionIndex === 0
  const isLast = currentQuestionIndex === questions.length - 1

  const handleResponseChange = (value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = async () => {
    if (isLast) {
      await handleComplete()
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('u_id')
      if (!userId) {
        toast.error('Session expired. Please start again.')
        router.push('/growth-assessment')
        return
      }

      // Save assessment responses
      const payload = {
        u_id: userId,
        responses: responses,
        submittedat: new Date().toISOString(),
      }

      const response = await fetch('/api/growth-assessment/save-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        toast.error('Failed to save your responses.')
        return
      }

      // Navigate to results
      router.push('/growth-assessment/step3')
      
    } catch (error) {
      console.error('Error completing assessment:', error)
      toast.error('Unexpected error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
          >
            <ChartLine className="text-sm" />
            <span>Step 2 of 2 – Business Profile</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Shield className="text-white text-2xl" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Build Your Growth Roadmap
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-4"
          >
            Answer a few quick questions to receive custom insights on how to scale your business effectively.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-6 text-sm text-gray-500"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Personalized recommendations</span>
            </div>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <ProgressIndicator
            currentStep={currentQuestionIndex + 1}
            totalSteps={questions.length}
          />
        </motion.div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion.question}
          type={currentQuestion.type}
          options={currentQuestion.options}
          value={responses[currentQuestion.id] || (currentQuestion.type === 'multiple' ? [] : '')}
          onChange={handleResponseChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirst={isFirst}
          isLast={isLast}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  )
}