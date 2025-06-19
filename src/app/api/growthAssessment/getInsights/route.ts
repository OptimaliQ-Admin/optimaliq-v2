import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json(); // ✅ Ensure lowercase column name
    console.log("🔍 Fetching stored answers for User ID:", u_id);

    if (!u_id) {
      return NextResponse.json({ error: "Missing User ID in request" }, { status: 400 });
    }

    // ✅ Retrieve latest business assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("growth_assessment")
      .select("*")
      .eq("u_id", u_id)
      .order("submittedat", { ascending: false }) // ✅ Get the latest submission
      .limit(1)
      .single();

    if (assessmentError || !assessment) {
      console.error("❌ Supabase Fetch Error (Assessment):", assessmentError);
      return NextResponse.json({ error: "Failed to retrieve business responses" }, { status: 500 });
    }
    console.log("✅ Retrieved Business Responses:", assessment);

    // ✅ Retrieve user details
    const { data: user, error: userError } = await supabase
      .from("growth_users")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (userError || !user) {
      console.error("❌ Supabase User Fetch Error:", userError);
      return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }
    console.log("✅ Retrieved User Info:", user);

    // ✅ Structure data for OpenAI prompt
    const aiPrompt = `
You are a world-class business strategist assisting high-growth companies in translating qualitative business signals into customized, actionable strategic insights. Your expertise spans diagnosing obstacles, evaluating scalability, and maximizing ROI across strategy, process, and technology.

Analyze the provided business and company inputs to generate tailored insights in a strict JSON format.

Business Inputs:
- Biggest obstacles: ${assessment.obstacles}
- Strategy differentiation: ${assessment.strategy}
- Process optimization: ${assessment.process}
- Customer understanding: ${assessment.customers}
- Technology level: ${assessment.technology}

Company Details:
- Industry: ${user.industry}
- Company Size: ${user.companysize}
- Revenue Range: ${user.revenuerange}

Your Task:
- Provide insights specifically relevant to the user's supplied inputs.
- If obstacles are provided (one or more), explain how leading firms have overcome such challenges, referencing real industry examples where possible.
- For strong strategies (single or multiple), recommend tailored scaling tactics, such as partnerships, pricing diversification, or expansion—drawing upon sector best practices.
- If process optimizations are described (single or multiple), suggest ways to future-proof and enhance scalability.
- For advanced technology input, propose ROI-boosting recommendations like integrations, AI, or innovative data use.
- Avoid generic advice; all recommendations must be specific to the context reported.
- If a relevant real-world example cannot be found for the given industry/obstacle, state this clearly in the insight.
- Use practical examples throughout where appropriate.
- Make sure all output is precise, strategic, and actionable.
- If applicable, include examples of how top companies in the ${user.industry} sector are solving similar challenges.

## Output Format

Return your results in this strict JSON schema and order:

{
  "strategy_score": integer (1 to 5), // 1 = very weak strategy, 5 = very strong. Use 1 if input is non-integer, missing, or ambiguous.
  "strategyInsight": string, // Specific actionable insight or explanation. If input is missing, ambiguous, or invalid, respond with guidance using "N/A" to indicate cased details.
  "process_score": integer (1 to 5), // 1 = very weak process, 5 = very strong. Use 1 for non-integer, missing, or ambiguous input.
  "processInsight": string, // Tailored process insight; use "N/A" when information is incomplete or invalid.
  "technology_score": integer (1 to 5), // 1 = very weak technology, 5 = very strong. Use 1 for non-integer, missing, or ambiguous input.
  "technologyInsight": string, // Specific strategic recommendation for the company's tech context. Use "N/A" in cases of missing or unclear data.
  "fallback_overall_score": float (range: 1.0 – 5.0, rounded to 1 decimal place) // Average of available scored fields if possible. If too many fields are missing or invalid, give your best justified estimate and explain your reasoning in the corresponding insights.
}

- Always output every field in the order above, even if information is incomplete.
- Do not return extra metadata or fields not included in the schema.
- If any required business input is missing, unparseable, or only partially present (including lists or multiple values), reflect this specifically in the respective insight using "N/A" for undefined values, while providing as much relevant guidance as possible.
- For input slots supporting multiple items (e.g., obstacles, strategies), synthesize insights across all provided values, clarifying if information is partial or spans several distinct issues/strengths.
- If no actionable real-world example is available for the industry or situation, clearly state this in the insight.
- Never reorder or omit fields in the JSON output, regardless of input completeness.

Example Output:
{
  "strategy_score": 4,
  "strategyInsight": "The company's clear market positioning has enabled rapid partnership expansion; a good next step is international channel partnerships, as seen with Company X (industry peer).",
  "process_score": 2,
  "processInsight": "Process optimization is lacking details (N/A). Consider mapping workflows, as leading firms in this space have done to prepare for scale.",
  "technology_score": 3,
  "technologyInsight": "Current technology is at industry average (N/A for specifics). Integrating a CRM system could boost ROI, based on tech adoption by top sector performers.",
  "fallback_overall_score": 3.0
}
    `;

    console.log("🔹 Sending request to OpenAI...");

    // ✅ Log API request in ai_log before calling OpenAI
    const { data: logData, error: logError } = await supabase
      .from("ai_log")
      .insert([
        {
          u_id,
          apirequest: aiPrompt,
          createdat: new Date().toISOString(),
        },
      ])
      .select("log_id")
      .single();

    if (logError) {
      console.error("⚠️ Warning: Failed to log API request:", logError);
    } else {
      console.log("✅ API request logged in ai_log with ID:", logData?.log_id);
    }

    // ✅ Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "system", content: aiPrompt }],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    });

    console.log("✅ OpenAI Response Received");

    if (!response.choices?.[0]?.message?.content) {
      console.error("🚨 OpenAI returned an empty or invalid response.");
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error("🚨 JSON Parsing Error:", error);
      console.log("📜 Raw OpenAI Response:", response.choices[0].message.content);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    console.log("🔢 AI-Generated Scores:", parsedResponse);

    // Calculate weighted overall score
    const strategy_score = parsedResponse.strategy_score || 0;
    const process_score = parsedResponse.process_score || 0;
    const technology_score = parsedResponse.technology_score || 0;
    
    // Calculate weighted score (40% strategy, 30% process, 30% technology)
    const overall_score = Math.min(
      5,
      Math.max(
        0,
        strategy_score * 0.4 + process_score * 0.3 + technology_score * 0.3
      )
    );

    // ✅ Insert AI response into ai_log
    if (logData?.log_id) {
      const { error: logResponseError } = await supabase
        .from("ai_log")
        .update({
          apiresponse: JSON.stringify(parsedResponse),
          tokensused: response.usage?.total_tokens || 0,
        })
        .eq("log_id", logData.log_id);

      if (logResponseError) {
        console.error("⚠️ Warning: Failed to log API response:", logResponseError);
      } else {
        console.log("✅ AI response logged in ai_log");
      }
    }

    // ✅ Insert AI insights into Supabase
    const insightsData = {
      u_id,
      strategy_score: Number(parsedResponse.strategy_score) || 0,
      strategy_insight: parsedResponse.strategyInsight || "",
      process_score: Number(parsedResponse.process_score) || 0,
      process_insight: parsedResponse.processInsight || "",
      technology_score: Number(parsedResponse.technology_score) || 0,
      technology_insight: parsedResponse.technologyInsight || "",
      overall_score: Number(overall_score) || 0,
      fallback_score_gpt: Number(parsedResponse.fallback_overall_score) || 0,
      generatedat: new Date().toISOString()
    };
    

    console.log("🔍 Insights data to insert:", JSON.stringify(insightsData, null, 2));

    console.log("🔍 About to insert into growth_insights table...");
    const { data: insertedInsights, error: storeError } = await supabase
      .from("growth_insights")
      .upsert([insightsData], { onConflict: "u_id" }) // 👈 ensures one active insight per user
      .select("*");

    if (storeError) {
      console.error("❌ Supabase Insert Error:", storeError);
      console.error("❌ Data that failed to insert:", JSON.stringify(insightsData, null, 2));
      return NextResponse.json({ error: "Failed to store AI insights" }, { status: 500 });
    }

    console.log("✅ AI Insights Successfully Stored:", insertedInsights);

    return NextResponse.json(parsedResponse);

  } catch (error: any) {
    console.error("🚨 AI API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 