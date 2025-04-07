// File: /src/app/api/cron/generateMarketInsight/route.ts

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;

  if (!FINNHUB_API_KEY || !process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing API keys" }, { status: 500 });
  }

  try {
    // 1. Fetch sector performance
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!sectorRes.ok) {
      throw new Error(`Sector API failed: ${sectorRes.status}`);
    }

    const sectorData = await sectorRes.json();

    // 2. Fetch top news
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!newsRes.ok) {
      throw new Error(`News API failed: ${newsRes.status}`);
    }

    const newsData = await newsRes.json();

    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- \"${n.headline}\"`).join("\n");

    // 3. Create prompt
    const aiPrompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market data and news to create a strategic summary and actionable recommendation for growth-stage companies.

Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

Top Headlines:
${topHeadlines}

Format:
📊 Summary Insight:
🎯 Strategic Recommendation:
    `.trim();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: aiPrompt }],
      temperature: 0.7,
    });

    const insightText = response.choices?.[0]?.message?.content || "No insight returned.";

    // 4. Store in Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "\ud83d\udcc8 Market Trend Prediction",
        insight: insightText,
        source: "finnhub + GPT",
      },
    ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save insight" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: insightText });
  } catch (err: any) {
    console.error("❌ Unhandled error in generateMarketInsight:", err);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}