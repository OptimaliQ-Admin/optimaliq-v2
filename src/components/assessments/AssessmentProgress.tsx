"use client";

import { motion } from "framer-motion";
import { 
  CheckCircleIcon, 
  ClockIcon,
  ArrowRightIcon,
  PlayIcon
} from "@heroicons/react/24/outline";

interface AssessmentProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  progress: number; // 0-100
  timeElapsed?: number; // in seconds
  estimatedTimeRemaining?: number; // in minutes
  isPaused?: boolean;
}

export default function AssessmentProgress({
  currentQuestion,
  totalQuestions,
  progress,
  timeElapsed = 0,
  estimatedTimeRemaining,
  isPaused = false
}: AssessmentProgressProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'from-red-500 to-red-600';
    if (progress < 50) return 'from-yellow-500 to-orange-600';
    if (progress < 75) return 'from-blue-500 to-indigo-600';
    return 'from-green-500 to-emerald-600';
  };

  const getProgressStatus = (progress: number) => {
    if (progress < 25) return 'Getting Started';
    if (progress < 50) return 'In Progress';
    if (progress < 75) return 'Almost Done';
    return 'Nearly Complete';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8"
    >
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            {isPaused ? (
              <PlayIcon className="w-5 h-5 text-white" />
            ) : (
              <ClockIcon className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Assessment Progress</h3>
            <p className="text-sm text-gray-600">{getProgressStatus(progress)}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {currentQuestion} / {totalQuestions}
          </div>
          <div className="text-sm text-gray-600">Questions</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
        </div>
        
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full relative`}
          >
            {/* Progress Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Question */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">{currentQuestion}</span>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Current</p>
            <p className="text-sm font-bold text-gray-900">Question</p>
          </div>
        </div>

        {/* Time Elapsed */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <ClockIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Time</p>
            <p className="text-sm font-bold text-gray-900">{formatTime(timeElapsed)}</p>
          </div>
        </div>

        {/* Estimated Time Remaining */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <ArrowRightIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs text-gray-600 font-medium">Remaining</p>
            <p className="text-sm font-bold text-gray-900">
              {estimatedTimeRemaining ? `${estimatedTimeRemaining}m` : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Milestones */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Progress Milestones</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        
        <div className="flex items-center gap-2">
          {[25, 50, 75, 100].map((milestone) => (
            <div key={milestone} className="flex-1 flex items-center">
              <div className={`flex-1 h-1 rounded-full ${
                progress >= milestone 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                  : 'bg-gray-200'
              }`} />
              {milestone < 100 && (
                <div className={`w-2 h-2 rounded-full mx-1 ${
                  progress >= milestone 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
        >
          <div className="flex items-center gap-2">
            <PlayIcon className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Assessment paused</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 