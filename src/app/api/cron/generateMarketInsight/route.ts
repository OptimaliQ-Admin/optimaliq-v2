"use server";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// Supabase client using service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  // ✅ TEMP LOG — for debugging only
  console.log("✅ FINNHUB_API_KEY loaded:", FINNHUB_API_KEY ? "yes" : "NO");

  try {
    // 1. Fetch sector performance (header auth)
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!sectorRes.ok) {
      const text = await sectorRes.text();
      console.error("❌ Sector API failed:", sectorRes.status, text);
      return NextResponse.json({ error: "Sector API failed" }, { status: 500 });
    }

    const sectorData = await sectorRes.json();

    // 2. Fetch top headlines (header auth)
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!newsRes.ok) {
      const text = await newsRes.text();
      console.error("❌ News API failed:", newsRes.status, text);
      return NextResponse.json({ error: "News API failed" }, { status: 500 });
    }

    const newsData = await newsRes.json();
    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // 3. Compose OpenAI prompt
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

    // 4. Send to OpenAI
    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await aiResponse.json();

    if (!aiData.choices || !aiData.choices[0]) {
      console.error("❌ OpenAI response malformed:", aiData);
      return NextResponse.json({ error: "OpenAI did not return a valid response" }, { status: 500 });
    }

    const aiText = aiData.choices[0].message.content || "No insight returned";

    // 5. Save to Supabase
    const { error } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save insight" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: aiText });
  } catch (err) {
    console.error("❌ Unhandled error in cron job:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
