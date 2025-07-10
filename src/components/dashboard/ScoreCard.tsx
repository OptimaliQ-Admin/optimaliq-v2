//src/components/dashboard/ScoreCard.tsx
"use client";

import { motion } from "framer-motion";
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  ChevronRightIcon,
  SparklesIcon,
  TrophyIcon,
  ChartBarIcon
} from "@heroicons/react/24/solid";

type ScoreCardProps = {
  title: string;
  icon?: string;
  score: number;
  industryAvg?: number;
  topPerformer?: number;
  description?: string;
  onLearnMore?: () => void;
};

export default function ScoreCard({
  title,
  icon,
  score,
  industryAvg,
  topPerformer,
  description,
  onLearnMore,
}: ScoreCardProps) {
  const getPerformanceZone = (value: number, topPerformer: number) => {
    const percentage = (value / topPerformer) * 100;
    if (percentage >= 90) return { 
      zone: "Excellence", 
      color: "text-emerald-700", 
      bg: "bg-emerald-50", 
      border: "border-emerald-200",
      gradient: "from-emerald-500 to-emerald-600",
      icon: <SparklesIcon className="w-4 h-4" />
    };
    if (percentage >= 75) return { 
      zone: "Competitive", 
      color: "text-amber-700", 
      bg: "bg-amber-50", 
      border: "border-amber-200",
      gradient: "from-amber-500 to-amber-600",
      icon: <TrophyIcon className="w-4 h-4" />
    };
    if (percentage >= 60) return { 
      zone: "Developing", 
      color: "text-orange-700", 
      bg: "bg-orange-50", 
      border: "border-orange-200",
      gradient: "from-orange-500 to-orange-600",
      icon: <ChartBarIcon className="w-4 h-4" />
    };
    return { 
      zone: "Needs Focus", 
      color: "text-red-700", 
      bg: "bg-red-50", 
      border: "border-red-200",
      gradient: "from-red-500 to-red-600",
      icon: <ChartBarIcon className="w-4 h-4" />
    };
  };

  const getTrendDirection = (value: number, industryAvg: number) => {
    const diff = value - industryAvg;
    if (diff > 0.5) return { 
      direction: "up", 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      percentage: Math.round((diff / industryAvg) * 100),
      icon: <ArrowTrendingUpIcon className="w-4 h-4" />
    };
    if (diff < -0.5) return { 
      direction: "down", 
      color: "text-red-600", 
      bg: "bg-red-50",
      percentage: Math.round((Math.abs(diff) / industryAvg) * 100),
      icon: <ArrowTrendingDownIcon className="w-4 h-4" />
    };
    return { 
      direction: "stable", 
      color: "text-gray-600", 
      bg: "bg-gray-50",
      percentage: 0,
      icon: <div className="w-4 h-4 bg-gray-300 rounded-full" />
    };
  };

  const getExplanation = () => {
    if (!industryAvg || !topPerformer) return null;
    
    const vsIndustry = ((score / industryAvg) * 100 - 100);
    const vsTopPerformer = (score / topPerformer) * 100;
    
    return {
      vsIndustry: vsIndustry > 0 
        ? `You're performing ${Math.round(vsIndustry)}% better than the typical company in your industry`
        : `You're performing ${Math.round(Math.abs(vsIndustry))}% below the typical company in your industry`,
      vsTopPerformer: `You're operating at ${Math.round(vsTopPerformer)}% of what the best companies in your industry achieve`,
      performanceZone: getPerformanceZone(score, topPerformer).zone
    };
  };

  const explanation = getExplanation();
  const performanceZone = topPerformer ? getPerformanceZone(score, topPerformer) : null;
  const trend = industryAvg ? getTrendDirection(score, industryAvg) : null;
  const scorePercentage = topPerformer ? (score / topPerformer) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 h-full overflow-hidden"
    >
      {/* Gradient accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${performanceZone?.gradient || 'from-blue-500 to-indigo-600'}`} />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${performanceZone?.bg || 'bg-blue-50'} rounded-xl flex items-center justify-center shadow-sm`}>
              <span className="text-2xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {description && (
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              )}
            </div>
          </div>
          
          {/* Performance Zone Badge */}
          {performanceZone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-full ${performanceZone.bg} ${performanceZone.border} border`}
            >
              {performanceZone.icon}
              <span className={`text-xs font-semibold ${performanceZone.color}`}>
                {performanceZone.zone}
              </span>
            </motion.div>
          )}
        </div>

        {/* Main Score Display */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center space-x-2 mb-2">
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-gray-900"
            >
              {score?.toFixed(1)}
            </motion.span>
            <span className="text-lg text-gray-500">/ {Math.round(topPerformer || 100)}</span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercentage}%` }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
              className={`h-2 rounded-full bg-gradient-to-r ${performanceZone?.gradient || 'from-blue-500 to-indigo-600'}`}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            {Math.round(scorePercentage)}% of top performer
          </div>
        </div>

        {/* Performance Metrics Grid */}
        {industryAvg !== undefined && topPerformer !== undefined && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* vs Industry */}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className={`p-3 rounded-lg ${trend.bg} border border-gray-100`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-600">vs Industry</span>
                  {trend.icon}
                </div>
                <div className={`text-lg font-bold ${trend.color}`}>
                  {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                  {trend.percentage}%
                </div>
              </motion.div>
            )}

            {/* vs Top Performer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="p-3 rounded-lg bg-blue-50 border border-blue-100"
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-gray-600">vs Top Performer</span>
                <TrophyIcon className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">
                {Math.round((score / topPerformer) * 100)}%
              </div>
            </motion.div>
          </div>
        )}

        {/* Performance Summary */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100 mb-6"
          >
            <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
              Performance Summary
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>{explanation.vsIndustry}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{explanation.vsTopPerformer}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Zone: <strong>{explanation.performanceZone}</strong></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Learn More Button */}
        {onLearnMore && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log(`🚀 Learn More clicked for: ${title}`);
              onLearnMore?.();
            }}
            className="w-full group/button bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
          >
            <span>Learn More</span>
            <ChevronRightIcon className="w-4 h-4 group-hover/button:translate-x-1 transition-transform duration-200" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
