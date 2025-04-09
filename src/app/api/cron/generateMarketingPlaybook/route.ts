import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { load } from "cheerio";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const CRON_SECRET = process.env.CRON_SECRET!;

const URLS_TO_SCRAPE = [
  "https://www.hubspot.com/hubfs/2025%20State%20of%20Marketing%20from%20HubSpot.pdf",
  "https://www.adweek.com/category/marketing/",
  "https://www.marketingdive.com/",
  "https://www.socialmediaexaminer.com/",
  "https://www.contentmarketinginstitute.com/blog/",
  "https://blog.hubspot.com/marketing",
  "https://marketingland.com/",
  "https://martech.org/"
];

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🟡 [START] Weekly Marketing Playbook Generator");

  try {
    // Create a helper function for fetch and scrape
    const fetchAndScrape = async (url: string) => {
      try {
        const html = await fetch(url).then((res) => res.text());
        const $ = load(html);
        const headlinesForUrl: string[] = [];
        $("h1, h2, h3, p").each((_, el) => {
          const text = $(el).text().trim();
          if (text.length > 40 && text.length < 300) {
            headlinesForUrl.push(`- ${text}`);
          }
        });
        return headlinesForUrl;
      } catch (e) {
        console.warn("⚠️ Failed to fetch/scrape:", url);
        return [];
      }
    };

    // Execute all fetch requests concurrently
    const results = await Promise.all(URLS_TO_SCRAPE.map(fetchAndScrape));
    const headlines = results.flat();

    // Prepare prompt using the first 20 headlines
    const contentChunk = headlines.slice(0, 20).join("\n");
    const prompt = `
You are an elite marketing strategist for high-growth companies. Based on the latest headlines below from trusted sources, summarize:

1. 3–5 tactical marketing trends
2. Actionable strategic plays companies should adopt

Do not mention websites. Tie to business outcomes. Output format:

🧠 Tactical Marketing Brief — {Month Year}
🔥 Trends:
🎯 Plays:

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
        model: "gpt-o3-mini",
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
  } catch (err: any) {
    console.error("🔥 Cron Job Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
