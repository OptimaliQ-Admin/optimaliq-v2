// src/lib/ai/callOpenAI.ts

import OpenAI from "openai";

// Only create OpenAI instance if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface OpenAIOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: 'json_object' | 'text';
}

export async function callOpenAI(prompt: string, options: OpenAIOptions = {}) {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
  }

  const {
    model = "gpt-4o-mini", // Default to gpt-4o-mini instead of gpt-4.1-mini
    maxTokens = 1000,
    temperature = 0.7,
    responseFormat = "json_object"
  } = options;

  const requestConfig: any = {
    model,
    messages: [{ role: "system", content: prompt }],
    max_tokens: maxTokens,
    temperature,
  };

  // Only add response_format if it's json_object (default behavior)
  if (responseFormat === "json_object") {
    requestConfig.response_format = { type: "json_object" };
  }

  const response = await openai.chat.completions.create(requestConfig);

  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty or invalid response.");
  }

  // If expecting JSON, parse it
  if (responseFormat === "json_object") {
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
  } else {
    // For text responses, return the content directly
    return {
      parsed: { message: content },
      tokensUsed: response.usage?.total_tokens || 0,
      raw: content,
    };
  }
}