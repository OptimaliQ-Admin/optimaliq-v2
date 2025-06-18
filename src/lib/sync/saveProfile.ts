import { SupabaseClient } from "@supabase/supabase-js";

type ProfileScores = {
  strategy_score: number;
  process_score: number;
  technology_score: number;
  base_score: number;
};

export async function saveProfileScores(
  supabase: SupabaseClient,
  u_id: string,
  scores: ProfileScores
): Promise<boolean> {
  try {
    const payload = {
      u_id, // 👈 ensure this is part of the payload
      strategy_score: scores.strategy_score,
      process_score: scores.process_score,
      technology_score: scores.technology_score,
      base_score: scores.base_score,
      updated_at: new Date().toISOString(),
    };

    console.log(`📝 Upserting profile scores for ${u_id}:`, payload);

    const { error } = await supabase
      .from("tier2_profiles")
      .upsert(payload, { onConflict: "u_id" }); // 👈 key change here

    if (error) {
      console.error("❌ Failed to save profile scores:", error);
      return false;
    }

    console.log("✅ Profile scores saved (inserted or updated) successfully.");
    return true;
  } catch (err: unknown) {
    console.error("🔥 Unexpected error saving profile scores:", err);
    return false;
  }
}
