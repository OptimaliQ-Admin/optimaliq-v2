"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface Props {
  question: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  rows?: number;
}

export default function EnhancedTextAreaQuestion({
  question,
  description,
  placeholder,
  value,
  onChange,
  maxLength = 500,
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
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{question}</h2>
        {description && (
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        )}
      </div>

      <motion.div
        className={`relative transition-all duration-300 ${
          isFocused ? "scale-[1.02]" : "scale-100"
        }`}
      >
        <div
          className={`relative border-2 rounded-xl transition-all duration-300 ${
            isFocused
              ? "border-blue-500 shadow-lg shadow-blue-100"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="absolute top-4 left-4 text-gray-400">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
          </div>
          
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className="w-full p-4 pl-12 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-400"
          />
          
          <div className="absolute bottom-2 right-2">
            <span
              className={`text-xs font-medium ${
                isNearLimit
                  ? characterCount >= maxLength
                    ? "text-red-500"
                    : "text-amber-500"
                  : "text-gray-400"
              }`}
            >
              {characterCount}/{maxLength}
            </span>
          </div>
        </div>
      </motion.div>

      {characterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
        >
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-700">
              {characterCount} characters
            </span>
            {characterCount >= maxLength && (
              <span className="text-red-600 ml-2">(Maximum reached)</span>
            )}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
} 