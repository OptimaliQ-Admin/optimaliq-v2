"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TextInputProps {
  question: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  onSend: (value: string) => void;
  disabled?: boolean;
  personality?: string;
}

export default function TextInput({
  question,
  placeholder = "Type your answer...",
  maxLength = 500,
  rows = 3,
  onSend,
  disabled = false,
  personality = 'consultant'
}: TextInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim());
      setValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const characterCount = value.length;
  const isOverLimit = characterCount > maxLength;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Question Display */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
              personality === 'consultant' ? 'bg-blue-500' :
              personality === 'analyst' ? 'bg-purple-500' :
              personality === 'strategist' ? 'bg-green-500' :
              'bg-orange-500'
            }`}>
              {personality === 'consultant' ? '💼' :
               personality === 'analyst' ? '📊' :
               personality === 'strategist' ? '🎯' :
               '🧠'}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">{question}</p>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              className={`w-full px-4 py-3 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isFocused 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-200 bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ minHeight: `${rows * 1.5}rem` }}
            />
            
            {/* Character Counter */}
            <AnimatePresence>
              {isFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-2 right-2 text-xs"
                >
                  <span className={`${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
                    {characterCount}/{maxLength}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSend}
            disabled={!value.trim() || disabled || isOverLimit}
            className={`mt-3 w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              value.trim() && !disabled && !isOverLimit
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Send Response</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </motion.button>

          {/* Helper Text */}
          {isOverLimit && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-red-500 text-center"
            >
              Please keep your response under {maxLength} characters
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
} 