//src/app/api/tier2/assessments/sales_performance/route.ts
import { NextResponse } from "next/server";
import salesScoringMap from "../data/sales_scoring_map.json";
import { createClient } from "@supabase/supabase-js";
import type { SalesScoringMap } from "@/lib/types/AssessmentAnswers";

// Init Supabase service client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Bracket selector logic based on GMF+ score
function getBracket(score: number): string {
  if (score < 1.5) return "score_1_1_4";
  if (score < 2.0) return "score_1_5_1_9";
  if (score < 2.5) return "score_2_0_2_4";
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
  const scoringMap = salesScoringMap as SalesScoringMap;
const scoringConfig = scoringMap[bracketKey];

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

    if (valScore > 0) {
      total += valScore * q.weight;
      weightSum += q.weight;
    } else {
      console.warn(`Unscored answer for '${key}':`, answer);
    }
  }

  const raw = weightSum ? total / weightSum : 0;
  const normalized = Math.round((raw + Number.EPSILON) * 2) / 2;

  // ✅ Insert into score_SalesPerformance table
  const { error: insertError } = await supabase.from("score_SalesPerformance").insert([
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

  // ✅ Upsert into tier2_profiles (create or update profile with sales score)
  const { error: profileError } = await supabase
    .from("tier2_profiles")
    .upsert(
      {
        u_id: userId,
        sales_score: normalized,
        sales_last_taken: new Date().toISOString(),
      },
      { onConflict: "u_id" }
    );

  if (profileError) {
    console.error("❌ Failed to update tier2_profiles:", profileError);
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }

  // 🎉 Return score to frontend
  return NextResponse.json({ salesScore: normalized });
}
