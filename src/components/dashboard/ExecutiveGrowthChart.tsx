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
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-1">
        📈 Your Growth Benchmarking
      </h3>
      <p className="text-gray-500 mb-6">
        Visualize how your business growth compares to the industry and top performers over time.
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
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

          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingBottom: "1rem" }}
          />

          <Line
            type="monotone"
            dataKey="userScore"
            name="You"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{ r: 5, fill: "#3b82f6" }}
            activeDot={{ r: 7, fill: "#1d4ed8" }}
            filter="url(#glow)"
          />

          <Line
            type="monotone"
            dataKey="industryScore"
            name="Industry Avg"
            stroke="#9ca3af"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "#9ca3af" }}
          />

          <Line
            type="monotone"
            dataKey="topPerformerScore"
            name="Top Performers"
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={{ r: 3, fill: "#10b981" }}
          />

          <ReferenceLine
            x="Now"
            stroke="#3b82f6"
            strokeDasharray="3 3"
            label={<Label position="top" className="text-xs text-blue-600">Current</Label>}
          />

          <ReferenceDot
            x={lastPoint.month}
            y={lastPoint.userScore}
            r={6}
            fill="#3b82f6"
            stroke="#fff"
            strokeWidth={2}
            ifOverflow="visible"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ExecutiveGrowthChart;
