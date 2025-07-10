"use client";

import { motion } from "framer-motion";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

interface EnterpriseScoreCardProps {
  title: string;
  score: number;
  industryAvg: number;
  topPerformer: number;
  description: string;
  trend: "up" | "down" | "stable";
  trendValue: string;
  icon: string;
  onClick?: () => void;
}

export default function EnterpriseScoreCard({
  title,
  score,
  industryAvg,
  topPerformer,
  description,
  trend,
  trendValue,
  icon,
  onClick
}: EnterpriseScoreCardProps) {
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

  const getTrendIcon = () => {
    if (trend === "up") return <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl shadow-sm border ${getScoreBorderColor(score, topPerformer)} p-6 hover:shadow-lg transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${getScoreBgColor(score, topPerformer)} rounded-xl flex items-center justify-center`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {getTrendIcon()}
          <span className={`text-sm font-medium ${getTrendColor()}`}>{trendValue}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline space-x-2">
          <span className={`text-3xl font-bold ${getScoreColor(score, topPerformer)}`}>
            {Math.round(score)}
          </span>
          <span className="text-sm text-gray-500">/ {Math.round(topPerformer)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Industry Avg</span>
            <span className="font-medium text-gray-900">{Math.round(industryAvg)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(score / topPerformer) * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-2 rounded-full ${getScoreColor(score, topPerformer).replace('text-', 'bg-')}`}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Your Score</span>
            <span>{Math.round((score / topPerformer) * 100)}% of top performer</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 