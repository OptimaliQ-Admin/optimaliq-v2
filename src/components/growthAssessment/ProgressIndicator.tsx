"use client";

import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";

interface ProgressStep {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: ProgressStep[];
  className?: string;
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  steps,
  className = ""
}: ProgressIndicatorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Step {currentStep} of {totalSteps}</h2>
        <div className="text-sm text-gray-500">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </div>
      </div>

      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        
        {/* Progress Bar Fill */}
        <motion.div
          className="absolute top-4 left-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-green-500 text-white'
                    : step.status === 'current'
                    ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                {step.status === 'completed' ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </motion.div>

              {/* Step Content */}
              <motion.div
                className="mt-3 text-center max-w-32"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
              >
                <h3 className={`text-sm font-semibold ${
                  step.status === 'completed'
                    ? 'text-green-600'
                    : step.status === 'current'
                    ? 'text-blue-600'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Details */}
      <motion.div
        className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">{currentStep}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {steps[currentStep - 1]?.title}
            </h3>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 