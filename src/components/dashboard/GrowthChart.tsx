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
      <SectionTitleBar
  title="📈 Growth Projection"
  tooltip="Your forecasted growth based on current maturity and best practices."
/>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis domain={[1, 5]} tick={{ fill: "#6b7280", fontSize: 12 }} tickCount={5} />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "0.5rem",
              border: "1px solid #e5e7eb",
              padding: "0.75rem",
            }}
            formatter={(value: number, name: string) => [value.toFixed(1), name]}
          />

          <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: "1rem" }} />

          <Line
            type="monotone"
            dataKey="userScore"
            name="You"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          <Line
            type="monotone"
            dataKey="industryScore"
            name="Industry Avg"
            stroke="#6b7280"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="topPerformerScore"
            name="Top Performers"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="2 2"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
