//src/components/growthstudio/QuadrantChart.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { usePremiumUser } from "@/context/PremiumUserContext";

type QuadrantData = {
  x: number;
  y: number;
  name: string;
  quadrant: string;
};

const quadrants = [
  { name: "High Growth, High Efficiency", color: "#10B981" },
  { name: "High Growth, Low Efficiency", color: "#3B82F6" },
  { name: "Low Growth, High Efficiency", color: "#F59E0B" },
  { name: "Low Growth, Low Efficiency", color: "#EF4444" },
];

export default function QuadrantChart({ userId }: { userId: string }) {
  const [data, setData] = useState<QuadrantData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/growth_studio/quadrant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ u_id: userId }),
        });

        if (!response.ok) throw new Error("Failed to fetch quadrant data");

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching quadrant data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Strategic Growth Quadrant</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Growth" 
                domain={[0, 5]} 
                label={{ value: "Growth", position: "bottom" }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Efficiency" 
                domain={[0, 5]} 
                label={{ value: "Efficiency", angle: -90, position: "left" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "0.75rem",
                }}
                formatter={(value: number, name: string) => [value.toFixed(1), name]}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{ 
                  paddingBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              />
              {quadrants.map((quadrant, index) => (
                <Scatter
                  key={quadrant.name}
                  name={quadrant.name}
                  data={data.filter(d => d.quadrant === quadrant.name)}
                  fill={quadrant.color}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {quadrants.map((quadrant) => (
            <div key={quadrant.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: quadrant.color }}
              />
              <span className="text-sm text-gray-600">{quadrant.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
