import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceDot,
} from "recharts";

interface ChartPoint {
  month: string;
  userScore: number;
  industryScore: number;
  topPerformerScore: number;
}

interface Props {
  data: ChartPoint[];
}

const ExecutiveGrowthChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        📈 Growth Trajectory (You vs. Industry vs. Top Performers)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280" }} />
          <YAxis domain={[1, 5]} tick={{ fill: "#6b7280" }} tickCount={5} />

          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }}
            formatter={(value: number, name: string) => [value.toFixed(1), name]}
          />

          <Legend verticalAlign="top" height={36} />

          <Area
            type="monotone"
            dataKey="userScore"
            name="You"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorUser)"
            strokeWidth={3}
          />

          <Area
            type="monotone"
            dataKey="industryScore"
            name="Industry Avg"
            stroke="#9ca3af"
            fillOpacity={0}
            strokeDasharray="4 2"
            strokeWidth={2}
          />

          <Area
            type="monotone"
            dataKey="topPerformerScore"
            name="Top Performers"
            stroke="#10b981"
            fillOpacity={0}
            strokeDasharray="2 2"
            strokeWidth={2}
          />

          {/* Optional callout dot at end */}
          <ReferenceDot
            x={data[data.length - 1].month}
            y={data[data.length - 1].userScore}
            r={4}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={2}
            ifOverflow="visible"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutiveGrowthChart;
