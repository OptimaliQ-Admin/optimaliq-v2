import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase"; // ✅ Ensure Supabase client is imported

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json(); // ✅ Ensure lowercase column name
    console.log("🔍 Fetching stored answers for User ID:", u_id);

    if (!u_id) {
      return NextResponse.json({ error: "Missing User ID in request" }, { status: 400 });
    }

    // ✅ Retrieve stored business responses from Supabase
    const { data: assessment, error: assessmentError } = await supabase
    .from("assessment")
    .select("*")
    .eq("u_id", u_id)
    .order("submittedat", { ascending: false }) // ✅ Get the latest submission
    .limit(1) // ✅ Ensure we only get one row
    .single(); // ✅ Safely retrieve a single row
  

    if (assessmentError || !assessment) {
      console.error("❌ Supabase Fetch Error:", assessmentError);
      return NextResponse.json({ error: "Failed to retrieve business responses" }, { status: 500 });
    }

    console.log("✅ Retrieved Business Responses:", assessment);

    // ✅ Retrieve user details from Supabase
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("u_id", u_id)
      .maybeSingle();

    if (userError || !user) {
      console.error("❌ Supabase User Fetch Error:", userError);
      return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }

    console.log("✅ Retrieved User Info:", user);

    // ✅ Structure data for OpenAI prompt
    const aiPrompt = `
      You are a world-class business strategist. Analyze the user's business assessment and provide high-impact insights.
      
      **Business Inputs:**
      - **Biggest obstacles:** ${assessment.obstacles}
      - **Strategy differentiation:** ${assessment.strategy}
      - **Process optimization:** ${assessment.process}
      - **Customer understanding:** ${assessment.customers}
      - **Technology level:** ${assessment.technology}
      
      **Company Details:**
      - **Industry:** ${user.industry}
      - **Company Size:** ${user.companysize}
      - **Revenue Range:** ${user.revenuerange}
      
      **Your Task:**
      - Provide **custom insights** based on the user's inputs.
      - Offer specific recommendations (not generic advice).
      - Ensure insights align with business size & industry.
      
      **Example JSON Output:**
      {
        "strategyscore": 4,
        "strategyinsight": "Your differentiation is strong, but market positioning needs refinement. Focus on targeted partnerships and market penetration strategies.",
        "processscore": 3,
        "processinsight": "Your processes are stable but lack scalability. Automate workflows to handle growth.",
        "technologyscore": 5,
        "technologyinsight": "You have a cutting-edge stack but need better integration. Implement predictive analytics for enhanced decision-making."
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
      model: "gpt-4o",
      messages: [{ role: "system", content: aiPrompt }],
      max_tokens: 300,
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
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    console.log("🔢 AI-Generated Scores:", parsedResponse);

    // ✅ Insert AI response into ai_log
    const { error: logResponseError } = await supabase
      .from("ai_log")
      .update({
        apiresponse: JSON.stringify(parsedResponse),
        tokensused: response.usage?.total_tokens || 0,
      })
      .eq("log_id", logData?.log_id);

    if (logResponseError) {
      console.error("⚠️ Warning: Failed to log API response:", logResponseError);
    } else {
      console.log("✅ AI response logged in ai_log");
    }

    // ✅ Insert insights into Supabase
    const { error: storeError } = await supabase
      .from("insights")
      .insert([
        {
          u_id, // ✅ Ensure lowercase
          strategyscore: parsedResponse.strategyscore,
          strategyinsight: parsedResponse.strategyinsight,
          processscore: parsedResponse.processscore,
          processinsight: parsedResponse.processinsight,
          technologyscore: parsedResponse.technologyscore,
          technologyinsight: parsedResponse.technologyinsight,
          generatedat: new Date().toISOString(), // ✅ Add timestamp
        },
      ]);

    if (storeError) {
      console.error("❌ Supabase Insert Error:", storeError);
      return NextResponse.json({ error: "Failed to store AI insights" }, { status: 500 });
    }

    console.log("✅ AI Insights Stored in Supabase");

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("🚨 AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI-driven insights" }, { status: 500 });
  }
}
