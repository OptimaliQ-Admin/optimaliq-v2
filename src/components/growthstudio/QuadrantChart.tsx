//src/components/growthstudio/QuadrantChart.tsx
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
  Label,
} from "recharts";
import { motion } from "framer-motion";
import SectionTitleBar from "@/components/dashboard/SectionTitleBar";
import { Card, CardContent } from "@/components/ui/card";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/growth_studio/quadrant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: userId }),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch quadrant data");
        }

        const result = await res.json();
        
        if (!result.companies || !result.user) {
          throw new Error("Invalid data format received");
        }

        setData(result);
      } catch (err) {
        console.error("❌ Failed to load quadrant data:", err);
        setError(err instanceof Error ? err.message : "Failed to load quadrant data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card className="p-6">
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            <div className="h-[460px] bg-gray-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <CardContent>
          <div className="text-center text-red-600">
            <p className="font-semibold mb-2">⚠️ Error Loading Quadrant</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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

  const minX = Math.floor(Math.min(...strategyValues)) - .2;
  const maxX = Math.ceil(Math.max(...strategyValues)) + .2;
  const minY = Math.floor(Math.min(...processValues)) - .2;
  const maxY = Math.ceil(Math.max(...processValues)) + .2;

  const quadrantMidX = 3;
  const quadrantMidY = 3;

  return (
    <Card className="p-6">
      <CardContent>
        <SectionTitleBar
          title="Strategic Growth Quadrant"
          tooltip="Compare your company's performance against industry peers across strategy, process, and technology dimensions."
        />

        <div className="w-full h-[520px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{
                top: 20,
                right: 40,
                bottom: 30,
                left: 30,
              }}
            >
              {/* Soft quadrant backgrounds with gradients */}
              <defs>
                <linearGradient id="quadrant1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#DBEAFE" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#BFDBFE" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="quadrant2" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#DCFCE7" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#BBF7D0" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="quadrant3" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FEF9C3" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FEF08A" stopOpacity={0.3} />
                </linearGradient>
                <linearGradient id="quadrant4" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EDE9FE" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#DDD6FE" stopOpacity={0.3} />
                </linearGradient>
              </defs>

              <ReferenceArea x1={minX} x2={quadrantMidX} y1={quadrantMidY} y2={maxY} fill="url(#quadrant1)" />
              <ReferenceArea x1={quadrantMidX} x2={maxX} y1={quadrantMidY} y2={maxY} fill="url(#quadrant2)" />
              <ReferenceArea x1={minX} x2={quadrantMidX} y1={minY} y2={quadrantMidY} fill="url(#quadrant3)" />
              <ReferenceArea x1={quadrantMidX} x2={maxX} y1={minY} y2={quadrantMidY} fill="url(#quadrant4)" />

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
                range={[40, 400]}
                name="Technology Score"
              />

              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;

                  const { name, strategy_score, process_score, technology_score } = payload[0].payload;

                  return (
                    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 text-sm">
                      <div className="font-semibold text-gray-900 mb-2">{name}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Strategy</span>
                          <span className="font-medium text-gray-900">{strategy_score.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Process</span>
                          <span className="font-medium text-gray-900">{process_score.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Technology</span>
                          <span className="font-medium text-gray-900">{technology_score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
                cursor={{ strokeDasharray: "3 3" }}
              />

              {/* Midlines with labels */}
              <ReferenceLine x={quadrantMidX} stroke="#d1d5db" strokeWidth={1.5}>
                <Label value="Strategy" position="top" fill="#6b7280" fontSize={12} />
              </ReferenceLine>
              <ReferenceLine y={quadrantMidY} stroke="#d1d5db" strokeWidth={1.5}>
                <Label value="Process" position="right" fill="#6b7280" fontSize={12} offset={5} />
              </ReferenceLine>

              {/* Companies */}
              <Scatter
                name="Other Companies"
                data={normalizedCompanies}
                fill="#94A3B8"
                shape="circle"
              />

              {/* You */}
              <Scatter
                name="Your Company"
                data={[normalizedUser]}
                fill="#1D4ED8"
                shape="star"
              >
                <LabelList 
                  dataKey="name" 
                  position="top" 
                  style={{ fill: "#1D4ED8", fontSize: 12, fontWeight: 600 }}
                />
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#CBD5E1]"></div>
            <span className="text-sm text-gray-600">Other Companies</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 text-[#2563eb]">★</div>
            <span className="text-sm text-gray-600">Your Company</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
