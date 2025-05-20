//src/components/dashboard/ExecutiveRadarChart.tsx
"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SectionTitleBar from "./SectionTitleBar";

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
      <div className="mb-6">
        <SectionTitleBar
          title="\ud83d\udded Capability Comparison"
          tooltip="Compare your strategy, process, and technology maturity to industry benchmarks."
        />
        <p className="text-gray-500 text-sm leading-relaxed mt-2">
          Compare your maturity across Strategy, Process, and Technology against industry averages and top performers.
          See how close you are to enterprise excellence.
        </p>
      </div>

      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#d1d5db" strokeWidth={1.5} />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "#374151", fontSize: 20, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tickCount={6}
              tick={{ fill: "#6b7280", fontSize: 16 }}
              stroke="#e5e7eb"
            />

            <Radar
              name="You"
              dataKey="You"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Radar
              name="Industry Avg"
              dataKey="Industry Avg"
              stroke="#4b5563"
              fill="#4b5563"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Top Performers"
              dataKey="Top Performers"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
              strokeWidth={2}
            />

            <Tooltip 
              formatter={(val: number) => val.toFixed(1)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around text-sm text-gray-700 font-medium pt-6 mt-2">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
          You
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
          Industry Avg
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded-sm"></div>
          Top Performers
        </span>
      </div>
    </div>
  );
};

export default ExecutiveRadarChart;
