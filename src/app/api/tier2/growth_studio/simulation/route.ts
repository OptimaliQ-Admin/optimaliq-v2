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

  // Basic mock calculation logic
  const revenueImpact = Math.round((strategyChange + processChange + techChange) * 0.1 * revenue);
  const costSavings = Math.round((strategyChange + techChange) * 0.05 * costs);
  const efficiencyGain = Math.round((processChange + techChange) * 2);

  return NextResponse.json({
    revenueImpact,
    costSavings,
    efficiencyGain,
  });
}
