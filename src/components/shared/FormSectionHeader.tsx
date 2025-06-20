// src/components/shared/FormSectionHeader.tsx
"use client";

import { motion } from "framer-motion";
import { FaRoad, FaLightbulb } from "react-icons/fa";

export default function FormSectionHeader() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
        <FaRoad className="text-sm" />
        <span>Growth Roadmap Builder</span>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Build Your Growth Roadmap</h1>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
        Answer a few quick questions to receive custom insights on how to scale your business effectively.
      </p>
      
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaLightbulb className="text-yellow-500" />
          <span>AI-powered insights</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>Personalized recommendations</span>
        </div>
      </div>
    </motion.div>
  );
}
