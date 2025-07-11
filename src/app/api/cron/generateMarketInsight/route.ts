import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

/**
 * Get the last Monday at 12am (midnight)
 */
function getLastMonday12am(): Date {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate days to subtract to get to last Monday
  // If today is Monday (1), we want last Monday, so subtract 7
  // If today is Sunday (0), we want last Monday, so subtract 6
  const daysToSubtract = currentDay === 1 ? 7 : currentDay === 0 ? 6 : currentDay - 1;
  
  const lastMonday = new Date(now);
  lastMonday.setDate(now.getDate() - daysToSubtract);
  lastMonday.setHours(0, 0, 0, 0); // Set to 12am (midnight)
  
  return lastMonday;
}

export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  console.log("🟡 [START] Market Insight Generator - Monday 12am Refresh");

  try {
    const { data: rows, error } = await supabase
      .from("industry_stock_symbols")
      .select("industry, symbol");

    if (error || !rows) throw new Error("Failed to fetch industry stock symbols");

    const industries: Record<string, string[]> = {};
    for (const { industry, symbol } of rows) {
      if (!industries[industry]) industries[industry] = [];
      if (industries[industry].length < 4) industries[industry].push(symbol);
    }

    for (const [industry, symbols] of Object.entries(industries)) {
      const { data: existing } = await supabase
        .from("realtime_market_trends")
        .select("createdat")
        .eq("industry", industry)
        .order("createdat", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Check if we need to refresh (Monday 12am schedule)
      const lastRun = existing?.createdat ? new Date(existing.createdat).getTime() : 0;
      const now = Date.now();
      const lastMonday12am = getLastMonday12am().getTime();
      const isFresh = lastRun > lastMonday12am;
      
      if (isFresh) {
        console.log(`⏰ Skipping ${industry} - already refreshed this week`);
        continue;
      }

      const analystSummary = (await Promise.all(
        symbols.map(async (sym) => {
          const json = await fetch(`https://finnhub.io/api/v1/stock/recommendation?symbol=${sym}&token=${FINNHUB_API_KEY}`).then(r => r.json());
          return `- ${sym}: ${json?.[0]?.rating || "N/A"}`;
        })
      )).join("\n");

      const headlinesJson = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`).then(r => r.json());
      const topHeadlines = Array.isArray(headlinesJson)
        ? headlinesJson.slice(0, 3).map((n: any) => `- \"${n.headline}\"`).join("\n")
        : "No headlines available.";

      const metricJson = await fetch(`https://finnhub.io/api/v1/stock/metric?symbol=${symbols[0]}&metric=all&token=${FINNHUB_API_KEY}`).then(r => r.json());
      const metrics = metricJson?.metric || {};
      const pe = metrics.peTTM ?? "N/A";
      const beta = metrics.beta ?? "N/A";
      const marketCap = metrics.marketCapitalization ? `${Math.round(metrics.marketCapitalization).toLocaleString()}M` : "N/A";

      const prompt = `
You are a world-class strategic advisor trusted by growth-stage companies to translate fast-moving market signals into high-impact decisions.

Market Context
📈 Analyst Recommendations:
${analystSummary}

📰 Top Headlines:
${topHeadlines}

📊 Financial Snapshot for ${symbols[0]}:

P/E Ratio: ${pe}

Beta: ${beta}

Market Cap: ${marketCap}

Instructions
Write a concise, consulting-style memo similar to Bain or McKinsey briefing notes.

Segment by industry only if relevant patterns emerge.

Focus on strategic insights and directional implications — not financial advice or stock recommendations.

Prioritize signals relevant to growth-stage companies (e.g., shifts in consumer behavior, digital investment trends, capital efficiency).

Avoid fluff, hype, or technical trading commentary.

Output Format
📊 Market Summary
A clear 2–4 sentence snapshot of the macro/micro shifts emerging from the analyst sentiment, headlines, and financials.

🎯 Strategic Outlook for Growth Companies

Bullet 1: Insightful, directional action or consideration

Bullet 2

Bullet 3

(Optional) Bullet 4
`.trim();

      const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      const gptJson = await gptRes.json();
      const insight = gptJson?.choices?.[0]?.message?.content ?? "No insight generated.";

      await supabase.from("realtime_market_trends").insert([
        {
          title: "📊 Market Trend Prediction",
          industry,
          insight,
          source: "finnhub + GPT",
          createdat: new Date().toISOString(),
        },
      ]);

      break;
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}
