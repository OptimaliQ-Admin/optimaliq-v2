import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type DigitalScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestDigitalScore(u_id: string): Promise<DigitalScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("digital_score, digital_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch BPM score from profile:", error);
    return null;
  }

  if (!data?.digital_score || !data?.digital_last_taken) {
    return null;
  }

  const takenAt = data.digital_last_taken;
  const score = data.digital_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
