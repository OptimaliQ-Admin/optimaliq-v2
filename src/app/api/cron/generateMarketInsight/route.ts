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
    // 1️⃣ Fetch bellwether stock symbols from industry table (limit 4)
    const { data: bellwethers, error: bellwetherError } = await supabase
      .from("industry_stock_symbols")
      .select("symbol")
      .limit(4);

    if (bellwetherError || !bellwethers || bellwethers.length === 0) {
      throw new Error("❌ No bellwether stocks found");
    }

    const symbols = bellwethers.map((b) => b.symbol);

    // 2️⃣ ETF Sector Allocation
    console.log("🌐 Fetching ETF sector data from Finnhub...");
    const sectorRes = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`);
    const sectorJson = await sectorRes.json();
    const sectorText = Array.isArray(sectorJson.sectorWeights)
      ? sectorJson.sectorWeights.map((s: any) => `- ${s.name}: ${s.weight.toFixed(2)}%`).join("\n")
      : "Sector allocation unavailable.";

    // 3️⃣ Market Sentiment
    let totalBullish = 0;
    let totalBearish = 0;

    for (const sym of symbols) {
      const sentimentRes = await fetch(`https://finnhub.io/api/v1/news-sentiment?symbol=${sym}&token=${FINNHUB_API_KEY}`);
      const sentimentJson = await sentimentRes.json();
      totalBullish += sentimentJson.sentiment?.bullishPercent || 0;
      totalBearish += sentimentJson.sentiment?.bearishPercent || 0;
    }

    const bullish = (totalBullish / symbols.length).toFixed(1);
    const bearish = (totalBearish / symbols.length).toFixed(1);

    // 4️⃣ Analyst Recommendations
    const recommendations = await Promise.all(
      symbols.map(async (sym) => {
        const res = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${sym}&token=${FINNHUB_API_KEY}`);
        const data = await res.json();
        const rating = data?.[0]?.rating || "N/A";
        return `- ${sym}: ${rating}`;
      })
    );
    const analystSummary = recommendations.join("\n");

    // 5️⃣ News Headlines
    console.log("🌐 Fetching market news from Finnhub...");
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const newsJson = await newsRes.json();
    const topHeadlines = Array.isArray(newsJson)
      ? newsJson.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n")
      : "No headlines available.";

    // 6️⃣ GPT Prompt
    const prompt = `
You are a world-class strategic advisor trusted by growth-stage companies to translate market signals into high-impact decisions.

**Your Mission:**
Using the curated market context below, generate a concise, high-value advisory memo. You are speaking to founders, executives, and decision-makers — help them think like top-tier operators.

**Market Context:**

📊 **Sector Allocation (SPY):**
${sectorText}

🧠 **Sentiment Summary (avg. across ${symbols.join(", ")}):**
- Bullish: ${bullish}%
- Bearish: ${bearish}%

📈 **Analyst Recommendations:**
${analystSummary}

📰 **Top Headlines:**
${topHeadlines}

**Instructions:**
- Write an insight memo that delivers **strategic foresight** — tell the user what this data means, why it matters, and how to position their business.
- **Segment insights by industry type if relevant.**
- Reference **macro implications** (e.g., investor sentiment, funding climate, regulatory changes) when relevant.
- Offer **practical takeaways**: What should a smart, growth-focused company *do* with this info?
- Avoid generic statements. Your insight should read like something a Bain or McKinsey consultant would send to an executive client.
- Do NOT add filler or summaries. Start directly with the insight.

**Format:**
📊 Market Summary:
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
