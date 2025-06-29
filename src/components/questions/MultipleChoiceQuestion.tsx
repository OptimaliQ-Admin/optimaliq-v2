"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckIcon,
  CircleStackIcon
} from "@heroicons/react/24/outline";

interface Option {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface Props {
  question: string;
  description?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function MultipleChoiceQuestion({
  question,
  description,
  options,
  value,
  onChange,
  required = false,
}: Props) {
  return (
    <motion.div 
      className="mb-8"
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
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
            <CircleStackIcon className="w-5 h-5 text-white" />
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

      {/* Options Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {options.map((opt, index) => {
            const isSelected = value === opt.value;
            
            return (
              <motion.label
                key={opt.value}
                className={`relative cursor-pointer group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(opt.value)}
              >
                <motion.div
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg shadow-purple-100"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                  animate={{
                    scale: isSelected ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Selection Indicator */}
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${
                        isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-600 border-purple-500"
                          : "bg-white border-gray-300 group-hover:border-purple-400"
                      }`}
                      animate={{
                        scale: isSelected ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AnimatePresence mode="wait">
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CheckIcon className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {opt.icon && (
                          <span className="text-xl">{opt.icon}</span>
                        )}
                        <span className={`font-semibold text-lg ${
                          isSelected ? "text-purple-900" : "text-gray-900"
                        }`}>
                          {opt.label}
                        </span>
                      </div>
                      {opt.description && (
                        <p className={`text-sm ${
                          isSelected ? "text-purple-700" : "text-gray-600"
                        }`}>
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {/* Hidden Radio Input */}
                    <input
                      type="radio"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => onChange(opt.value)}
                    />
                  </div>

                  {/* Background Pattern */}
                  <div className={`absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 ${
                    isSelected 
                      ? "bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-100" 
                      : "opacity-0"
                  }`} />
                </motion.div>

                {/* Selection Glow Effect */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.label>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selection Status */}
      {value && (
        <motion.div
          className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Option Selected</p>
              <p className="text-sm text-green-700">
                {options.find(opt => opt.value === value)?.label}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}