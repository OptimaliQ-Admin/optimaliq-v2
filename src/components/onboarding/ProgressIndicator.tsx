import React from 'react';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentSection?: string;
}

export default function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  currentSection 
}: ProgressIndicatorProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg">
            {currentStep}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              Question {currentStep} of {totalSteps}
            </h2>
            {currentSection && (
              <p className="text-white/70 text-sm truncate">{currentSection}</p>
            )}
          </div>
        </div>
        <div className="text-white/80 text-sm flex-shrink-0 font-medium">
          {Math.round(progress)}% complete
        </div>
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 