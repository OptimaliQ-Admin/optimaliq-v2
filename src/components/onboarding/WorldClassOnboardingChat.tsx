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
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});

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

  const handleGroupSubmit = async () => {
    const currentGroup = questionGroups[currentQuestionGroupIndex];
    
    // Check if all questions in the current group are answered
    const allGroupQuestionsAnswered = currentGroup.questions.every(question => 
      currentAnswers[question.id] && 
      (typeof currentAnswers[question.id] === 'string' ? currentAnswers[question.id].trim() : currentAnswers[question.id].length > 0)
    );
    
    if (!allGroupQuestionsAnswered) {
      return; // Don't proceed if not all questions are answered
    }
    
    setIsSubmitting(true);
    
    // Add user answers to messages
    const answerMessages = currentGroup.questions.map(question => ({
      id: `answer-${question.id}`,
      type: 'user' as const,
      content: currentAnswers[question.id] || 'No answer provided',
      timestamp: new Date()
    }));

    setMessages(prev => [...prev, ...answerMessages]);
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
        setCurrentQuestionGroupIndex(prev => prev + 1);
        setCurrentAnswers({}); // Reset answers for next group
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
  const allCurrentGroupAnswered = currentGroup?.questions.every(question => 
    currentAnswers[question.id] && 
    (typeof currentAnswers[question.id] === 'string' ? currentAnswers[question.id].trim() : currentAnswers[question.id].length > 0)
  );

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Indicator */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white shadow-sm">
        <ProgressIndicator
          currentStep={currentQuestionGroupIndex + 1}
          totalSteps={questionGroups.length}
          currentSection={currentGroup?.name}
        />
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessageBubble message={message} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Current Question Group */}
        {currentGroup && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 shadow-sm">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                {currentGroup.name}
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {currentGroup.aiPromptIntro}
              </p>
              
              <div className="space-y-6">
                {currentGroup.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <InlineQuestionInput
                      question={question}
                      onAnswerChange={(answer) => handleAnswerChange(question.id, answer)}
                      currentAnswer={currentAnswers[question.id]}
                      questionNumber={index + 1}
                    />
                  </div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleGroupSubmit}
                  disabled={!allCurrentGroupAnswered || isSubmitting}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    allCurrentGroupAnswered && !isSubmitting
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
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
                    `Continue to ${currentQuestionGroupIndex < questionGroups.length - 1 ? 'Next Section' : 'Complete'}`
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
} 