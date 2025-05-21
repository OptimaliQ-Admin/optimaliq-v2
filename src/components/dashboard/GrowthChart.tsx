//src/components/dashboard/GrowthChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import SectionTitleBar from "./SectionTitleBar";

type DataPoint = {
  month: string;
  userScore: number;
  industryScore: number;
  topPerformerScore: number;
};

type GrowthChartProps = {
  data: DataPoint[];
};

export default function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">Growth Trajectory</h3>
          <p className="text-gray-500 text-sm mt-2">
            Projected growth based on current performance
          </p>
        </div>
      </div>

      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="userScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="4 4" 
              stroke="#e5e7eb" 
              vertical={false}
              opacity={0.5}
            />
            
            <XAxis 
              dataKey="month" 
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              padding={{ left: 20, right: 20 }}
            />
            
            <YAxis 
              domain={[1, 5]} 
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
              tickCount={5}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => value.toFixed(1)}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                padding: "0.75rem",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                fontSize: "0.875rem",
              }}
              formatter={(value: number, name: string) => [
                <span key="value" className="font-semibold">{value.toFixed(1)}</span>,
                name
              ]}
              labelStyle={{ fontWeight: 600, marginBottom: "0.5rem" }}
            />

            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ 
                paddingBottom: "1.5rem",
                fontSize: "0.875rem",
                fontWeight: 500
              }}
            />

            <ReferenceLine 
              y={4} 
              stroke="#10b981" 
              strokeDasharray="3 3" 
              strokeWidth={1}
              label={{ 
                value: "Target", 
                position: "right",
                fill: "#10b981",
                fontSize: 12,
                fontWeight: 500
              }}
            />

            <Line
              type="monotone"
              dataKey="userScore"
              name="You"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ 
                r: 4,
                fill: "#3b82f6",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
              activeDot={{ 
                r: 6,
                fill: "#3b82f6",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
            />

            <Line
              type="monotone"
              dataKey="industryScore"
              name="Industry Avg"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ 
                r: 3,
                fill: "#6b7280",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
              activeDot={{ 
                r: 5,
                fill: "#6b7280",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
            />

            <Line
              type="monotone"
              dataKey="topPerformerScore"
              name="Top Performers"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={{ 
                r: 3,
                fill: "#10b981",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
              activeDot={{ 
                r: 5,
                fill: "#10b981",
                strokeWidth: 2,
                stroke: "#ffffff"
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between text-xs text-gray-500">
        <span>Maturity Score</span>
        <span>Time Period</span>
      </div>
    </div>
  );
}
