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
    // ✅ Fetch ETF sector breakdown (macro view)
    console.log("🌐 Fetching ETF sector data from Finnhub...");
    const etfRes = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`);
    const etfText = await etfRes.text();

    console.log("📥 ETF Sector Raw Response:", etfText.slice(0, 300));

    let etfData;
    try {
      etfData = JSON.parse(etfText);
    } catch (err) {
      throw new Error("❌ Failed to parse ETF sector JSON. Response was not JSON.");
    }

    // ✅ Fetch general market news
    console.log("🌐 Fetching market news from Finnhub...");
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const newsText = await newsRes.text();

    console.log("📥 News Raw Response:", newsText.slice(0, 300));

    let newsData;
    try {
      newsData = JSON.parse(newsText);
    } catch (err) {
      throw new Error("❌ Failed to parse news JSON. Response was not JSON.");
    }

    const topHeadlines = newsData.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n");

    // 🧠 GPT prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. ETF sector allocation and headline news to generate a weekly strategic market trend summary.

ETF Sector Breakdown (SPY):
${etfData.sectorWeightings.map((s: any) => `- ${s.sector}: ${s.weight}%`).join("\n")}

Top Headlines:
${topHeadlines}

Format:
📊 Summary Insight:
🎯 Strategic Recommendation:
    `.trim();

    console.log("🧠 Sending prompt to GPT. Prompt size:", prompt.length);

    // ✅ GPT call
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

    const gptText = await gptRes.text();
    console.log("📥 Raw OpenAI Response:", gptText.slice(0, 300));

    let gptData;
    try {
      gptData = JSON.parse(gptText);
    } catch (err) {
      throw new Error("❌ Failed to parse GPT response. Got HTML or invalid JSON.");
    }

    const aiText = gptData?.choices?.[0]?.message?.content ?? "No insight returned.";

    // ✅ Save to Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "Finnhub + GPT",
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
