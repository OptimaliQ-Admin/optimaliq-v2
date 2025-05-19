import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";


export type GrowthScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;


export async function getLatestGrowthScore (u_id: string): Promise<GrowthScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("benchmarking_score, benchmarking_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();


  if (error) {
    console.error("❌ Failed to fetch Growthscore from profile:", error);
    return null;
  }


  if (!data?.benchmarking_score || !data?.benchmarking_last_taken) {
    return null;
  }


  const takenAt = data.benchmarking_last_taken;
  const score = data.benchmarking_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;


  return {
    score,
    takenAt,
    isExpired,
  };
}
