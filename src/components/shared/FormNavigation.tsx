"use client";

import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit?: () => void;
  isValid: boolean;
  isSubmitting?: boolean;
  nextLabel?: string;
  previousLabel?: string;
  submitLabel?: string;
  className?: string;
}

export default function FormNavigation({
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSubmit,
  isValid,
  isSubmitting = false,
  nextLabel = "Continue",
  previousLabel = "Back",
  submitLabel = "Submit",
  className = ""
}: FormNavigationProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const showSubmit = isLastStep && onSubmit;

  return (
    <div className={`flex items-center justify-between pt-8 border-t border-gray-200 ${className}`}>
      {/* Previous Button */}
      <motion.button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep || isSubmitting}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
          isFirstStep || isSubmitting
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
        }`}
        whileHover={!isFirstStep && !isSubmitting ? { scale: 1.02 } : {}}
        whileTap={!isFirstStep && !isSubmitting ? { scale: 0.98 } : {}}
      >
        <ArrowLeftIcon className="w-5 h-5" />
        {previousLabel}
      </motion.button>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'bg-blue-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Next/Submit Button */}
      <motion.button
        type="button"
        onClick={showSubmit ? onSubmit : onNext}
        disabled={!isValid || isSubmitting}
        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
          !isValid || isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : showSubmit
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl'
        }`}
        whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
        whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>{showSubmit ? submitLabel : nextLabel}</span>
            {!showSubmit && <ArrowRightIcon className="w-5 h-5" />}
          </>
        )}
      </motion.button>
    </div>
  );
} 