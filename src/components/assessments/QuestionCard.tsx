"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QuestionMarkCircleIcon,
  LightBulbIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface QuestionOption {
  value: string;
  label: string;
  score?: number;
  description?: string;
}

interface Question {
  id: string;
  text: string;
  type: 'multiple_choice' | 'scale' | 'text' | 'boolean';
  options?: QuestionOption[];
  required: boolean;
  category: string;
  hint?: string;
  explanation?: string;
}

interface QuestionCardProps {
  question: Question;
  currentAnswer?: string | number;
  onAnswer: (answer: string | number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  isLastQuestion: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  currentAnswer,
  onAnswer,
  onNext,
  onPrevious,
  canGoBack,
  canGoNext,
  isLastQuestion,
  questionNumber,
  totalQuestions
}: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (value: string | number) => {
    onAnswer(value);
  };

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleOptionSelect(option.value)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
                  currentAnswer === option.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                    currentAnswer === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {currentAnswer === option.value && (
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-gray-600">{option.description}</div>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case 'scale':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {currentAnswer ? `${currentAnswer}/5` : 'Select a rating'}
              </div>
              <div className="text-sm text-gray-600">Rate from 1 (Not at all) to 5 (Extremely)</div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <motion.button
                  key={value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: value * 0.1 }}
                  onClick={() => handleOptionSelect(value)}
                  className={`flex-1 aspect-square rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center ${
                    currentAnswer === value
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className={`text-2xl font-bold ${
                    currentAnswer === value ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {value === 1 && 'Not at all'}
                    {value === 2 && 'Slightly'}
                    {value === 3 && 'Moderately'}
                    {value === 4 && 'Very'}
                    {value === 5 && 'Extremely'}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <textarea
              value={currentAnswer as string || ''}
              onChange={(e) => handleOptionSelect(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
              rows={4}
            />
            <div className="text-sm text-gray-500">
              {currentAnswer ? `${(currentAnswer as string).length} characters` : '0 characters'}
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div className="flex gap-4">
            {[
              { value: 'true', label: 'Yes', color: 'from-green-500 to-emerald-600' },
              { value: 'false', label: 'No', color: 'from-red-500 to-pink-600' }
            ].map((option) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleOptionSelect(option.value)}
                className={`flex-1 p-6 rounded-xl border-2 transition-all duration-200 ${
                  currentAnswer === option.value
                    ? `border-transparent bg-gradient-to-r ${option.color} text-white shadow-lg`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">{option.label}</div>
                  <div className="text-sm opacity-80">
                    {option.value === 'true' ? 'This applies to us' : 'This does not apply'}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8"
    >
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <QuestionMarkCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm text-gray-600 font-medium mb-1">
              Question {questionNumber} of {totalQuestions}
            </div>
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {question.category}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {question.hint && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHint(!showHint)}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </motion.button>
          )}
          
          {question.required && (
            <div className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">
              Required
            </div>
          )}
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed mb-4">
          {question.text}
        </h2>
        
        <AnimatePresence>
          {showHint && question.hint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <div className="flex items-start gap-3">
                <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-blue-900 mb-1">Hint</div>
                  <div className="text-sm text-blue-800">{question.hint}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        {renderQuestionContent()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            canGoBack
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </motion.button>

        <div className="flex items-center gap-4">
          {question.explanation && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Why we ask this?
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!canGoNext}
            className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
              canGoNext
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next Question'}
          </motion.button>
        </div>
      </div>

      {/* Explanation Modal */}
      <AnimatePresence>
        {showExplanation && question.explanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowExplanation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <LightBulbIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Why we ask this?</h3>
                  <p className="text-sm text-gray-600">Understanding the purpose</p>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                {question.explanation}
              </p>
              
              <button
                onClick={() => setShowExplanation(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-medium"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 