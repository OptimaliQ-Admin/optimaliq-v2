"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStep, OnboardingQuestion, OnboardingResponse, OnboardingQuestionOption } from '@/lib/services/onboarding/StructuredOnboardingService';

interface StructuredOnboardingFormProps {
  sessionId: string;
  currentStep: OnboardingStep;
  totalSteps: number;
  progress: number;
  onSubmit: (answers: OnboardingResponse[]) => Promise<void>;
  onComplete: () => void;
}

export default function StructuredOnboardingForm({
  sessionId,
  currentStep,
  totalSteps,
  progress,
  onSubmit,
  onComplete
}: StructuredOnboardingFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize answers for current step
  useEffect(() => {
    const initialAnswers: Record<string, any> = {};
    currentStep.questions.forEach(question => {
      if (question.type === 'multi_select') {
        initialAnswers[question.id] = [];
      } else {
        initialAnswers[question.id] = '';
      }
    });
    setAnswers(initialAnswers);
    setErrors({});
  }, [currentStep]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error when user starts answering
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateAnswers = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    currentStep.questions.forEach(question => {
      const answer = answers[question.id];
      
      if (question.required) {
        if (question.type === 'multi_select') {
          if (!Array.isArray(answer) || answer.length === 0) {
            newErrors[question.id] = 'Please select at least one option';
          }
        } else if (!answer || (answer || '').toString().trim() === '') {
          newErrors[question.id] = 'This field is required';
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const responses: OnboardingResponse[] = currentStep.questions.map(question => ({
        questionId: question.id,
        answer: answers[question.id],
        timestamp: new Date().toISOString()
      }));

      await onSubmit(responses);
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = (question: OnboardingQuestion) => {
    const value = answers[question.id];
    const error = errors[question.id];

    switch (question.type) {
      case 'text':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.description && (
              <p className="text-sm text-gray-600 mb-3">{question.description}</p>
            )}
            <textarea
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your answer..."
              rows={question.rows || 3}
              maxLength={question.maxLength}
            />
            {question.maxLength && (
              <p className="text-xs text-gray-500 mt-1">
                {(value || '').toString().length}/{question.maxLength} characters
              </p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            {question.helpText && (
              <p className="text-gray-500 text-sm mt-1">{question.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.description && (
              <p className="text-sm text-gray-600 mb-3">{question.description}</p>
            )}
            <select
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option...</option>
              {question.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'multi_select':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.description && (
              <p className="text-sm text-gray-600 mb-3">{question.description}</p>
            )}
            <div className="space-y-3">
              {question.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                const optionDescription = typeof option === 'string' ? undefined : option.description;
                
                return (
                  <label key={optionValue} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Array.isArray(value) && value.includes(optionValue)}
                      onChange={(e) => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const maxSelect = question.maxSelect || 999;
                        
                        let newValues;
                        if (e.target.checked) {
                          if (currentValues.length >= maxSelect) {
                            newValues = [...currentValues.slice(1), optionValue];
                          } else {
                            newValues = [...currentValues, optionValue];
                          }
                        } else {
                          newValues = currentValues.filter(v => v !== optionValue);
                        }
                        handleAnswerChange(question.id, newValues);
                      }}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-700">{optionLabel}</span>
                      {optionDescription && (
                        <p className="text-xs text-gray-500 mt-1">{optionDescription}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
            {question.maxSelect && (
              <p className="text-xs text-gray-500 mt-2">
                Select up to {question.maxSelect} options
              </p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'number':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value || ''}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a number..."
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      case 'rank':
        return (
          <div key={question.id} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {question.description && (
              <p className="text-sm text-gray-600 mb-3">{question.description}</p>
            )}
            <div className="space-y-2">
              {Array.isArray(question.options) && question.options.map((option, index) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                const currentRank = Array.isArray(value) ? value.indexOf(optionValue) + 1 : index + 1;
                
                return (
                  <div key={optionValue} className="flex items-center p-3 border border-gray-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {currentRank}
                    </div>
                    <span className="text-sm text-gray-700">{optionLabel}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Drag to reorder (not implemented yet - using default order)
            </p>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep.order} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Step Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.title}</h2>
        <p className="text-gray-600">{currentStep.description}</p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {currentStep.questions.map(renderQuestion)}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : currentStep.order === totalSteps ? 'Complete Onboarding' : 'Continue'}
        </button>
      </div>
    </div>
  );
} 