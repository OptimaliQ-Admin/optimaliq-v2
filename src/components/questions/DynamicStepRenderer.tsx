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
  categories?: Record<string, string[]>;
};

type ScoreConfigGroup = {
  groups: {
    [key: string]: Question[];
  };
  finalQuestions?: Question[];
};

type ScoreConfig = {
  [key: string]: ScoreConfigGroup;
};

type Props = {
  config: ScoreConfig;
  score: number;
  step: number;
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
  assessmentType?: string;
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

function flattenedOptions(categories: Record<string, string[]>): Record<string, { label: string; score: number }> {
  const result: Record<string, { label: string; score: number }> = {};
  const score = 1;
  Object.entries(categories).forEach(([group, tools]) => {
    tools.forEach(tool => {
      const key = `${group}:${tool}`;
      result[key] = { label: `${group}: ${tool}`, score };
    });
  });
  return result;
}

export default function DynamicStepRenderer({
  config,
  score,
  step,
  answers,
  onAnswer,
  assessmentType,
}: Props) {
  const normalizedScore = normalizeScore(score);
  const scoreConfig = config[normalizedScore];

  if (!scoreConfig) {
    console.error(`No configuration found for score ${score}`);
    return null;
  }

  const group = scoreConfig.groups?.[step.toString()];
  if (!group) return null;

  // Get the last group number
  const lastGroupStep = Math.max(...Object.keys(scoreConfig.groups).map(Number));

  // Check if this is the last step and we have final questions for tech stack assessment
  const isLastStep = step === lastGroupStep;
  const shouldShowFinalQuestions = isLastStep && assessmentType === "tech_stack" && scoreConfig.finalQuestions;

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

      {shouldShowFinalQuestions && scoreConfig.finalQuestions && (
        <>
          {scoreConfig.finalQuestions.map((question: Question) => (
            <DynamicQuestion
              key={question.key}
              question={question.label}
              type={question.type}
              options={question.categories ? flattenedOptions(question.categories) : undefined}
              selected={convertToQuestionValue(answers[question.key])}
              onChange={(value: string | string[]) => onAnswer(question.key, value)}
              maxSelect={10}
            />
          ))}
        </>
      )}
    </div>
  );
} 