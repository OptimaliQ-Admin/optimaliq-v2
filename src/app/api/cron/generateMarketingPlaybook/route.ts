import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { scrapeHeadlinesFromUrls } from "src/lib/scrapeSources";

import { getErrorMessage } from "@/utils/errorHandler";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;

const SOURCES = [
  "https://www.hubspot.com/hubfs/2025%20State%20of%20Marketing%20from%20HubSpot.pdf",
  "https://www.adweek.com/category/marketing/",
  "https://www.marketingdive.com/",
  "https://www.sagefrog.com/wp-content/uploads/2024/11/Top-Marketing-Objectives-Playbook_v3.pdf",
  "https://www.socialmediaexaminer.com/",
  "https://www.contentmarketinginstitute.com/blog/",
  "https://www.linkedin.com/pulse/my-2025-marketing-playbook-jeremy-mays-hi3fe/",
  "https://blog.hubspot.com/marketing",
  "https://marketingland.com/",
  "https://martech.org/"
];

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🟡 [START] Tactical Marketing Playbook Generator");

  try {
    const selectedSources = SOURCES.sort(() => 0.5 - Math.random()).slice(0, 3); // rotate sources randomly
    const headlines = await scrapeHeadlinesFromUrls(selectedSources);

    const contentChunk = headlines.slice(0, 20).join("\n");
    const prompt = `
You are a marketing intelligence strategist trusted by top CMOs to identify emerging marketing trends, shifts in investment strategy, and strategic plays shaping modern go-to-market efforts.

Based on the curated news headlines below, extract high-level marketing trends and directional guidance for growth-stage companies.

📰 Headlines:
${contentChunk}

🗂️ Instructions:

Assume headlines are from the past 7 days and reflect current shifts and patterns.

Identify marketing priorities, channel shifts, investment signals, and campaign strategies from industry leaders.

Focus on budget reallocation, audience behavior, channel performance, creative trends, and tech adoption.

Frame insights for a cross-industry CMO audience (unless specific vertical patterns emerge).

Avoid quoting sources or websites.

Keep the tone strategic, data-aware, and future-focused — not tactical or executional.

If signals are weak or unclear, provide thoughtful context and guidance.

Output Format
✍️ Output Format:
🧠 Marketing Intelligence Brief — {Month Year}

🔥 Trends:
List 4–5 emerging shifts in brand marketing strategy. Each should be concise, specific, and ideally quantitative.
(e.g., "B2B brands are reallocating up to 25% of paid media budgets to lifecycle email automation.")

🎯 Strategic Plays:
Offer 3–4 directional plays companies might consider in response. These should be hypothesis-driven, grounded in market signals, and include ROI indicators where possible.
(e.g., "Retailers investing in loyalty-first retention campaigns have seen 40% lift in 6-month CLTV.")
`.trim();

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
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

    const json = await aiResponse.json();
    const insight = json?.choices?.[0]?.message?.content;

    if (!insight) throw new Error("GPT returned no content.");

    const { error } = await supabase.from("realtime_marketing_playbook").insert([
      {
        insight,
        source: "GPT + Curated URLs",
      },
    ]);

    if (error) {
      console.error("❌ DB insert failed:", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    console.log("✅ Tactical Marketing Playbook saved.");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("🔥 Cron Job Error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
