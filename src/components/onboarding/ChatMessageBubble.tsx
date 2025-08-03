import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot } from 'lucide-react';

interface ChatMessageBubbleProps {
  message: {
    id: string;
    type: 'user' | 'ai' | 'question_group';
    content: string;
    timestamp: Date;
    isTyping?: boolean;
  };
  isTyping?: boolean;
}

export default function ChatMessageBubble({ message, isTyping }: ChatMessageBubbleProps) {
  // Don't render question_group messages in this component
  if (message.type === 'question_group') {
    return null;
  }
  
  const isAI = message.type === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex items-start space-x-3 max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isAI 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {isAI ? (
            <Bot size={16} />
          ) : (
            <User size={16} />
          )}
        </div>

        {/* Message Bubble */}
        <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isAI 
              ? 'bg-white text-gray-900 border border-gray-200 shadow-sm' 
              : 'bg-blue-500 text-white'
          }`}>
            {isTyping ? (
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">Thinking...</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            )}
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-gray-500 mt-1">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
} 