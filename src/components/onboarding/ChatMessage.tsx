"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationMessage } from '@/lib/services/onboarding/ConversationManager';

interface ChatMessageProps {
  message: ConversationMessage;
  isTyping?: boolean;
  showTypingIndicator?: boolean;
}

export default function ChatMessage({
  message,
  isTyping = false,
  showTypingIndicator = false
}: ChatMessageProps) {
  const isAI = message.type === 'ai';
  const personality = message.metadata?.personality || 'consultant';

  const getPersonalityConfig = () => {
    switch (personality) {
      case 'consultant':
        return {
          icon: '💼',
          name: 'Consultant',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
      case 'analyst':
        return {
          icon: '📊',
          name: 'Analyst',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-pink-50',
          borderColor: 'border-purple-200'
        };
      case 'strategist':
        return {
          icon: '🎯',
          name: 'Strategist',
          color: 'green',
          gradient: 'from-green-500 to-green-600',
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200'
        };
      case 'mentor':
        return {
          icon: '🧠',
          name: 'Mentor',
          color: 'orange',
          gradient: 'from-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-amber-50',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: '💼',
          name: 'Consultant',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200'
        };
    }
  };

  const config = getPersonalityConfig();

  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-start space-x-3 mb-6"
      >
        {/* AI Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white text-lg font-medium shadow-lg`}>
          {config.icon}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Message Header */}
          <div className="flex items-center space-x-2 mb-2">
            <span className={`font-semibold text-${config.color}-800`}>
              {config.name}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>

          {/* Message Bubble */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className={`bg-white rounded-2xl shadow-lg border ${config.borderColor} overflow-hidden`}
          >
            {/* Message Header */}
            <div className={`px-4 py-3 bg-gradient-to-r ${config.bgGradient} border-b ${config.borderColor}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white text-xs`}>
                  {config.icon}
                </div>
                <span className={`text-sm font-medium text-${config.color}-800`}>
                  {config.name}
                </span>
              </div>
            </div>

            {/* Message Content */}
            <div className="px-4 py-3">
              {showTypingIndicator ? (
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
                  <span className="text-sm text-gray-500">
                    {config.name} is thinking...
                  </span>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              )}
            </div>

            {/* Insights */}
            {message.metadata?.insights && message.metadata.insights.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <div className="space-y-2">
                  {message.metadata.insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start space-x-2"
                    >
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center mt-0.5">
                        <svg className="w-2 h-2 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // User Message
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start space-x-3 mb-6 justify-end"
    >
      {/* Message Content */}
      <div className="flex-1 min-w-0 max-w-md">
        {/* Message Header */}
        <div className="flex items-center space-x-2 mb-2 justify-end">
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          <span className="font-semibold text-gray-800">
            You
          </span>
        </div>

        {/* Message Bubble */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg px-4 py-3"
        >
          <div className="prose prose-sm max-w-none prose-invert">
            <p className="text-white leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </motion.div>
      </div>

      {/* User Avatar */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center text-white text-lg font-medium shadow-lg">
        👤
      </div>
    </motion.div>
  );
} 