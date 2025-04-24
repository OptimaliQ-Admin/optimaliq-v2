// refactor/src/lib/ai/callOpenAI.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAI(prompt: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty or invalid response.");
  }

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(content);
  } catch (err) {
    console.error("Failed to parse OpenAI response:", content);
    throw new Error("Invalid JSON in OpenAI response");
  }

  return {
    parsed: parsedResponse,
    tokensUsed: response.usage?.total_tokens || 0,
    raw: content,
  };
}