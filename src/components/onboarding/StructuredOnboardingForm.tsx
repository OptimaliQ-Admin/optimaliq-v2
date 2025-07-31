"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { OnboardingStep, OnboardingQuestion, OnboardingResponse } from '@/lib/services/onboarding/StructuredOnboardingService';

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
        } else if (!answer || answer.toString().trim() === '') {
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
            <input
              type="text"
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your answer..."
            />
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
            <select
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select an option...</option>
              {question.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
            <div className="space-y-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleAnswerChange(question.id, newValues);
                    }}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
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
              value={value}
              onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter a number..."
            />
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