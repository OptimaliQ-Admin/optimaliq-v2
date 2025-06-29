"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: string;
}

interface Props {
  question: string;
  description?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  variant?: "cards" | "list";
}

export default function EnhancedMultipleChoiceQuestion({
  question,
  description,
  options,
  value,
  onChange,
  variant = "cards",
}: Props) {
  const renderCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        
        return (
          <motion.div
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer"
            onClick={() => onChange(opt.value)}
          >
            <div
              className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg shadow-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{opt.label}</h3>
                  {opt.description && (
                    <p className="text-sm text-gray-600">{opt.description}</p>
                  )}
                </div>
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckIcon className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderList = () => (
    <div className="mt-6 space-y-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        
        return (
          <motion.div
            key={opt.value}
            whileHover={{ x: 4 }}
            className="cursor-pointer"
            onClick={() => onChange(opt.value)}
          >
            <div
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{opt.label}</span>
                  {opt.description && (
                    <p className="text-sm text-gray-600 mt-1">{opt.description}</p>
                  )}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckIcon className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

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

      {variant === "cards" ? renderCards() : renderList()}
    </motion.div>
  );
} 