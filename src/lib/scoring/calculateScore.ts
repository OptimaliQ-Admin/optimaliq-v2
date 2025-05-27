import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

export type ScoringMap = {
  [key: string]: {
    groups: {
      [key: string]: Array<{
        key: string;
        type: "select" | "multi_select" | "text_area";
        options: Array<{
          value: string;
          label: string;
          score: number;
        }>;
      }>;
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

  // Get the appropriate score bracket based on baseScore
  const scoreBracket = getBracket(baseScore);
  const scoreConfig = scoringMap[scoreBracket];

  if (!scoreConfig) {
    console.error(`No scoring configuration found for score bracket ${scoreBracket}`);
    return baseScore;
  }

  Object.entries(scoreConfig.groups).forEach(([_, questions]) => {
    questions.forEach(question => {
      const answer = answers[question.key];
      if (!answer) return;

      const { options } = question;
      if (!options) return;

      totalWeight += 1; // Each question has equal weight

      if (Array.isArray(answer)) {
        answer.forEach(value => {
          const option = options.find(opt => opt.value === value);
          if (option) {
            totalScore += option.score;
          }
        });
      } else if (typeof answer === "string") {
        const option = options.find(opt => opt.value === answer);
        if (option) {
          totalScore += option.score;
        }
      }
    });
  });

  return totalWeight > 0 ? totalScore / totalWeight : baseScore;
}

function getBracket(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}