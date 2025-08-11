import OpenAI from "openai";
import { z } from "zod";

const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export const ScoringSchema = z.object({
  strategy_score: z.number().min(1).max(5),
  process_score: z.number().min(1).max(5),
  technology_score: z.number().min(1).max(5),
  score: z.number().min(1).max(5),
  confidence: z.number().min(0).max(1).optional(),
  explanations: z.object({
    strategy: z.string().min(8),
    process: z.string().min(8),
    technology: z.string().min(8),
  }).optional()
});

export type ScoringResult = z.infer<typeof ScoringSchema>;

export async function generateScoresWithLLM(input: {
  industry: string;
  features: Record<string, any>;
  answers: Record<string, any>;
}): Promise<ScoringResult | null> {
  if (!client) return null;

  const sys = `You are a McKinsey-tier assessment scorer. Output ONLY strict JSON that matches the provided schema. Scores are 1-5 with 0.1 precision. Penalize ad hoc processes and gut-driven decisions.`;
  const usr = `Industry: ${input.industry}\nFeatures: ${JSON.stringify(input.features)}\nAnswers: ${JSON.stringify(input.answers)}\nReturn JSON with keys: strategy_score, process_score, technology_score, score, confidence (0-1), explanations{strategy,process,technology}.`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: usr }
    ]
  });
  const text = res.choices?.[0]?.message?.content?.trim() || "";
  try {
    const parsed = JSON.parse(text);
    return ScoringSchema.parse(parsed);
  } catch {
    return null;
  }
}


