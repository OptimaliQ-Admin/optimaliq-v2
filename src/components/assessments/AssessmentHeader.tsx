"use client";

import { motion } from "framer-motion";
import { 
  ClockIcon, 
  QuestionMarkCircleIcon, 
  ChartBarIcon,
  LightBulbIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

interface AssessmentHeaderProps {
  title: string;
  description: string;
  estimatedTime: number; // in minutes
  questionsCount: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastScore?: number | null;
  lastTakenDate?: string | null;
}

export default function AssessmentHeader({
  title,
  description,
  estimatedTime,
  questionsCount,
  category,
  difficulty,
  lastScore,
  lastTakenDate
}: AssessmentHeaderProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'from-green-500 to-emerald-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-600';
      case 'advanced':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Standard';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{title}</h1>
              <p className="text-gray-600 mt-1">{category} Assessment</p>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-700 leading-relaxed max-w-3xl"
          >
            {description}
          </motion.p>
        </div>

        {/* Difficulty Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex-shrink-0"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${getDifficultyColor(difficulty)} text-white shadow-lg`}>
            <div className="w-2 h-2 bg-white rounded-full" />
            {getDifficultyLabel(difficulty)}
          </div>
        </motion.div>
      </div>

      {/* Assessment Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Time Estimate */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
            <ClockIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Estimated Time</p>
            <p className="text-lg font-bold text-gray-900">{estimatedTime} minutes</p>
          </div>
        </div>

        {/* Questions Count */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
            <QuestionMarkCircleIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Questions</p>
            <p className="text-lg font-bold text-gray-900">{questionsCount} total</p>
          </div>
        </div>

        {/* Previous Score */}
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
            <LightBulbIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">Previous Score</p>
            <p className="text-lg font-bold text-gray-900">
              {lastScore ? `${lastScore.toFixed(1)}/5.0` : 'Not taken'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      {lastTakenDate && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Last completed: {new Date(lastTakenDate).toLocaleDateString()}</p>
              <p className="text-xs text-gray-600">You can retake this assessment to track your progress</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 