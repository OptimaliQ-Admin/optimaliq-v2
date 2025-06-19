// components/step3/ScoreInsightGrid.tsx
"use client";

import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

export default function ScoreInsightGrid({ insights, loading }: { insights: Record<string, string>, loading: boolean }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition h-full">
      <SectionTitleBar title="📌 Data Driven Business Insights" />
      {loading ? (
        <p className="text-gray-500 text-center mt-4">Generating insights...</p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {Object.entries(insights).map(([key, value]) => (
            <div
              key={key}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 transition duration-300 ease-in-out hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-blue-600">{key.charAt(0).toUpperCase() + key.slice(1)} Insight</h3>
              <p className="text-gray-600 mt-2 text-sm">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
