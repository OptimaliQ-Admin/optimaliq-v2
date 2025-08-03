import OpenAI from "openai";
import { z } from "zod";

// Only create OpenAI instance if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// ✅ Zod schema to validate response
const DashboardScoresSchema = z.object({
  strategy_score: z.number().min(1).max(5),
  process_score: z.number().min(1).max(5),
  technology_score: z.number().min(1).max(5),
  score: z.number().min(1).max(5),
  industryAvgScore: z.number().min(1).max(5),
  topPerformerScore: z.number().min(1).max(5),
  benchmarking: z.object({
    strategy: z.string(),
    process: z.string(),
    technology: z.string(),
  }),
  strengths: z.array(
    z.object({
      title: z.string(),
      impact: z.string(),
    })
  ),
  weaknesses: z.array(
    z.object({
      title: z.string(),
      impact: z.string(),
    })
  ),
  roadmap: z.array(
    z.object({
      task: z.string(),
      expectedImpact: z.string(),
    })
  ),
});

export type DashboardScores = z.infer<typeof DashboardScoresSchema>;

export async function generateDashboardScores(user: any, assessment: any): Promise<DashboardScores | null> {
  // Prepare user context with business overview
  const userContext = {
    industry: user.industry,
    company_size: user.company_size,
    revenue_range: user.revenue_range,
    business_overview: assessment.business_overview || user.business_overview,
  };

  const systemPrompt = `
You are a world-class business strategist evaluating high-growth companies. Your job is to assess strategy, process, and technology maturity, identify strategic gaps, benchmark against peers, and generate a 30-day growth roadmap.

You must anchor all responses in two things:
1. The company’s **industry**: ${user.industry}
2. The company’s **self-described business**: ${assessment.business_overview}

Your responses MUST reflect the unique nature of the business, its model, and its context — not just generic industry practices.

All benchmarking insights, strengths/weaknesses, and roadmap tasks should reflect the norms, challenges, and best practices relevant to the company’s industry (e.g., ${user.industry}). Use the provided company size and revenue range to contextualize your output.

Responses must be deterministic — the same input should produce the same output. This ensures consistency in scoring and insights across sessions.

Respond only in valid JSON using the following structure. Do not include commentary, markdown, explanations, or extra fields.

Required fields:

strategy_score (float between 1.0–5.0 — round to 1–2 decimal places)
process_score (float between 1.0–5.0 — round to 1–2 decimal places)
technology_score (float between 1.0–5.0 — round to 1–2 decimal places)
score (overall average of the three scores — between 1.0–5.0, round to 2 decimals)
industryAvgScore (float between 1.0–5.0)
topPerformerScore (float between 1.0–5.0)

benchmarking: object with:
- strategy: brief string summary
- process: brief string summary
- technology: brief string summary

strengths: array of 3–4 objects:
- each with a title (string) and impact (string)

weaknesses: array of 3–4 objects:
- each with a title (string) and impact (string)

roadmap: array of 4 task objects:
- each with a task (string) and expectedImpact (string)
- Each task must clearly relate to the business model and industry.
- each task should be clear, action-oriented, specific (not generic or vague) and talored to the to the specific company context from ${assessment.business_overview} and ${user.industry}.

Formatting rules:
- All numeric scores must be floats rounded to 1–2 decimal places
- Do not return values outside the 1.0–5.0 range
- Return a single JSON object only (no markdown, code blocks, or wrappers)
`;

  try {
    // Check if OpenAI is available
    if (!openai) {
      throw new Error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
    }

    // Log the data being sent to AI
    console.log("🧠 Business overview in assessment:", !!assessment.business_overview);
    console.log("🧠 Business overview in user:", !!user.business_overview);
    console.log("🧠 Business overview in userContext:", !!userContext.business_overview);

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            ...userContext,
            ...assessment,
          }),
        },
      ],
      temperature: 0,
      max_tokens: 1100,
    });

    let content = aiResponse.choices[0].message.content || "{}";

    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?/g, "").trim();
    }

    // 🧪 Log raw content
    console.log("🧠 Raw AI response:", content);

    const parsed = DashboardScoresSchema.safeParse(JSON.parse(content));

    if (!parsed.success) {
      console.error("❌ Invalid AI response:", parsed.error.format());
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error("❌ OpenAI call failed:", error);
    return null;
  }
}
