// File: /src/app/api/cron/generateMarketInsight/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  console.log("🟡 [START] Cron job running:", new Date().toISOString());

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing environment keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // ✅ 1. Fetch sector performance from Finnhub
    console.log("🌐 Fetching sector data from Finnhub...");
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    const sectorText = await sectorRes.text();
    console.log("📥 Sector Raw Response:", sectorText.slice(0, 300));

    if (!sectorRes.ok) throw new Error(`Sector API failed: ${sectorText}`);

    const sectorData = JSON.parse(sectorText);
    console.log("✅ Parsed Sector Data:", sectorData);

    // ✅ 2. Fetch news from Finnhub
    console.log("🌐 Fetching market news from Finnhub...");
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    const newsText = await newsRes.text();
    console.log("📥 News Raw Response:", newsText.slice(0, 500));

    if (!newsRes.ok) throw new Error(`News API failed: ${newsText}`);

    const newsData = JSON.parse(newsText);
    console.log("✅ Parsed News Data. Top 3 headlines:");
    newsData.slice(0, 3).forEach((n: any, i: number) => {
      console.log(`📰 Headline ${i + 1}:`, n.headline);
    });

    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // ✅ 3. Compose OpenAI prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market data and news to create a strategic summary and actionable recommendation for growth-stage companies.

📊 Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

📰 Top Headlines:
${topHeadlines}

✍️ Format (Strict):
{
  "summary": "...",
  "recommendation": "..."
}
`.trim();

    console.log("🧠 Final Prompt Sent to OpenAI:\n", prompt);

    // ✅ 4. Call OpenAI
    console.log("🚀 Sending request to OpenAI...");

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

    const contentType = openaiRes.headers.get("content-type");
    const statusCode = openaiRes.status;
    console.log("📬 OpenAI Response Status:", statusCode);
    console.log("📦 OpenAI Content-Type:", contentType);

    const rawOpenAI = await openaiRes.text();
    console.log("📜 Raw OpenAI Response (first 500 chars):", rawOpenAI.slice(0, 500));

    if (!openaiRes.ok) {
      throw new Error(`OpenAI Error Response:\nStatus: ${statusCode}\n${rawOpenAI}`);
    }

    let parsedOpenAI;
    try {
      parsedOpenAI = JSON.parse(rawOpenAI);
    } catch (jsonErr) {
      console.error("❌ Failed to parse OpenAI JSON:", jsonErr);
      return NextResponse.json(
        {
          error: "OpenAI returned invalid JSON",
          debug: rawOpenAI.slice(0, 500),
        },
        { status: 500 }
      );
    }

    const aiText = parsedOpenAI?.choices?.[0]?.message?.content ?? "No insight returned.";
    console.log("✅ Parsed OpenAI Content:\n", aiText);

    // ✅ 5. Store in Supabase
    console.log("💾 Inserting into Supabase...");
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
        generatedat: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase Insert Error:", dbError);
      return NextResponse.json({ error: "Failed to insert into Supabase", dbError }, { status: 500 });
    }

    console.log("✅ Insight saved to Supabase");

    return NextResponse.json({ success: true, insight: aiText });
  } catch (err: any) {
    console.error("🔥 FULL ERROR DUMP:", {
      message: err.message,
      stack: err.stack,
      time: new Date().toISOString(),
    });

    return NextResponse.json({ error: "Unhandled Server Error", detail: err.message }, { status: 500 });
  }
}
