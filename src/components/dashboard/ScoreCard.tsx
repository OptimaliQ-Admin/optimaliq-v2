//src/components/dashboard/ScoreCard.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface ScoreCardProps {
  title: string;
  icon?: string;
  score: number;
  industryAvg?: number;
  topPerformer?: number;
  description?: string;
  onLearnMore?: () => void;
}

export default function ScoreCard({
  title,
  icon,
  score,
  industryAvg,
  topPerformer,
  description,
  onLearnMore,
}: ScoreCardProps) {
  const getScoreColor = (score: number, topPerformer: number) => {
    const percentage = (score / topPerformer) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number, topPerformer: number) => {
    const percentage = (score / topPerformer) * 100;
    if (percentage >= 80) return "bg-green-50";
    if (percentage >= 60) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getScoreBorderColor = (score: number, topPerformer: number) => {
    const percentage = (score / topPerformer) * 100;
    if (percentage >= 80) return "border-green-200";
    if (percentage >= 60) return "border-yellow-200";
    return "border-red-200";
  };

  const getPerformanceZone = (value: number, topPerformer: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 90) return { zone: "Excellence", color: "#10b981", bg: "#d1fae5" };
    if (percentage >= 75) return { zone: "Competitive", color: "#f59e0b", bg: "#fef3c7" };
    if (percentage >= 60) return { zone: "Developing", color: "#ef4444", bg: "#fee2e2" };
    return { zone: "Needs Focus", color: "#dc2626", bg: "#fecaca" };
  };

  const getTrendDirection = (value: number, industryAvg: number) => {
    const diff = value - industryAvg;
    if (diff > 0.5) return { direction: "up", color: "#10b981", percentage: Math.round((diff / industryAvg) * 100) };
    if (diff < -0.5) return { direction: "down", color: "#ef4444", percentage: Math.round((Math.abs(diff) / industryAvg) * 100) };
    return { direction: "stable", color: "#6b7280", percentage: 0 };
  };

  const getExplanation = () => {
    if (!industryAvg || !topPerformer) return null;
    
    const vsIndustry = ((score / industryAvg) * 100 - 100);
    const vsTopPerformer = (score / topPerformer) * 100;
    
    return {
      vsIndustry: vsIndustry > 0 
        ? `You're ${Math.round(vsIndustry)}% above industry avg`
        : `You're ${Math.round(Math.abs(vsIndustry))}% below industry avg`,
      vsTopPerformer: `You're operating at ${Math.round(vsTopPerformer)}% of top performer`,
      performanceZone: getPerformanceZone(score, topPerformer).zone
    };
  };

  const explanation = getExplanation();
  const performanceZone = topPerformer ? getPerformanceZone(score, topPerformer) : null;
  const trend = industryAvg ? getTrendDirection(score, industryAvg) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border ${getScoreBorderColor(score, topPerformer || 100)} p-6 hover:shadow-lg transition-all duration-200 ${onLearnMore ? 'cursor-pointer' : ''}`}
      onClick={onLearnMore}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${getScoreBgColor(score, topPerformer || 100)} rounded-xl flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {trend && trend.direction === "up" && <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />}
          {trend && trend.direction === "down" && <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />}
          {trend && trend.direction === "stable" && <div className="w-4 h-4 bg-gray-300 rounded-full" />}
          <span className={`text-sm font-medium ${trend ? (trend.direction === "up" ? "text-green-600" : trend.direction === "down" ? "text-red-600" : "text-gray-600") : "text-gray-600"}`}>
            {trend ? `${trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}${trend.percentage}%` : ""}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${getScoreColor(score, topPerformer || 100)}`}>
            {Math.round(score)}
          </span>
          <span className="text-sm text-gray-500">/ {Math.round(topPerformer || 100)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Industry Avg</span>
            <span className="font-medium text-gray-900">{Math.round(industryAvg || 0)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / (topPerformer || 100)) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2 rounded-full ${getScoreColor(score, topPerformer || 100).replace('text-', 'bg-')}`}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Your Score</span>
            <span>{Math.round((score / (topPerformer || 100)) * 100)}% of top performer</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      {explanation && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-4">
          <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
            📊 Performance Summary
          </h4>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>{explanation.vsIndustry}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600">•</span>
              <span>{explanation.vsTopPerformer}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Zone: <strong>{explanation.performanceZone}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Button */}
      {onLearnMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`🚀 Learn More clicked for: ${title}`);
            onLearnMore?.();
          }}
          className="w-full text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 py-2 px-4 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50 flex items-center justify-center space-x-2"
        >
          <span>Learn More</span>
          <ChevronRightIcon className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
