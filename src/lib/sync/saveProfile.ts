import { SupabaseClient } from "@supabase/supabase-js";

type ProfileScores = {
  strategyScore: number;
  processScore: number;
  technologyScore: number;
  overallScore: number;
};

export async function saveProfileScores(
  supabase: SupabaseClient,
  u_id: string,
  scores: ProfileScores
): Promise<boolean> {
  try {
    const updatePayload = {
      strategyScore: scores.strategyScore,
      processScore: scores.processScore,
      technologyScore: scores.technologyScore,
      overallScore: scores.overallScore,
      updated_at: new Date().toISOString(), // Optional: track updates
    };

    console.log(`📝 Saving profile scores for ${u_id}:`, updatePayload);

    const { error } = await supabase
      .from("tier2_profiles")
      .update(updatePayload)
      .eq("u_id", u_id);

    if (error) {
      console.error("❌ Failed to save profile scores:", error);
      return false;
    }

    console.log("✅ Profile scores updated successfully.");
    return true;
  } catch (err: unknown) {
    console.error("🔥 Unexpected error saving profile scores:", err);
    return false;
  }
}
