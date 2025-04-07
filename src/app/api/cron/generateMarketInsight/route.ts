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

  console.log("🟡 [START] Cron job running:", new Date().toISOString());

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing environment keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // 1️⃣ Fetch bellwether stock symbols from industry table (limit to 4 total)
    const { data: bellwethers, error: bellwetherError } = await supabase
      .from("industry_stock_symbols")
      .select("symbol")
      .limit(4);

    if (bellwetherError || !bellwethers || bellwethers.length === 0) {
      throw new Error("❌ No bellwether stocks found");
    }

    const symbols = bellwethers.map((b) => b.symbol);

    // 2️⃣ Fetch sector allocation
    console.log("🌐 Fetching ETF sector data from Finnhub...");
    const sectorRes = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`);
    const sectorJson = await sectorRes.json();

    let sectorText = "Sector allocation unavailable.";
    if (!sectorJson.error && Array.isArray(sectorJson.sectorWeights)) {
      sectorText = sectorJson.sectorWeights.map((s: any) => `- ${s.name}: ${s.weight.toFixed(2)}%`).join("\n");
    }

    // 3️⃣ Fetch news sentiment
    let totalBullish = 0;
    let totalBearish = 0;
    for (const symbol of symbols) {
      const sentimentRes = await fetch(`https://finnhub.io/api/v1/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const sentimentJson = await sentimentRes.json();
      totalBullish += sentimentJson.sentiment?.bullishPercent || 0;
      totalBearish += sentimentJson.sentiment?.bearishPercent || 0;
    }
    const bullish = (totalBullish / symbols.length).toFixed(1);
    const bearish = (totalBearish / symbols.length).toFixed(1);

    // 4️⃣ Fetch analyst recommendations
    const analystRecs = await Promise.all(symbols.map(async (symbol) => {
      const res = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
      const data = await res.json();
      return `- ${symbol}: ${data[0]?.rating || "N/A"}`;
    }));

    // 5️⃣ Fetch news
    console.log("🌐 Fetching market news from Finnhub...");
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const newsJson = await newsRes.json();
    const topHeadlines = Array.isArray(newsJson)
      ? newsJson.slice(0, 3).map((n: any) => `- \"${n.headline}\"`).join("\n")
      : "No headlines available.";

    // 🧠 Compose GPT Prompt
    const prompt = `
Market Sector Allocation (from SPY):
${sectorText}

Top Market Sentiment (avg from ${symbols.join(", ")}):
- Bullish: ${bullish}%
- Bearish: ${bearish}%

Top Analyst Recommendations:
${analystRecs.join("\n")}

Recent Headlines:
${topHeadlines}

TASK:
Based on this market data, write a concise but consultative weekly insight for growth-stage companies. Be strategic. Be specific. Offer directional advice that helps them think like top-tier operators.

Format:
📊 Market Summary:
🎯 Strategic Outlook:
    `.trim();

    console.log("🧠 Sending prompt to GPT. Length:", prompt.length);

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const gptJson = await gptRes.json();
    const aiText = gptJson?.choices?.[0]?.message?.content ?? "No insight returned.";

    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
        createdat: new Date().toISOString(),
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save insight to Supabase" }, { status: 500 });
    }

    console.log("✅ Cron job complete. Insight saved.");
    return NextResponse.json({ success: true, insight: aiText });
  } catch (err: any) {
    console.error("🔥 FULL ERROR DUMP:", {
      message: err.message,
      stack: err.stack,
      time: new Date().toISOString(),
    });

    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
