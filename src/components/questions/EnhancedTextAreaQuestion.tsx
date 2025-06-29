"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Props {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export default function EnhancedTextAreaQuestion({
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 300,
  rows = 4,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{question}</h2>
        </div>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed ml-14">{description}</p>
        )}
      </div>

      <div className="relative">
        <textarea
          rows={rows}
          className={`w-full p-6 border-2 rounded-xl text-lg leading-relaxed transition-all duration-200 resize-none focus:outline-none ${
            isFocused
              ? "border-blue-500 bg-white shadow-lg shadow-blue-100"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 right-4 flex items-center space-x-2"
        >
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              isFocused ? "bg-blue-500" : "bg-gray-300"
            }`}
          />
          <span
            className={`text-sm font-medium transition-colors duration-200 ${
              isNearLimit ? "text-amber-600" : "text-gray-500"
            }`}
          >
            {characterCount}/{maxLength}
          </span>
        </motion.div>
      </div>

      {isNearLimit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            {characterCount >= maxLength
              ? "Character limit reached"
              : "Approaching character limit"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 