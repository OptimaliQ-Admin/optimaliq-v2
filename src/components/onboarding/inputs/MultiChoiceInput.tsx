"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiChoiceInputProps {
  question: string;
  options: Option[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  personality?: string;
  layout?: 'cards' | 'list';
}

export default function MultiChoiceInput({
  question,
  options,
  onSelect,
  disabled = false,
  personality = 'consultant',
  layout = 'cards'
}: MultiChoiceInputProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    if (!disabled) {
      setSelectedValue(value);
      onSelect(value);
    }
  };

  const getPersonalityConfig = () => {
    switch (personality) {
      case 'consultant':
        return {
          icon: '💼',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50'
        };
      case 'analyst':
        return {
          icon: '📊',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-pink-50'
        };
      case 'strategist':
        return {
          icon: '🎯',
          color: 'green',
          gradient: 'from-green-500 to-green-600',
          bgGradient: 'from-green-50 to-emerald-50'
        };
      case 'mentor':
        return {
          icon: '🧠',
          color: 'orange',
          gradient: 'from-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-amber-50'
        };
      default:
        return {
          icon: '💼',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50'
        };
    }
  };

  const config = getPersonalityConfig();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Question Header */}
        <div className={`px-6 py-4 bg-gradient-to-r ${config.bgGradient} border-b border-gray-100`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-medium bg-gradient-to-r ${config.gradient}`}>
              {config.icon}
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-semibold text-lg">{question}</p>
              <p className="text-gray-600 text-sm mt-1">Select the option that best describes your situation</p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="p-6">
          <div className={`grid gap-3 ${
            layout === 'cards' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1'
          }`}>
            <AnimatePresence>
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: disabled ? 1 : 1.02,
                    y: disabled ? 0 : -2
                  }}
                  whileTap={{ scale: disabled ? 1 : 0.98 }}
                >
                  <button
                    onClick={() => handleSelect(option.value)}
                    disabled={disabled}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedValue === option.value
                        ? `border-${config.color}-500 bg-${config.color}-50 shadow-lg`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Radio Button */}
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedValue === option.value
                          ? `border-${config.color}-500 bg-${config.color}-500`
                          : 'border-gray-300'
                      }`}>
                        {selectedValue === option.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium ${
                          selectedValue === option.value 
                            ? `text-${config.color}-800` 
                            : 'text-gray-800'
                        }`}>
                          {option.label}
                        </h3>
                        {option.description && (
                          <p className={`text-sm mt-1 ${
                            selectedValue === option.value 
                              ? `text-${config.color}-600` 
                              : 'text-gray-500'
                          }`}>
                            {option.description}
                          </p>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {selectedValue === option.value && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center`}
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Helper Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-500 mt-4"
          >
            Click on an option to continue
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
} 