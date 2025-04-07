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
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  if (!FINNHUB_API_KEY) {
    console.error("❌ Missing Finnhub key");
    return NextResponse.json({ error: "Missing keys" }, { status: 500 });
  }

  try {
    // ✅ Fetch sector performance
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    if (!sectorRes.ok) {
      const text = await sectorRes.text();
      throw new Error(`Sector API failed: ${text}`);
    }
    const sectorData = await sectorRes.json();

    // ✅ Fetch top news
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    if (!newsRes.ok) {
      const text = await newsRes.text();
      throw new Error(`News API failed: ${text}`);
    }
    const newsData = await newsRes.json();

    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // 🧠 GPT Prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market data and news to create a strategic summary and actionable recommendation for growth-stage companies.

Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

Top Headlines:
${topHeadlines}

Return result in this strict format (JSON only, no pretext):
{
  "summary": "...",
  "recommendation": "..."
}
    `.trim();

    console.log("🧠 Sending prompt to GPT...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    const raw = response.choices?.[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned empty content");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("❌ Failed to parse OpenAI JSON:", raw);
      throw new Error("OpenAI did not return strict JSON as expected.");
    }

    const { summary, recommendation } = parsed;

    // ✅ Save to Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: `📊 Summary Insight:\n${summary}\n\n🎯 Strategic Recommendation:\n${recommendation}`,
        source: "finnhub + GPT",
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save insight" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: parsed });
  } catch (err: any) {
    console.error("❌ Unhandled Error:", err.message);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
