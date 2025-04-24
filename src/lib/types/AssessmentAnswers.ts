// src/types/AssessmentAnswers.ts

export type AssessmentAnswerValue = string | string[] | number | boolean;

export type AssessmentAnswers = Record<string, AssessmentAnswerValue>;

export type OnAnswerHandler = (key: string, value: AssessmentAnswerValue) => void;

export function getStringAnswer(value: AssessmentAnswerValue): string {
    return typeof value === "string" ? value : "";
  }
