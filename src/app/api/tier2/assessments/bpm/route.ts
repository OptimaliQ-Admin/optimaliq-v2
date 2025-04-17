//src/app/api/tier2/assessments/bpm/route.ts
import { NextResponse } from "next/server";
import bpmScoringMap from "../data/bpm_scoring_map.json";
import { createClient } from "@supabase/supabase-js";

// Init Supabase service client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Bracket selector logic based on GMF+ score
function getBracket(score: number): string {
  if (score < 1.5) return "score_1_1_4";
  if (score < 2.0) return "score_1_5_1_9";
  if (score < 2.5) return "score_2_2_4";
  if (score < 3.0) return "score_2_5_2_9";
  if (score < 3.5) return "score_3_3_4";
  if (score < 4.0) return "score_3_5_3_9";
  if (score < 4.5) return "score_4_4_4";
  if (score < 5.0) return "score_4_5_4_9";
  return "score_5_0";
}

export async function POST(req: Request) {
  const { answers, score, userId } = await req.json();

  if (!answers || typeof score !== "number" || !userId) {
    return NextResponse.json({ error: "Missing answers, score, or userId" }, { status: 400 });
  }

  const bracketKey = getBracket(score);
  const scoringConfig = (bpmScoringMap as Record<string, any>)[bracketKey];

  if (!scoringConfig) {
    return NextResponse.json({ error: "Invalid score bracket" }, { status: 400 });
  }

  let total = 0;
  let weightSum = 0;

  for (const key in answers) {
    const q = scoringConfig[key];
    if (!q) continue;

    const answer = answers[key];
    let valScore = 0;

    if (q.type === "multiple_choice") {
      valScore = q.values[answer] || 0;
    }

    if (q.type === "multi_select") {
      try {
        const selections: string[] = Array.isArray(answer) ? answer : JSON.parse(answer);
        const scores = selections.map((s) => q.values[s] || 0);
        valScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      } catch {
        valScore = 0;
      }
    }

    total += valScore * q.weight;
    weightSum += q.weight;
  }

  const raw = weightSum ? total / weightSum : 0;
  const normalized = Math.round((raw + Number.EPSILON) * 2) / 2;

  // ✅ Insert into score_BPM table
  const { error: insertError } = await supabase.from("score_BPM").insert([
    {
      u_id: userId,
      gmf_score: score,
      bracket_key: bracketKey,
      score: normalized,
      answers,
      version: "v1",
    },
  ]);

  if (insertError) {
    console.error("❌ Supabase insert error:", insertError);
    return NextResponse.json({ error: "Failed to store score." }, { status: 500 });
  }

  // Return score back to frontend
  return NextResponse.json({ bpmScore: normalized });
}
