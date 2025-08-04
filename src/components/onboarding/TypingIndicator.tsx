import React from 'react';
import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3 mb-6"
    >
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg flex-shrink-0">
        AI
      </div>
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <motion.div
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-white/60 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        <p className="text-xs text-white/60 mt-3">AI is analyzing your responses...</p>
      </div>
    </motion.div>
  );
} 