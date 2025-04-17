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
  ReferenceLine,
  ReferenceDot,
  LabelList,
} from "recharts";
import { motion } from "framer-motion";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

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
      <div className="px-6 pt-6">
        <SectionTitleBar
          title="📊 Strategic Growth Quadrant"
          tooltip="Compare Strategy and Process across the market. Bubble size represents Technology maturity."
        />
      </div>

      <div className="p-6 pt-4">
        <ResponsiveContainer width="100%" height={460}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="strategy_score" domain={[1, 5]} />
            <YAxis type="number" dataKey="process_score" domain={[1, 5]} />
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

            {/* Midlines */}
            <ReferenceLine x={quadrantMidX} stroke="#e5e7eb" strokeDasharray="3 3" />
            <ReferenceLine y={quadrantMidY} stroke="#e5e7eb" strokeDasharray="3 3" />

            {/* Quadrant Labels */}
            <ReferenceDot
              x={4.6}
              y={4.6}
              r={0}
              label={{ value: "🚀 Accelerated Performers", fill: "#6b7280", fontSize: 12 }}
            />
            <ReferenceDot
              x={1.4}
              y={4.6}
              r={0}
              label={{ value: "🧭 Strategic Builders", fill: "#6b7280", fontSize: 12 }}
            />
            <ReferenceDot
              x={1.4}
              y={1.4}
              r={0}
              label={{ value: "🧱 Emerging Foundations", fill: "#6b7280", fontSize: 12 }}
            />
            <ReferenceDot
              x={4.6}
              y={1.4}
              r={0}
              label={{ value: "⚙️ Efficient Executors", fill: "#6b7280", fontSize: 12 }}
            />

            {/* Data Points */}
            <Scatter
              name="Other Companies"
              data={normalizedCompanies}
              fill="#CBD5E1"
              shape="circle"
            >
              <LabelList dataKey="name" position="top" />
            </Scatter>

            <Scatter
              name="Your Company"
              data={[normalizedUser]}
              fill="#2563eb"
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
