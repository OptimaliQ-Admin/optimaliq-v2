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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {currentStep}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Step {currentStep} of {totalSteps}
            </h2>
            {currentSection && (
              <p className="text-sm text-gray-600">{currentSection}</p>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 