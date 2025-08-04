import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypingIndicatorProps {
  message?: string;
  showThinking?: boolean;
}

export default function TypingIndicator({ 
  message = "AI is thinking...", 
  showThinking = true 
}: TypingIndicatorProps) {
  const [dots, setDots] = useState('');
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const thinkingMessages = [
    "Analyzing your response...",
    "Identifying patterns...",
    "Formulating insights...",
    "Preparing next question..."
  ];

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Animate thinking phases
  useEffect(() => {
    if (!showThinking) return;

    const interval = setInterval(() => {
      setThinkingPhase(prev => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showThinking, thinkingMessages.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start space-x-3 p-4"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Typing Bubble */}
      <div className="flex-1">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 max-w-sm">
          <div className="flex items-center space-x-2">
            {/* Typing Dots */}
            <div className="flex space-x-1">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 bg-white/60 rounded-full"
              />
            </div>

            {/* Thinking Message */}
            {showThinking && (
              <AnimatePresence mode="wait">
                <motion.span
                  key={thinkingPhase}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-white/70 text-sm ml-2"
                >
                  {thinkingMessages[thinkingPhase]}
                </motion.span>
              </AnimatePresence>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <motion.div
              className="h-1 bg-white/20 rounded-full overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-2 text-xs text-white/50">
          <span className="flex items-center space-x-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <span>Processing your response</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
} 