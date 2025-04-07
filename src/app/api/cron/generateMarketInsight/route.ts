// File: /src/app/api/cron/generateMarketInsight/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing API Keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // 1. Fetch Sector Data
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const sectorData = await sectorRes.json();

    // 2. Fetch News
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const newsData = await newsRes.json();
    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // 3. Compose Prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market data and news to create a strategic summary and actionable recommendation for growth-stage companies.

Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

Top Headlines:
${topHeadlines}

Format:
📊 Summary Insight:
🎯 Strategic Recommendation:
    `.trim();

    // 4. Call OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const text = await openaiRes.text();

    if (!openaiRes.ok) {
      console.error("❌ OpenAI Error Text:", text.slice(0, 200));
      return NextResponse.json({ error: "OpenAI request failed", detail: text }, { status: 500 });
    }

    let aiData;
    try {
      aiData = JSON.parse(text);
    } catch (err) {
      console.error("❌ Failed to parse OpenAI response as JSON");
      console.log("📃 Raw OpenAI response:", text.slice(0, 500));
      return NextResponse.json({ error: "Invalid JSON from OpenAI" }, { status: 500 });
    }

    const aiText = aiData.choices?.[0]?.message?.content || "No insight returned.";

    // 5. Store in Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to save to Supabase" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: aiText });
  } catch (err: any) {
    console.error("❌ Unhandled Error:", err.message || err);
    return NextResponse.json({ error: "Server error", detail: err.message || err }, { status: 500 });
  }
}
