import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";


export type reassessmentScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;


export async function getLatestReassessmentScore(u_id: string): Promise<reassessmentScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("reassessment_score, reassessment")
    .eq("u_id", u_id)
    .maybeSingle();


  if (error) {
    console.error("❌ Failed to fetch reassessment score from profile:", error);
    return null;
  }


  if (!data?.reassessment_score || !data?.reassessment_last_taken) {
    return null;
  }


  const takenAt = data.reassessment_last_taken;
  const score = data.reassessment_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;


  return {
    score,
    takenAt,
    isExpired,
  };
}
