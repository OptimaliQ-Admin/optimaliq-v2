"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Props {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export default function TextAreaQuestion({
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 300,
}: Props) {
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isAtLimit = characterCount >= maxLength;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-start space-x-3 mb-4"
        variants={itemVariants}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
          <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
          {description && (
            <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
          )}
        </div>
      </motion.div>

      <motion.div
        className="relative"
        variants={itemVariants}
      >
        <textarea
          rows={4}
          className={`w-full p-6 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all duration-200 resize-none ${
            isAtLimit
              ? "border-red-300 bg-red-50"
              : isNearLimit
              ? "border-amber-300 bg-amber-50"
              : "border-gray-200 focus:border-blue-500 bg-white"
          }`}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight: "120px" }}
        />
        
        <motion.div
          className={`flex justify-between items-center mt-3 px-2 ${
            isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-gray-500"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-sm font-medium">
            {isAtLimit && "⚠️ Character limit reached"}
            {isNearLimit && !isAtLimit && "⚠️ Approaching character limit"}
          </span>
          <span className={`text-sm font-mono ${
            isAtLimit ? "text-red-600" : isNearLimit ? "text-amber-600" : "text-gray-500"
          }`}>
            {characterCount} / {maxLength}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}