import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";


export type StrategicScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;


export async function getLatestStrategicScore(u_id: string): Promise<StrategicScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("strategy_score, strategy_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();


  if (error) {
    console.error("❌ Failed to fetch (Assessment)score from profile:", error);
    return null;
  }


  if (!data?.strategy_score || !data?.strategy_last_taken) {
    return null;
  }


  const takenAt = data.strategy_last_taken;
  const score = data.strategy_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;


  return {
    score,
    takenAt,
    isExpired,
  };
}
