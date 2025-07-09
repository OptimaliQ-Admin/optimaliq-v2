import { SupabaseClient } from "@supabase/supabase-js";

type ProfileScores = {
  strategy_score: number;
  process_score: number;
  technology_score: number;
  base_score: number;
  overall_score?: number;
};

export async function saveProfileScores(
  supabase: SupabaseClient,
  u_id: string,
  scores: ProfileScores
): Promise<boolean> {
  try {
    const payload = {
      u_id,
      strategy_score: scores.strategy_score,
      process_score: scores.process_score,
      technology_score: scores.technology_score,
      base_score: scores.base_score,
      ...(scores.overall_score !== undefined && { overall_score: scores.overall_score }),
      updated_at: new Date().toISOString(),
    };

    console.log("📝 Upserting profile scores");

    const { error } = await supabase
      .from("tier2_profiles")
      .upsert(payload, { onConflict: "u_id" });

    if (error) {
      console.error("❌ Error upserting profile scores:", error);
      throw error;
    }

    console.log("✅ Profile scores saved successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to save profile scores:", error);
    throw error;
  }
}
