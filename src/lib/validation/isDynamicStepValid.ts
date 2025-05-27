import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

type QuestionConfig = {
  [key: string]: {
    groups: {
      [key: string]: Array<{
        key: string;
        label: string;
        type: "select" | "multi_select" | "text_area";
        options?: Array<{
          value: string;
          label: string;
          score: number;
        }>;
      }>;
    };
    finalQuestions?: Array<{
      key: string;
      label: string;
      type: "select" | "multi_select" | "text_area";
      categories?: Record<string, string[]>;
    }>;
  };
};

function normalizeScore(score: number): string {
  return `score_${Math.min(Math.max(Math.ceil(score), 1), 5)}`;
}

export function isDynamicStepValid(
  score: number,
  step: number,
  answers: AssessmentAnswers,
  questionConfig: QuestionConfig
): boolean {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = questionConfig[normalizedScore];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return false;
  }

  const groupStepCount = Object.keys(scoreConfig.groups || {}).length;
  const isFinalStep = step === groupStepCount && !!scoreConfig.finalQuestions;

  // Get questions for the current step
  const questions = isFinalStep && scoreConfig.finalQuestions
    ? scoreConfig.finalQuestions
    : scoreConfig.groups[step.toString()] || [];

  // Check if all questions in the step have valid answers
  return questions.every((question) => {
    const answer = answers[question.key];

    // For multi-select questions
    if (question.type === "multi_select") {
      return Array.isArray(answer) && answer.length > 0;
    }

    // For text area questions
    if (question.type === "text_area") {
      return typeof answer === "string" && answer.trim().length > 0;
    }

    // For select questions
    return typeof answer === "string" && answer.trim().length > 0;
  });
} 