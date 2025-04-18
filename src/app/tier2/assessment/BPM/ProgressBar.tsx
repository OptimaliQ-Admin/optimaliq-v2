//src/app/tier2/assessment/BPM/ProgressBar.tsx
"use client";

import React from "react";

type ProgressBarProps = {
  current: number;  // Current step (0-based)
  total: number;    // Total number of steps
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = ((current + 1) / total) * 100;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
        <span>Step {current + 1} of {total}</span>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
