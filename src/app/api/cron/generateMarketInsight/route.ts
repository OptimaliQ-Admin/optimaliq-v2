// /src/app/api/cron/generateMarketInsight/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // Fetch sector performance
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const sectorData = await sectorRes.json();

    // Fetch top news
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    const newsData = await newsRes.json();

    const topHeadlines = newsData
      .slice(0, 3)
      .map((n: any) => `- "${n.headline}"`)
      .join("\n");

    // GPT prompt
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

    // 🔥 OpenAI call
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
        max_tokens: 500,
      }),
    });

    // ⛔ Handle bad OpenAI response (like HTML instead of JSON)
    const rawText = await openaiRes.text();
    console.log("📜 OpenAI Raw Response Text:", rawText);

    if (!openaiRes.ok) {
      return NextResponse.json({
        error: "OpenAI request failed",
        detail: rawText.slice(0, 500), // avoid flooding logs
      }, { status: 500 });
    }

    // ✅ Parse response (if it's JSON)
    let aiData;
    try {
      aiData = JSON.parse(rawText);
    } catch (err) {
      console.error("🚨 OpenAI returned invalid JSON");
      return NextResponse.json({
        error: "OpenAI did not return valid JSON.",
        detail: rawText.slice(0, 500),
      }, { status: 500 });
    }

    const aiText = aiData?.choices?.[0]?.message?.content ?? "No insight returned.";

    // ✅ Save to Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
      },
    ]);

    if (dbError) {
      return NextResponse.json({ error: "Failed to save insight to Supabase" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: aiText });
  } catch (err: any) {
    console.error("❌ Unhandled Error in Cron:", err);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
