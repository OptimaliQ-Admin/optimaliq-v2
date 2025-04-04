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
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          🧭 Capability Comparison
        </h3>
        <p className="text-gray-500">
          Compare your maturity across Strategy, Process, and Technology against industry averages and top performers.
          <br />
          See how close you are to enterprise excellence.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <RadarChart cx="50%" cy="50%" outerRadius={140} data={data}>
          <PolarGrid stroke="#d1d5db" strokeWidth={1.5} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[1, 5]}
            tickCount={5}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            stroke="#e5e7eb"
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
            fillOpacity={0.3}
          />
          <Radar
            name="Top Performers"
            dataKey="Top Performers"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.3}
          />

          <Tooltip formatter={(val: number) => val.toFixed(1)} />
        </RadarChart>
      </ResponsiveContainer>

      <div className="flex justify-around text-sm text-gray-600 font-medium pt-4">
        <span>🟦 You</span>
        <span>⬛ Industry Avg</span>
        <span>🟩 Top Performers</span>
      </div>
    </div>
  );
};

export default ExecutiveRadarChart;