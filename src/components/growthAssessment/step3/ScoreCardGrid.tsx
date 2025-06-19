// components/step3/ScoreCardGrid.tsx
"use client";

import SectionTitleBar from "@/components/dashboard/SectionTitleBar";

export default function ScoreCardGrid({ score }: { score: number }) {
  return (
    <>
      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="📊 GMF+ Score" />
          <p className="text-3xl font-bold text-blue-600">{score} / 5</p>
          <p className="text-sm text-gray-600 mt-2">Your current growth maturity level.</p>
          <p className="text-xs text-gray-400 mt-1 italic">Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span></p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="📈 Industry Benchmark" tooltip="Unlock full benchmarking with OptimaliQ Pro" />
          <p className="text-3xl font-bold text-green-600">4.2 / 5</p>
          <p className="text-sm text-gray-600 mt-2">Average score of top industry performers.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="🔍 Optimization Potential" tooltip="Unlock predictive modeling with OptimaliQ Pro" />
          <p className="text-3xl font-bold text-blue-600">+{(5 - score - 0.5).toFixed(1)} / +20%</p>
          <p className="text-sm text-gray-600 mt-2">Potential to elevate your score and revenue over the next 12 months.</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
        <div>
          <SectionTitleBar title="🎯 Growth Opportunity" />
          <p className="text-3xl font-bold text-purple-600">{(score / 5 * 100).toFixed(0)}%</p>
          <p className="text-sm text-gray-600 mt-2">Your current market readiness percentage.</p>
        </div>
      </div>
    </>
  );
}
