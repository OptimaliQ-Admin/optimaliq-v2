"use client";

import React from "react";
import DynamicStepRenderer from "@/components/questions/DynamicStepRenderer";
import { type AssessmentAnswers } from "@/lib/types/AssessmentAnswers";
import salesQuestionConfig from "@/lib/config/question_config.json";

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

type SalesQuestionOption = {
  label: string;
  score: number;
};

type SalesQuestionOptionV2 = {
  key: string;
  label: string;
  score: number;
};

type SalesQuestion = {
  label: string;
  type: string;
  options?: Record<string, SalesQuestionOption> | SalesQuestionOptionV2[];
  key?: string;
};

type SalesConfig = {
  [scoreKey: string]: {
    [questionKey: string]: SalesQuestion;
  };
};

type Props = {
  step: number;
  score: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: any) => void;
};

// Transform the sales config to match the expected structure
function transformSalesConfig(config: SalesConfig): ScoreConfig {
  const transformed: ScoreConfig = {};
  
  Object.entries(config).forEach(([scoreKey, questions]) => {
    const questionArray = Object.entries(questions).map(([key, q]) => {
      const options = q.options ? (
        Array.isArray(q.options) 
          ? q.options.map(opt => ({
              value: opt.key,
              label: opt.label,
              score: opt.score
            }))
          : Object.entries(q.options).map(([value, opt]) => ({
              value,
              label: opt.label,
              score: opt.score
            }))
      ) : undefined;

      return {
        key: q.key || key,
        label: q.label,
        type: q.type as QuestionType,
        options,
        order: 0 // Sales config doesn't have order, but it's not used
      };
    });

    // Group questions into steps (3/4/3)
    transformed[scoreKey] = {
      groups: {
        "0": questionArray.slice(0, 3),
        "1": questionArray.slice(3, 7),
        "2": questionArray.slice(7)
      }
    };
  });

  return transformed;
}

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
  const transformedConfig = transformSalesConfig(salesQuestionConfig);

  return (
    <DynamicStepRenderer
      config={transformedConfig}
      score={score}
      step={step}
      answers={answers}
      onAnswer={onAnswer}
    />
  );
}
