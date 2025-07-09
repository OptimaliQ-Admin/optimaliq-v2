//src/app/api/growth_studio/simulation/route.ts

import { NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/errorHandler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      strategyChange,
      processChange,
      techChange,
      revenue,
      costs,
      efficiency,
    } = body;

    // Validate input
    if (
      typeof strategyChange !== 'number' ||
      typeof processChange !== 'number' ||
      typeof techChange !== 'number' ||
      typeof revenue !== 'number' ||
      typeof costs !== 'number' ||
      typeof efficiency !== 'number'
    ) {
      return NextResponse.json(
        { error: "Invalid input: all parameters must be numbers" },
        { status: 400 }
      );
    }

    // Validate ranges
    if (
      strategyChange < -2 || strategyChange > 2 ||
      processChange < -2 || processChange > 2 ||
      techChange < -2 || techChange > 2 ||
      revenue < 0 ||
      costs < 0 ||
      efficiency < 0 || efficiency > 100
    ) {
      return NextResponse.json(
        { error: "Invalid input: parameters out of valid range" },
        { status: 400 }
      );
    }

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
  } catch (err: unknown) {
    console.error("❌ Simulation error:", err);
    return NextResponse.json(
      { error: getErrorMessage(err) || "Failed to process simulation" },
      { status: 500 }
    );
  }
}
