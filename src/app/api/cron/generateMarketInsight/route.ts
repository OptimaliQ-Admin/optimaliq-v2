import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

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

      const lastRun = existing?.createdat ? new Date(existing.createdat).getTime() : 0;
      const isFresh = Date.now() - lastRun < 7 * 24 * 60 * 60 * 1000;
      if (isFresh) continue;

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
You are a world-class strategic advisor trusted by growth-stage companies to translate market signals into high-impact decisions.

**Market Context:**

📈 Analyst Recommendations:
${analystSummary}

📰 Top Headlines:
${topHeadlines}

📊 Financial Snapshot for ${symbols[0]}:
- P/E Ratio: ${pe}
- Beta: ${beta}
- Market Cap: ${marketCap}

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
          model: "gpt-4.1",
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
