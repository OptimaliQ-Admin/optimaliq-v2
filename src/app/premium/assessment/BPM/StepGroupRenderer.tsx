"use client";

import React from "react";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import bpmQuestionConfig from "@/lib/config/bpm_question_config.json";

type QuestionType = "multiple_choice" | "multi_select" | "text_area";

type QuestionOption = {
  value: string;
  label: string;
  score: number;
};

type Question = {
  key: string;
  label: string;
  type: QuestionType;
  options?: QuestionOption[];
  order: number;
};

type ScoreConfig = {
  [key: string]: {
    groups: {
      [key: string]: Question[];
    };
  };
};

type Props = {
  step: number;
  score: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: any) => void;
};

export function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

export default function StepGroupRenderer({
  step,
  score,
  answers,
  onAnswer,
}: Props) {
  return (
    <DynamicStepRenderer
      config={bpmQuestionConfig as ScoreConfig}
      score={score}
      step={step}
      answers={answers}
      onAnswer={onAnswer}
    />
  );
} 