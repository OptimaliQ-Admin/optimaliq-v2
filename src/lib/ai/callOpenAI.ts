// src/lib/ai/callOpenAI.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface OpenAIOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export async function callOpenAI(prompt: string, options: OpenAIOptions = {}) {
  const {
    model = "gpt-4o-mini", // Default to gpt-4o-mini instead of gpt-4.1-mini
    maxTokens = 1000,
    temperature = 0.7
  } = options;

  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "system", content: prompt }],
    max_tokens: maxTokens,
    temperature,
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