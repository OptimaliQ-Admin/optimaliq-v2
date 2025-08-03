import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Check, AlertCircle } from 'lucide-react';
import { Question } from '@/lib/services/onboarding/QuestionFlowManager';

interface InlineQuestionInputProps {
  questions: Question[];
  onSubmit: (responses: Record<string, any>) => void;
  isSubmitting: boolean;
}

export default function InlineQuestionInput({ 
  questions, 
  onSubmit, 
  isSubmitting 
}: InlineQuestionInputProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (questionId: string, value: any) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateResponses = (): boolean => {
    const newErrors: Record<string, string> = {};

    questions.forEach(question => {
      const response = responses[question.id];

      // Check required fields
      if (question.required && (!response || (Array.isArray(response) && response.length === 0))) {
        newErrors[question.id] = 'This field is required';
        return;
      }

      // Validate text area length
      if (question.type === 'text_area' && question.validation && response) {
        if (question.validation.minLength && response.length < question.validation.minLength) {
          newErrors[question.id] = `Must be at least ${question.validation.minLength} characters`;
        }
        if (question.validation.maxLength && response.length > question.validation.maxLength) {
          newErrors[question.id] = `Must be less than ${question.validation.maxLength} characters`;
        }
      }

      // Validate multi-select max
      if (question.type === 'multi_select' && question.maxSelect && Array.isArray(response)) {
        if (response.length > question.maxSelect) {
          newErrors[question.id] = `Maximum ${question.maxSelect} selections allowed`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateResponses()) {
      onSubmit(responses);
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = responses[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'text_area':
        return (
          <div className="space-y-2">
            <textarea
              value={value || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder="Type your answer here..."
              className={`w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-300' : 'border-gray-300'
              }`}
              rows={4}
              maxLength={question.validation?.maxLength}
            />
            {question.validation?.maxLength && (
              <div className="text-xs text-gray-500 text-right">
                {value?.length || 0} / {question.validation.maxLength}
              </div>
            )}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'multi_select':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleInputChange(question.id, newValues);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
            {question.maxSelect && (
              <div className="text-xs text-gray-500">
                Select up to {question.maxSelect} options
              </div>
            )}
          </div>
        );

      case 'rank_order':
        return (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 mb-3">
              Drag to reorder or click to select:
            </div>
            {question.options?.map((option, index) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-2 border border-gray-200 rounded cursor-move hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-gray-500 w-6">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 flex-1">{option}</span>
                <input
                  type="hidden"
                  value={option}
                  name={`${question.id}_${index}`}
                />
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-900">
              {question.prompt}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {errors[question.id] && (
              <div className="flex items-center space-x-1 text-red-600 text-sm">
                <AlertCircle size={14} />
                <span>{errors[question.id]}</span>
              </div>
            )}
          </div>
          
          {renderQuestionInput(question)}
        </div>
      ))}

      <motion.button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Continue</span>
          </>
        )}
      </motion.button>
    </div>
  );
} 