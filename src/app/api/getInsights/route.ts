import path from "path";
import { spawnSync } from "child_process";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Define OpenAI Response Type
interface AIResponse {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  strategyInsight: string;
  processInsight: string;
  technologyInsight: string;
}

// ✅ Function to log user responses for ML training
function logUserData(strategyScore: number, processScore: number, technologyScore: number, mlScore: number, industry: string): void {
  const logPath = path.resolve(process.cwd(), "ml/training_data.csv");

  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "strategy,process,technology,score,industry\n", "utf8");
  }

  const logEntry = `${strategyScore},${processScore},${technologyScore},${mlScore},${industry}\n`;
  fs.appendFileSync(logPath, logEntry, "utf8");

  if (fs.readFileSync(logPath, "utf8").trim().split("\n").length >= 12) {
    spawnSync("python3", ["ml/train_model.py"]);
  }
}

// ✅ Function to log user data for tracking
function logUserDatabase(strategyScore: number, processScore: number, technologyScore: number, mlScore: number, industry: string, companySize: string, revenueRange: string, name: string, email: string): void {
  const logPath = path.resolve(process.cwd(), "ml/user_database.csv");

  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, "name,email,strategy,process,technology,score,industry,companySize,revenueRange\n", "utf8");
  }

  const logEntry = `${name},${email},${strategyScore},${processScore},${technologyScore},${mlScore},${industry},${companySize},${revenueRange}\n`;
  fs.appendFileSync(logPath, logEntry, "utf8");
}

// ✅ Main API Route
export async function POST(req: Request) {
  try {
    const { answers } = await req.json();
    console.log("🔍 Received Answers:", answers);

    if (!answers) {
      return NextResponse.json({ error: "Missing answers in request" }, { status: 400 });
    }

    // ✅ Capture additional user info
    const industry = answers.industry?.trim() || "Unknown";
    const companySize = answers.companySize?.trim() || "Unknown";
    const revenueRange = answers.revenueRange?.trim() || "Unknown";
    const name = answers.name?.trim() || "Unknown";
    const email = answers.email?.trim() || "Unknown";

    // ✅ OpenAI Prompt
    const aiPrompt = `
      You are a world-class business strategist, trusted by top executives and high-growth companies to uncover hidden opportunities,
      and helping companies scale efficiently. Your expertise lies in diagnosing a company's current state and delivering precise, 
      high-impact recommendations that create a clear, actionable roadmap for growth. 
      Your task is to analyze the following business inputs and generate **customized insights** 
      that reflect the user's unique situation.

      **Business Inputs:**
      1️⃣ **Biggest obstacles:** ${answers.obstacles}
      2️⃣ **Strategy differentiation:** ${answers.strategy}
      3️⃣ **Process optimization:** ${answers.process}
      4️⃣ **Customer understanding:** ${answers.customers}
      5️⃣ **Technology level:** ${answers.technology}

      **Your Task:**
      - Provide **custom insights** directly addressing the user's input.
      - If an obstacle (e.g., "Funding") is listed, showcase how top-performing companies have overcome them. Provide real-world, battle-tested solutions (e.g., alternative funding sources, leadership restructuring, or automation strategies).
      - If strategy is strong, guide the user toward maximum scalability. Offer specific growth levers, such as expanding market share, operational automation, pricing optimization, or vertical/horizontal expansion.
      - If processes are optimized, focus on future-proofing & risk mitigation. Identify areas where bottlenecks could emerge at scale and suggest proactive measures to maintain efficiency.
      - If technology is cutting-edge, provide advanced insights on maximizing ROI through integration, automation, AI-driven efficiencies, and leveraging first-party data.
      - Deliver powerful, compelling insights. Avoid generic advice—every recommendation should be highly relevant, tailored, and capable of driving immediate action.
      - Deliver strategic insights that go beyond surface-level advice. Use the user's inputs to provide deeply customized, high-value recommendations.

      **Example Output Format (strict JSON, no extra text):**
      {
  "strategyScore": 4,
  "strategyInsight": "Your innovative solution is differentiated, but the market entry strategy lacks precision. Focus on refining your ideal customer profile (ICP) and developing a multi-channel acquisition strategy that includes strategic partnerships, outbound targeting, and conversion-optimized landing pages.",
  
  "processScore": 3,
  "processInsight": "Your current operations are stable, but not yet built for scalability. Implement automation in customer onboarding, introduce KPI-driven decision-making, and establish a delegation framework to eliminate bottlenecks as you scale.",
  
  "technologyScore": 5,
  "technologyInsight": "Your tech stack is cutting-edge, but underutilized. Implement a data unification strategy across CRM, analytics, and automation tools to drive more predictive decision-making and customer segmentation."
}
    `;

    console.log("🔹 Sending request to OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: aiPrompt }],
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    console.log("✅ OpenAI Response Received");

    // ✅ Ensure OpenAI response is valid
    if (!response.choices?.[0]?.message?.content) {
      console.error("🚨 OpenAI returned an empty or invalid response.");
      return NextResponse.json({ error: "Failed to parse AI response. Try again later." }, { status: 500 });
    }

    // ✅ Parse response safely
    let parsedResponse: AIResponse;
    try {
      parsedResponse = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("🚨 JSON Parsing Error:", error);
      console.log("📜 Raw OpenAI Response:", response.choices[0].message.content);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    // ✅ Extract AI-generated scores & insights safely
    const strategyScore = parsedResponse.strategyScore ?? 1;
    const processScore = parsedResponse.processScore ?? 1;
    const technologyScore = parsedResponse.technologyScore ?? 1;
    const strategyInsight = parsedResponse.strategyInsight || "No strategy insight available.";
    const processInsight = parsedResponse.processInsight || "No process insight available.";
    const technologyInsight = parsedResponse.technologyInsight || "No technology insight available.";

    let mlScore = strategyScore; // Default fallback
    console.log("🔢 Using Scores for ML:", { strategyScore, processScore, technologyScore, mlScore });

    // ✅ Log Data Separately
    logUserData(strategyScore, processScore, technologyScore, mlScore, industry);
    logUserDatabase(strategyScore, processScore, technologyScore, mlScore, industry, companySize, revenueRange, name, email);

    // ✅ Run ML Model
    const mlScriptPath = path.resolve(process.cwd(), "ml/predict_score.py");
    const modelPath = path.resolve(process.cwd(), "ml/business_score_model.pkl");

    console.log(`📂 ML Script Path: ${mlScriptPath}`);
    console.log(`📂 ML Model Path: ${modelPath}`);

    const mlProcess = spawnSync("python3", [
      mlScriptPath,
      strategyScore.toString(),
      processScore.toString(),
      technologyScore.toString(),
      modelPath
    ]);

    const mlOutput = mlProcess.stdout.toString().trim();
    const mlError = mlProcess.stderr.toString().trim();

    console.log("🔍 Raw ML Model Output:", mlOutput);
    console.log("⚠️ ML Model Error (if any):", mlError);

    try {
      mlScore = parseFloat(mlOutput) || strategyScore;
    } catch (error) {
      console.error("⚠️ ML Score Parsing Error:", error);
    }

    console.log(`✅ Final ML Predicted Score: ${mlScore}`);

    return NextResponse.json({
      score: mlScore,
      strategyScore,
      strategyInsight,
      processScore,
      processInsight,
      technologyScore,
      technologyInsight
    });

  } catch (error) {
    console.error("🚨 AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI-driven insights" }, { status: 500 });
  }
}
