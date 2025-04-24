// components/step3/ScoreCardGrid.tsx
"use client";

import { Card } from "@/components/ui/card";

export default function ScoreCardGrid({ score }: { score: number }) {
  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700">📊 GMF+ Score</h2>
        <p className="text-6xl font-bold text-red-600 mt-2">{score} / 5</p>
        <p className="text-gray-500 text-sm mt-2">Your current growth maturity level.</p>
        <p className="text-xs text-gray-400 mt-1 italic">Powered by <span className="text-blue-600 font-semibold">OptimaliQ.ai</span></p>
      </Card>

      <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700">
          📈 Industry Benchmark <span title="Unlock full benchmarking with OptimaliQ Pro" className="ml-1 cursor-help">🔒</span>
        </h2>
        <p className="text-5xl font-bold text-green-600 mt-2">4.2 / 5</p>
        <p className="text-gray-500 text-sm mt-2">Average score of top industry performers.</p>
      </Card>

      <Card className="p-6 shadow-md bg-white text-center rounded-lg transform hover:scale-105 hover:shadow-lg">
        <h2 className="text-lg font-semibold text-gray-700">
          🔍 Optimization Potential <span title="Unlock predictive modeling with OptimaliQ Pro" className="ml-1 cursor-help">🔒</span>
        </h2>
        <p className="text-5xl font-bold text-blue-600 mt-2">+{(5 - score - 0.5).toFixed(1)} / +20%</p>
        <p className="text-gray-500 text-sm mt-2">Potential to elevate your score and revenue over the next 12 months.</p>
      </Card>
    </div>
  );
}
