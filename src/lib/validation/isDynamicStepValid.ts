import questionConfig from "@/lib/config/question_config.json";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

export function isDynamicStepValid(
  score: number,
  step: number,
  answers: AssessmentAnswers
): boolean {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = questionConfig[normalizedScore as keyof typeof questionConfig];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return false;
  }

  // Get questions for the current step
  const questions = Object.entries(scoreConfig).slice(step * 3, (step + 1) * 3);

  // Check if all questions in the step have valid answers
  return questions.every(([key, question]) => {
    const answer = answers[key];

    // For multi-select questions
    if (question.type === "multi_select") {
      return Array.isArray(answer) && answer.length > 0;
    }

    // For multiple choice questions
    return typeof answer === "string" && answer.trim().length > 0;
  });
} 