"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";
import questionConfig from "@/lib/config/sales_performance_question_config.json";

export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_understanding"] === "string" &&
    answers["customer_understanding"].trim().length > 0 &&
    typeof answers["team_understanding"] === "string" &&
    answers["team_understanding"].trim().length > 0 &&
    typeof answers["growth_understanding"] === "string" &&
    answers["growth_understanding"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Customer Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.customer_understanding.label}
        options={Object.entries(questionConfig.customer_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["customer_understanding"])}
        onChange={(val) => onAnswer("customer_understanding", val)}
      />

      {/* Question 2: Team Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.team_understanding.label}
        options={Object.entries(questionConfig.team_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["team_understanding"])}
        onChange={(val) => onAnswer("team_understanding", val)}
      />

      {/* Question 3: Growth Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.growth_understanding.label}
        options={Object.entries(questionConfig.growth_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["growth_understanding"])}
        onChange={(val) => onAnswer("growth_understanding", val)}
      />
    </div>
  );
}
