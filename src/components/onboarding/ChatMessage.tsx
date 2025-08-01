"use client";

import React from 'react';
import { motion } from 'framer-motion';
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
          gradient: 'from-blue-500 to-blue-600'
        };
      case 'analyst':
        return {
          icon: '📊',
          name: 'Analyst',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600'
        };
      case 'strategist':
        return {
          icon: '🎯',
          name: 'Strategist',
          color: 'green',
          gradient: 'from-green-500 to-green-600'
        };
      case 'mentor':
        return {
          icon: '🧠',
          name: 'Mentor',
          color: 'orange',
          gradient: 'from-orange-500 to-orange-600'
        };
      default:
        return {
          icon: '💼',
          name: 'Consultant',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600'
        };
    }
  };

  const config = getPersonalityConfig();

  if (isAI) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-start space-x-3 mb-4"
      >
        {/* AI Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white text-sm font-medium shadow-sm`}>
          {config.icon}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Message Bubble */}
          <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-sm">
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
              </div>
            ) : (
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">
                {message.content}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className="text-xs text-gray-500 mt-1 ml-1">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  // User Message
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex items-start space-x-3 mb-4 justify-end"
    >
      {/* Message Content */}
      <div className="flex-1 min-w-0 max-w-sm">
        {/* Message Bubble */}
        <div className="bg-blue-500 text-white rounded-2xl px-4 py-3 ml-auto">
          <div className="text-white leading-relaxed whitespace-pre-wrap text-sm">
            {message.content}
          </div>
        </div>
        
        {/* Timestamp */}
        <div className="text-xs text-gray-500 mt-1 mr-1 text-right">
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      {/* User Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium shadow-sm">
        👤
      </div>
    </motion.div>
  );
} 