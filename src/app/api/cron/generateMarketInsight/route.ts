import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic for Vercel edge
export const dynamic = "force-dynamic";

// ✅ Supabase init
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
    // 🌐 Sector allocation from SPY ETF
    console.log("🌐 Fetching ETF sector data from Finnhub...");
    const sectorRes = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`);
    const sectorJson = await sectorRes.json();

    let sectorText = "Sector allocation data was not available.";
    if (!sectorJson.error && Array.isArray(sectorJson.sectorWeights)) {
      sectorText = sectorJson.sectorWeights
        .map((s: any) => `- ${s.name}: ${s.weight.toFixed(2)}%`)
        .join("\n");
    } else {
      console.warn("⚠️ Finnhub ETF sector endpoint error:", sectorJson.error || "Unexpected format");
    }

    // 🌐 Market sentiment
    console.log("🌐 Fetching news sentiment from Finnhub...");
    const sentimentRes = await fetch(`https://finnhub.io/api/v1/news-sentiment?symbol=AAPL&token=${FINNHUB_API_KEY}`);
    const sentimentJson = await sentimentRes.json();

    const bullish = sentimentJson.sentiment?.bullishPercent ?? "N/A";
    const bearish = sentimentJson.sentiment?.bearishPercent ?? "N/A";

    // 🌐 Market news
    console.log("🌐 Fetching market news from Finnhub...");
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const newsJson = await newsRes.json();
    const topHeadlines = Array.isArray(newsJson)
      ? newsJson.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n")
      : "No headlines available.";

    // 🧠 Build GPT prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market context and create a weekly insight summary with strategic implications for growth-stage companies.

🟣 Sector Allocation (SPY ETF):
${sectorText}

🔵 Market Sentiment (Apple as proxy):
- Bullish: ${bullish}%
- Bearish: ${bearish}%

📰 Top Headlines:
${topHeadlines}

Format:
📊 Summary Insight:
🎯 Strategic Outlook for Growth Companies:
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

    // ✅ Save to Supabase
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
