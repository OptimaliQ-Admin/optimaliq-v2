"use client";

import React from "react";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

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
      step={step}
      score={score}
      answers={answers}
      onAnswer={onAnswer}
    />
  );
}
