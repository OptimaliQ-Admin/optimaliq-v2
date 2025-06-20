// File: /src/app/api/growth_studio/commentary/route.ts
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

import { getErrorMessage } from "@/utils/errorHandler";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const {
      revenueImpact,
      costSavings,
      efficiencyGain,
    } = await req.json();

    const prompt = `
You are a business strategy consultant. Given the following simulation results, write a 2–3 sentence executive-level insight.

Use strategic language, avoid repeating the numbers verbatim, and focus on what it suggests for decision-making.

Simulation Results:
- Revenue Impact: $${revenueImpact}
- Cost Savings: $${costSavings}
- Efficiency Gain: ${efficiencyGain}%

Insight:
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const summary = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ summary });
  } catch (err: unknown) {
    console.error("🔥 Commentary error:", err);
    return NextResponse.json({ error: getErrorMessage(err) || "Failed to generate insight" }, { status: 500 });
  }
}
