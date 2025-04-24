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
You are a marketing intelligence strategist trusted by top CMOs. Based on the headlines below, extract high-level strategic marketing trends and investment signals.

Your goal is to help growth-stage companies understand how leading brands are allocating budget, shifting priorities, and adjusting their marketing playbooks. These insights should guide strategic thinking — not prescribe exact actions.

Do not mention the original sources or websites.

Format the response as:

🧠 Marketing Intelligence Brief — {Month Year}
🔥 Trends:
List 4-5 emerging marketing shifts (e.g., "B2B brands reallocating 25% of paid media budget to lifecycle email campaigns").

🎯 Strategic Plays:
Offer 3-4 directional plays companies might consider, based on the trends above. Include ROI signals or benchmarks if possible (e.g., "Brands investing in short-form video are seeing 40% lift in engagement").

Headlines:
${contentChunk}
    `.trim();

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
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
