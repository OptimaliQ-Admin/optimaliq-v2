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

export async function POST(request: Request) {
  try {
    const { u_id } = await request.json();

    if (!u_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

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
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a growth strategy expert. Generate 5 specific, actionable growth levers that a business can implement. Each lever should be a single sentence starting with a verb. Make them practical and measurable."
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const leversText = completion.choices[0].message.content
        ?.split("\n")
        .filter(line => line.trim().startsWith("-"))
        .map(line => line.replace("-", "").trim())
        .slice(0, 5);

      if (!leversText || leversText.length === 0) {
        throw new Error("Failed to generate growth levers");
      }

      // Upsert the new levers
      const { error: upsertError } = await supabase
        .from("growth_levers")
        .upsert({
          u_id,
          levers: leversText,
          generated_at: new Date().toISOString(),
        });

      if (upsertError) {
        throw upsertError;
      }

      // Get the progress for each lever
      const { data: progressData, error: progressError } = await supabase
        .from("growth_lever_progress")
        .select("*")
        .eq("u_id", u_id)
        .in("lever_text", leversText);

      if (progressError) {
        throw progressError;
      }

      // Combine levers with their progress
      const levers = leversText.map(text => ({
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