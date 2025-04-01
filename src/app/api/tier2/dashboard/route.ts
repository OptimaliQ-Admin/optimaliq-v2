import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  return NextResponse.json({ status: "API route is live ✅" });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Missing email" }, { status: 400 });

    // Fetch user data from Supabase
    const { data: user, error: userError } = await supabase
      .from("tier2_users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const userId = user.user_id;

    // Fetch the latest assessment for the user
    const { data: assessment, error: assessmentError } = await supabase
      .from("onboarding_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (assessmentError || !assessment)
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    // Determine if the assessment is older than 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const assessmentDate = new Date(assessment.created_at);
    const promptRetake = assessmentDate < thirtyDaysAgo;

    // Check for existing insights if assessment is still recent
    const { data: existingInsights } = await supabase
      .from("tier2_dashboard_insights")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingInsights && !promptRetake) {
      return NextResponse.json({ ...existingInsights, promptRetake });
    }

    // Prepare the AI prompt using details from user and assessment
    const aiPrompt = `
You are a world-class business strategist specializing in **growth, efficiency, and market positioning**. 
Your role is to analyze a company's current performance, compare it to industry benchmarks, and provide a highly actionable **30-day improvement plan**. 
Your response must be formatted strictly as a **JSON object**.
---

## **📊 Company Profile & Performance Overview**
**Business Name:** ${user.name}  
**Industry:** ${user.industry}  
**Company Size:** ${user.companySize || "N/A"} employees  
**Revenue Range:** ${user.revenueRange || "N/A"}  

**Current Scores:**
- **Strategy:** ${assessment.strategy} / 5
- **Process:** ${assessment.process} / 5
- **Technology:** ${assessment.technology} / 5
- **Overall Score:** ${assessment.score} / 5

---

## **📈 Benchmarking & Industry Comparisons**
Compare the company’s performance to **industry norms** and **top performers**. Be specific. Use relevant insights for **their company size and revenue range**.

- **Industry Avg Score:** What is the **average** performance level for this industry?
- **Top Performer Score:** What score do the best companies achieve, and why?
- **Key Gaps:** Identify where this company lags and **what top companies do differently**.

---

## **🔍 Strengths & Weaknesses Analysis**
Analyze the **root causes** behind the company's scores. Provide **real business implications**—not generic feedback.

### **✅ Strengths (Competitive Advantages)**
List **specific** strengths and their business impact.
- **[Strength Title]**: _How does this provide a business advantage?_
- **[Strength Title]**: _What measurable impact does this create?_

### **🚨 Weaknesses (Barriers to Growth)**
Identify major weaknesses and how they impact revenue, efficiency, or scalability. Provide context and urgency.
- **[Weakness Title]**: _What is the direct cost or risk of not fixing this?_
- **[Weakness Title]**: _How does this impact customer experience, retention, or market positioning?_

---

## **🚀 Next 30-Day Growth Plan**
Give a **step-by-step, high-impact action plan** with measurable outcomes.
- **Week 1 (Quick Wins):** What immediate changes can drive impact?
- **Week 2-3 (Process Optimization):** What structural improvements should be made?
- **Week 4 (Scaling & Revenue Growth):** What long-term optimizations will drive sustained performance?

Each action should:
✅ Be **specific and doable within 30 days**  
✅ Have a **measurable business impact**  
✅ Improve **Strategy, Process, or Overall Score**  

---

## **📈 Future Score Projection**
Forecast how implementing these recommendations will impact the company’s overall score.
    `;

    // Send prompt to OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond in valid JSON only." },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 900,
    });

    let rawContent = aiResponse.choices[0].message.content || "{}";

// 🧼 Strip Markdown-style code block wrappers if present
if (rawContent.startsWith("```")) {
  rawContent = rawContent.replace(/```(?:json)?/g, "").trim();
}

let insightsFromAI;
try {
  insightsFromAI = JSON.parse(rawContent);
} catch (parseError) {
  console.error("❌ JSON Parse Error:", parseError);
  console.log("🪵 Raw AI Response:", rawContent);
  return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
}
    // Use the assessment's overall score as the baseline for chart data
    const overallScore = parseFloat(assessment.score) || 0;
    const chartData = [
      {
        month: "Now",
        userScore: overallScore,
        industryScore: insightsFromAI.industryAvgScore,
        topPerformerScore: insightsFromAI.topPerformerScore,
      },
      {
        month: "3 Months",
        userScore: Math.min(5, overallScore + 0.5),
        industryScore: insightsFromAI.industryAvgScore,
        topPerformerScore: insightsFromAI.topPerformerScore,
      },
      {
        month: "6 Months",
        userScore: Math.min(5, overallScore + 1),
        industryScore: insightsFromAI.industryAvgScore,
        topPerformerScore: insightsFromAI.topPerformerScore,
      },
      {
        month: "12 Months",
        userScore: Math.min(5, overallScore + 2),
        industryScore: insightsFromAI.industryAvgScore,
        topPerformerScore: insightsFromAI.topPerformerScore,
      },
    ];

    // Construct final payload combining assessment scores and AI insights
    const finalPayload = {
      user_id: userId,
      strategyScore: parseFloat(assessment.strategy) || 0,
      processScore: parseFloat(assessment.process) || 0,
      technologyScore: parseFloat(assessment.technology) || 0,
      score: overallScore,
      industryAvgScore: insightsFromAI.industryAvgScore,
      topPerformerScore: insightsFromAI.topPerformerScore,
      benchmarking: insightsFromAI.benchmarking,
      strengths: insightsFromAI.strengths,
      weaknesses: insightsFromAI.weaknesses,
      roadmap: insightsFromAI.roadmap,
      chartData,
      updated_at: new Date().toISOString(),
    };

    // Upsert the new insights to Supabase
    await supabase
      .from("tier2_dashboard_insights")
      .upsert(finalPayload, { onConflict: "user_id" });

    return NextResponse.json({ ...finalPayload, promptRetake });
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
