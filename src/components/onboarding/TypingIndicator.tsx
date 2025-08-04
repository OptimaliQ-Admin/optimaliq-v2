import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface TypingIndicatorProps {
  message?: string;
  showThinking?: boolean;
}

export default function TypingIndicator({ 
  message = "AI is thinking...", 
  showThinking = true 
}: TypingIndicatorProps) {
  const [thinkingPhase, setThinkingPhase] = useState(0);
  const thinkingMessages = [
    "Analyzing your response...",
    "Identifying patterns...",
    "Formulating insights...",
    "Preparing next question..."
  ];

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="flex justify-start"
    >
      <div className="max-w-[85%] md:max-w-[70%]">
        <div className="flex items-start space-x-3">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Typing Bubble */}
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                {/* Typing Dots */}
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
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
                      className="text-sm text-gray-600 ml-2"
                    >
                      {thinkingMessages[thinkingPhase]}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <motion.div
                  className="h-1 bg-gray-200 rounded-full overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 