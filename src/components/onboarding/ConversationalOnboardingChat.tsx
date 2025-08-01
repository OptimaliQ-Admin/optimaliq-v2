"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationMessage, QuestionNode, RealTimeInsight } from '@/lib/services/onboarding/ConversationManager';
import { BusinessMetrics, StrategicInsight } from '@/lib/services/onboarding/BusinessIntelligenceEngine';
import ChatMessage from './ChatMessage';
import DynamicInputRenderer from './DynamicInputRenderer';
import PhaseProgressIndicator from './PhaseProgressIndicator';
import OnboardingCompletion from './OnboardingCompletion';

interface ConversationalOnboardingChatProps {
  sessionId: string;
  onComplete: () => void;
}

interface MessageWithUI extends ConversationMessage {
  isTyping?: boolean;
  showOptions?: boolean;
}

export default function ConversationalOnboardingChat({
  sessionId,
  onComplete
}: ConversationalOnboardingChatProps) {
  const [messages, setMessages] = useState<MessageWithUI[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionNode | null>(null);
  const [insights, setInsights] = useState<RealTimeInsight[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'introduction' | 'discovery' | 'diagnosis' | 'roadmap'>('introduction');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<{
    metrics: BusinessMetrics;
    insights: StrategicInsight[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    initializeConversation();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentQuestion]);

  const initializeConversation = async () => {
    try {
      const response = await fetch('/api/onboarding/conversational/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQuestion(data.question);
        setCurrentPhase(data.question.phase);
      }
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
    }
  };

  const addMessage = (message: ConversationMessage, withTyping = false) => {
    if (withTyping) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { ...message, showOptions: true }]);
      }, 1500);
    } else {
      setMessages(prev => {
        // Prevent duplicate messages
        const isDuplicate = prev.some(m => m.id === message.id);
        if (isDuplicate) return prev;
        return [...prev, message];
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAnswer = useCallback(async (answer: string | string[] | number) => {
    if (!currentQuestion) return;

    // Add user message
    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: Array.isArray(answer) ? answer.join(', ') : String(answer),
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);

    // Show typing indicator
    setIsTyping(true);

    try {
      const response = await fetch('/api/onboarding/conversational/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answer,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update state
        setProgress(data.state.progress);
        setCurrentPhase(data.state.currentPhase);
        setInsights(data.insights);

        // Add AI response if it has content
        if (data.aiMessage && data.aiMessage.content && data.aiMessage.content.trim() !== "") {
          addMessage(data.aiMessage);
        }

        // Update current question
        if (data.nextQuestion) {
          setCurrentQuestion(data.nextQuestion);
          setCurrentPhase(data.nextQuestion.phase);
        } else {
          // Conversation completed
          handleCompletion();
        }
      } else {
        throw new Error('Failed to process response');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
      // Add error message
      addMessage({
        id: `error_${Date.now()}`,
        type: 'ai',
        content: "I apologize, but I encountered an error processing your response. Please try again.",
        timestamp: new Date().toISOString(),
        metadata: { personality: 'consultant' }
      });
    } finally {
      setIsTyping(false);
    }
  }, [currentQuestion, sessionId]);

  const handleCompletion = async () => {
    try {
      const response = await fetch('/api/onboarding/conversational/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        setCompletionData(data);
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (isCompleted && completionData) {
    return (
      <OnboardingCompletion
        metrics={completionData.metrics}
        insights={completionData.insights}
        onContinue={onComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Phase Progress Indicator */}
        <PhaseProgressIndicator
          currentPhase={currentPhase}
          progress={progress}
        />

        {/* Chat Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Chat Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white text-lg backdrop-blur-sm">
                💼
              </div>
              <div>
                <h1 className="text-lg font-semibold">Business Growth Consultant</h1>
                <p className="text-blue-100 text-sm">OptimaliQ&apos;s business discovery</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  showTypingIndicator={message.isTyping}
                />
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium shadow-lg">
                  💼
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-2 h-2 bg-gray-400 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Current Question Input */}
            {currentQuestion && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-6"
              >
                <DynamicInputRenderer
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  disabled={isTyping}
                />
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Insights Panel - Only show if there are meaningful insights */}
          {insights.length > 0 && insights.some(insight => insight.confidence > 0.7) && (
            <div className="border-t border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-800">💡 Key Insight</h3>
              </div>
              <div className="space-y-2">
                {insights
                  .filter(insight => insight.confidence > 0.7)
                  .slice(-1)
                  .map((insight, index) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-gray-700 bg-white rounded-lg p-3 border border-amber-200 shadow-sm"
                    >
                      {insight.content}
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 