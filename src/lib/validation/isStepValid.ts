import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

type QuestionType = "multiple_choice" | "multi_select" | "text_area";

type QuestionOption = {
  value: string;
  label: string;
};

type Question = {
  type: QuestionType;
  key: string;
  label: string;
  required: boolean;
  options?: QuestionOption[];
};

type ScoreConfig = {
  steps: {
    [key: string]: {
      questions: Question[];
    };
  };
};

export function isStepValid(
  score: number,
  step: number,
  answers: AssessmentAnswers,
  config: ScoreConfig
): boolean {
  // Get the appropriate step from the config
  const stepKey = `step_${step + 1}`;
  const stepConfig = config.steps[stepKey];

  if (!stepConfig) {
    console.error(`Invalid step: ${stepKey}`);
    return false;
  }

  // Check each question in the step
  for (const question of stepConfig.questions) {
    // Skip validation for non-required questions
    if (!question.required) {
      continue;
    }

    const answer = answers[question.key];

    // If no answer provided for required question, step is invalid
    if (answer === undefined || answer === null || answer === "") {
      return false;
    }

    // Validate based on question type
    switch (question.type) {
      case "multiple_choice":
        if (typeof answer !== "string") {
          return false;
        }
        // Check if the answer is one of the valid options
        if (question.options && !question.options.some(opt => opt.value === answer)) {
          return false;
        }
        break;

      case "multi_select":
        if (!Array.isArray(answer)) {
          return false;
        }
        // Check if all selected values are valid options
        if (question.options && !answer.every(val => 
          question.options?.some(opt => opt.value === val)
        )) {
          return false;
        }
        break;

      case "text_area":
        if (typeof answer !== "string" || answer.trim() === "") {
          return false;
        }
        break;

      default:
        console.error(`Unknown question type: ${question.type}`);
        return false;
    }
  }

  return true;
} 