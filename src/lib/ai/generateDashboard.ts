// /lib/ai/generateDashboard.ts

import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const DashboardScoresSchema = z.object({
  strategy_score: z.number(),
  process_score: z.number(),
  technology_score: z.number(),
  score: z.number(),
  industryAvgScore: z.number(),
  topPerformerScore: z.number(),
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

export async function generateDashboardScores(
  user: any,
  assessment: any
): Promise<DashboardScores | null> {
  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "You are a world-class business strategist hired to evaluate high-growth companies. Respond in valid JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify({
            industry: user.industry,
            company_size: user.company_size,
            revenue_range: user.revenue_range,
            growth_metrics: assessment.growth_metrics,
            gtm_strategy: assessment.gtm_strategy,
            friction_points: assessment.friction_points,
            differentiator: assessment.differentiator,
            brand_perception: assessment.brand_perception,
            business_priorities: assessment.business_priorities,
            tech_stack: assessment.tech_stack,
            process_discipline: assessment.process_discipline,
            acquisition_channels: assessment.acquisition_channels,
            tech_maturity: assessment.tech_maturity,
            retention_strategy: assessment.retention_strategy,
            decision_bottlenecks: assessment.decision_bottlenecks,
            team_alignment: assessment.team_alignment,
            future_success: assessment.future_success,
            benchmark_preferences: assessment.benchmark_preferences,
            funding_status: assessment.funding_status,
            growth_pace: assessment.growth_pace,
            unresolved_issue: assessment.unresolved_issue,
            final_confirmation: assessment.final_confirmation,
          }),
        },
      ],
      max_tokens: 900,
    });

    let content = aiResponse.choices?.[0]?.message?.content || "{}";
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?/g, "").trim();
    }

    const parsed = JSON.parse(content);
    const result = DashboardScoresSchema.safeParse(parsed);

    if (!result.success) {
      console.error("❌ Schema validation failed:", result.error.flatten());
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("❌ Failed to generate dashboard scores:", error);
    return null;
  }
}
