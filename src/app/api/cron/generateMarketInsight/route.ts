// File: /src/app/api/cron/generateMarketInsight/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

  if (!FINNHUB_API_KEY || !process.env.OPENAI_API_KEY) {
    console.error("❌ Missing API Keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // 1. Fetch sector data
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const sectorData = await sectorRes.json();

    // 2. Fetch news data
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const newsData = await newsRes.json();
    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- \"${n.headline}\"`).join("\n");

    // 3. Compose GPT prompt
    const aiPrompt = `
      You are a world-class market strategist. Analyze the following U.S. sector performance data and news headlines. Provide:
      - A strategic insight summarizing the state of the market
      - A high-level recommendation for growing companies to act on.

      Sector Performance:
      ${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

      Headlines:
      ${topHeadlines}

      Format (strict JSON only):
      {
        "summaryInsight": "...",
        "strategicRecommendation": "..."
      }
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: aiPrompt }],
      response_format: { type: "json_object" },
    });

    const raw = completion.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(raw!);
    } catch (err) {
      console.error("🚨 JSON Parse Error:", err);
      console.log("🔴 Raw content:", raw);
      return NextResponse.json({ error: "OpenAI returned invalid JSON" }, { status: 500 });
    }

    const { summaryInsight, strategicRecommendation } = parsed;

    // 4. Store in Supabase
    const { error } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: `📊 Summary Insight: ${summaryInsight}\n\n🎯 Strategic Recommendation: ${strategicRecommendation}`,
        source: "finnhub + GPT",
      },
    ]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      return NextResponse.json({ error: "Failed to store insight" }, { status: 500 });
    }

    return NextResponse.json({ success: true, summaryInsight, strategicRecommendation });
  } catch (err: any) {
    console.error("❌ Unhandled error:", err);
    return NextResponse.json({ error: "Server error", detail: err.message || err }, { status: 500 });
  }
}
