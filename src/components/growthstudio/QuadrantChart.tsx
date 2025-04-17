"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  Label,
  ReferenceLine,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";

interface CompanyPoint {
  label: string;
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface UserPoint {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
}

interface APIResponse {
  companies: CompanyPoint[];
  user: UserPoint;
}

export default function QuadrantChart({ userId }: { userId: string }) {
  const [data, setData] = useState<APIResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tier2/growth_studio/quadrant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("❌ Failed to load quadrant data:", err);
      }
    };

    fetchData();
  }, [userId]);

  if (!data) return null;

  const normalizedCompanies = data.companies.map((company) => ({
    name: company.label,
    strategy_score: company.strategyScore,
    process_score: company.processScore,
    technology_score: company.technologyScore,
  }));

  const normalizedUser = {
    name: "You",
    strategy_score: data.user.strategyScore,
    process_score: data.user.processScore,
    technology_score: data.user.technologyScore,
  };

  const quadrantMidX = 3;
  const quadrantMidY = 3;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-700">
          📊 Strategic Growth Quadrant
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Compare your current business performance with industry benchmarks.
          Bubble size represents your Technology score.
        </p>
      </div>
      <div className="p-6">
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="strategy_score" domain={[1, 5]}>
              <Label value="Strategy Score" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis type="number" dataKey="process_score" domain={[1, 5]}>
              <Label value="Process Score" angle={-90} position="insideLeft" />
            </YAxis>
            <ZAxis
              type="number"
              dataKey="technology_score"
              range={[100, 400]}
              name="Technology Score"
            />
            <Tooltip
              formatter={(value: any, name: string) => [`${value}`, name.replace(/_/g, " ")]}
              cursor={{ strokeDasharray: "3 3" }}
            />

            {/* Horizontal and Vertical Midlines */}
            <ReferenceLine x={quadrantMidX} stroke="#e5e7eb" strokeDasharray="3 3" />
            <ReferenceLine y={quadrantMidY} stroke="#e5e7eb" strokeDasharray="3 3" />

            {/* Quadrant Labels */}
            <Label
              value="🚀 Growth Leaders"
              position="top"
              offset={-20}
              angle={0}
              className="text-xs text-gray-600"
              viewBox={{ x: 380, y: 0 }}
            />
            <Label
              value="🧭 Strategic but Inefficient"
              position="top"
              offset={-20}
              angle={0}
              viewBox={{ x: 40, y: 0 }}
            />
            <Label
              value="⚙️ Efficient but Misaligned"
              position="bottom"
              offset={10}
              angle={0}
              viewBox={{ x: 380, y: 400 }}
            />
            <Label
              value="🧱 Foundational"
              position="bottom"
              offset={10}
              angle={0}
              viewBox={{ x: 40, y: 400 }}
            />

            <Scatter
              name="Other Companies"
              data={normalizedCompanies}
              fill="#CBD5E1" // slate-300
              shape="circle"
            />

            <Scatter
              name="Your Company"
              data={[normalizedUser]}
              fill="#2563eb" // OptimaliQ blue
              shape="star"
            >
              <LabelList dataKey="name" position="top" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
