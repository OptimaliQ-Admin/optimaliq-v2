"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessageBubble from './ChatMessageBubble';
import InlineQuestionInput from './InlineQuestionInput';
import ProgressIndicator from './ProgressIndicator';
import TypingIndicator from './TypingIndicator';
import { questionGroups, QuestionGroup, Question } from '@/lib/services/onboarding/QuestionFlowManager';
// Removed generateSectionReply import - now using dynamic AI API
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

  const handleNextQuestion = async () => {
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

    // Generate AI response for this individual question
    setIsTyping(true);
    try {
      const response = await fetch('/api/ai/onboarding-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          currentSection: currentGroup.id,
          currentQuestion: currentQuestion.id,
          userAnswer: currentAnswers[currentQuestion.id],
          conversationHistory: messages.map(msg => ({
            type: msg.type,
            content: msg.content,
            timestamp: msg.timestamp
          })),
          userProfile,
          nextQuestion: currentQuestionIndex < currentGroup.questions.length - 1 
            ? {
                id: currentGroup.questions[currentQuestionIndex + 1].id,
                text: currentGroup.questions[currentQuestionIndex + 1].prompt,
                type: currentGroup.questions[currentQuestionIndex + 1].type
              }
            : undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const aiResponse = await response.json();

      setMessages(prev => [...prev, {
        id: `ai-${currentQuestion.id}`,
        type: 'ai',
        content: aiResponse.response,
        timestamp: new Date()
      }]);

      // Store extracted data for dashboard
      if (aiResponse.dataForDashboard) {
        setAllAnswers(prev => ({
          ...prev,
          [`${currentQuestion.id}_insights`]: aiResponse.dataForDashboard
        }));
      }

      // Check if this is the last question in the group
      if (currentQuestionIndex === currentGroup.questions.length - 1) {
        // Complete the group
        await handleGroupComplete();
      } else {
        // Move to next question in the same group
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1000);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setMessages(prev => [...prev, {
        id: `error-${currentQuestion.id}`,
        type: 'ai',
        content: 'I appreciate your response. Let\'s continue with the next question.',
        timestamp: new Date()
      }]);
      
      // Still move to next question even if AI response fails
      if (currentQuestionIndex === currentGroup.questions.length - 1) {
        await handleGroupComplete();
      } else {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1000);
      }
    } finally {
      setIsTyping(false);
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
    
    setIsSubmitting(false);
  };

  const currentGroup = questionGroups[currentQuestionGroupIndex];
  const currentQuestion = currentGroup?.questions[currentQuestionIndex];
  const isCurrentQuestionAnswered = currentQuestion && currentAnswers[currentQuestion.id] && 
    (typeof currentAnswers[currentQuestion.id] === 'string' ? currentAnswers[currentQuestion.id].trim() : currentAnswers[currentQuestion.id].length > 0);

  const totalQuestions = questionGroups.reduce((total: number, group: QuestionGroup) => total + group.questions.length, 0);
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
                        onAnswerChange={(answer: any) => handleAnswerChange(currentQuestion.id, answer)}
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
        {isTyping && <TypingIndicator showThinking={true} />}
      </div>
    </div>
  );
} 