"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';
import { ConversationMessage } from '@/lib/types/database';

interface ConversationalInterfaceProps {
  sessionId: string;
  initialMessages?: ConversationMessage[];
  onMessage?: (message: string) => void;
  onComplete?: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  suggestions?: string[];
  timestamp: Date;
  isLoading?: boolean;
}

export default function ConversationalInterface({
  sessionId,
  initialMessages = [],
  onMessage,
  onComplete
}: ConversationalInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages from props
  useEffect(() => {
    if (initialMessages.length > 0) {
      const formattedMessages: Message[] = initialMessages.map(msg => ({
        id: msg.id,
        type: msg.message_type === 'user_input' ? 'user' : 'ai',
        content: typeof msg.content === 'object' && msg.content && 'text' in msg.content 
          ? (msg.content as any).text || ''
          : typeof msg.content === 'string' ? msg.content : '',
        suggestions: typeof msg.content === 'object' && msg.content && 'suggestions' in msg.content
          ? (msg.content as any).suggestions || []
          : [],
        timestamp: new Date(msg.created_at)
      }));
      setMessages(formattedMessages);
    }
  }, [initialMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(`/api/onboarding/session/${sessionId}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add typing indicator
      const typingMessage: Message = {
        id: `typing-${Date.now()}`,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isLoading: true
      };

      setMessages(prev => [...prev, typingMessage]);

      // Simulate typing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Replace typing indicator with actual response
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: data.response.text,
        suggestions: data.response.suggestions || [],
        timestamp: new Date()
      };

      setMessages(prev => prev.map(msg => 
        msg.id === typingMessage.id ? aiMessage : msg
      ));

      // Call onMessage callback
      onMessage?.(message.trim());

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Business Strategist</h2>
            <p className="text-sm text-gray-600">Let&apos;s understand your business together</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <MessageCircle className="w-4 h-4" />
          <span>{messages.filter(m => m.type === 'user').length} messages</span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
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
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed">{message.content.replace(/'/g, '&apos;').replace(/"/g, '&quot;')}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      {message.type === 'ai' && (
                        <Sparkles className="w-3 h-3 opacity-70" />
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">AI is typing...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Suggestions */}
        {messages.length > 0 && messages[messages.length - 1].type === 'ai' && 
         messages[messages.length - 1].suggestions && 
         messages[messages.length - 1].suggestions!.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 justify-start"
          >
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                disabled={isLoading}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        
        {/* Help text */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send • Be conversational and natural
        </p>
      </div>
    </div>
  );
} 