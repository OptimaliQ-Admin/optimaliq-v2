import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    strategyChange,
    processChange,
    techChange,
    revenue,
    costs,
    efficiency,
  } = await req.json();

  // Weighted impact multipliers
  const strategyWeight = 0.6;
  const processWeight = 0.3;
  const techWeight = 0.4;

  // Apply non-linear scaling (diminishing returns)
  const strategyEffect = Math.pow(Math.abs(strategyChange), 1.1) * Math.sign(strategyChange);
  const processEffect = Math.pow(Math.abs(processChange), 1.05) * Math.sign(processChange);
  const techEffect = Math.pow(Math.abs(techChange), 1.05) * Math.sign(techChange);

  // Efficiency-based multiplier (higher gains if base efficiency is lower)
  const efficiencyMultiplier = (100 - efficiency) / 100; // e.g. 0.5 = 50% efficiency

  // 🚀 New Calculations
  const revenueImpact = Math.round(
    (strategyEffect * strategyWeight +
      processEffect * processWeight +
      techEffect * techWeight) *
      revenue *
      0.12 // Overall scaling factor
  );

  const costSavings = Math.round(
    (strategyEffect * 0.4 + techEffect * 0.6) * costs * 0.07
  );

  const efficiencyGain = Math.round(
    (processEffect + techEffect) * 1.8 * efficiencyMultiplier * 10
  ) / 10;

  return NextResponse.json({
    revenueImpact,
    costSavings,
    efficiencyGain,
  });
}
