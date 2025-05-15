import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type TechScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestTechScore(u_id: string): Promise<TechScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("tech_score, tech_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch Tech score from profile:", error);
    return null;
  }

  if (!data?.tech_score || !data?.tech_last_taken) {
    return null;
  }

  const takenAt = data.tech_last_taken;
  const score = data.tech_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
