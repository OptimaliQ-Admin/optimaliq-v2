// File: /src/components/growthstudio/QuadrantChart.tsx

"use client";

import { useEffect, useState } from "react";
import {
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  ResponsiveContainer,
  Label,
} from "recharts";

interface CompanyPoint {
  name: string;
  strategy_score: number;
  process_score: number;
  technology_score: number;
  overall_score: number;
}

interface UserPoint {
  strategy_score: number;
  process_score: number;
  technology_score: number;
  overall_score: number;
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-bold text-gray-700 mb-4">📊 Strategic Growth Quadrant</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="strategy_score" domain={[1, 5]}>
            <Label value="Strategy Score" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey="process_score" domain={[1, 5]}>
            <Label value="Process Score" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Scatter
            name="Other Companies"
            data={data.companies}
            fill="#ccc"
            shape="circle"
          />
          <Scatter
            name="Your Company"
            data={[{
              ...data.user,
              name: "You"
            }]}
            fill="#2563eb" // OptimaliQ blue
            shape="star"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
