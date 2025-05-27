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

  console.log(`Validating step ${step} with ${questions.length} questions`);
  console.log('Current answers:', answers);

  // Check if all questions in the step have valid answers
  const isValid = questions.every((question) => {
    const answer = answers[question.key];
    console.log(`Validating question ${question.key}:`, { type: question.type, answer });

    // For multi-select questions
    if (question.type === "multi_select") {
      const isValid = Array.isArray(answer) && answer.length > 0;
      console.log(`Multi-select validation for ${question.key}:`, isValid);
      return isValid;
    }

    // For text area questions
    if (question.type === "text_area") {
      const isValid = typeof answer === "string" && answer.trim().length > 0;
      console.log(`Text area validation for ${question.key}:`, isValid);
      return isValid;
    }

    // For select questions
    const isValid = typeof answer === "string" && answer.trim().length > 0;
    console.log(`Select validation for ${question.key}:`, isValid);
    return isValid;
  });

  console.log(`Step ${step} validation result:`, isValid);
  return isValid;
} 