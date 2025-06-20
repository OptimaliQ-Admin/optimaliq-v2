//src/components/dashboard/ScoreCard.tsx
"use client";

import { motion } from "framer-motion";
import SectionTitleBar from "./SectionTitleBar";

type ScoreCardProps = {
  title: string;
  score: number;
  industryAvg?: number;
  topPerformer?: number;
  description?: string;
  onLearnMore?: () => void;
};

export default function ScoreCard({
  title,
  score,
  industryAvg,
  topPerformer,
  description,
  onLearnMore,
}: ScoreCardProps) {
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
        ? `You&apos;re performing ${Math.round(vsIndustry)}% better than the typical company in your industry`
        : `You&apos;re performing ${Math.round(Math.abs(vsIndustry))}% below the typical company in your industry`,
      vsTopPerformer: `You&apos;re operating at ${Math.round(vsTopPerformer)}% of what the best companies in your industry achieve`,
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
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full"
    >
      <div className="mb-4">
        <SectionTitleBar title={title} />
        {description && (
          <p className="text-gray-500 text-sm leading-relaxed mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Main Score Display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">{score?.toFixed(1)}</div>
        <div className="text-sm text-gray-600 font-medium">Overall Score</div>
      </div>

      {/* Performance Metrics */}
      {industryAvg !== undefined && topPerformer !== undefined && (
        <div className="space-y-3 mb-4">
          {/* Performance Zone */}
          {performanceZone && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Performance Zone:</span>
              <span 
                className="text-sm font-semibold px-2 py-1 rounded-full"
                style={{ 
                  backgroundColor: performanceZone.bg,
                  color: performanceZone.color
                }}
              >
                {performanceZone.zone}
              </span>
            </div>
          )}

          {/* vs Industry */}
          {trend && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">vs Industry:</span>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-semibold ${trend.color}`}>
                  {trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}
                  {trend.percentage}%
                </span>
                {trend.direction !== "stable" && (
                  <span className={`text-sm ${trend.color}`}>
                    {trend.direction === "up" ? "↗️" : "↘️"}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* vs Top Performer */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">vs Top Performer:</span>
            <span className="text-sm font-semibold text-gray-800">
              {Math.round((score / topPerformer) * 100)}%
            </span>
          </div>
        </div>
      )}

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
              <span>Performance Zone: <strong>{explanation.performanceZone}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Button */}
      {onLearnMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            console.log(`🚀 Learn More clicked for: ${title}`);
            onLearnMore?.();
          }}
          className="w-full text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors duration-200 py-2 px-4 rounded-lg border border-blue-200 hover:border-blue-300 hover:bg-blue-50"
        >
          Learn more →
        </motion.button>
      )}

      {/* Legend */}
      {industryAvg !== undefined && topPerformer !== undefined && (
        <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span>Your Score</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 border border-gray-600 rounded-full"></div>
            <span>Industry Avg</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 border border-green-500 rounded-full"></div>
            <span>Top Performers</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
