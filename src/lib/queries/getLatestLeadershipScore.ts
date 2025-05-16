import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";


export type LeadershipScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;


export async function getLatestLeadershipScore(u_id: string): Promise<LeadershipScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("Leadership_score, Leadership_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();


  if (error) {
    console.error("❌ Failed to fetch Leadershipscore from profile:", error);
    return null;
  }


  if (!data?.Leadership_score || !data?.Leadership_last_taken) {
    return null;
  }


  const takenAt = data.Leadership_last_taken;
  const score = data.Leadership_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;


  return {
    score,
    takenAt,
    isExpired,
  };
}
