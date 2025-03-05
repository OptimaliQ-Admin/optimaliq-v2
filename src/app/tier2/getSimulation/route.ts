import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, strategyChange, processChange, techChange, revenue, costs, efficiency } = await req.json();
    if (!global.__basedir) {
      global.__basedir = process.cwd();
    }
    
    if (!email) {
      return NextResponse.json({ error: "Missing user session (email required)." }, { status: 400 });
    }

    if (
      strategyChange === undefined ||
      processChange === undefined ||
      techChange === undefined ||
      revenue === undefined ||
      costs === undefined ||
      efficiency === undefined
    ) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    console.log("🔍 Running business simulation for:", {
      email,
      strategyChange,
      processChange,
      techChange,
      revenue,
      costs,
      efficiency,
    });

    // ✅ Store CWD before Next.js renames `process`
    const _cwd = process.cwd();

    const scriptPath = path.resolve(_cwd, "ml/business_simulation.py");
    const modelPath = path.resolve(_cwd, "ml/business_score_model.pkl");

    // ✅ Run Python script for simulation
    const simulationProcess = spawnSync("python3", [
      scriptPath,
      strategyChange.toString(),
      processChange.toString(),
      techChange.toString(),
      revenue.toString(),
      costs.toString(),
      efficiency.toString(),
      modelPath,
    ]);

    const output = simulationProcess.stdout.toString().trim();
    const errorOutput = simulationProcess.stderr.toString().trim();

    if (errorOutput) {
      console.error("🚨 Simulation Error:", errorOutput);
      return NextResponse.json({ error: "Simulation failed. Check logs." }, { status: 500 });
    }

    console.log("📊 Simulation Result:", output);

    let simulationResult;
    try {
      simulationResult = JSON.parse(output);
    } catch (parseError) {
      console.error("🚨 JSON Parsing Error:", parseError);
      return NextResponse.json({ error: "Failed to parse simulation results." }, { status: 500 });
    }

    // ✅ Ensure the `ml/` directory exists
    const logDir = path.resolve(_cwd, "ml");
    if (!fs.existsSync(logDir)) {
      console.log("🚨 ml/ directory missing. Creating...");
      fs.mkdirSync(logDir, { recursive: true });
    }

    // ✅ Set log file path
    const logPath = path.join(_cwd, "ml/simulation_history.csv");

    console.log("✅ Logging simulation results...");
    console.log("🔹 Process.cwd():", _cwd);
    console.log("🔹 Log Path:", logPath);

    // ✅ Ensure the CSV file exists with headers
    if (!fs.existsSync(logPath)) {
      console.log("🚨 simulation_history.csv missing. Creating with headers...");
      fs.writeFileSync(
        logPath,
        "email,strategyChange,processChange,techChange,revenueImpact,costSavings,efficiencyGain,newOverallScore,timestamp\n",
        "utf8"
      );
    }

    const logEntry = `${email},${strategyChange},${processChange},${techChange},${simulationResult.revenueImpact},${simulationResult.costSavings},${simulationResult.efficiencyGain},${simulationResult.newOverallScore},${new Date().toISOString()}\n`;

    try {
      fs.appendFileSync(logPath, logEntry, "utf8");
      console.log("✅ Successfully wrote to the CSV:", logEntry);
    } catch (writeError) {
      console.error("🚨 Error writing to CSV:", writeError);
    }

    console.log("✅ Simulation result logged successfully.");

    return NextResponse.json(simulationResult);
  } catch (error) {
    console.error("🚨 API Error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
