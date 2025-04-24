"use client";

import React from "react";

type ProgressBarProps = {
  current: number; // 0-based index
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const step = Math.min(current + 1, total);
  const percent = Math.round((step / total) * 100);

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center text-sm text-gray-700 font-medium mb-2">
        <span>Step {step} of {total}</span>
        <span>{percent}% Complete</span>
      </div>

      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className="bg-indigo-600 h-full transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
