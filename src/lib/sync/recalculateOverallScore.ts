import { SupabaseClient } from "@supabase/supabase-js";

const SCORE_WEIGHTS = {
  base_score: 0.25,
  bpm_score: 0.15,
  sales_score: 0.10,
  tech_stack_score: 0.10,
  cx_score: 0.10,
  strategic_maturity_score: 0.10,
  marketing_score: 0.05,
  ai_score: 0.05,
  digital_score: 0.05,
  leadership_score: 0.03,
  benchmarking_score: 0.02,
} as const;

export async function recalculateOverallScore(
  supabase: SupabaseClient,
  userId: string
) {
  // Fetch the user's profile
  const { data: profile, error: fetchError } = await supabase
    .from("tier2_profiles")
    .select("*")
    .eq("u_id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching profile:", fetchError);
    throw fetchError;
  }

  if (!profile) {
    throw new Error("Profile not found");
  }

  // Calculate weighted average of non-null scores
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [field, weight] of Object.entries(SCORE_WEIGHTS)) {
    const score = profile[field];
    if (score !== null && score !== undefined) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  // If only base_score is present, use it directly
  const overallScore = totalWeight === SCORE_WEIGHTS.base_score 
    ? profile.base_score 
    : weightedSum / totalWeight;

  // Update the profile with the new overall score
  const { error: updateError } = await supabase
    .from("tier2_profiles")
    .update({ overall_score: overallScore })
    .eq("u_id", userId);

  if (updateError) {
    console.error("Error updating overall score:", updateError);
    throw updateError;
  }

  return overallScore;
} 