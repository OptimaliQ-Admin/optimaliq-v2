"use client";

import React from "react";
import DynamicQuestion from "./DynamicQuestion";
import { type AssessmentAnswers, type AssessmentAnswerValue } from "@/lib/types/AssessmentAnswers";

type QuestionType = "select" | "multi_select" | "text_area";

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
};

type ScoreConfig = {
  [key: string]: {
    groups: {
      [key: string]: Question[];
    };
  };
};

type Props = {
  config: ScoreConfig;
  score: number;
  step: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
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

function convertToQuestionValue(value: AssessmentAnswerValue): string | string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (typeof value === "boolean") return value.toString();
  return "";
}

export default function DynamicStepRenderer({
  config,
  score,
  step,
  answers,
  onAnswer,
}: Props) {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = config[normalizedScore];
  
  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return null;
  }

  const group = scoreConfig.groups?.[step.toString()];
  if (!group) return null;

  return (
    <div className="space-y-8 p-6 max-w-2xl mx-auto">
      {group.map((question) => {
        const optionsRecord = question.options?.reduce((acc, opt) => ({
          ...acc,
          [opt.value]: { label: opt.label, score: opt.score }
        }), {} as Record<string, { label: string; score: number }>);

        return (
          <DynamicQuestion
            key={question.key}
            question={question.label}
            type={question.type}
            options={optionsRecord}
            selected={convertToQuestionValue(answers[question.key])}
            onChange={(value: string | string[]) => onAnswer(question.key, value)}
            maxSelect={question.type === "multi_select" ? 5 : undefined}
          />
        );
      })}
    </div>
  );
} 