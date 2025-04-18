//src/lib/queries/getLatestSalesScore.ts
import { supabase } from "@/lib/supabase";
import { differenceInDays, parseISO } from "date-fns";

export type SalesScoreResult = {
  score: number;
  takenAt: string;
  isExpired: boolean;
} | null;

export async function getLatestSalesScore(u_id: string): Promise<SalesScoreResult> {
  const { data, error } = await supabase
    .from("tier2_profiles")
    .select("sales_score, sales_last_taken")
    .eq("u_id", u_id)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch Sales score from profile:", error);
    return null;
  }

  if (!data?.sales_score || !data?.sales_last_taken) {
    return null;
  }

  const takenAt = data.sales_last_taken;
  const score = data.sales_score;
  const daysOld = differenceInDays(new Date(), parseISO(takenAt));
  const isExpired = daysOld > 30;

  return {
    score,
    takenAt,
    isExpired,
  };
}
