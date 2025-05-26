import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

type ScoreConfig = {
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
): boolean; 