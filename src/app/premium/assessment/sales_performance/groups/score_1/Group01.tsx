"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";
import questionConfig from "@/lib/config/sales_performance_question_config.json";

export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_understanding"] === "string" &&
    answers["strategy_understanding"].trim().length > 0 &&
    typeof answers["innovation_understanding"] === "string" &&
    answers["innovation_understanding"].trim().length > 0 &&
    typeof answers["market_understanding"] === "string" &&
    answers["market_understanding"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Strategy Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.strategy_understanding.label}
        options={Object.entries(questionConfig.strategy_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["strategy_understanding"])}
        onChange={(val) => onAnswer("strategy_understanding", val)}
      />

      {/* Question 2: Innovation Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.innovation_understanding.label}
        options={Object.entries(questionConfig.innovation_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["innovation_understanding"])}
        onChange={(val) => onAnswer("innovation_understanding", val)}
      />

      {/* Question 3: Market Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.market_understanding.label}
        options={Object.entries(questionConfig.market_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["market_understanding"])}
        onChange={(val) => onAnswer("market_understanding", val)}
      />
    </div>
  );
}
