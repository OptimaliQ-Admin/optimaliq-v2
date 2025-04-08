
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getQuestionsByScore(score: number) {

  const { data, error } = await supabase
    .from('bpm_assessment_questions')
    .select("*")
    .lte("min_score", score)
    .gte("max_score", score);

  if (error) {
    console.error("Error fetching questions:", error);
    return [];
  }

  return data || [];
}
