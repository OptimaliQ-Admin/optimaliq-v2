"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface MultiSelectInputProps {
  question: string;
  options: Option[];
  maxSelect?: number;
  onSelect: (values: string[]) => void;
  disabled?: boolean;
  personality?: string;
}

export default function MultiSelectInput({
  question,
  options,
  maxSelect = 5,
  onSelect,
  disabled = false,
  personality = 'consultant'
}: MultiSelectInputProps) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    if (disabled) return;

    setSelectedValues(prev => {
      const isSelected = prev.includes(value);
      let newSelection: string[];

      if (isSelected) {
        // Remove if already selected
        newSelection = prev.filter(v => v !== value);
      } else {
        // Add if not at max limit
        if (prev.length < maxSelect) {
          newSelection = [...prev, value];
        } else {
          // Replace last item if at max limit
          newSelection = [...prev.slice(1), value];
        }
      }

      onSelect(newSelection);
      return newSelection;
    });
  };

  const getPersonalityConfig = () => {
    switch (personality) {
      case 'consultant':
        return {
          icon: '💼',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          tagGradient: 'from-blue-100 to-blue-200'
        };
      case 'analyst':
        return {
          icon: '📊',
          color: 'purple',
          gradient: 'from-purple-500 to-purple-600',
          bgGradient: 'from-purple-50 to-pink-50',
          tagGradient: 'from-purple-100 to-purple-200'
        };
      case 'strategist':
        return {
          icon: '🎯',
          color: 'green',
          gradient: 'from-green-500 to-green-600',
          bgGradient: 'from-green-50 to-emerald-50',
          tagGradient: 'from-green-100 to-green-200'
        };
      case 'mentor':
        return {
          icon: '🧠',
          color: 'orange',
          gradient: 'from-orange-500 to-orange-600',
          bgGradient: 'from-orange-50 to-amber-50',
          tagGradient: 'from-orange-100 to-orange-200'
        };
      default:
        return {
          icon: '💼',
          color: 'blue',
          gradient: 'from-blue-500 to-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          tagGradient: 'from-blue-100 to-blue-200'
        };
    }
  };

  const config = getPersonalityConfig();
  const isAtMax = selectedValues.length >= maxSelect;

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
              <p className="text-gray-600 text-sm mt-1">
                Select up to {maxSelect} options that apply to your business
              </p>
            </div>
          </div>
        </div>

        {/* Selected Tags */}
        <AnimatePresence>
          {selectedValues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-3 bg-gray-50 border-b border-gray-100"
            >
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value, index) => {
                  const option = options.find(opt => opt.value === value);
                  return (
                    <motion.div
                      key={value}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`px-3 py-1 rounded-full bg-gradient-to-r ${config.tagGradient} border border-${config.color}-200 flex items-center space-x-2`}
                    >
                      <span className={`text-${config.color}-800 text-sm font-medium`}>
                        {option?.label || value}
                      </span>
                      <button
                        onClick={() => handleToggle(value)}
                        className={`w-4 h-4 rounded-full bg-${config.color}-500 text-white flex items-center justify-center hover:bg-${config.color}-600 transition-colors`}
                      >
                        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Options */}
        <div className="p-6">
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
            <AnimatePresence>
              {options.map((option, index) => {
                const isSelected = selectedValues.includes(option.value);
                const isDisabled = !isSelected && isAtMax;

                return (
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
                      scale: disabled || isDisabled ? 1 : 1.02,
                      y: disabled || isDisabled ? 0 : -2
                    }}
                    whileTap={{ scale: disabled || isDisabled ? 1 : 0.98 }}
                  >
                    <button
                      onClick={() => handleToggle(option.value)}
                      disabled={disabled || isDisabled}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isSelected
                          ? `border-${config.color}-500 bg-${config.color}-50 shadow-lg`
                          : isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-50'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      } ${disabled || isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start space-x-3">
                        {/* Checkbox */}
                        <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-colors ${
                          isSelected
                            ? `border-${config.color}-500 bg-${config.color}-500`
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium ${
                            isSelected 
                              ? `text-${config.color}-800` 
                              : 'text-gray-800'
                          }`}>
                            {option.label}
                          </h3>
                          {option.description && (
                            <p className={`text-sm mt-1 ${
                              isSelected 
                                ? `text-${config.color}-600` 
                                : 'text-gray-500'
                            }`}>
                              {option.description}
                            </p>
                          )}
                        </div>

                        {/* Selection Count */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {selectedValues.indexOf(option.value) + 1}
                          </motion.div>
                        )}
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Helper Text and Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-4 space-y-3"
          >
            <p className="text-sm text-gray-500">
              {selectedValues.length}/{maxSelect} selected
            </p>
            {isAtMax && (
              <p className="text-xs text-orange-600">
                Maximum selections reached. Click on a selected item to remove it.
              </p>
            )}
            
            {/* Continue Button */}
            {selectedValues.length > 0 && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(selectedValues)}
                disabled={disabled}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : `bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl`
                }`}
              >
                Continue with {selectedValues.length} selection{selectedValues.length !== 1 ? 's' : ''}
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 