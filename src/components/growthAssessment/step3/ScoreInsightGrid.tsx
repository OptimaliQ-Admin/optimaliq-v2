// components/step3/ScoreInsightGrid.tsx
"use client";

import { Card } from "@/components/ui/card";

export default function ScoreInsightGrid({ insights, loading }: { insights: Record<string, string>, loading: boolean }) {
  return (
    <Card className="p-6 shadow-md bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 text-center">📌 Data Driven Business Insights</h2>
      {loading ? (
        <p className="text-gray-500 text-center mt-4">Generating insights...</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(insights).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              <h3 className="text-lg font-bold text-blue-600">{key.charAt(0).toUpperCase() + key.slice(1)} Insight</h3>
              <p className="text-gray-600 mt-2">{value}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
