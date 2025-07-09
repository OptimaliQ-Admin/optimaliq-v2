"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PerformanceMetricsProps {
  score: number;
  industryAvg: number;
  topPerformer: number;
  className?: string;
}

interface MetricBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  showValue?: boolean;
  className?: string;
}

function MetricBar({ label, value, maxValue, color, showValue = true, className = "" }: MetricBarProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm font-semibold text-gray-900">{value.toFixed(1)}</span>
        )}
      </div>
      
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function PerformanceMetrics({
  score,
  industryAvg,
  topPerformer,
  className = ""
}: PerformanceMetricsProps) {
  const getScoreColor = (value: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (value: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 80) return "Excellent";
    if (percentage >= 60) return "Good";
    if (percentage >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <motion.div
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Score Breakdown */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Performance Breakdown</h4>
        
        <MetricBar
          label="Your Score"
          value={score}
          maxValue={topPerformer}
          color={getScoreColor(score)}
          className="mb-4"
        />
        
        <MetricBar
          label="Industry Average"
          value={industryAvg}
          maxValue={topPerformer}
          color="bg-gray-400"
          showValue={false}
        />
        
        <MetricBar
          label="Top Performer"
          value={topPerformer}
          maxValue={topPerformer}
          color="bg-purple-500"
          showValue={false}
        />
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h5 className="font-semibold text-gray-900">Performance Summary</h5>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            getScoreColor(score).replace('bg-', 'text-').replace('-500', '-700')
          } ${getScoreColor(score).replace('bg-', 'bg-').replace('-500', '-100')}`}>
            {getScoreLabel(score)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((score / industryAvg) * 100)}%
            </div>
            <div className="text-gray-600">vs Industry Avg</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((score / topPerformer) * 100)}%
            </div>
            <div className="text-gray-600">of Top Performer</div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        <h5 className="font-semibold text-gray-900">Key Insights</h5>
        
        <div className="space-y-2">
          {score > industryAvg ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                             <span className="text-gray-700">
                 You&apos;re performing <strong>{Math.round((score / industryAvg - 1) * 100)}% better</strong> than the industry average
               </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                             <span className="text-gray-700">
                 You&apos;re <strong>{Math.round((1 - score / industryAvg) * 100)}% below</strong> the industry average
               </span>
            </div>
          )}
          
          <div className="flex items-start gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-700">
              You need <strong>{Math.round((topPerformer - score) / topPerformer * 100)}% improvement</strong> to reach top performer level
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 