import OpenAI from "openai";
import { z } from "zod";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const SWRoadmapSchema = z.object({
  strengths: z.array(z.object({
    title: z.string().min(3),
    impact: z.string().min(8),
    sourceQuestions: z.array(z.string()).default([])
  })).min(3).max(4),
  weaknesses: z.array(z.object({
    title: z.string().min(3),
    impact: z.string().min(8),
    sourceQuestions: z.array(z.string()).default([])
  })).min(3).max(4),
  roadmap: z.array(z.object({
    task: z.string().min(8),
    expectedImpact: z.string().min(10),
    owner: z.string().min(2),
    references: z.array(z.string()).default([])
  })).length(4)
});

export type SWRoadmap = z.infer<typeof SWRoadmapSchema>;

export async function generateSWAndRoadmap(params: {
  industry: string;
  answers: Record<string, any>;
  businessOverview?: string;
}): Promise<SWRoadmap | null> {
  if (!openai) return null;

  const { industry, answers, businessOverview } = params;
  const answersList = Object.entries(answers || {})
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
    .join("\n");

  const system = `You are a top-tier McKinsey-style management consultant.
- Write crisply, precisely, and with authority. Tone: executive, consultative, and data-driven.
- Tailor all content to the user's specific business and industry.
- No generic fluff. Every line must reference the context and be actionable.
- Use the user's answers as evidence; cite question keys in sourceQuestions/references.
- Respond ONLY with JSON matching the required schema.`;

  const userMsg = {
    role: "user" as const,
    content: JSON.stringify({
      industry,
      businessOverview: businessOverview ?? answers?.business_description ?? "",
      answers: answers || {},
      answersList
    })
  };

  const schemaReminder = `Return JSON with:
{
  "strengths": [{"title":"...","impact":"...","sourceQuestions":["question_key"]}],
  "weaknesses": [{"title":"...","impact":"...","sourceQuestions":["question_key"]}],
  "roadmap": [{"task":"...","expectedImpact":"...","owner":"Role","references":["question_key"]}] (exactly 4 items)
}`;

  const prompt = `Context:
Industry: ${industry}
Business overview: ${businessOverview ?? ""}
Answers:\n${answersList}\n\n${schemaReminder}`;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      max_tokens: 900
    });

    let content = resp.choices[0]?.message?.content || "{}";
    if (content.startsWith("```")) content = content.replace(/```(?:json)?/g, "").trim();

    const parsed = SWRoadmapSchema.safeParse(JSON.parse(content));
    if (!parsed.success) {
      console.error("SW/roadmap validation failed:", parsed.error?.flatten?.());
      return null;
    }
    return parsed.data;
  } catch (e) {
    console.error("SW/roadmap generation failed:", e);
    return null;
  }
}


