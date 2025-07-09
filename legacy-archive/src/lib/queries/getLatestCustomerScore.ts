import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type CustomercoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestCustomerScore(u_id: string): Promise<CustomercoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("cx_score, cx_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch BPM score from profile:", error);
    return null;
  }

  if (!data?.cx_score || !data?.cx_last_taken) {
    return null;
  }

  const takenAt = data.cx_last_taken;
  const score = data.cx_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
