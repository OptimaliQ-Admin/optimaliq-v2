import path from "path";
import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { strategyChange, processChange, techChange, revenue, costs, efficiency } = await req.json();

    console.log("🔹 Running What-If Simulation with:", {
      strategyChange, processChange, techChange, revenue, costs, efficiency
    });

    if (strategyChange === undefined || processChange === undefined || techChange === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const mlScriptPath = path.resolve(process.cwd(), "ml/business_simulation.py");
    const modelPath = path.resolve(process.cwd(), "ml/business_score_model.pkl");

    console.log(`📂 Running ML Simulation: ${mlScriptPath}`);

    const mlProcess = spawnSync("python3", [
      mlScriptPath,
      strategyChange.toString(),
      processChange.toString(),
      techChange.toString(),
      revenue.toString(),
      costs.toString(),
      efficiency.toString(),
      modelPath
    ]);

    const mlOutput = mlProcess.stdout.toString().trim();
    const mlError = mlProcess.stderr.toString().trim();

    console.log("🔍 Raw ML Output:", mlOutput);
    if (mlError) console.error("⚠️ ML Error:", mlError);

    let result;
    try {
      result = JSON.parse(mlOutput);
    } catch (error) {
      console.error("🚨 JSON Parsing Error:", error);
      return NextResponse.json({ error: "Failed to process simulation results" }, { status: 500 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("🚨 Simulation API Error:", error);
    return NextResponse.json({ error: "Failed to run business simulation" }, { status: 500 });
  }
}
