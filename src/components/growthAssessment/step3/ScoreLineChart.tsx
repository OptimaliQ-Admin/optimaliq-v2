"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "framer-motion";
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  SparklesIcon
} from "@heroicons/react/24/outline";

type Props = {
  data: { month: string; score: number }[];
  score: number;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const isTargetZone = value >= 3.8;
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-xl"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isTargetZone ? 'bg-emerald-500' : 'bg-blue-500'}`} />
            <span className="font-semibold text-gray-900">{label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {value.toFixed(1)}
            <span className="text-sm font-normal text-gray-500 ml-1">/ 5.0</span>
          </div>
          <div className="text-sm text-gray-600">
            {isTargetZone ? 'Target maturity level' : 'Projected growth'}
          </div>
        </div>
      </motion.div>
    );
  }
  return null;
};

export default function ScoreLineChart({ data, score }: Props) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const getScoreColor = (value: number) => {
    if (value >= 4.0) return "#10b981"; // emerald
    if (value >= 3.0) return "#3b82f6"; // blue
    if (value >= 2.0) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getScoreLabel = (value: number) => {
    if (value >= 4.0) return "Mature";
    if (value >= 3.0) return "Developing";
    if (value >= 2.0) return "Emerging";
    return "Foundation";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Growth Projections</h3>
            <p className="text-sm text-gray-600">Strategic roadmap to maturity</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{score.toFixed(1)}</div>
          <div className="text-sm text-gray-500">Current Score</div>
        </div>
      </div>

      {/* Enhanced Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              strokeOpacity={0.5}
              vertical={false}
            />
            
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            
            <YAxis 
              domain={[1, 5]} 
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              tickFormatter={(value) => `${value}.0`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target Maturity Zone */}
            <ReferenceArea
              y1={3.8}
              y2={5}
              fill="#10b981"
              fillOpacity={0.08}
              stroke="none"
            />
            
            {/* Area under the line */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#areaGradient)"
            />
            
            {/* Main line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const isCurrent = payload.month === "Now";
                const isTarget = payload.score >= 3.8;
                
                return (
                  <g>
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isCurrent ? 8 : 6}
                      fill={isTarget ? "#10b981" : "#3b82f6"}
                      stroke="white"
                      strokeWidth={3}
                      className="transition-all duration-200 hover:r-10"
                    />
                    {isCurrent && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke={isTarget ? "#10b981" : "#3b82f6"}
                        strokeWidth={2}
                        strokeDasharray="4 4"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              }}
            />
            
            {/* Current score reference line */}
            <ReferenceLine
              y={score}
              stroke="#f59e0b"
              strokeDasharray="4 4"
              strokeWidth={2}
              label={{
                position: "right",
                value: `Current: ${score.toFixed(1)}`,
                fill: "#f59e0b",
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            
            {/* Target zone label */}
            <ReferenceLine
              y={4.2}
              stroke="none"
              label={{
                position: "left",
                value: "Target Maturity Zone",
                fill: "#10b981",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Projection</div>
            <div className="text-xs text-gray-500">Growth path</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Current</div>
            <div className="text-xs text-gray-500">Your score</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-emerald-500 opacity-60"></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Target Zone</div>
            <div className="text-xs text-gray-500">Maturity level</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <div>
            <div className="text-sm font-semibold text-gray-900">Potential</div>
            <div className="text-xs text-gray-500">Growth opportunity</div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 space-y-4">
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <LightBulbIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Strategic Insight</h4>
            <p className="text-gray-700 text-sm">
              Your current score of <span className="font-semibold text-blue-600">{score.toFixed(1)}</span> indicates 
              a <span className="font-semibold">{getScoreLabel(score)}</span> stage. With targeted improvements, 
              you can reach maturity within <span className="font-semibold text-emerald-600">6-12 months</span>.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
          <CheckCircleIcon className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm mb-1">Growth Opportunity</h4>
            <p className="text-gray-700 text-sm">
              Top performers average <span className="font-semibold text-emerald-600">4.2/5.0</span>. 
              Your potential improvement of <span className="font-semibold text-purple-600">+{(5 - score).toFixed(1)} points</span> 
              represents significant revenue growth potential.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
        <div className="flex items-center gap-3 mb-4">
          <SparklesIcon className="w-6 h-6 text-blue-400" />
          <h4 className="text-lg font-bold">Unlock Advanced Analytics</h4>
        </div>
        <p className="text-gray-300 text-sm mb-4 leading-relaxed">
          Get real-time benchmarking, predictive modeling, and personalized growth roadmaps with OptimaliQ Pro.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
            Weekly insights
          </span>
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
            Industry benchmarks
          </span>
          <span className="flex items-center gap-1">
            <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
            AI recommendations
          </span>
        </div>
      </div>
    </motion.div>
  );
}
