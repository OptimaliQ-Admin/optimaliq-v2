// src/types/AssessmentAnswers.ts

export type AssessmentAnswerValue = string | string[] | number | boolean | null;

export type AssessmentAnswers = {
  [key: string]: AssessmentAnswerValue;
};

export type OnAnswerHandler = (key: string, value: AssessmentAnswerValue) => void;

export function getStringAnswer(value: AssessmentAnswerValue): string {
  if (typeof value === "string") return value;
  return "";
}

export function getStringArrayAnswer(value: AssessmentAnswerValue): string[] {
  if (Array.isArray(value)) return value;
  return [];
}

export function getArrayAnswer(value: AssessmentAnswerValue): string[] {
  return Array.isArray(value) ? value : [];
}

export type BpmQuestionType = "multiple_choice" | "multi_select";

export type BpmScoringEntry = {
  type: BpmQuestionType;
  weight: number;
  values: Record<string, number>;
};

export type BpmScoringBracket = Record<string, BpmScoringEntry>;

export type BpmScoringMap = Record<string, BpmScoringBracket>;

export type SalesScoringEntry = {
  type: BpmQuestionType;
  weight: number;
  values: Record<string, number>;
};

export type SalesScoringBracket = Record<string, BpmScoringEntry>;

export type SalesScoringMap = Record<string, BpmScoringBracket>;

