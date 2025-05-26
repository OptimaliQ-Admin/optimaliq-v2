import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

export type ScoringMap = {
  [key: string]: {
    [key: string]: {
      type: "multiple_choice" | "multi_select" | "text_area";
      weight: number;
      values: Record<string, number>;
    };
  };
};

export function calculateScore(
  answers: AssessmentAnswers,
  baseScore: number,
  scoringMap: ScoringMap
): number {
  let totalScore = baseScore;
  let totalWeight = 0;

  Object.entries(scoringMap).forEach(([questionKey, config]) => {
    const answer = answers[questionKey];
    if (!answer) return;

    const questionConfig = config[questionKey];
    if (!questionConfig) return;

    const { weight, values } = questionConfig;
    totalWeight += weight;

    if (Array.isArray(answer)) {
      answer.forEach(value => {
        if (values[value]) {
          totalScore += values[value] * weight;
        }
      });
    } else if (values[answer]) {
      totalScore += values[answer] * weight;
    }
  });

  return totalWeight > 0 ? totalScore / totalWeight : baseScore;
}

function getBracket(score: number): keyof ScoringMap {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
} 