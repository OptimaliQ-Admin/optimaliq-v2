"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  current: number;
  total: number;
  steps?: string[];
};

export default function EnhancedProgressBar({ current, total, steps }: Props) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm font-medium text-gray-600">
            Step {current + 1} of {total}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progress)}% Complete
          </span>
        </div>
      </div>

      {/* Step Indicators */}
      {steps && (
        <div className="flex justify-between mt-6">
          {steps.map((step, index) => {
            const isCompleted = index < current;
            const isCurrent = index === current;
            const isUpcoming = index > current;

            return (
              <div key={index} className="flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={isCompleted || isCurrent ? { scale: 1.1 } : {}}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <span
                  className={`text-xs mt-2 text-center max-w-20 ${
                    isCurrent
                      ? "text-blue-600 font-medium"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 