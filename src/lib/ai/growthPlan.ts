import { aiClient } from "@/lib/ai/client";
import { z } from "zod";

export const Lever = z.object({
  title: z.string().min(6),
  description: z.string().min(10),
  priority: z.number().int().min(1).max(5),
  success_metric: z.string(),
  target_value: z.string().min(1),
  due_date: z.string(), // ISO date
  owner: z.string().default("Owner"),
  tags: z.array(z.string()).optional(),
  ai_reasoning: z.string().optional()
});

export type LeverT = z.infer<typeof Lever>;

export async function generateGrowthPlan(
  scores: any,
  cohort: any
): Promise<{ levers: LeverT[]; cohort_snapshot: any }> {
  const schema = z.object({ levers: z.array(Lever).length(5) });

  const prompt = `
You are OptimaliQ Growth Planner. Using the user's latest scores and the cohort snapshot, propose exactly FIVE prioritized, 30-day growth levers.
Rules:
- Each lever must be specific, measurable, and achievable in 30 days.
- Include: title, description, priority (1 highest..5), success_metric, target_value, due_date (ISO), owner, tags[], and a short ai_reasoning.
- Avoid duplicates; align to the user's weakest dimensions first.
Return strictly as JSON: { "levers": Lever[] }.
User Scores: ${JSON.stringify(scores)}
Cohort: ${JSON.stringify(cohort)}
`.trim();

  const res = await aiClient.generate(prompt, { responseFormat: "json", temperature: 0.4, fallback: true });
  const parsed = schema.safeParse(res.content);
  if (!parsed.success) {
    throw new Error("AI response failed validation for growth plan");
  }
  return { levers: parsed.data.levers as LeverT[], cohort_snapshot: cohort };
}


