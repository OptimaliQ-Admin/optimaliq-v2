import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

// ✅ Define the expected shape of simulation results
interface SimulationResult {
  revenueImpact: number;
  costSavings: number;
  efficiencyGain: number;
}

// ✅ API to handle business simulations
export async function POST(req: Request) {
  try {
    const { strategyChange, processChange, techChange, revenue, costs, efficiency } = await req.json();
    console.log("🔍 Running What-If Simulation with:", { strategyChange, processChange, techChange, revenue, costs, efficiency });

    if (strategyChange === undefined || processChange === undefined || techChange === undefined) {
      return NextResponse.json({ error: "No changes provided for simulation" }, { status: 400 });
    }

    // ✅ Define ML script paths
    const simulationScriptPath = path.resolve(process.cwd(), "ml/business_simulation.py");
    const modelPath = path.resolve(process.cwd(), "ml/business_score_model.pkl");

    // ✅ Run ML model simulation
    const simulationProcess = spawnSync("python3", [
      simulationScriptPath,
      strategyChange.toString(),
      processChange.toString(),
      techChange.toString(),
      revenue.toString(),
      costs.toString(),
      efficiency.toString(),
      modelPath
    ]);

    // ✅ Capture output
    const simulationOutput = simulationProcess.stdout.toString().trim();
    const simulationError = simulationProcess.stderr.toString().trim();

    if (simulationError) {
      console.error("🚨 Simulation Model Error:", simulationError);
    }

    console.log("🔍 Raw Simulation Output:", simulationOutput);

    let parsedResult: SimulationResult;
    try {
      parsedResult = JSON.parse(simulationOutput) as SimulationResult;
    } catch (error) {
      console.error("🚨 JSON Parsing Error:", error);
      return NextResponse.json({ error: "Failed to parse simulation results" }, { status: 500 });
    }

    // ✅ Log Simulation for Tracking
    logSimulation(strategyChange, processChange, techChange, revenue, costs, efficiency, parsedResult);

    return NextResponse.json(parsedResult);

  } catch (error) {
    console.error("🚨 Error in Simulation API:", error);
    return NextResponse.json({ error: "Failed to generate simulation insights" }, { status: 500 });
  }
}

// ✅ Function to log simulations for tracking
function logSimulation(
  strategy: number,
  processChange: number,
  tech: number,
  revenue: number,
  costs: number,
  efficiency: number,
  result: SimulationResult
): void {
  const logFilePath = path.resolve(globalThis.process.cwd(), "ml/simulation_history.csv");

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(
      logFilePath,
      "strategy,process,tech,revenue,costs,efficiency,revenueImpact,costSavings,efficiencyGain\n",
      "utf8"
    );
  }

  const logEntry = `${strategy},${processChange},${tech},${revenue},${costs},${efficiency},${result.revenueImpact},${result.costSavings},${result.efficiencyGain}\n`;
  fs.appendFileSync(logFilePath, logEntry, "utf8");
}

