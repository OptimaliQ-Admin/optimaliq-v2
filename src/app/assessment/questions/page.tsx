/**
 * OptimaliQ Assessment Questions Page
 * AI-powered question flow with progress tracking and dynamic content
 */

'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup } from '@/components/ui/form'

function AssessmentQuestionsContent() {
  const searchParams = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext, setUserContext] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    // Get user context from URL parameters and localStorage
    const assessmentType = searchParams.get('type') || 'strategic';
    const userId = searchParams.get('user');
    const industry = searchParams.get('industry');
    
    // Get additional user info from localStorage
    const storedUserContext = localStorage.getItem('assessment_user_context');
    let context = null;
    
    if (storedUserContext) {
      try {
        context = JSON.parse(storedUserContext);
      } catch (error) {
        console.error('Error parsing stored user context:', error);
      }
    }

    // Combine URL params with localStorage data
    const userContext = {
      userId: userId || context?.userId,
      industry: industry || context?.industry || 'Technology',
      role: context?.role || 'Business Professional',
      companySize: context?.companySize || '11-50',
      revenueRange: context?.revenueRange || '$100K-$500K',
      name: context?.name || 'Business Professional'
    };

    setUserContext(userContext);

    // Generate personalized questions based on context
    const personalizedQuestions = generatePersonalizedQuestions(assessmentType, userContext);
    setQuestions(personalizedQuestions);
  }, [searchParams]);

  const generatePersonalizedQuestions = (type: string, context: any) => {
    // Base questions for each assessment type
    const baseQuestions = {
      strategic: [
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
          category: 'Strategy',
          question: 'How well does your current strategy align with market opportunities?',
          type: 'scale',
          options: [
            { value: '1', label: 'Poor alignment' },
            { value: '2', label: 'Some alignment' },
            { value: '3', label: 'Moderate alignment' },
            { value: '4', label: 'Good alignment' },
            { value: '5', label: 'Excellent alignment' }
          ],
          followUp: 'What market trends are you currently tracking?'
        }
      ],
      operational: [
        {
          id: 1,
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
        }
      ],
      team: [
        {
          id: 1,
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
        }
      ]
    };

    let personalizedQuestions = baseQuestions[type as keyof typeof baseQuestions] || baseQuestions.strategic;

    // Add industry-specific questions
    if (context.industry === 'Technology' || context.industry === 'SaaS') {
      personalizedQuestions.push({
        id: personalizedQuestions.length + 1,
        category: 'Industry-Specific',
        question: 'How would you rate your product-market fit?',
        type: 'scale',
        options: [
          { value: '1', label: 'Poor fit' },
          { value: '2', label: 'Some fit' },
          { value: '3', label: 'Moderate fit' },
          { value: '4', label: 'Good fit' },
          { value: '5', label: 'Excellent fit' }
        ],
        followUp: 'What customer feedback have you received about your product?'
      });
    }

    // Add role-specific questions
    if (context.role.toLowerCase().includes('ceo') || context.role.toLowerCase().includes('founder')) {
      personalizedQuestions.push({
        id: personalizedQuestions.length + 1,
        category: 'Leadership',
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
      });
    }

    return personalizedQuestions;
  };

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your personalized questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.id]: answer
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitAssessment = async () => {
    if (Object.keys(answers).length < totalQuestions) {
      alert('Please answer all questions before submitting.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit assessment to API
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: searchParams.get('type') || 'strategic',
          responses: answers,
          metadata: {
            userAgent: navigator.userAgent,
            startTime: new Date().toISOString(),
            completionTime: new Date().toISOString(),
            userContext: userContext
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Redirect to results page
        window.location.href = `/assessment/results?id=${result.data.id}`;
      } else {
        throw new Error('Failed to submit assessment');
      }
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-8">
        {/* Header with User Context */}
        {userContext && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{userContext.name}</h2>
                    <p className="text-sm text-gray-600">{userContext.role} • {userContext.industry}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Assessment Type</div>
                  <div className="font-semibold text-gray-900 capitalize">
                    {searchParams.get('type') || 'strategic'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
                Question {currentQuestion + 1} of {totalQuestions}
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

        {/* Current Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg">
            {/* Question Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {currentQuestion + 1}
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {currentQuestionData.category}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
                {currentQuestionData.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="mb-8">
              {currentQuestionData.type === 'scale' && (
                <RadioGroup
                  options={currentQuestionData.options}
                  value={answers[currentQuestionData.id]?.value || ''}
                  onChange={(value) => handleAnswer({ 
                    value, 
                    label: currentQuestionData.options.find((opt: any) => opt.value === value)?.label 
                  })}
                  className="space-y-4"
                />
              )}
            </div>

            {/* Follow-up Question */}
            {currentQuestionData.followUp && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Follow-up Question:</h4>
                <p className="text-blue-800">{currentQuestionData.followUp}</p>
                <textarea
                  className="w-full mt-3 p-3 border border-blue-200 rounded-lg resize-none"
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={answers[currentQuestionData.id]?.followUp || ''}
                  onChange={(e) => handleAnswer({
                    ...answers[currentQuestionData.id],
                    followUp: e.target.value
                  })}
                />
              </div>
            )}
          </div>
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
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestion === totalQuestions - 1 ? (
            <Button
              onClick={submitAssessment}
              disabled={Object.keys(answers).length < totalQuestions || isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Assessment
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextQuestion}
              disabled={!answers[currentQuestionData.id]}
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

export default function AssessmentQuestionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment questions...</p>
        </div>
      </div>
    }>
      <AssessmentQuestionsContent />
    </Suspense>
  );
}
