"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  month: string;
  userScore: number;
  industryScore: number;
};

type GrowthChartProps = {
  data: DataPoint[];
};

export default function GrowthChart({ data }: GrowthChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Growth Projection</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[1, 5]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="userScore"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Your Score"
          />
          <Line
            type="monotone"
            dataKey="industryScore"
            stroke="#E53E3E"
            strokeWidth={3}
            dot={{ r: 5 }}
            name="Industry Avg"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
