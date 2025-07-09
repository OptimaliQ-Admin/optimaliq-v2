import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type AIScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestAIScore(u_id: string): Promise<AIScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("ai_score, ai_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch BPM score from profile:", error);
    return null;
  }

  if (!data?.ai_score || !data?.ai_last_taken) {
    return null;
  }

  const takenAt = data.ai_last_taken;
  const score = data.ai_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
