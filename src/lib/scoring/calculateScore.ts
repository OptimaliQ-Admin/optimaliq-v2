import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import { type ScoringMap } from "@/lib/types/ScoringMap";

type QuestionType = "multiple_choice" | "multi_select" | "text_area";

export function calculateScore(
  answers: AssessmentAnswers,
  baseScore: number,
  scoringMap: ScoringMap
): number {
  // Get the appropriate scoring bracket based on the base score
  const bracket = getBracket(baseScore);
  const bracketScoring = scoringMap[bracket];

  if (!bracketScoring) {
    throw new Error(`Invalid score bracket: ${bracket}`);
  }

  let total = 0;
  let weightSum = 0;

  // Track scoring issues for debugging
  const scoringIssues = {
    unmatchedKeys: [] as string[],
    typeMismatches: [] as { key: string; expected: string; received: string }[],
    defaultedScores: [] as { 
      key: string; 
      answer: any; 
      reason: string;
      mappedValue?: string;
      mappedSelections?: string[];
    }[]
  };

  for (const key in answers) {
    const q = bracketScoring[key];
    if (!q) {
      scoringIssues.unmatchedKeys.push(key);
      continue;
    }

    const answer = answers[key];
    let valScore = 0;

    switch (q.type as QuestionType) {
      case "multiple_choice":
        if (typeof answer === "string") {
          valScore = q.values[answer] || 0;
        } else {
          scoringIssues.typeMismatches.push({
            key,
            expected: "string",
            received: typeof answer
          });
        }
        break;

      case "multi_select":
        if (Array.isArray(answer)) {
          const scores = answer
            .map((val) => q.values[val] || 0)
            .filter((score) => score > 0);
          valScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
        } else {
          scoringIssues.typeMismatches.push({
            key,
            expected: "array",
            received: typeof answer
          });
        }
        break;

      case "text_area":
        // Text areas don't contribute to the score
        continue;

      default:
        scoringIssues.typeMismatches.push({
          key,
          expected: "multiple_choice | multi_select | text_area",
          received: q.type
        });
        continue;
    }

    total += valScore * q.weight;
    weightSum += q.weight;
  }

  // Log any scoring issues
  if (scoringIssues.unmatchedKeys.length > 0 || 
      scoringIssues.typeMismatches.length > 0 || 
      scoringIssues.defaultedScores.length > 0) {
    console.warn("Scoring issues:", scoringIssues);
  }

  // Calculate final weighted average
  return weightSum > 0 ? total / weightSum : 0;
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