import OpenAI from "openai";
import { z } from "zod";

const CustomInsightsSchema = z.object({
  overall_score: z.number().min(0).max(5),
  confidence: z.number().min(0).max(1).default(0.6),
  summary: z.string().min(10).max(800),
  key_strengths: z.array(z.string()).min(1).max(6),
  areas_for_improvement: z.array(z.string()).min(1).max(6)
});

export type CustomInsights = z.infer<typeof CustomInsightsSchema>;

export async function scoreCustomAssessment(input: {
  topic: string;
  questions: Array<{ key: string; label?: string; text?: string; type?: string }>;
  answers: Record<string, unknown>;
}): Promise<CustomInsights | null> {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const system = `You are a management consultant. Score from 0-5 (5=world-class), then summarize.
- Topic: ${input.topic}
- Use CEO/McKinsey tone. Keep bullets concise.`;
    const user = {
      topic: input.topic,
      questions: input.questions,
      answers: input.answers
    };
    const resp = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: JSON.stringify(user) }
      ],
      response_format: { type: "json_object" }
    });
    const content = resp.choices?.[0]?.message?.content || "{}";
    const parsed = CustomInsightsSchema.safeParse(JSON.parse(content));
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}


