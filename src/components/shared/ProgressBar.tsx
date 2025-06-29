//refactor/src/components/shared/ProgressBar.tsx
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@heroicons/react/24/solid";

type ProgressBarProps = {
  current: number;  // Current step (0-based)
  total: number;    // Total number of steps
};

const stepLabels = [
  "Goals & Metrics",
  "Positioning",
  "Operations",
  "Growth Stack",
  "Clarity",
  "Benchmarks",
  "Business Overview",
  "Final Review"
];

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-8">
      {/* Enhanced Progress Bar */}
      <div className="relative">
        {/* Background Track */}
        <div className="w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Animated Progress Fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: total }, (_, index) => {
            const isCompleted = index < current;
            const isCurrent = index === current;
            const isFuture = index > current;

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Step Circle */}
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : isCurrent
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg ring-4 ring-blue-200"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckIcon className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {index + 1}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Step Label */}
                <motion.div
                  className={`mt-2 text-xs font-medium text-center max-w-20 ${
                    isCompleted
                      ? "text-green-600"
                      : isCurrent
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {stepLabels[index]}
                </motion.div>

                {/* Connection Line */}
                {index < total - 1 && (
                  <div className="absolute top-5 left-full w-full h-0.5 bg-gray-200 -z-10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      initial={{ width: 0 }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Stats */}
      <motion.div
        className="flex justify-between items-center mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">{current + 1}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Step {current + 1} of {total}
            </p>
            <p className="text-xs text-gray-600">
              {stepLabels[current]}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            {Math.round(percent)}%
          </motion.div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </motion.div>
    </div>
  );
}
