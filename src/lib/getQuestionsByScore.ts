
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getQuestionsByScore(score: number) {
  const bracket = Math.floor(score * 2) / 2;
  const { data, error } = await supabase
    .from('bpm_assessment_questions')
    .select('*')
    .eq('score_bracket', bracket);

  if (error) throw error;

  return data.map((q) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null // assuming options are stored as JSON string
  }));
}
