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
  ReferenceArea,
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
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#fff", 
              borderRadius: "8px", 
              border: "1px solid #ddd",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value: any, name: any) => [
              `${value.toFixed(1)}`,
              "Your Projected Score"
            ]}
            labelFormatter={(label) => `${label}`}
          />

          {/* Target Maturity Zone */}
          <ReferenceArea
            y1={3.8}
            y2={4.5}
            fill="#10b981"
            fillOpacity={0.1}
            stroke="none"
          />

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

          {/* Target Zone Label */}
          <ReferenceLine
            y={4.5}
            stroke="none"
            label={{
              position: "left",
              value: "Target Maturity Zone",
              fill: "#10b981",
              fontSize: 11,
              fontStyle: "italic",
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

      {/* Legend */}
      <div className="flex justify-center items-center space-x-6 mt-4 text-xs text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Your Projection</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Current Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-30"></div>
          <span>Target Zone</span>
        </div>
      </div>

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

        {/* Value Propositions */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚀</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Built to Replace a $25K Consultant</h4>
              <p className="text-gray-600 text-xs">Get strategic clarity, competitive benchmarks, and execution-ready roadmaps—without hiring a firm or waiting weeks.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Trained on 10,000+ High-Growth Playbooks</h4>
              <p className="text-gray-600 text-xs">Our AI distills what the fastest-scaling companies are doing right now—and shows you how to apply it to your business today.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">Diagnose. Prescribe. Simulate.</h4>
              <p className="text-gray-600 text-xs">OptimaliQ doesn&apos;t just analyze your business—it runs simulations to show the ROI of fixing what&apos;s broken.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">From Gut Feeling to Growth Engine—in Under 10 Minutes</h4>
              <p className="text-gray-600 text-xs">Plug in your data, and get a strategy that would take a human team months to build.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
