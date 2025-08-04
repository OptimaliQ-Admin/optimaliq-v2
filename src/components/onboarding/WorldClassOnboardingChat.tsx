'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRightIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';
import InlineQuestionInput from './InlineQuestionInput';
import TypingIndicator from './TypingIndicator';
import { questionGroups, QuestionGroup, Question } from '@/lib/services/onboarding/QuestionFlowManager';
// Removed generateSectionReply import - now using dynamic AI API
import { generateDashboardScores } from '@/lib/services/ai/generateDashboardScores';
import { getRandomWelcomeMessage, getTransitionHook } from '@/lib/config/onboardingMessages';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface WorldClassOnboardingChatProps {
  sessionId: string;
  userProfile?: any;
  onComplete: (answers: any, scores: any) => void;
}

export default function WorldClassOnboardingChat({
  sessionId,
  userProfile,
  onComplete
}: WorldClassOnboardingChatProps) {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, any>>({});
  const [isComplete, setIsComplete] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const currentGroup = questionGroups[currentGroupIndex];
  const currentQuestion = currentGroup?.questions[currentQuestionIndex];

  // Auto-scroll to question when it changes
  useEffect(() => {
    if (currentQuestion && !isTyping) {
      setTimeout(() => {
        const questionElement = document.querySelector('[data-question-id]');
        if (questionElement) {
          questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [currentQuestionIndex, currentGroupIndex, isTyping]);

  // Initialize welcome message
  useEffect(() => {
    if (showWelcome && currentGroup) {
      const welcomeMessage = getRandomWelcomeMessage();
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: typeof welcomeMessage === 'string' ? welcomeMessage : welcomeMessage.content,
        timestamp: new Date()
      }]);
    }
  }, [showWelcome, currentGroup]);

  const handleAnswerSubmit = async (questionId: string, answer: any) => {
    if (!currentQuestion) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${questionId}`,
      type: 'user',
      content: typeof answer === 'string' ? answer : JSON.stringify(answer),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentAnswers(prev => ({ ...prev, [questionId]: answer }));
    setAllAnswers(prev => ({ ...prev, [questionId]: answer }));

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
          userAnswer: answer,
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
    if (currentGroupIndex < questionGroups.length - 1) {
      // Move to next group
      setTimeout(() => {
        setCurrentGroupIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
        setCurrentAnswers({});
      }, 1500);
         } else {
       // Complete the assessment
       setIsComplete(true);
       const scores = await generateDashboardScores({
         sessionId,
         allResponses: allAnswers,
         userProfile
       });
       onComplete(allAnswers, scores);
     }
  };

  const getProgressPercentage = () => {
    const totalQuestions = questionGroups.reduce((sum, group) => sum + group.questions.length, 0);
    const completedQuestions = allAnswers ? Object.keys(allAnswers).filter(key => !key.includes('_insights')).length : 0;
    return Math.min((completedQuestions / totalQuestions) * 100, 100);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <SparklesIcon className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Assessment Complete!</h3>
          <p className="text-gray-600">Generating your personalized insights...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header with Progress */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 px-6 py-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Strategic Assessment</h2>
              <p className="text-sm text-gray-500">{currentGroup?.name}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {Math.round(getProgressPercentage())}% Complete
            </div>
            <div className="text-xs text-gray-500">
              Question {currentQuestionIndex + 1} of {currentGroup?.questions.length}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ 
                duration: 0.3, 
                ease: "easeOut",
                delay: index * 0.1 
              }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] md:max-w-[70%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'ai' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                      : 'bg-gradient-to-r from-gray-600 to-gray-700'
                  }`}>
                    {message.type === 'ai' ? (
                      <SparklesIcon className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-white text-sm font-medium">U</span>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === 'ai'
                      ? 'bg-white border border-gray-200 text-gray-900'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`text-xs mt-2 ${
                      message.type === 'ai' ? 'text-gray-400' : 'text-blue-100'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && <TypingIndicator showThinking={true} />}
        </AnimatePresence>

        {/* Current Question */}
        {currentQuestion && !isTyping && (
          <motion.div
            data-question-id={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <ChevronRightIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentQuestion.prompt}
                </h3>
                {currentQuestion.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {currentQuestion.description}
                  </p>
                )}
              </div>
            </div>
            
            <InlineQuestionInput
              question={currentQuestion}
              onAnswerChange={(answer) => {
                setCurrentAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
                setAllAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
              }}
              currentAnswer={currentAnswers[currentQuestion.id]}
            />
            
            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <motion.button
                onClick={() => handleAnswerSubmit(currentQuestion.id, currentAnswers[currentQuestion.id])}
                disabled={!currentAnswers[currentQuestion.id]}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  currentAnswers[currentQuestion.id]
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={currentAnswers[currentQuestion.id] ? { scale: 1.05 } : {}}
                whileTap={currentAnswers[currentQuestion.id] ? { scale: 0.95 } : {}}
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
} 