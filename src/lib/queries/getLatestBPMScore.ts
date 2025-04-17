import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type BPMScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestBPMScore(u_id: string): Promise<BPMScoreResult> {
  const { data, error } = await supabase
    .from("score_BPM")
    .select("score, created_at")
    .eq("u_id", u_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch BPM score:", error);
    return null;
  }

  if (!data) return null;

  const takenAt = data.created_at;
  const score = data.score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
