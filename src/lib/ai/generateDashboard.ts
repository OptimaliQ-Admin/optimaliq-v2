import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type DashboardScores = {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  score: number;
  industryAvgScore: number;
  topPerformerScore: number;
  benchmarking: Record<string, string>;
  strengths: { title: string; impact: string }[];
  weaknesses: { title: string; impact: string }[];
  roadmap: { task: string; expectedImpact: string }[];
};

export async function generateDashboardScores(user: any, assessment: any): Promise<DashboardScores | null> {
  const aiPrompt = `...`; // your existing prompt remains unchanged

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Respond in valid JSON only." },
        { role: "user", content: aiPrompt },
      ],
      max_tokens: 900,
    });

    let content = aiResponse.choices[0]?.message?.content || "{}";

    // 🧼 Clean up Markdown if present
    if (content.startsWith("```")) {
      content = content.replace(/```(?:json)?/g, "").trim();
    }

    // 🧪 Log raw GPT content
    console.log("🧠 Raw OpenAI response content:", content);

    const parsed = JSON.parse(content);

    // 🧪 Log parsed object
    console.log("🧪 Parsed AI response object:", JSON.stringify(parsed, null, 2));

    // 🛡️ Validate fields
    if (
      parsed.strategyScore === undefined ||
      parsed.processScore === undefined ||
      parsed.technologyScore === undefined ||
      parsed.score === undefined ||
      !parsed.benchmarking ||
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.weaknesses) ||
      !Array.isArray(parsed.roadmap)
    ) {
      console.error("❌ Missing expected fields in parsed OpenAI response:", parsed);
      return null;
    }

    return {
      strategyScore: parsed.strategyScore,
      processScore: parsed.processScore,
      technologyScore: parsed.technologyScore,
      score: parsed.score,
      industryAvgScore: parsed.industryAvgScore,
      topPerformerScore: parsed.topPerformerScore,
      benchmarking: parsed.benchmarking,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      roadmap: parsed.roadmap,
    };
  } catch (error) {
    console.error("❌ Failed to generate dashboard scores:", error);
    return null;
  }
}
