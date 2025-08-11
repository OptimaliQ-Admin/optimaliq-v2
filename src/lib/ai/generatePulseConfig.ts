import OpenAI from "openai";

export type PulseConfig = {
  meta: { version: '1.0'; generatedAt: string; topic: string };
  questions: Array<
    | { key: string; type: 'multiple_choice'; label: string; options: string[]; weight: number; required: true }
    | { key: string; type: 'multi_select'; label: string; options: string[]; weight: number; required: true }
    | { key: string; type: 'text'; label: string; maxLength?: number; weight: number; required: false }
  >;
  scoring: { weights: Record<string, number>; rubric: '1-4' };
};

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generatePulseConfig(input: { topic: string; roles?: string[]; context?: string }): Promise<PulseConfig> {
  const prompt = `Generate a JSON assessment config for a quick pulse on the topic "${input.topic}".
Roles: ${input.roles?.join(', ') || 'general'}
Context: ${input.context || 'n/a'}
Requirements:
- 6-10 concise questions
- Mostly multiple_choice/multi_select with clear, non-overlapping options
- Include at most 2 short text questions
- Provide weights (0.1-1.0) and a 1-4 rubric
- Output as JSON only with keys: meta, questions, scoring`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0,
    messages: [{ role: 'system', content: 'You are an assessment designer. Respond in strict JSON.' }, { role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });
  const content = res.choices[0].message.content || '{}';
  const cfg = JSON.parse(content);
  return cfg as PulseConfig;
}


