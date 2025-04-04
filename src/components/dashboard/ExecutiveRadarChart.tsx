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
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        🧭 Capability Comparison (Strategic View)
      </h3>
      <p className="text-gray-500 mb-6">
        Compare your strategic maturity across three dimensions against industry
        benchmarks and top performers.
      </p>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius={130} data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="category" tick={{ fill: "#374151", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[1, 5]} tickCount={5} tick={{ fill: "#9ca3af" }} />

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
            stroke="#9ca3af"
            fill="#9ca3af"
            fillOpacity={0.2}
          />
          <Radar
            name="Top Performers"
            dataKey="Top Performers"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.2}
          />

          <Legend wrapperStyle={{ paddingTop: 20 }} />
          <Tooltip formatter={(val: number) => val.toFixed(1)} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutiveRadarChart;
