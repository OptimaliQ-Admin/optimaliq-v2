"use client";

import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
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
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition h-full">
      <SectionTitleBar title="🚀 Your Growth Projections" />
      <p className="text-gray-600 text-sm mb-4">
        A visual projection of how strategic improvements with OptimaliQ can elevate your business performance over time.
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

      <div className="mt-4 text-center">
        <p className="text-gray-700 text-sm mb-4">
          Most businesses fail because they rely on instinct over intelligence.
          <br />
          <span className="font-bold text-blue-600">OptimaliQ</span> provides the exact roadmap to dominate your industry.
        </p>
        
        {/* Add urgency element */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm font-semibold">
            ⏰ Your insights are fresh now - get ongoing monitoring and AI recommendations
          </p>
        </div>
        
        {/* Enhanced CTA */}
        <div className="space-y-3">
          <a
            href="/Pricing"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition w-full sm:w-auto"
          >
            Get Ongoing Insights & AI Recommendations
          </a>
          <p className="text-xs text-gray-500">
            Start now • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
