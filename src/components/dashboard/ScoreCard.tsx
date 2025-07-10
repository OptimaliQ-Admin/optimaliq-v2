//src/components/dashboard/ScoreCard.tsx
"use client";

import { motion } from "framer-motion";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  MinusIcon,
  TrophyIcon,
  LightBulbIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

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
      icon: "🏆"
    };
    if (percentage >= 75) return { 
      zone: "Competitive", 
      color: "text-amber-700", 
      bg: "bg-amber-50", 
      border: "border-amber-200",
      icon: "⚡"
    };
    if (percentage >= 60) return { 
      zone: "Developing", 
      color: "text-orange-700", 
      bg: "bg-orange-50", 
      border: "border-orange-200",
      icon: "📈"
    };
    return { 
      zone: "Needs Focus", 
      color: "text-red-700", 
      bg: "bg-red-50", 
      border: "border-red-200",
      icon: "🎯"
    };
  };

  const getTrendDirection = (value: number, industryAvg: number) => {
    const diff = value - industryAvg;
    if (diff > 0.5) return { 
      direction: "up", 
      color: "text-emerald-600", 
      bg: "bg-emerald-50",
      icon: ArrowTrendingUpIcon,
      percentage: Math.round((diff / industryAvg) * 100) 
    };
    if (diff < -0.5) return { 
      direction: "down", 
      color: "text-red-600", 
      bg: "bg-red-50",
      icon: ArrowTrendingDownIcon,
      percentage: Math.round((Math.abs(diff) / industryAvg) * 100) 
    };
    return { 
      direction: "stable", 
      color: "text-gray-600", 
      bg: "bg-gray-50",
      icon: MinusIcon,
      percentage: 0 
    };
  };

  const getExplanation = () => {
    if (!industryAvg || !topPerformer) return null;
    
    const vsIndustry = ((score / industryAvg) * 100 - 100);
    const vsTopPerformer = (score / topPerformer) * 100;
    
    return {
      vsIndustry: vsIndustry > 0 
        ? `You're ${Math.round(vsIndustry)}% above industry average`
        : `You're ${Math.round(Math.abs(vsIndustry))}% below industry average`,
      vsTopPerformer: `You're operating at ${Math.round(vsTopPerformer)}% of top performer level`,
      performanceZone: getPerformanceZone(score, topPerformer).zone
    };
  };

  const explanation = getExplanation();
  const performanceZone = topPerformer ? getPerformanceZone(score, topPerformer) : null;
  const trend = industryAvg ? getTrendDirection(score, industryAvg) : null;
  const vsTopPerformerPercentage = topPerformer ? Math.round((score / topPerformer) * 100) : 0;

  // Animated score bar
  const scorePercentage = topPerformer ? (score / topPerformer) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full overflow-hidden"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />
      
      <div className="relative p-6">
        {/* Header with icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-lg">{icon}</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              {description && (
                <p className="text-gray-500 text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          {/* Performance Zone Badge */}
          {performanceZone && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${performanceZone.bg} ${performanceZone.color} ${performanceZone.border} border`}
            >
              <span>{performanceZone.icon}</span>
              <span>{performanceZone.zone}</span>
            </motion.div>
          )}
        </div>

        {/* Main Score Display */}
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="relative"
          >
            <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              {score?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 font-medium">/ 100</div>
            
            {/* Animated score bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0</span>
                <span>100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scorePercentage}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Metrics Grid */}
        {industryAvg !== undefined && topPerformer !== undefined && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* vs Industry */}
            {trend && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className={`p-3 rounded-xl border ${trend.bg} ${trend.color} border-gray-200`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <trend.icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">vs Industry</span>
                </div>
                <div className="text-lg font-bold">
                  {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                  {trend.percentage}%
                </div>
              </motion.div>
            )}

            {/* vs Top Performer */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="p-3 rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrophyIcon className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700">vs Top Performer</span>
              </div>
              <div className="text-lg font-bold text-amber-700">
                {vsTopPerformerPercentage}%
              </div>
            </motion.div>
          </div>
        )}

        {/* Performance Summary */}
        {explanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-gray-200 mb-6"
          >
            <h4 className="font-bold text-gray-800 mb-3 text-sm flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-blue-600" />
              Performance Summary
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{explanation.vsIndustry}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                <span>{explanation.vsTopPerformer}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
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
            transition={{ delay: 0.7, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              console.log(`🚀 Learn More clicked for: ${title}`);
              onLearnMore?.();
            }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 group/button"
          >
            <span>Learn More</span>
            <motion.div
              initial={{ x: 0 }}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <LightBulbIcon className="w-4 h-4" />
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
