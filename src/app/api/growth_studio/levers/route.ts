import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const scoreLabels = {
  strategy_score: "Strategy",
  process_score: "Process",
  technology_score: "Technology",
  bpm_score: "Business Process",
  tech_stack_score: "Tech Stack",
  strategic_maturity_score: "Strategic Maturity",
  marketing_score: "Marketing",
  sales_score: "Sales",
  cx_score: "Customer Experience",
  ai_score: "AI & Automation",
  digital_score: "Digital Transformation",
  leadership_score: "Leadership & Team",
  benchmarking_score: "Benchmarking",
  reassessment_score: "Reassessment",
};

export async function POST(request: Request) {
  try {
    const { u_id } = await request.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user's industry from tier2_users
    const { data: userData, error: userError } = await supabase
      .from("tier2_users")
      .select("industry")
      .eq("u_id", u_id)
      .single();

    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }

    const industry = userData?.industry || "general business";

    // Fetch profile scores
    const { data: profile, error: profileError } = await supabase
      .from("tier2_profiles")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      throw profileError;
    }

    // Build score prompt from all non-null fields
    const includedScores = [];
    const missingScores = [];

    for (const [key, label] of Object.entries(scoreLabels)) {
      const value = profile?.[key as keyof typeof profile];
      if (value !== null && value !== undefined) {
        includedScores.push(`${label}: ${value}`);
      } else {
        missingScores.push(label);
      }
    }

    const scorePrompt = `The user has the following business scores:\n${includedScores
      .map((s) => `- ${s}`)
      .join("\n")}\n\n` +
      (missingScores.length > 0
        ? `The following assessments have not been completed: ${missingScores.join(
            ", "
          )}. If appropriate, suggest that the user take these assessments.`
        : "");

    // Build business context prompt
    const businessContext = profile?.business_overview 
      ? `Business Context: The user runs a business in the ${industry} industry. Specifically, their business ${profile.business_overview}.`
      : `Business Context: The user runs a business in the ${industry} industry.`;

    // Check for existing levers
    const { data: existingLevers, error: fetchError } = await supabase
      .from("growth_levers")
      .select("*")
      .eq("u_id", u_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    // Check if we need to generate new levers
    const needsNewLevers = !existingLevers || 
      new Date().getTime() - new Date(existingLevers.generated_at).getTime() > 31 * 24 * 60 * 60 * 1000;

    if (needsNewLevers) {
      // Generate new levers using OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `You are a growth strategy expert for the ${industry} industry.

Business Context: The user runs a business in the ${industry} industry. Specifically, their business ${profile?.business_overview || 'provides services in this industry'}.

${scorePrompt}

Based on this data, generate 5 high-impact growth levers the business should focus on. Each lever should be:
- One actionable sentence starting with a verb
- Practical and measurable
- Either based on the provided scores or suggest assessments if relevant
- Tailored to the specific business context and industry

## Output Format
Return your response as a JSON object with a "levers" array containing exactly 5 growth levers as strings. For example:

{
  "levers": [
    "Expand your online marketing efforts by increasing ad spend towards targeted demographics.",
    "Launch a customer referral program to drive new client acquisition.",
    "Assess the potential of upselling additional services to existing customers based on sales data.",
    "Strengthen supply chain partnerships to optimize inventory management and reduce costs.",
    "Introduce a quarterly customer feedback survey to identify new service opportunities."
  ]
}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      // Parse the JSON response
      let responseData;
      try {
        responseData = JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", content);
        throw new Error("Invalid response format from AI");
      }

      const leversText = responseData.levers || [];
      
      if (!leversText || leversText.length === 0) {
        throw new Error("Failed to generate growth levers");
      }

      // Ensure we have exactly 5 levers
      const finalLevers = leversText.slice(0, 5);

      // Upsert the new levers
      const { error: upsertError } = await supabase
        .from("growth_levers")
        .upsert({
          u_id,
          levers: finalLevers,
          generated_at: new Date().toISOString()
        });

      if (upsertError) {
        throw upsertError;
      }

      // Get the progress for each lever
      const { data: progressData, error: progressError } = await supabase
        .from("growth_lever_progress")
        .select("*")
        .eq("u_id", u_id)
        .in("lever_text", finalLevers);

      if (progressError) {
        throw progressError;
      }

      // Combine levers with their progress
      const levers = finalLevers.map((text: string) => ({
        text,
        isCompleted: progressData?.some(p => p.lever_text === text && p.is_completed) || false,
      }));

      return NextResponse.json({ levers });
    }

    // If we have existing levers, get their progress
    const { data: progressData, error: progressError } = await supabase
      .from("growth_lever_progress")
      .select("*")
      .eq("u_id", u_id)
      .in("lever_text", existingLevers.levers);

    if (progressError) {
      throw progressError;
    }

    // Combine existing levers with their progress
    const levers = existingLevers.levers.map((text: string) => ({
      text,
      isCompleted: progressData?.some(p => p.lever_text === text && p.is_completed) || false,
    }));

    return NextResponse.json({ levers });
  } catch (error) {
    console.error("Error in growth levers API:", error);
    return NextResponse.json(
      { error: "Failed to fetch growth levers" },
      { status: 500 }
    );
  }
} 