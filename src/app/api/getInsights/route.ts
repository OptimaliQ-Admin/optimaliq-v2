import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import AWS from "aws-sdk";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const sagemaker = new AWS.SageMakerRuntime({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function POST(req: Request) {
  try {
    const { u_id } = await req.json(); // ✅ Ensure lowercase column name
    console.log("🔍 Fetching stored answers for User ID:", u_id);

    if (!u_id) {
      return NextResponse.json({ error: "Missing User ID in request" }, { status: 400 });
    }

    // ✅ Retrieve latest business assessment
    const { data: assessment, error: assessmentError } = await supabase
      .from("assessment")
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
      .from("users")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (userError || !user) {
      console.error("❌ Supabase User Fetch Error:", userError);
      return NextResponse.json({ error: "Failed to retrieve user info" }, { status: 500 });
    }
    console.log("✅ Retrieved User Info:", user);

    // ✅ Build input vector for SageMaker
const industryOneHot = [
  "E-commerce", "Finance", "SaaS", "Education", "Technology", "Healthcare", "Retail",
  "Manufacturing", "Consulting", "Entertainment", "Real Estate", "Transportation",
  "Hospitality", "Energy", "Telecommunications", "Pharmaceuticals", "Automotive",
  "Construction", "Legal", "Nonprofit", "Other"
].map((industry) => (user.industry === industry ? 1 : 0));

const sageInput = [
  assessment.strategyScore || 0,
  assessment.processScore || 0,
  assessment.technologyScore || 0,
  ...industryOneHot,
];

const csvPayload = sageInput.join(",");


    // ✅ Structure data for OpenAI prompt
    const aiPrompt = `
      You are a world-class business strategist, trusted by top executives and high-growth companies to uncover hidden opportunities,
      and helping companies scale efficiently. Your expertise lies in diagnosing a company's current state and delivering precise, 
      high-impact recommendations that create a clear, actionable roadmap for growth. 
      Your task is to analyze the following business inputs and generate **customized insights** 
      that reflect the user's unique situation.
      
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
      - Provide **custom insights** directly addressing the user's input.
      - If an obstacle (e.g., "Funding") is listed, showcase how top-performing companies have overcome them. Provide real-world, battle-tested solutions (e.g., alternative funding sources, leadership restructuring, or automation strategies).
      - If strategy is strong, guide the user toward maximum scalability. Offer specific growth levers, such as expanding market share, operational automation, pricing optimization, or vertical/horizontal expansion.
      - If processes are optimized, focus on future-proofing & risk mitigation. Identify areas where bottlenecks could emerge at scale and suggest proactive measures to maintain efficiency.
      - If technology is cutting-edge, provide advanced insights on maximizing ROI through integration, automation, AI-driven efficiencies, and leveraging first-party data.
      - Deliver powerful, compelling insights. Avoid generic advice—every recommendation should be highly relevant, tailored, and capable of driving immediate action.
      - Deliver strategic insights that go beyond surface-level advice. Use the user's inputs to provide deeply customized, high-value recommendations.

      **Example Output Format (strict JSON, no extra text):**
      {
  "strategyScore": 4,
  "strategyInsight": "Your innovative solution is differentiated, but the market entry strategy lacks precision. Focus on refining your ideal customer profile (ICP) and developing a multi-channel acquisition strategy that includes strategic partnerships, outbound targeting, and conversion-optimized landing pages.",
  
  "processScore": 3,
  "processInsight": "Your current operations are stable, but not yet built for scalability. Implement automation in customer onboarding, introduce KPI-driven decision-making, and establish a delegation framework to eliminate bottlenecks as you scale.",
  
  "technologyScore": 5,
  "technologyInsight": "Your tech stack is cutting-edge, but underutilized. Implement a data unification strategy across CRM, analytics, and automation tools to drive more predictive decision-making and customer segmentation."
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

    // ✅ Call SageMaker Endpoint
let sageMakerScore = 0;
try {
  const sageResponse = await sagemaker
    .invokeEndpoint({
      EndpointName: process.env.SAGEMAKER_ENDPOINT_NAME,
      Body: csvPayload,
      ContentType: "text/csv",
    })
    .promise();

  sageMakerScore = parseFloat(sageResponse.Body.toString("utf-8"));
  console.log("🎯 SageMaker Predicted Score:", sageMakerScore);
} catch (error) {
  console.error("❌ SageMaker Error:", error);
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
      console.log("📜 Raw OpenAI Response:", response.choices[0].message.content);
      return NextResponse.json({ error: "Failed to parse AI response." }, { status: 500 });
    }

    console.log("🔢 AI-Generated Scores:", parsedResponse);

    // ✅ Ensure AI response has all required fields before inserting into insights
    if (!parsedResponse.strategyScore || !parsedResponse.strategyInsight || !parsedResponse.processScore) {
      console.error("❌ AI response is missing required fields:", parsedResponse);
      return NextResponse.json({ error: "AI response is incomplete" }, { status: 500 });
    }

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
      strategyscore: parsedResponse.strategyScore,
      strategyinsight: parsedResponse.strategyInsight,
      processscore: parsedResponse.processScore,
      processinsight: parsedResponse.processInsight,
      technologyscore: parsedResponse.technologyScore,
      technologyinsight: parsedResponse.technologyInsight,
      generatedat: new Date().toISOString(),
      overallscore: sageMakerScore,
    };

    const { data: insertedInsights, error: storeError } = await supabase
      .from("insights")
      .insert([insightsData])
      .select("*"); // ✅ Fetch inserted rows

    if (storeError) {
      console.error("❌ Supabase Insert Error:", storeError);
      return NextResponse.json({ error: "Failed to store AI insights" }, { status: 500 });
    }

    console.log("✅ AI Insights Successfully Stored:", insertedInsights);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("🚨 AI API Error:", error);
    return NextResponse.json({ error: "Failed to generate AI-driven insights" }, { status: 500 });
  }
}
