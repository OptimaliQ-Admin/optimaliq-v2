"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  Label,
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
  const lastPoint = data[data.length - 1];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        📈 Your Growth Benchmarking
      </h3>
      <p className="text-gray-500 mb-6">
        Visualize how your business growth compares to the industry and top performers over time.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <linearGradient id="gradientUser" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis
            domain={[1, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "1rem",
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
            stroke="#9ca3af"
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

          {/* Optional vertical line to emphasize "Now" */}
          <ReferenceLine
            x="Now"
            stroke="#3b82f6"
            strokeDasharray="3 3"
            label={<Label position="top" className="text-xs text-blue-600">Current</Label>}
          />

          {/* Optional callout at the last data point */}
          <ReferenceDot
            x={lastPoint.month}
            y={lastPoint.userScore}
            r={5}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth={2}
            ifOverflow="visible"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExecutiveGrowthChart;
