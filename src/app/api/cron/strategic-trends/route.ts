// src/app/api/cron/strategic-trends/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const NEWSAPI_KEY = process.env.NEWSAPI_KEY!;
const NEWSAPI_ENDPOINT = `https://newsapi.org/v2/top-headlines?language=en&category=business&pageSize=10&apiKey=${NEWSAPI_KEY}`;

// Fetch CB Insights' recent headlines
async function fetchCBInsights(): Promise<string[]> {
  try {
    const res = await fetch("https://www.cbinsights.com/research/rss");
    const xml = await res.text();
    const items = Array.from(xml.matchAll(/<item>[\s\S]*?<\/item>/g)).slice(0, 5);

    return items.map((item) => {
      const title = item[1].match(/<title>(.*?)<\/title>/)?.[1]?.trim();
      const description = item[1].match(/<description>(.*?)<\/description>/)?.[1]?.trim();
      const link = item[1].match(/<link>(.*?)<\/link>/)?.[1]?.trim();
      return `• ${title} - ${description || ""} (${link})`;
    });
  } catch (e) {
    console.error("❌ Failed to fetch CB Insights RSS", e);
    return [];
  }
}

// Simulated McKinsey scrape
async function fetchMckinseyHeadlines(): Promise<string[]> {
  return [
    "• CEOs are shifting capital toward digital capabilities - https://www.mckinsey.com/featured-insights",
    "• How leading companies build resilience into operations",
    "• The rise of industry-specific AI solutions"
  ];
}

export async function GET() {
  try {
    const allSummaries: string[] = [];
    const allUrls: string[] = [];

    // Fetch NewsAPI headlines
    const newsRes = await fetch(NEWSAPI_ENDPOINT);
    const newsData = await newsRes.json();
    if (newsData?.articles?.length) {
      newsData.articles.forEach((a: any) => {
        allSummaries.push(`• ${a.title} - ${a.description || ""}`);
        if (a.url) allUrls.push(a.url);
      });
    }

    // Fetch CB Insights and McKinsey
    const cbHeadlines = await fetchCBInsights();
    const mckinseyHeadlines = await fetchMckinseyHeadlines();
    allSummaries.push(...cbHeadlines, ...mckinseyHeadlines);

    const finalSummary = allSummaries.join("\n");

    // GPT Prompt
    const prompt = `
You are a strategic advisor. Based on the headlines below, generate 3 forward-looking insights that would help business leaders think strategically. Focus on emerging risks, technology shifts, or operational trends.

Return the summary in paragraph form and include 3 tags like ["strategy", "tech", "cx"].

Headlines:
${finalSummary}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const gptText = completion.choices[0].message.content || "";

    // ✅ Safely extract tags
    let tags: string[] = [];
    try {
      const tagMatch = gptText.match(/\[.*?\]/);
      if (tagMatch?.[0]) {
        tags = JSON.parse(tagMatch[0]);
      }
    } catch {
      console.warn("⚠️ Failed to parse tags from GPT output. Defaulting to ['strategy']");
      tags = ["strategy"];
    }

    // ✅ Insert into Supabase
    const { error } = await supabase.from("realtime_strategic_trends").insert({
      raw_input: finalSummary,
      gpt_summary: gptText,
      gpt_tags: tags,
      source_urls: allUrls,
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to insert into DB" }, { status: 500 });
    }

    return NextResponse.json({ success: true, summary: gptText, tags });
  } catch (err) {
    console.error("🔥 Strategic cron error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
