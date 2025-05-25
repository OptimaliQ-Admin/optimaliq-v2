"use client";

import React from "react";
import DynamicQuestion from "./DynamicQuestion";
import questionConfig from "@/lib/config/question_config.json";

type Props = {
  score: number;
  step: number;
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

function normalizeScore(score: number): string {
  if (score >= 4.5) return "score_4_5";
  if (score >= 4.0) return "score_4";
  if (score >= 3.5) return "score_3_5";
  if (score >= 3.0) return "score_3";
  if (score >= 2.5) return "score_2_5";
  if (score >= 2.0) return "score_2";
  if (score >= 1.5) return "score_1_5";
  return "score_1";
}

export default function DynamicStepRenderer({
  score,
  step,
  answers,
  onAnswer,
}: Props) {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = questionConfig[normalizedScore as keyof typeof questionConfig];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return null;
  }

  // Get questions for the current step
  const questions = Object.entries(scoreConfig).slice(step * 3, (step + 1) * 3);

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      {questions.map(([key, question]) => (
        <DynamicQuestion
          key={key}
          question={question.label}
          type={question.type}
          options={question.options}
          selected={answers[key]}
          onChange={(value) => onAnswer(key, value)}
          maxSelect={question.type === "multi_select" ? 5 : undefined}
        />
      ))}
    </div>
  );
} 