"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

interface RadarDataPoint {
  category: string;
  You: number;
  "Industry Avg": number;
  "Top Performers": number;
}

interface Props {
  strategy: number;
  process: number;
  technology: number;
  industryAvg: number;
  topPerformer: number;
}

const ExecutiveRadarChart: React.FC<Props> = ({
  strategy,
  process,
  technology,
  industryAvg,
  topPerformer,
}) => {
  const data: RadarDataPoint[] = [
    {
      category: "Strategy",
      You: strategy,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
    {
      category: "Process",
      You: process,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
    {
      category: "Technology",
      You: technology,
      "Industry Avg": industryAvg,
      "Top Performers": topPerformer,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <motion.div
        className="w-full h-[400px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={140} data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#374151", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[1, 5]}
              tickCount={5}
              tick={{ fill: "#9ca3af", fontSize: 10 }}
            />

            <Radar
              name="You"
              dataKey="You"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
            />
            <Radar
              name="Industry Avg"
              dataKey="Industry Avg"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.15}
            />
            <Radar
              name="Top Performers"
              dataKey="Top Performers"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.15}
            />

            <Legend wrapperStyle={{ paddingTop: 20 }} />
            <Tooltip formatter={(val: number) => val.toFixed(1)} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="lg:pl-8"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🧭 Capability Comparison
        </h3>
        <p className="text-gray-500">
          Compare your maturity across <strong>Strategy</strong>, <strong>Process</strong>, and <strong>Technology</strong> against industry averages and top performers.
          <br className="hidden md:block" /> See how close you are to enterprise excellence.
        </p>
      </motion.div>
    </div>
  );
};

export default ExecutiveRadarChart;