import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// NewsAPI config
const NEWSAPI_KEY = process.env.NEWSAPI_KEY!;
const NEWSAPI_ENDPOINT = `https://newsapi.org/v2/top-headlines?language=en&category=business&pageSize=10&apiKey=${NEWSAPI_KEY}`;

// Simulated McKinsey-style insights
async function fetchMckinseyHeadlines(): Promise<string[]> {
  return [
    "• CEOs are shifting capital toward digital capabilities - https://www.mckinsey.com/featured-insights",
    "• How leading companies build resilience into operations",
    "• The rise of industry-specific AI solutions",
  ];
}

export async function GET() {
  try {
    const allSummaries: string[] = [];
    const allUrls: string[] = [];

    // ✅ Fetch from NewsAPI
    const newsRes = await fetch(NEWSAPI_ENDPOINT);
    const newsData = await newsRes.json();

    if (newsData?.articles?.length) {
      newsData.articles.forEach((a: any) => {
        allSummaries.push(`• ${a.title} - ${a.description || ""}`);
        if (a.url) allUrls.push(a.url);
      });
    }

    // ✅ Add simulated McKinsey insights
    const mckinseyHeadlines = await fetchMckinseyHeadlines();
    allSummaries.push(...mckinseyHeadlines);

    const finalSummary = allSummaries.join("\n");

    // ✅ GPT Prompt
    const prompt = `
You are a strategic advisor. Based on the business headlines and research insights below, generate 3 forward-looking insights that would help business leaders think strategically. Focus on emerging risks, technology shifts, or operational trends.

Return the summary in paragraph form and include 3 tags like ["strategy", "tech", "cx"].

Headlines:
${finalSummary}
`;

    // ✅ GPT Completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const gptText = completion.choices[0].message.content || "";

    // ✅ Extract tags from GPT output
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
    console.error("🔥 Strategic cron job error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
