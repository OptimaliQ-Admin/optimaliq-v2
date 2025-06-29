"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface Props {
  question: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCharacterCount?: boolean;
  required?: boolean;
}

export default function TextAreaQuestion({
  question,
  description,
  value,
  onChange,
  placeholder = "Type your answer here...",
  maxLength = 300,
  showCharacterCount = true,
  required = false,
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const characterCount = value.length;
  const isNearLimit = characterCount > maxLength * 0.8;
  const isOverLimit = characterCount > maxLength;
  const remainingChars = maxLength - characterCount;

  return (
    <motion.div 
      className="max-w-2xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Question Header */}
      <div className="mb-6">
        <motion.div 
          className="flex items-start gap-3 mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <motion.h2 
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {question}
              {required && <span className="text-red-500 ml-1">*</span>}
            </motion.h2>
            {description && (
              <motion.p 
                className="text-gray-600 text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {description}
              </motion.p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Text Area Container */}
      <motion.div
        className={`relative rounded-xl border-2 transition-all duration-300 ${
          isFocused
            ? "border-blue-500 shadow-lg shadow-blue-100"
            : "border-gray-200 hover:border-gray-300"
        } ${isOverLimit ? "border-red-500 shadow-red-100" : ""}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Text Area */}
        <textarea
          rows={4}
          className="w-full p-6 text-lg border-0 rounded-xl focus:outline-none focus:ring-0 resize-none bg-transparent"
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />

        {/* Character Count */}
        {showCharacterCount && (
          <motion.div 
            className="absolute bottom-4 right-4 flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {isOverLimit ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  className="flex items-center gap-1 text-red-500"
                >
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Over limit</span>
                </motion.div>
              ) : isNearLimit ? (
                <motion.div
                  key="warning"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 text-amber-600"
                >
                  <span className="text-sm font-medium">{remainingChars} left</span>
                </motion.div>
              ) : (
                <motion.div
                  key="normal"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 text-gray-500"
                >
                  <span className="text-sm">{characterCount} / {maxLength}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Success Indicator */}
        {characterCount > 0 && !isOverLimit && (
          <motion.div
            className="absolute top-4 right-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}

        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-xl pointer-events-none" />
      </motion.div>

      {/* Helper Text */}
      <AnimatePresence>
        {isOverLimit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-700 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4" />
              Please reduce your response by {Math.abs(remainingChars)} characters
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {showCharacterCount && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isOverLimit
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : isNearLimit
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((characterCount / maxLength) * 100, 100)}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}