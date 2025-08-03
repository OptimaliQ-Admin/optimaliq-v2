import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white">
        AI
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-1">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">AI is thinking...</p>
      </div>
    </motion.div>
  );
} 