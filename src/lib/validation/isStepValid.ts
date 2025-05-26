import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

export type ScoreConfig = {
  steps: {
    [key: string]: {
      questions: Array<{
        type: "multiple_choice" | "multi_select" | "text_area";
        key: string;
        label: string;
        required: boolean;
        options?: Array<{
          value: string;
          label: string;
        }>;
      }>;
    };
  };
};

export function isStepValid(
  score: number,
  step: number,
  answers: AssessmentAnswers,
  config: ScoreConfig
): boolean {
  const currentStep = config.steps[`step_${step + 1}`];
  if (!currentStep) return false;

  return currentStep.questions.every(question => {
    if (!question.required) return true;
    const answer = answers[question.key];
    if (!answer) return false;

    switch (question.type) {
      case "multiple_choice":
        return typeof answer === "string" && answer.length > 0;
      case "multi_select":
        return Array.isArray(answer) && answer.length > 0;
      case "text_area":
        return typeof answer === "string" && answer.trim().length > 0;
      default:
        return false;
    }
  });
} 