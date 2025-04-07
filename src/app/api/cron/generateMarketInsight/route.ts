import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY!;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

  if (!FINNHUB_API_KEY || !OPENAI_API_KEY) {
    console.error("❌ Missing environment keys");
    return NextResponse.json({ error: "Missing environment keys" }, { status: 500 });
  }

  try {
    // ✅ Fetch sector performance from Finnhub
    const sectorRes = await fetch("https://finnhub.io/api/v1/stock/sector-performance", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!sectorRes.ok) {
      const errorText = await sectorRes.text();
      throw new Error(`Sector API failed: ${errorText}`);
    }

    const sectorData = await sectorRes.json();

    // ✅ Fetch top news from Finnhub
    const newsRes = await fetch("https://finnhub.io/api/v1/news?category=general", {
      headers: { "X-Finnhub-Token": FINNHUB_API_KEY },
    });

    if (!newsRes.ok) {
      const errorText = await newsRes.text();
      throw new Error(`News API failed: ${errorText}`);
    }

    const newsData = await newsRes.json();
    const topHeadlines = newsData
      .slice(0, 3)
      .map((n: any) => `- "${n.headline}"`)
      .join("\n");

    // ✅ GPT Prompt
    const prompt = `
Act as a McKinsey-caliber strategist. Analyze the following U.S. market data and news to create a strategic summary and actionable recommendation for growth-stage companies.

Sector Performance:
${sectorData.map((s: any) => `- ${s.sector}: ${s.change}%`).join("\n")}

Top Headlines:
${topHeadlines}

Format:
📊 Summary Insight:
🎯 Strategic Recommendation:
    `.trim();

    console.log("🧠 Sending prompt to GPT:", prompt);

    // ✅ Send to OpenAI
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    // ✅ Read the raw text response
    const rawText = await openaiRes.text();
    console.log("📜 OpenAI Raw Response Text:", rawText);

    let aiData;
    try {
      aiData = JSON.parse(rawText);
    } catch (parseError) {
      console.error("🚨 JSON Parse Error from OpenAI:", parseError);
      return NextResponse.json(
        {
          error: "OpenAI did not return valid JSON.",
          detail: rawText.slice(0, 500), // show the first part of HTML/error
        },
        { status: 500 }
      );
    }

    const aiText = aiData?.choices?.[0]?.message?.content ?? "No insight returned.";

    // ✅ Store in Supabase
    const { error: dbError } = await supabase.from("realtime_market_trends").insert([
      {
        title: "📊 Market Trend Prediction",
        insight: aiText,
        source: "finnhub + GPT",
      },
    ]);

    if (dbError) {
      console.error("❌ Supabase insert error:", dbError);
      return NextResponse.json({ error: "Failed to save insight to Supabase" }, { status: 500 });
    }

    return NextResponse.json({ success: true, insight: aiText });
  } catch (err: any) {
    console.error("❌ Unhandled Error:", err.message || err);
    return NextResponse.json(
      {
        error: "Server error",
        detail: err.message || "Unknown server error",
      },
      { status: 500 }
    );
  }
}
