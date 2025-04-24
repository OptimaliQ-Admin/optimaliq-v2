"use client";

import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

type Props = {
  data: { month: string; score: number }[];
  score: number;
};

export default function ScoreLineChart({ data, score }: Props) {
  return (
    <Card className="p-6 shadow-md bg-white rounded-lg">
      <h2 className="text-lg font-bold text-gray-700 text-center">🚀 Your Growth Projections</h2>
      <p className="text-gray-600 text-center text-sm mb-4">
        A visual projection of how strategic improvements can elevate your business performance over time.
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 20, right: 10, left: -30, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis dataKey="month" tick={{ fill: "#4F46E5" }} />
          <YAxis domain={[1, 5]} tick={{ fill: "#4F46E5" }} />
          <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #ddd" }} />

          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#gradient)"
            strokeWidth={4}
            dot={{ r: 6, stroke: "#2563EB", strokeWidth: 2, fill: "white" }}
          />

          {/* Reference line for current score */}
          <ReferenceLine
            y={score}
            stroke="#F97316"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={{
              position: "right",
              value: `Current Score: ${score}`,
              fill: "#F97316",
              fontSize: 12,
              fontWeight: 600,
            }}
          />

          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
              <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.5} />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-2 text-center">
        <p className="text-gray-700 text-sm mt-2">
          Most businesses fail because they rely on instinct over intelligence.
          <br />
          <span className="font-bold text-blue-600">OptimaliQ</span> provides the exact roadmap to dominate your industry.
        </p>
        <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition">
          Learn More
        </button>
      </div>
    </Card>
  );
}
