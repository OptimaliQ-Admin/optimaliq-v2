import { supabase } from "@/lib/supabase";

type ScoreResult = {
  score: number;
  takenAt: string;
} | null;

export async function getLatestBPMScore(userId: string): Promise<ScoreResult> {
  try {
    const { data, error } = await supabase
      .from("bpm_assessment")
      .select("score, created_at")
      .eq("u_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching BPM score:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    return {
      score: data.score,
      takenAt: data.created_at
    };
  } catch (error) {
    console.error("Unexpected error fetching BPM score:", error);
    return null;
  }
} 