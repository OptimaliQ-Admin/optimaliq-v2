import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

Based on the following top news headlines, generate a high-level business trend summary with directional recommendations.

📰 Top News Headlines:
${headlines}

📦 Instructions:
- Extract key business trends.
- Do not just summarize — offer strategic insight.
- Help companies understand how to adapt, pivot, or grow.
- These are **not guarantees** — they are guidance to think smarter.

✍️ Output Format:
🔥 Business Trend Summary:
🎯 Actionable Recommendations (3–5):
`.trim();

    // 3. Call OpenAI
    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
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
  } catch (err: any) {
    console.error("🔥 Cron Error:", err.message);
    return NextResponse.json({ error: "Server error", detail: err.message }, { status: 500 });
  }
}
