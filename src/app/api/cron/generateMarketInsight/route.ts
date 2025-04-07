import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  // 🔐 Protect cron route
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("🔒 Unauthorized cron trigger.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  console.log("🟡 [START] Cron job running:", new Date().toISOString());

  try {
    // 1️⃣ Get all industry -> symbol mappings
    const { data: industries, error: industriesError } = await supabase
      .from("industry_stock_symbols")
      .select("industry, symbol");

    if (industriesError || !industries) {
      throw new Error("❌ Failed to fetch industry symbols");
    }

    // 2️⃣ Group symbols by industry (max 4 per)
    const industryMap: Record<string, string[]> = {};
    for (const { industry, symbol } of industries) {
      if (!industryMap[industry]) industryMap[industry] = [];
      if (industryMap[industry].length < 4) industryMap[industry].push(symbol);
    }

    // 3️⃣ Loop to find the first outdated insight and process only that
    for (const [industry, symbols] of Object.entries(industryMap)) {
      const { data: existingInsight } = await supabase
        .from("realtime_market_trends")
        .select("createdat")
        .eq("industry", industry)
        .order("createdat", { ascending: false })
        .limit(1)
        .maybeSingle();

      const now = new Date();
      const isFresh = existingInsight?.createdat &&
        (now.getTime() - new Date(existingInsight.createdat).getTime()) < 7 * 24 * 60 * 60 * 1000;

      if (isFresh) {
        console.log(`⏩ ${industry} is fresh. Skipping.`);
        continue;
      }

      console.log(`🔄 Processing insight for: ${industry}`);

      // 4️⃣ Sector Allocation
      const sectorRes = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`);
      const sectorJson = await sectorRes.json();
      const sectorText = Array.isArray(sectorJson.sectorWeights)
        ? sectorJson.sectorWeights.map((s: any) => `- ${s.name}: ${s.weight.toFixed(2)}%`).join("\n")
        : "Sector allocation unavailable.";

      // 5️⃣ Sentiment
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

      // 6️⃣ Analyst Recs
      const recommendations = await Promise.all(
        symbols.map(async (sym) => {
          const res = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${sym}&token=${FINNHUB_API_KEY}`);
          const data = await res.json();
          return `- ${sym}: ${data?.[0]?.rating || "N/A"}`;
        })
      );
      const analystSummary = recommendations.join("\n");

      // 7️⃣ Headlines
      const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
      const newsJson = await newsRes.json();
      const topHeadlines = Array.isArray(newsJson)
        ? newsJson.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n")
        : "No headlines available.";

      // 8️⃣ GPT Prompt
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
- Segment insights by industry if relevant.
- Reference macro trends (e.g., funding, supply chain, inflation).
- Offer practical takeaways, no fluff.

**Format:**
📊 Market Summary:
🎯 Strategic Outlook for Growth Companies:
      `.trim();

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
          industry,
          createdat: new Date().toISOString(),
        },
      ]);

      if (dbError) {
        console.error(`❌ Error saving insight for ${industry}:`, dbError);
      } else {
        console.log(`✅ Saved new insight for: ${industry}`);
      }

      break; // ✅ Stop after first update
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 FULL ERROR DUMP:", {
      message: err.message,
      stack: err.stack,
      time: new Date().toISOString(),
    });
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
