import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  // 🔐 Auth protection
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn("🔒 Unauthorized cron trigger.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
  console.log("🟡 [START] Cron job running:", new Date().toISOString());

  try {
    // 🧩 1. Load all industry-symbol mappings
    const { data: rows, error } = await supabase
      .from("industry_stock_symbols")
      .select("industry, symbol");

    if (error || !rows) throw new Error("Failed to fetch industry stock symbols");

    // 📦 2. Map symbols per industry (limit 4)
    const industries: Record<string, string[]> = {};
    for (const { industry, symbol } of rows) {
      if (!industries[industry]) industries[industry] = [];
      if (industries[industry].length < 4) industries[industry].push(symbol);
    }

    // 🔍 3. Loop through each industry, process one that's outdated
    for (const [industry, symbols] of Object.entries(industries)) {
      const { data: existing } = await supabase
        .from("realtime_market_trends")
        .select("createdat")
        .eq("industry", industry)
        .order("createdat", { ascending: false })
        .limit(1)
        .maybeSingle();

      const lastRun = existing?.createdat ? new Date(existing.createdat).getTime() : 0;
      const isFresh = Date.now() - lastRun < 7 * 24 * 60 * 60 * 1000;
      if (isFresh) {
        console.log(`⏭️ ${industry} is fresh. Skipping.`);
        continue;
      }

      console.log(`🔄 Processing: ${industry}`);

      // 📊 Sector Allocation
      const sectorData = await fetch(`https://finnhub.io/api/v1/etf/sector?symbol=SPY&token=${FINNHUB_API_KEY}`).then(r => r.json());
      const sectorText = Array.isArray(sectorData?.sectorWeights)
        ? sectorData.sectorWeights.map((s: any) => `- ${s.name}: ${s.weight.toFixed(2)}%`).join("\n")
        : "Sector data unavailable.";

      // 📈 Sentiment
      let bullish = 0, bearish = 0;
      for (const sym of symbols) {
        const json = await fetch(`https://finnhub.io/api/v1/news-sentiment?symbol=${sym}&token=${FINNHUB_API_KEY}`).then(r => r.json());
        bullish += json?.sentiment?.bullishPercent || 0;
        bearish += json?.sentiment?.bearishPercent || 0;
      }
      const avgBullish = (bullish / symbols.length).toFixed(1);
      const avgBearish = (bearish / symbols.length).toFixed(1);

      // 🧠 Analyst Recs
      const analystSummary = (await Promise.all(
        symbols.map(async (sym) => {
          const json = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${sym}&token=${FINNHUB_API_KEY}`).then(r => r.json());
          return `- ${sym}: ${json?.[0]?.rating || "N/A"}`;
        })
      )).join("\n");

      // 📰 Headlines
      const headlinesJson = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`).then(r => r.json());
      const topHeadlines = Array.isArray(headlinesJson)
        ? headlinesJson.slice(0, 3).map((n: any) => `- "${n.headline}"`).join("\n")
        : "No headlines available.";

      // 💬 GPT Prompt
      const prompt = `
You are a world-class strategic advisor trusted by growth-stage companies to translate market signals into high-impact decisions.

**Market Context:**

📊 Sector Allocation:
${sectorText}

🧠 Sentiment (avg. across ${symbols.join(", ")}):
- Bullish: ${avgBullish}%
- Bearish: ${avgBearish}%

📈 Analyst Recommendations:
${analystSummary}

📰 Top Headlines:
${topHeadlines}

**Instructions:**
- Write a Bain/McKinsey-style memo.
- Segment by industry if relevant.
- Provide directional insights and strategic actions.
- Avoid fluff.

**Output:**
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
      const insight = gptJson?.choices?.[0]?.message?.content ?? "No insight generated.";

      const { error: insertErr } = await supabase.from("realtime_market_trends").insert([
        {
          title: "📊 Market Trend Prediction",
          industry,
          insight,
          source: "finnhub + GPT",
          createdat: new Date().toISOString(),
        },
      ]);

      if (insertErr) console.error(`❌ Failed to save insight for ${industry}`, insertErr);
      else console.log(`✅ Insight saved for: ${industry}`);

      break; // ✅ STOP after processing one industry
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("🔥 Cron Error:", err.message);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
