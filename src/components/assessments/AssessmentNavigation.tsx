"use client";

import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PauseIcon,
  PlayIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";

interface AssessmentNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  onPause: () => void;
  onResume: () => void;
  progress: number;
  canGoBack: boolean;
  canGoNext: boolean;
  isPaused: boolean;
  isLastQuestion: boolean;
  timeElapsed: number;
  estimatedTimeRemaining?: number;
}

export default function AssessmentNavigation({
  currentQuestion,
  totalQuestions,
  onNext,
  onPrevious,
  onSubmit,
  onPause,
  onResume,
  progress,
  canGoBack,
  canGoNext,
  isPaused,
  isLastQuestion,
  timeElapsed,
  estimatedTimeRemaining
}: AssessmentNavigationProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
    >
      {/* Progress Overview */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{currentQuestion}</div>
            <div className="text-xs text-gray-600">Current</div>
          </div>
          
          <div className="text-gray-400">
            <ArrowRightIcon className="w-5 h-5" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Time Display */}
          <div className="text-right">
            <div className="text-sm font-bold text-gray-900">{formatTime(timeElapsed)}</div>
            <div className="text-xs text-gray-600">Time Elapsed</div>
          </div>

          {/* Pause/Resume Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPaused ? onResume : onPause}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isPaused
                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
            }`}
          >
            {isPaused ? (
              <PlayIcon className="w-5 h-5" />
            ) : (
              <PauseIcon className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onPrevious}
          disabled={!canGoBack}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            canGoBack
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Previous
        </motion.button>

        {/* Question Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: Math.min(5, totalQuestions) }, (_, i) => {
            const questionIndex = i + 1;
            const isCurrent = questionIndex === currentQuestion;
            const isCompleted = questionIndex < currentQuestion;
            
            return (
              <motion.div
                key={questionIndex}
                whileHover={{ scale: 1.1 }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'bg-blue-500 shadow-md'
                    : isCompleted
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            );
          })}
          
          {totalQuestions > 5 && (
            <div className="text-xs text-gray-500">
              +{totalQuestions - 5} more
            </div>
          )}
        </div>

        {/* Next/Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isLastQuestion ? onSubmit : onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
            canGoNext
              ? isLastQuestion
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLastQuestion ? (
            <>
              <CheckIcon className="w-4 h-4" />
              Complete Assessment
            </>
          ) : (
            <>
              Next
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>

      {/* Estimated Time Remaining */}
      {estimatedTimeRemaining && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2">
            <QuestionMarkCircleIcon className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              Estimated time remaining: {estimatedTimeRemaining} minutes
            </span>
          </div>
        </div>
      )}

      {/* Pause Status */}
      {isPaused && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-2">
            <PauseIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 font-medium">
              Assessment paused. Click play to resume.
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 