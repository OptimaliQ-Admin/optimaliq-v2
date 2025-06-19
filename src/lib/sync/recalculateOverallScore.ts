import { SupabaseClient } from "@supabase/supabase-js";

const SCORE_WEIGHTS = {
  bpm_score: 0.15,
  sales_score: 0.10,
  tech_stack_score: 0.10,
  cx_score: 0.10,
  strategic_maturity_score: 0.15,
  marketing_score: 0.05,
  ai_score: 0.05,
  digital_score: 0.05,
  leadership_score: 0.03,
  benchmarking_score: 0.02,
} as const;

// Fields to count for determining base_score weight
const DEEP_ASSESSMENT_FIELDS = [
  'bpm_score',
  'sales_score', 
  'tech_stack_score',
  'cx_score',
  'strategic_maturity_score',
  'marketing_score',
  'ai_score',
  'digital_score',
  'leadership_score',
  'benchmarking_score'
] as const;

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

  // Count completed deep assessments (excluding base_score)
  const completedDeepAssessments = DEEP_ASSESSMENT_FIELDS.filter(
    field => profile[field] !== null && profile[field] !== undefined
  ).length;

  // Determine base_score weight based on user progress
  const baseScoreWeight = completedDeepAssessments >= 2 ? 0.15 : 0.25;

  console.log(`📊 User ${userId} has completed ${completedDeepAssessments} deep assessments. Using base_score weight: ${baseScoreWeight * 100}%`);

  // Calculate weighted average of non-null scores
  let totalWeight = 0;
  let weightedSum = 0;

  // Handle base_score with dynamic weight
  if (profile.base_score !== null && profile.base_score !== undefined) {
    weightedSum += profile.base_score * baseScoreWeight;
    totalWeight += baseScoreWeight;
  }

  // Handle all other scores with fixed weights
  for (const [field, weight] of Object.entries(SCORE_WEIGHTS)) {
    const score = profile[field];
    if (score !== null && score !== undefined) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  }

  // If only base_score is present, use it directly
  const overallScore = totalWeight === baseScoreWeight 
    ? profile.base_score 
    : weightedSum / totalWeight;

  console.log(`🎯 Calculated overall score: ${overallScore.toFixed(2)} (total weight: ${totalWeight.toFixed(2)})`);

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