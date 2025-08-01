"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationMessage, QuestionNode, RealTimeInsight } from '@/lib/services/onboarding/ConversationManager';
import { BusinessMetrics, StrategicInsight } from '@/lib/services/onboarding/BusinessIntelligenceEngine';
import RankingInterface from './RankingInterface';
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
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionNode | null>(null);
  const [insights, setInsights] = useState<RealTimeInsight[]>([]);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<{
    metrics: BusinessMetrics;
    insights: StrategicInsight[];
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation
  useEffect(() => {
    initializeConversation();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        
        // Add welcome message with typing effect
        addMessage({
          id: 'welcome',
          type: 'ai',
          content: data.question.content,
          timestamp: new Date().toISOString(),
          metadata: { personality: data.question.personality }
        }, true);
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
      setMessages(prev => [...prev, message]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || !currentQuestion) return;

    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: currentInput,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    setCurrentInput('');

    // Process response
    try {
      const response = await fetch('/api/onboarding/conversational/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answer: currentInput
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response with typing effect
        addMessage(data.aiMessage, true);
        
        // Update state
        setCurrentQuestion(data.nextQuestion);
        setInsights(prev => [...prev, ...data.insights]);
        setProgress(data.state.progress);

        // Check if conversation is complete
        if (data.state.currentPhase === 'completion') {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (!currentQuestion) return;

    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: option,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);

    // Process response
    try {
      const response = await fetch('/api/onboarding/conversational/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answer: option
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response with typing effect
        addMessage(data.aiMessage, true);
        
        // Update state
        setCurrentQuestion(data.nextQuestion);
        setInsights(prev => [...prev, ...data.insights]);
        setProgress(data.state.progress);

        // Check if conversation is complete
        if (data.state.currentPhase === 'completion') {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleRankingComplete = async (rankings: string[]) => {
    if (!currentQuestion) return;

    const userMessage: ConversationMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: `Ranked: ${rankings.join(', ')}`,
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);

    // Process response
    try {
      const response = await fetch('/api/onboarding/conversational/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          answer: rankings
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add AI response with typing effect
        addMessage(data.aiMessage, true);
        
        // Update state
        setCurrentQuestion(data.nextQuestion);
        setInsights(prev => [...prev, ...data.insights]);
        setProgress(data.state.progress);

        // Check if conversation is complete
        if (data.state.currentPhase === 'completion') {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCompletion = async () => {
    try {
      const response = await fetch('/api/onboarding/conversational/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const data = await response.json();
        setCompletionData({
          metrics: data.metrics,
          insights: data.insights
        });
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const getPersonalityStyle = (personality?: string) => {
    switch (personality) {
      case 'consultant':
        return 'bg-blue-50 border-blue-200';
      case 'analyst':
        return 'bg-purple-50 border-purple-200';
      case 'strategist':
        return 'bg-green-50 border-green-200';
      case 'mentor':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getPersonalityIcon = (personality?: string) => {
    switch (personality) {
      case 'consultant':
        return '💼';
      case 'analyst':
        return '📊';
      case 'strategist':
        return '🎯';
      case 'mentor':
        return '🤝';
      default:
        return '🤖';
    }
  };

    // Show completion screen if onboarding is finished
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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Business Discovery Progress
          </span>
          <span className="text-sm text-gray-500">{progress}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : `${getPersonalityStyle(message.metadata?.personality)} border`
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">
                          {getPersonalityIcon(message.metadata?.personality)}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {message.metadata?.personality || 'AI'} Consultant
                        </span>
                      </div>
                    )}
                    
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {/* Show options for AI messages with multi-choice questions */}
                    {message.type === 'ai' && message.showOptions && currentQuestion?.type === 'multi_choice' && (
                      <div className="mt-4 space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option.value)}
                            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{option.label}</div>
                            {option.description && (
                              <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}

                    {/* Show ranking interface */}
                    {message.type === 'ai' && message.showOptions && currentQuestion?.type === 'ranking' && (
                      <div className="mt-4">
                        <RankingInterface
                          options={currentQuestion.options || []}
                          onRankingComplete={handleRankingComplete}
                        />
                      </div>
                    )}

                    {/* Show conditional questions */}
                    {message.type === 'ai' && message.showOptions && currentQuestion?.type === 'conditional' && (
                      <div className="mt-4 space-y-2">
                        {currentQuestion.options?.map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option.value)}
                            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                          >
                            <div className="font-medium text-gray-900">{option.label}</div>
                            {option.description && (
                              <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className={`max-w-[80%] rounded-lg p-4 ${getPersonalityStyle(currentQuestion?.personality)} border`}>
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
                    <span className="text-sm text-gray-500">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {(currentQuestion?.type === 'text_input' || currentQuestion?.type === 'conversation') && (
            <div className="border-t bg-gray-50 p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQuestion?.type === 'conversation' ? "Tell me about your challenge..." : "Type your answer..."}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!currentInput.trim() || isTyping}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Insights Panel */}
      {insights.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800 mb-2">💡 Real-time Insights</h3>
          <div className="space-y-2">
            {insights.slice(-3).map((insight) => (
              <div key={insight.id} className="text-sm text-purple-700">
                {insight.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 