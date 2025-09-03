/**
 * OptimaliQ Growth Assessment Step 2
 * AI-powered chat assessment with strategic questions
 * Following original GTM flow - immediate AI chat after lead capture
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Brain, 
  ChartLine, 
  Shield, 
  Lightbulb,
  MessageSquare,
  Send,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

// Strategic questions for growth assessment
const assessmentQuestions = [
  {
    id: 'obstacles',
    type: 'textarea',
    question: 'What are your biggest obstacles to scaling?',
    placeholder: 'Describe the main challenges preventing your business from growing...',
    required: true,
    maxLength: 250
  },
  {
    id: 'strategy',
    type: 'textarea', 
    question: 'How does your strategy differentiate you?',
    placeholder: 'Explain what makes your business unique and competitive...',
    required: true,
    maxLength: 250
  },
  {
    id: 'process',
    type: 'select',
    question: 'Are your processes optimized for efficiency?',
    options: [
      { value: 'yes', label: 'Yes, our processes are well-optimized' },
      { value: 'no', label: 'No, we need to improve our processes' },
      { value: 'partial', label: 'Partially, some areas need work' }
    ],
    required: true
  },
  {
    id: 'customers',
    type: 'textarea',
    question: "How well do you understand your customers' needs?",
    placeholder: 'Describe your customer insights and how you use them...',
    required: true,
    maxLength: 250
  },
  {
    id: 'technology',
    type: 'select',
    question: 'Is your technology stack supporting your growth?',
    options: [
      { value: 'outdated', label: 'Outdated - needs major upgrades' },
      { value: 'needs_work', label: 'Needs work - some improvements required' },
      { value: 'optimized', label: 'Optimized - working well for us' },
      { value: 'cutting_edge', label: 'Cutting edge - leading the industry' }
    ],
    required: true
  }
];

export default function GrowthAssessmentStep2() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem('growth_assessment_user');
    if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
        router.push('/growth-assessment');
      }
    } else {
      router.push('/growth-assessment');
    }
  }, [router]);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    if (Object.keys(answers).length < assessmentQuestions.length) {
      toast.error('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit assessment responses
      const response = await fetch('/api/growth-assessment/save-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInfo,
          answers,
          submittedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save assessment');
      }

      // Redirect to analyzing page
      router.push('/growth-assessment/analyzing');
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assessment...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = assessmentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
  const isCurrentQuestionAnswered = answers[currentQuestionData.id]?.trim() !== '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <ChartLine className="text-sm" />
            <span>Step 2 of 2 – Business Profile</span>
          </div>
          
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white text-2xl" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Growth Roadmap</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed mb-4">
            Answer a few quick questions to receive custom insights on how to scale your business effectively.
          </p>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              <span>AI-powered insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {currentQuestion + 1} of {assessmentQuestions.length}
              </h3>
              <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            {/* AI Avatar */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="text-white w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {currentQuestionData.question}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Input */}
            <div className="ml-16">
              {currentQuestionData.type === 'textarea' ? (
                <div className="space-y-3">
                  <textarea
                    value={answers[currentQuestionData.id] || ''}
                    onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
                    placeholder={currentQuestionData.placeholder}
                    className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    maxLength={currentQuestionData.maxLength}
                  />
                  <div className="text-right text-sm text-gray-500">
                    {(answers[currentQuestionData.id] || '').length}/{currentQuestionData.maxLength} characters
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentQuestionData.options?.map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                        answers[currentQuestionData.id] === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={currentQuestionData.id}
                        value={option.value}
                        checked={answers[currentQuestionData.id] === option.value}
                        onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestionData.id] === option.value
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[currentQuestionData.id] === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-800">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-between items-center"
        >
          <Button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6 py-3"
          >
            Previous
          </Button>

          {currentQuestion === assessmentQuestions.length - 1 ? (
            <Button
              onClick={submitAssessment}
              disabled={!isCurrentQuestionAnswered || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  Complete Assessment
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!isCurrentQuestionAnswered}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
