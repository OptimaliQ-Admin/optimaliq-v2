"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Phase {
  id: 'introduction' | 'discovery' | 'diagnosis' | 'roadmap';
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface PhaseProgressIndicatorProps {
  currentPhase: Phase['id'];
  progress: number;
}

const phases: Phase[] = [
  {
    id: 'introduction',
    name: 'Introduction',
    description: 'Setting expectations',
    icon: '👋',
    color: 'blue'
  },
  {
    id: 'discovery',
    name: 'Discovery',
    description: 'Understanding your business',
    icon: '🔍',
    color: 'purple'
  },
  {
    id: 'diagnosis',
    name: 'Diagnosis',
    description: 'Analyzing challenges',
    icon: '📊',
    color: 'green'
  },
  {
    id: 'roadmap',
    name: 'Roadmap',
    description: 'Creating strategy',
    icon: '🎯',
    color: 'orange'
  }
];

export default function PhaseProgressIndicator({
  currentPhase,
  progress
}: PhaseProgressIndicatorProps) {
  const currentPhaseIndex = phases.findIndex(phase => phase.id === currentPhase);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Business Discovery</h2>
          <p className="text-sm text-gray-600">Let&apos;s uncover your growth opportunities</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-800">{progress}%</div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white opacity-30 rounded-full"
            />
          </motion.div>
        </div>
      </div>

      {/* Phase Indicators */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((phase, index) => {
          const isCompleted = index < currentPhaseIndex;
          const isCurrent = index === currentPhaseIndex;
          const isUpcoming = index > currentPhaseIndex;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`relative text-center ${
                isCurrent ? 'scale-105' : ''
              }`}
            >
              {/* Phase Circle */}
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                isCompleted
                  ? `bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-600 text-white shadow-md`
                  : isCurrent
                  ? `bg-gradient-to-r from-${phase.color}-500 to-${phase.color}-600 text-white shadow-md ring-2 ring-${phase.color}-200`
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                ) : (
                  phase.icon
                )}
              </div>

              {/* Phase Info */}
              <div className="space-y-0.5">
                <h3 className={`text-xs font-medium ${
                  isCompleted || isCurrent
                    ? `text-${phase.color}-800`
                    : 'text-gray-400'
                }`}>
                  {phase.name}
                </h3>
                <p className={`text-xs ${
                  isCompleted || isCurrent
                    ? 'text-gray-600'
                    : 'text-gray-400'
                }`}>
                  {phase.description}
                </p>
              </div>

              {/* Current Phase Indicator */}
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-${phase.color}-500 border border-white`}
                />
              )}

              {/* Connection Line */}
              {index < phases.length - 1 && (
                <div className="absolute top-4 left-full w-full h-0.5 bg-gray-200 -z-10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: isCompleted ? '100%' : isCurrent ? `${progress - (index * 25)}%` : '0%'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 