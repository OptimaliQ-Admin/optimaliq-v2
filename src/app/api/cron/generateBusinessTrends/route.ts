import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/errorHandler";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("🟡 [START] Weekly Business Trend Generator");

  try {
    // 1. Fetch top general business news headlines
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`);
    const newsJson = await newsRes.json();

    const headlines = newsJson.slice(0, 5).map((n: any) => `- "${n.headline}"`).join("\n");

    // 2. Create GPT prompt
    const prompt = `
You are a strategic business advisor helping high-growth companies identify market shifts, competitive pressures, and innovation opportunities.

Based on the following top news headlines and the user's business context, generate a concise but insightful business trend summary and 3–5 directional recommendations.

📰 Top News Headlines:
${headlines}

🗂️ Instructions:
- Extract strategic business trends using signals from the headlines.
- Offer actionable insights, not just summaries.
- Assume a cross-industry audience (unless clear sector context exists).
- Focus on innovation, adaptability, and growth (not just risk).
- Use headlines as anchor points where helpful (but don't quote all of them).
- Keep the tone balanced and strategic, not overly optimistic or alarmist.

## Output Format
✍️ Output Format:
🔥 Business Trend Summary:
A concise 2–3 sentence summary highlighting the major directional theme.

🎯 Actionable Recommendations:
- Bullet 1 (actionable and relevant)
- Bullet 2
- Bullet 3
- Bullet 4 (optional, up to 5 total)
- Bullet 5 (optional)

Guidance:
- Provide at least 3 and no more than 5 recommendations.
- If the news headlines offer ambiguous or insufficient information for clear recommendations, briefly note this in the trend summary and offer general strategic advice based on available signals.
`.trim();

    // 3. Call OpenAI
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
    const insight = gptJson?.choices?.[0]?.message?.content ?? "No business trends generated.";

    // 4. Store in Supabase
    const { error: insertError } = await supabase.from("realtime_business_trends").insert([
      {
        title: "🔥 Weekly Business Trend Insight",
        insight,
        source: "finnhub + GPT",
        createdat: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("❌ Failed to insert business trends:", insertError);
      return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
    }

    console.log("✅ Business trends insight saved.");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("🔥 Cron Error:", getErrorMessage(err));
    return NextResponse.json({ error: "Server error", detail: getErrorMessage(err) }, { status: 500 });
  }
}
