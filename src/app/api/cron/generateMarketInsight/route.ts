// File: /src/app/api/cron/generateMarketInsight/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // Required for Vercel cron

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing environment keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // ✅ 1. Fetch Sector Performance
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    if (!sectorRes.ok) throw new Error(`Sector API failed: ${await sectorRes.text()}`);
    const sectorData = await sectorRes.json();

    // ✅ 2. Fetch Top News
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });
    if (!newsRes.ok) throw new Error(`News API failed: ${await newsRes.text()}`);
    const newsData = await newsRes.json();
    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // ✅ 3. Construct OpenAI Prompt with Strict JSON Format
    const prompt = `
You are a McKinsey-level business strategist.

Analyze the following U.S. market data and generate a clear strategic insight and growth recommendation.

Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

Top Headlines:
${topHeadlines}

Return ONLY this format:

{
  "summaryInsight": "One-sentence strategic observation based on the trends.",
  "strategicRecommendation": "One-sentence recommendation for growth-stage businesses."
}
    `.trim();

    // ✅ 4. Send to OpenAI
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

    const rawText = await openaiRes.text();

    let parsed;
    try {
      const parsedJson = JSON.parse(rawText);
      parsed = JSON.parse(parsedJson.choices[0].message.content);
    } catch (err) {
      console.error("❌ Failed to parse OpenAI response", rawText.slice(0, 300));
      return NextResponse.json({ error: "OpenAI JSON parse failure" }, { status: 500 });
    }

    const finalInsight = `📊 ${parsed.summaryInsight}\n\n🎯 ${parsed.strategicRecommendation}`;

    // ✅ 5. Insert into Supabase
    const { error } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: finalInsight,
        source: "finnhub + GPT",
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to store insight" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: finalInsight });
  } catch (err: any) {
    console.error("❌ Unhandled error:", err.message || err);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
