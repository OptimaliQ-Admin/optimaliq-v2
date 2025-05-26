"use client";

import React from "react";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";

type Props = {
  score: number;
  step: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function StepGroupRenderer({ score, step, answers, onAnswer }: Props) {
  return (
    <DynamicStepRenderer
      score={score}
      step={step}
      answers={answers}
      onAnswer={onAnswer}
      configPath="/data/bpm_question_config.json"
    />
  );
}

export function normalizeScore(score: number): string {
  if (score >= 1 && score <= 1.4) return "score_1";
  if (score >= 1.5 && score <= 1.9) return "score_1_5";
  if (score >= 2 && score <= 2.4) return "score_2";
  if (score >= 2.5 && score <= 2.9) return "score_2_5";
  if (score >= 3 && score <= 3.4) return "score_3";
  if (score >= 3.5 && score <= 3.9) return "score_3_5";
  if (score >= 4 && score <= 4.4) return "score_4";
  if (score >= 4.5 && score <= 4.9) return "score_4_5";
  return "score_5";
}