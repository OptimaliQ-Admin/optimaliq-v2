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
            'Team expertise',
            'Brand recognition'
          ],
          required: true
        }
      ]
    },
    {
      id: 'operations',
      name: 'Operations & Processes',
      aiPromptIntro: 'Understanding your operational maturity and efficiency',
      order: 3,
      transitionHook: 'Let\'s shift gears to your customer engine — how you\'re acquiring, retaining, and scaling growth.',
      questions: [
        {
          id: 'process_maturity',
          type: 'multiple_choice',
          prompt: 'How would you describe your operational processes?',
          options: [
            'Mostly ad-hoc and reactive',
            'Some documented processes',
            'Well-defined and followed',
            'Highly optimized and automated'
          ],
          required: true
        },
        {
          id: 'team_size',
          type: 'multiple_choice',
          prompt: 'How large is your team?',
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
          id: 'biggest_operational_challenge',
          type: 'text_area',
          prompt: 'What\'s your biggest operational challenge?',
          required: true
        }
      ]
    },
    {
      id: 'growth_stack',
      name: 'Growth Stack & Tools',
      aiPromptIntro: 'Understanding your technology stack and growth tools',
      order: 4,
      transitionHook: 'This is where it gets interesting. Let\'s talk decision-making, alignment, and what success looks like for your team.',
      questions: [
        {
          id: 'tech_stack_maturity',
          type: 'multiple_choice',
          prompt: 'How mature is your technology stack?',
          options: [
            'Still building core systems',
            'Basic tools in place',
            'Integrated and optimized',
            'Advanced automation'
          ],
          required: true
        },
        {
          id: 'key_tools',
          type: 'multi_select',
          prompt: 'Which tools do you use most? (Select all that apply)',
          options: [
            'CRM (Salesforce, HubSpot, etc.)',
            'Marketing automation',
            'Analytics (Google Analytics, Mixpanel)',
            'Email marketing',
            'Social media management',
            'Project management',
            'Customer support',
            'Accounting/Finance',
            'HR/Recruiting'
          ],
          maxSelect: 5,
          required: true
        },
        {
          id: 'tech_gaps',
          type: 'text_area',
          prompt: 'What technology gaps are holding you back?',
          required: true
        }
      ]
    },
    {
      id: 'clarity',
      name: 'Decision Making & Clarity',
      aiPromptIntro: 'Understanding your decision-making processes and strategic clarity',
      order: 5,
      transitionHook: 'You\'re building toward something specific — let\'s anchor that with the right benchmarks and expectations.',
      questions: [
        {
          id: 'decision_speed',
          type: 'multiple_choice',
          prompt: 'How quickly do you typically make strategic decisions?',
          options: [
            'Immediately (same day)',
            'Within a week',
            'Within a month',
            'Several months',
            'Very slowly'
          ],
          required: true
        },
        {
          id: 'success_metrics',
          type: 'multi_select',
          prompt: 'What metrics do you track most closely? (Select all that apply)',
          options: [
            'Revenue growth',
            'Customer acquisition cost',
            'Customer lifetime value',
            'Conversion rates',
            'Team productivity',
            'Customer satisfaction',
            'Profit margins',
            'Market share'
          ],
          maxSelect: 4,
          required: true
        },
        {
          id: 'strategic_clarity',
          type: 'text_area',
          prompt: 'What strategic question keeps you up at night?',
          required: true
        }
      ]
    },
    {
      id: 'benchmarks',
      name: 'Benchmarks & Expectations',
      aiPromptIntro: 'Understanding your performance benchmarks and growth expectations',
      order: 6,
      transitionHook: 'Thanks for being thoughtful through this. One last thing before we wrap — let\'s talk about what\'s been left unsaid or deprioritized.',
      questions: [
        {
          id: 'industry_benchmark',
          type: 'multiple_choice',
          prompt: 'How do you think you compare to industry leaders?',
          options: [
            'Significantly behind',
            'Slightly behind',
            'On par',
            'Ahead of most',
            'Leading the industry'
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
            'Strong (20-50%)',
            'Explosive (50%+)'
          ],
          required: true
        },
        {
          id: 'deprioritized_areas',
          type: 'text_area',
          prompt: 'What important areas have you had to deprioritize?',
          required: true
        }
      ]
    }
  ];

  useEffect(() => {
    // Load user profile
    const loadUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    };

    loadUserProfile();
  }, []);

  useEffect(() => {
    // Show welcome message on mount
    if (messages.length === 0 && userProfile) {
      const welcomeMessage = getRandomWelcomeMessage(userProfile.industry);
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: welcomeMessage.content,
        timestamp: new Date()
      }]);
    }
  }, [userProfile, messages.length]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuestionGroupSubmit = async (answers: Record<string, any>) => {
    // Collect answers for the current question group
    const updatedAnswers = { ...currentAnswers, ...answers };
    setCurrentAnswers(updatedAnswers);
    
    // Check if we have all answers for the current group
    const currentGroup = questionGroups[currentQuestionGroupIndex];
    const allGroupQuestionsAnswered = currentGroup.questions.every(question => 
      updatedAnswers[question.id] && 
      (typeof updatedAnswers[question.id] === 'string' ? updatedAnswers[question.id].trim() : updatedAnswers[question.id].length > 0)
    );
    
    if (!allGroupQuestionsAnswered) {
      return; // Wait for all questions to be answered
    }
    
    setIsSubmitting(true);
    
    // Add user answers to messages
    const answerMessages = currentGroup.questions.map(question => ({
      id: `answer-${question.id}`,
      type: 'user' as const,
      content: updatedAnswers[question.id] || 'No answer provided',
      timestamp: new Date()
    }));

    setMessages(prev => [...prev, ...answerMessages]);
    setAllAnswers(prev => ({ ...prev, ...updatedAnswers }));

    // Save answers to database
    try {
      await supabase
        .from('user_responses')
        .insert(
          Object.entries(updatedAnswers).map(([questionId, answer]) => ({
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
        responses: updatedAnswers,
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
          allResponses: { ...allAnswers, ...updatedAnswers },
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Progress Indicator */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <ProgressIndicator
          currentStep={currentQuestionGroupIndex + 1}
          totalSteps={questionGroups.length}
          currentSection={currentGroup?.name}
        />
      </div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
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
            {currentGroup.questions.map((question) => (
              <InlineQuestionInput
                key={question.id}
                question={question}
                onSubmit={handleQuestionGroupSubmit}
                isSubmitting={isSubmitting}
                currentAnswers={currentAnswers}
              />
            ))}
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>
    </div>
  );
} 