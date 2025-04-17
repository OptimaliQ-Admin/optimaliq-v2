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
  ReferenceArea,
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

  // Normalize data
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

  const allData = [...normalizedCompanies, normalizedUser];

  // Auto-zoom bounds with padding
  const strategyValues = allData.map(d => d.strategy_score);
  const processValues = allData.map(d => d.process_score);

  const minX = Math.floor(Math.min(...strategyValues)) - 0.5;
  const maxX = Math.ceil(Math.max(...strategyValues)) + 0.5;
  const minY = Math.floor(Math.min(...processValues)) - 0.5;
  const maxY = Math.ceil(Math.max(...processValues)) + 0.5;

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

      <div className="relative px-6 pt-10 pb-12">
        {/* External Quadrant Labels */}
        <div className="absolute top-6 left-6 text-[15px] font-semibold text-blue-700">
          Strategic Builders
        </div>
        <div className="absolute top-6 right-6 text-[15px] font-semibold text-green-700">
          Accelerated Performers
        </div>
        <div className="absolute bottom-6 left-6 text-[15px] font-semibold text-yellow-700">
          Emerging Foundations
        </div>
        <div className="absolute bottom-6 right-6 text-[15px] font-semibold text-purple-700">
          Efficient Executors
        </div>

        <div className="flex justify-center items-center">
          <ResponsiveContainer width="90%" height={460}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              {/* Soft quadrant backgrounds */}
              <ReferenceArea x1={minX} x2={quadrantMidX} y1={quadrantMidY} y2={maxY} fill="#DBEAFE" fillOpacity={0.2} />
              <ReferenceArea x1={quadrantMidX} x2={maxX} y1={quadrantMidY} y2={maxY} fill="#DCFCE7" fillOpacity={0.2} />
              <ReferenceArea x1={minX} x2={quadrantMidX} y1={minY} y2={quadrantMidY} fill="#FEF9C3" fillOpacity={0.2} />
              <ReferenceArea x1={quadrantMidX} x2={maxX} y1={minY} y2={quadrantMidY} fill="#EDE9FE" fillOpacity={0.2} />

              <XAxis
                type="number"
                dataKey="strategy_score"
                domain={[minX, maxX]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <YAxis
                type="number"
                dataKey="process_score"
                domain={[minY, maxY]}
                axisLine={false}
                tickLine={false}
                tick={false}
              />
              <ZAxis
                type="number"
                dataKey="technology_score"
                range={[60, 800]} // More dramatic bubble sizing
                name="Technology Score"
              />

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

              {/* Companies */}
              <Scatter
                name="Other Companies"
                data={normalizedCompanies}
                fill="#CBD5E1"
                shape="circle"
              />

              {/* You */}
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
