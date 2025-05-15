import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type MarketingScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestMarketingScore(u_id: string): Promise<MarketingScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("marketing_score, marketing_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch BPM score from profile:", error);
    return null;
  }

  if (!data?.marketing_score || !data?.marketing_last_taken) {
    return null;
  }

  const takenAt = data.marketing_last_taken;
  const score = data.marketing_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
