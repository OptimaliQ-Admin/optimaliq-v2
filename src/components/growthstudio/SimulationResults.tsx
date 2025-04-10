// File: /src/components/growthstudio/SimulationResults.tsx

import React from "react";

interface SimulationResultsProps {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
}

export default function SimulationResults({
  revenueImpact,
  costSavings,
  efficiencyGain,
}: SimulationResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold text-green-700">📈 Revenue Impact</h3>
        <p className="text-xl font-bold text-green-900 mt-1">
          ${revenueImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold text-blue-700">💸 Cost Savings</h3>
        <p className="text-xl font-bold text-blue-900 mt-1">
          ${costSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg shadow-sm">
        <h3 className="text-md font-semibold text-yellow-700">⚙️ Efficiency Gain</h3>
        <p className="text-xl font-bold text-yellow-900 mt-1">
          {efficiencyGain.toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
