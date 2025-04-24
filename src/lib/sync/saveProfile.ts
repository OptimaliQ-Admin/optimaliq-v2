// File: /lib/sync/saveProfile.ts

import { supabase } from "@/lib/supabase";

import { getErrorMessage } from "@/utils/errorHandler";
export async function saveProfileScores(u_id: string, scores: {
  strategyScore: number,
  processScore: number,
  technologyScore: number,
  overallScore: number
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from("tier2_profiles")
      .update({
        strategy_score: scores.strategyScore,
        process_score: scores.processScore,
        technology_score: scores.technologyScore,
        overall_score: scores.overallScore,
        updated_at: new Date().toISOString()
      })
      .eq("u_id", u_id);

    if (error) {
      console.error("❌ Failed to update profile:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Profile successfully updated for user:", u_id);
    return { success: true };
  } catch (err: unknown) {
    console.error("❌ Unexpected error saving profile:", err);
    return { success: false, error: getErrorMessage(err) };
  }
}
