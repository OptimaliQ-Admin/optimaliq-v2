"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  ReferenceLine,
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
          tooltip="Visualize how businesses compare based on Strategy and Process. Larger bubbles reflect higher Tech maturity."
        />
      </div>

      <div className="relative px-6 pt-12 pb-14">
        {/* External Quadrant Labels */}
        <div className="absolute top-2 left-4 text-sm text-gray-500 font-medium">
          Strategic Builders
        </div>
        <div className="absolute top-2 right-4 text-sm text-gray-500 font-medium">
          Accelerated Performers
        </div>
        <div className="absolute bottom-2 left-4 text-sm text-gray-500 font-medium">
          Emerging Foundations
        </div>
        <div className="absolute bottom-2 right-4 text-sm text-gray-500 font-medium">
          Efficient Executors
        </div>

        <div className="flex justify-center items-center">
          <ResponsiveContainer width="90%" height={460}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                type="number"
                dataKey="strategy_score"
                domain={[1, 5]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis
                type="number"
                dataKey="process_score"
                domain={[1, 5]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <ZAxis
                type="number"
                dataKey="technology_score"
                range={[100, 400]}
                name="Technology Score"
              />

              {/* Custom Tooltip */}
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;

                  const { name, strategy_score, process_score, technology_score } = payload[0].payload;

                  return (
                    <div className="bg-white border border-gray-300 shadow-lg rounded-md p-3 text-sm text-gray-800">
                      <div className="font-semibold mb-1">Company: {name}</div>
                      <div>Strategy Score: {strategy_score}</div>
                      <div>Process Score: {process_score}</div>
                      <div>Technology Score: {technology_score}</div>
                    </div>
                  );
                }}
                cursor={{ strokeDasharray: "3 3" }}
              />

              {/* Midlines */}
              <ReferenceLine x={quadrantMidX} stroke="#d1d5db" strokeWidth={1.5} />
              <ReferenceLine y={quadrantMidY} stroke="#d1d5db" strokeWidth={1.5} />

              {/* Other Companies (no label) */}
              <Scatter
                name="Other Companies"
                data={normalizedCompanies}
                fill="#CBD5E1"
                shape="circle"
              />

              {/* Your Company (with label) */}
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
      </div>
    </motion.div>
  );
}
