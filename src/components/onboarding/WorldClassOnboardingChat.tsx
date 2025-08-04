"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessageBubble from './ChatMessageBubble';
import InlineQuestionInput from './InlineQuestionInput';
import ProgressIndicator from './ProgressIndicator';
import TypingIndicator from './TypingIndicator';
import { QuestionGroup, Question } from '@/lib/services/onboarding/QuestionFlowManager';
import { generateSectionReply } from '@/lib/services/ai/generateSectionReply';
import { generateDashboardScores } from '@/lib/services/ai/generateDashboardScores';
import { getRandomWelcomeMessage, getTransitionHook } from '@/lib/config/onboardingMessages';
import { supabase } from '@/lib/supabase';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'question_group';
  content: string;
  timestamp: Date;
  questionGroup?: QuestionGroup;
}

interface WorldClassOnboardingChatProps {
  sessionId: string;
  onComplete: (scores: any) => void;
}

export default function WorldClassOnboardingChat({
  sessionId,
  onComplete
}: WorldClassOnboardingChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionGroupIndex, setCurrentQuestionGroupIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});
  const [showNextQuestion, setShowNextQuestion] = useState(false);

  // Question groups from our architecture
  const questionGroups: QuestionGroup[] = [
    {
      id: 'goals',
      name: 'Goals & Priorities',
      aiPromptIntro: 'Understanding your growth priorities and strategic objectives',
      order: 1,
      transitionHook: 'Now that I understand your growth priorities, let\'s talk about how your business stands out in the market.',
      questions: [
        {
          id: 'primary_goal',
          type: 'multiple_choice',
          prompt: 'What\'s your primary growth goal right now?',
          options: [
            'Scale revenue rapidly',
            'Improve profitability',
            'Expand to new markets',
            'Optimize operations',
            'Build team and culture'
          ],
          required: true
        },
        {
          id: 'timeframe',
          type: 'multiple_choice',
          prompt: 'What\'s your target timeframe for achieving this goal?',
          options: [
            '3-6 months',
            '6-12 months',
            '12-18 months',
            '18+ months'
          ],
          required: true
        },
        {
          id: 'biggest_challenge',
          type: 'text_area',
          prompt: 'What\'s the biggest challenge standing in your way?',
          required: true
        }
      ]
    },
    {
      id: 'positioning',
      name: 'Market Positioning',
      aiPromptIntro: 'Understanding your competitive landscape and differentiation',
      order: 2,
      transitionHook: 'That gives me a good sense of how you\'re positioned. Now I want to look under the hood — your processes, tools, and internal rhythm.',
      questions: [
        {
          id: 'differentiator',
          type: 'text_area',
          prompt: 'What makes your business unique in your market?',
          required: true
        },
        {
          id: 'target_customer',
          type: 'text_area',
          prompt: 'Who is your ideal customer?',
          required: true
        },
        {
          id: 'competitive_advantage',
          type: 'multiple_choice',
          prompt: 'What\'s your strongest competitive advantage?',
          options: [
            'Technology/Product',
            'Customer service',
            'Price/Value',
            'Speed to market',
            'Team expertise'
          ],
          required: true
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations & Process',
      aiPromptIntro: 'Understanding your operational efficiency and process maturity',
      order: 3,
      transitionHook: 'Let\'s shift gears to your customer engine — how you\'re acquiring, retaining, and scaling growth.',
      questions: [
        {
          id: 'team_size',
          type: 'multiple_choice',
          prompt: 'How large is your current team?',
          options: [
            '1-5 people',
            '6-15 people',
            '16-50 people',
            '51-200 people',
            '200+ people'
          ],
          required: true
        },
        {
          id: 'process_maturity',
          type: 'multiple_choice',
          prompt: 'How would you describe your process maturity?',
          options: [
            'Ad-hoc and reactive',
            'Some processes documented',
            'Well-defined processes',
            'Highly optimized and automated'
          ],
          required: true
        },
        {
          id: 'tech_stack',
          type: 'text_area',
          prompt: 'What are your main tools and technologies?',
          required: true
        }
      ]
    },
    {
      id: 'growth_stack',
      name: 'Growth Engine',
      aiPromptIntro: 'Understanding your customer acquisition and retention strategies',
      order: 4,
      transitionHook: 'This is where it gets interesting. Let\'s talk decision-making, alignment, and what success looks like for your team.',
      questions: [
        {
          id: 'acquisition_channels',
          type: 'multi_select',
          prompt: 'Which customer acquisition channels are working best?',
          options: [
            'Content marketing',
            'Paid advertising',
            'Social media',
            'Email marketing',
            'Partnerships',
            'Direct sales',
            'Referrals',
            'SEO'
          ],
          maxSelect: 3,
          required: true
        },
        {
          id: 'retention_strategy',
          type: 'text_area',
          prompt: 'How do you currently retain and grow existing customers?',
          required: true
        },
        {
          id: 'growth_metrics',
          type: 'multi_select',
          prompt: 'Which metrics do you track most closely?',
          options: [
            'Revenue growth',
            'Customer acquisition cost',
            'Lifetime value',
            'Churn rate',
            'Conversion rates',
            'Customer satisfaction',
            'Market share'
          ],
          maxSelect: 4,
          required: true
        }
      ]
    },
    {
      id: 'clarity',
      name: 'Strategy & Alignment',
      aiPromptIntro: 'Understanding your strategic clarity and team alignment',
      order: 5,
      transitionHook: 'You\'re building toward something specific — let\'s anchor that with the right benchmarks and expectations.',
      questions: [
        {
          id: 'vision_clarity',
          type: 'multiple_choice',
          prompt: 'How clear is your team on the company vision?',
          options: [
            'Very clear and aligned',
            'Somewhat clear',
            'Unclear or conflicting',
            'Not communicated'
          ],
          required: true
        },
        {
          id: 'decision_making',
          type: 'multiple_choice',
          prompt: 'How do you typically make strategic decisions?',
          options: [
            'Data-driven analysis',
            'Gut instinct and experience',
            'Team consensus',
            'Customer feedback',
            'Market research'
          ],
          required: true
        },
        {
          id: 'success_definition',
          type: 'text_area',
          prompt: 'What does success look like for your business in the next year?',
          required: true
        }
      ]
    },
    {
      id: 'benchmarks',
      name: 'Benchmarks & Expectations',
      aiPromptIntro: 'Understanding your performance context and industry benchmarks',
      order: 6,
      transitionHook: 'Thanks for being thoughtful through this. One last thing before we wrap — let\'s talk about what\'s been left unsaid or deprioritized.',
      questions: [
        {
          id: 'industry_benchmarks',
          type: 'multiple_choice',
          prompt: 'How do you compare to industry benchmarks?',
          options: [
            'Leading the industry',
            'Above average',
            'Average',
            'Below average',
            'Not sure'
          ],
          required: true
        },
        {
          id: 'growth_rate',
          type: 'multiple_choice',
          prompt: 'What\'s your current growth rate?',
          options: [
            'Declining',
            'Flat (0-5%)',
            'Moderate (5-20%)',
            'High (20-50%)',
            'Hypergrowth (50%+)'
          ],
          required: true
        },
        {
          id: 'unaddressed_areas',
          type: 'text_area',
          prompt: 'What areas of your business have you been meaning to address but haven\'t had time for?',
          required: true
        }
      ]
    }
  ];

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get user profile from users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile || user);

        // Add welcome message
        const welcomeMessage = getRandomWelcomeMessage();
        setMessages([{
          id: 'welcome',
          type: 'ai',
          content: welcomeMessage.content,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    const currentGroup = questionGroups[currentQuestionGroupIndex];
    const currentQuestion = currentGroup.questions[currentQuestionIndex];
    
    // Check if current question is answered
    const isAnswered = currentAnswers[currentQuestion.id] && 
      (typeof currentAnswers[currentQuestion.id] === 'string' ? currentAnswers[currentQuestion.id].trim() : currentAnswers[currentQuestion.id].length > 0);
    
    if (!isAnswered) {
      return; // Don't proceed if question isn't answered
    }

    // Add user answer to messages
    setMessages(prev => [...prev, {
      id: `answer-${currentQuestion.id}`,
      type: 'user',
      content: currentAnswers[currentQuestion.id] || 'No answer provided',
      timestamp: new Date()
    }]);

    // Check if this is the last question in the group
    if (currentQuestionIndex === currentGroup.questions.length - 1) {
      // Complete the group
      handleGroupComplete();
    } else {
      // Move to next question in the same group
      setShowNextQuestion(true);
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowNextQuestion(false);
      }, 300);
    }
  };

  const handleGroupComplete = async () => {
    const currentGroup = questionGroups[currentQuestionGroupIndex];
    
    setIsSubmitting(true);
    setAllAnswers(prev => ({ ...prev, ...currentAnswers }));

    // Save answers to database
    try {
      await supabase
        .from('user_responses')
        .insert(
          Object.entries(currentAnswers).map(([questionId, answer]) => ({
            session_id: sessionId,
            question_id: questionId,
            answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
            timestamp: new Date().toISOString()
          }))
        );
    } catch (error) {
      console.error('Error saving answers:', error);
    }

    // Generate AI response
    setIsTyping(true);
    try {
      const aiResponse = await generateSectionReply({
        sectionId: currentGroup.id,
        sectionName: currentGroup.name,
        responses: currentAnswers,
        userProfile,
        transitionHook: currentGroup.transitionHook
      });

      setMessages(prev => [...prev, {
        id: `ai-${currentGroup.id}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      }]);

      // Check if this is the final section
      if (currentQuestionGroupIndex === questionGroups.length - 1) {
        // Generate final scores and roadmap
        const finalScores = await generateDashboardScores({
          sessionId,
          allResponses: { ...allAnswers, ...currentAnswers },
          userProfile
        });

        // Save to database
        await supabase
          .from('assessment_scores')
          .insert({
            user_id: userProfile?.id,
            session_id: sessionId,
            strategy_score: finalScores.strategy_score,
            process_score: finalScores.process_score,
            technology_score: finalScores.technology_score,
            overall_score: finalScores.overall_score,
            benchmark_position: finalScores.benchmark_position,
            roadmap: finalScores.roadmap,
            created_at: new Date().toISOString()
          });

        // Call completion handler
        onComplete(finalScores);
      } else {
        // Move to next question group
        setTimeout(() => {
          setCurrentQuestionGroupIndex(prev => prev + 1);
          setCurrentQuestionIndex(0);
          setCurrentAnswers({});
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages(prev => [...prev, {
        id: `error-${currentGroup.id}`,
        type: 'ai',
        content: 'I appreciate your responses. Let\'s continue with the next section.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
    }
  };

  const currentGroup = questionGroups[currentQuestionGroupIndex];
  const currentQuestion = currentGroup?.questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = currentQuestion && currentAnswers[currentQuestion.id] && 
    (typeof currentAnswers[currentQuestion.id] === 'string' ? currentAnswers[currentQuestion.id].trim() : currentAnswers[currentQuestion.id].length > 0);

  const totalQuestions = questionGroups.reduce((total, group) => total + group.questions.length, 0);
  const answeredQuestions = Object.keys(currentAnswers).length + 
    (currentQuestionGroupIndex * questionGroups[0]?.questions.length || 0);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Progress Indicator */}
      <div className="relative z-10 p-6 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <ProgressIndicator
          currentStep={answeredQuestions + 1}
          totalSteps={totalQuestions}
          currentSection={currentGroup?.name}
        />
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ChatMessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Question */}
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentQuestionGroupIndex}-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                {/* Section Header */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {currentQuestionGroupIndex + 1}
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                      {currentGroup.name}
                    </h2>
                  </div>
                  <p className="text-white/70 text-sm">
                    {currentGroup.aiPromptIntro}
                  </p>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mt-1">
                      {currentQuestionIndex + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white mb-4 leading-relaxed">
                        {currentQuestion.prompt}
                        {currentQuestion.required && <span className="text-red-400 ml-1">*</span>}
                      </h3>
                      
                      <InlineQuestionInput
                        question={currentQuestion}
                        onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        currentAnswer={currentAnswers[currentQuestion.id]}
                      />
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={!isCurrentQuestionAnswered || isSubmitting}
                    className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                      isCurrentQuestionAnswered && !isSubmitting
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                    }`}
                    whileHover={isCurrentQuestionAnswered && !isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={isCurrentQuestionAnswered && !isSubmitting ? { scale: 0.95 } : {}}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      currentQuestionIndex === currentGroup.questions.length - 1 
                        ? (currentQuestionGroupIndex === questionGroups.length - 1 ? 'Complete Assessment' : 'Complete Section')
                        : 'Next Question'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
} 