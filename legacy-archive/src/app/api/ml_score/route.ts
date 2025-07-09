// src/app/api/ml_score/route.ts

import { NextRequest, NextResponse } from "next/server";

// List of supported industries (you can expand as needed)
const industries = [
  "E-commerce","Finance","SaaS","Education","Technology","Healthcare","Retail","Manufacturing",
  "Consulting","Entertainment","Real Estate","Transportation","Hospitality","Energy",
  "Telecommunications","Pharmaceuticals","Automotive","Construction","Legal","Nonprofit","Other"
];

// Simple weighted scoring function as placeholder
function predictScore(strategy: number, process: number, tech: number): number {
  // Example: weighted average, adjust weights as you want
  const score = 0.4 * strategy + 0.3 * process + 0.3 * tech;
  return Math.min(Math.max(Number(score.toFixed(2)), 1), 5); // Clamp between 1 and 5
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const strategy_score = Number(body.strategy_score);
    const process_score = Number(body.process_score);
    const technology_score = Number(body.technology_score);
    const industry = typeof body.industry === "string" ? body.industry : "Other";

    if (
      isNaN(strategy_score) || isNaN(process_score) || isNaN(technology_score) ||
      strategy_score < 1 || strategy_score > 5 ||
      process_score < 1 || process_score > 5 ||
      technology_score < 1 || technology_score > 5 ||
      !industries.includes(industry)
    ) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    // Here you would replace this with your real ML model logic or external API call
    const predicted_score = predictScore(strategy_score, process_score, technology_score);

    return NextResponse.json({ predicted_score });
  } catch (error) {
    console.error("ML Score API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
