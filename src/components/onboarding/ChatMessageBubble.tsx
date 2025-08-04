import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'question_group';
  content: string;
  timestamp: Date;
}

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export default function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isAI = message.type === 'ai';
  const isUser = message.type === 'user';

  if (message.type === 'question_group') {
    return null; // These are handled separately
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
          isAI 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
            : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-lg'
        }`}>
          {isAI ? 'AI' : 'U'}
        </div>

        {/* Message Content */}
        <div className={`rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm ${
          isAI 
            ? 'bg-white/10 border border-white/20 text-white' 
            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
          <div className={`text-xs mt-3 ${
            isAI ? 'text-white/60' : 'text-white/80'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 