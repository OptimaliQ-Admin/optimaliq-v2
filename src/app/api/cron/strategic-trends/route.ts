import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";

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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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
You are a world-renowned strategic advisor at McKinsey & Company, helping business leaders decode emerging strategic shifts.

Your task is to generate three forward-looking strategic headlines, each followed by three concise, executive-ready bullet-point insights. These insights should address innovation, competitive dynamics, risk signals, and investment shifts relevant to C-level conversations.

${finalSummary} contains up to 3 headline blocks, each consisting of:
- A short headline (1 sentence)
- Supporting research insights (1–3 sentences of context)

Example format:
[
  {
    "headline": "AI adoption accelerates in enterprise software.",
    "insights": "Gartner reports a 35% YoY increase in AI budget allocation across B2B SaaS. Executives cite efficiency, personalization, and analytics as core drivers."
  },
  {
    "headline": "Retail media networks are driving record ad spend.",
    "insights": "Brands like Walmart and Amazon are capturing up to 30% of total digital ad budgets, reshaping the CPG marketing landscape."
  }
]

Tone:
- Assertive, strategic, and precise — no fluff, no hype.
- Speak like a McKinsey partner delivering boardroom-ready guidance.

Instructions:
- Write a lead-in statement (1–2 sentences explaining why this matters now).
- For each headline in ${finalSummary}, generate 3 clear and insightful bullet points.
- Use the headline as-is. Do not add numbering or section labels like "Headline 1".
- If a headline has insufficient supporting insights, write only 1–2 strong bullets.
- If fewer than 3 headline blocks exist, only use the ones provided.
- End with a final thoughts section (1–2 sentence strategic takeaway).

Formatting:
- Output must be plain text.
- Use hyphens (-) for bullet points.
- No tags, no markdown, no HTML.
- Maintain clean structure and spacing between sections.

Error handling:
If ${finalSummary} is empty or malformed, return:
ERROR: Missing or invalid summary data; cannot generate headlines.

Headlines:
${finalSummary}
`;

    // ✅ GPT Completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
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
