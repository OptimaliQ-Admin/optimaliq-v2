import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure API key is set in .env.local
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("🔍 Received Email Lookup Request:", email);

    if (!email) {
      return NextResponse.json({ error: "Missing email in request" }, { status: 400 });
    }

    const dbPath = path.resolve(process.cwd(), "ml/user_database.csv");

    if (!fs.existsSync(dbPath)) {
      console.error("🚨 user_database.csv NOT FOUND!");
      return NextResponse.json({ error: "User database not found" }, { status: 500 });
    }

    // ✅ Read CSV & Find User
    const fileData = fs.readFileSync(dbPath, "utf8").trim().split("\n");
    const headers = fileData[0].split(",");
    const userRow = fileData.find((row) => row.includes(email));

    if (!userRow) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // ✅ Parse User Data
    const userDataArr = userRow.split(",");
    const userData: Record<string, string> = headers.reduce((acc, key, index) => {
      acc[key.trim()] = userDataArr[index]?.trim() || "N/A";
      return acc;
    }, {} as Record<string, string>);

    console.log("✅ Found User Data:", userData);

    // ✅ Extract Scores
    const strategyScore = parseFloat(userData.strategy) || 0;
    const processScore = parseFloat(userData.process) || 0;
    const technologyScore = parseFloat(userData.technology) || 0;
    const overallScore = parseFloat(userData.score) || 0;

    console.log("📊 Extracted Scores:", { strategyScore, processScore, technologyScore, overallScore });

    console.log("🔹 Sending request to OpenAI for Tier 2 insights...");

    // ✅ AI Analysis Prompt
    const aiPrompt = `
You are a world-class business strategist specializing in **growth, efficiency, and market positioning**. 
Your role is to analyze a company's current performance, compare it to industry benchmarks, and provide a highly actionable **30-day improvement plan**. 
Your response must be formatted strictly as a **JSON object**.
---

## **📊 Company Profile & Performance Overview**
**Business Name:** ${userData.name}  
**Industry:** ${userData.industry}  
**Company Size:** ${userData.companySize} employees  
**Revenue Range:** ${userData.revenueRange}  

**Current Scores:**
- **Strategy:** ${strategyScore} / 5
- **Process:** ${processScore} / 5
- **Technology:** ${technologyScore} / 5
- **Overall Score:** ${overallScore} / 5

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

---

**Example Output (Valid JSON):**
{
  "industryAvgScore": 3.5,
  "topPerformerScore": 4.5,
  "benchmarking": {
    "strategy": "Your strategy score of ${strategyScore} is below the industry average. Consulting firms of similar size typically score around 3.5. The best firms operate at 4.5+ by leveraging industry positioning and strategic partnerships.",
    "process": "A process score of ${processScore} suggests inefficiencies. The most successful firms in your sector score around 4.0, focusing on operational automation and structured workflows.",
    "technology": "Your technology score of ${technologyScore} is above the industry norm, giving you a competitive edge. However, tech adoption alone does not drive growth—strategic alignment is needed."
  },
  "strengths": [
    { "title": "Technology Utilization", "impact": "Efficient service delivery and reduced operational costs by up to 20%." },
    { "title": "Niche Expertise", "impact": "Strong industry positioning that attracts high-value clients." }
  ],
  "weaknesses": [
    { "title": "Lack of Strategic Focus", "impact": "Inconsistent growth due to undefined long-term direction." },
    { "title": "Inefficient Processes", "impact": "Causes project delays and limits scalability." }
  ],
  "roadmap": [
    {
      "task": "Develop a 12-month strategic roadmap with clear KPIs.",
      "expectedImpact": "Companies with defined KPIs grow 23% faster.",
      "scoreImprovement": { "strategy": 0.8 }
    },
    {
      "task": "Automate lead tracking and customer outreach using CRM integrations.",
      "expectedImpact": "Could increase sales team efficiency by 15-20%, accelerating revenue cycles.",
      "scoreImprovement": { "process": 1.0 }
    },
    {
      "task": "Implement a streamlined onboarding workflow for new clients.",
      "expectedImpact": "Reduces churn by ensuring 90% of clients successfully integrate within the first 30 days.",
      "scoreImprovement": { "process": 0.7 }
    }
  ],
  "potentialScoreIncrease": 1.5,
  "scoreImprovementDetails": "By refining strategy and optimizing processes, the business score can increase by 1.5 points."
}
`;

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: "You are a world-class business strategist. Your response must be a structured JSON object." },
    { role: "user", content: "Provide a structured JSON response following this format:" },
    { role: "user", content: aiPrompt }
  ],
  max_tokens: 800,
  response_format: { type: "json_object" }
});


    const insights = JSON.parse(response.choices?.[0]?.message?.content || "{}");

    console.log("✅ Final Tier 2 Insights:", insights);

    // ✅ Score Progression Chart Data
    const chartData = [
      { month: "Now", userScore: overallScore, industryScore: insights.industryAvgScore, topPerformerScore: insights.topPerformerScore },
      { month: "3 Months", userScore: Math.min(5, overallScore + 0.5), industryScore: insights.industryAvgScore, topPerformerScore: insights.topPerformerScore },
      { month: "6 Months", userScore: Math.min(5, overallScore + 1), industryScore: insights.industryAvgScore, topPerformerScore: insights.topPerformerScore },
      { month: "12 Months", userScore: Math.min(5, overallScore + 2), industryScore: insights.industryAvgScore, topPerformerScore: insights.topPerformerScore }
    ];

    return NextResponse.json({
      strategyScore,
      processScore,
      technologyScore,
      score: overallScore,
      industryAvgScore: insights.industryAvgScore,
      topPerformerScore: insights.topPerformerScore,
      benchmarking: insights.benchmarking,
      strengths: insights.strengths,
      weaknesses: insights.weaknesses,
      roadmap: insights.roadmap,
      chartData
    });

  } catch (error) {
    console.error("🚨 API Error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
