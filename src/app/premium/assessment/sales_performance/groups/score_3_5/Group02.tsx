"use client";

import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import React from "react";
import MultipleChoiceQuestion from "src/components/questions/MultipleChoiceQuestion";
import questionConfig from "@/lib/config/sales_performance_question_config.json";

export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["process_understanding"] === "string" &&
    answers["process_understanding"].trim().length > 0 &&
    typeof answers["technology_understanding"] === "string" &&
    answers["technology_understanding"].trim().length > 0 &&
    typeof answers["data_understanding"] === "string" &&
    answers["data_understanding"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Question 1: Process Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.process_understanding.label}
        options={Object.entries(questionConfig.process_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["process_understanding"])}
        onChange={(val) => onAnswer("process_understanding", val)}
      />

      {/* Question 2: Technology Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.technology_understanding.label}
        options={Object.entries(questionConfig.technology_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["technology_understanding"])}
        onChange={(val) => onAnswer("technology_understanding", val)}
      />

      {/* Question 3: Data Understanding */}
      <MultipleChoiceQuestion
        question={questionConfig.data_understanding.label}
        options={Object.entries(questionConfig.data_understanding.options).map(([value, label]) => ({
          value,
          label,
        }))}
        value={getStringAnswer(answers["data_understanding"])}
        onChange={(val) => onAnswer("data_understanding", val)}
      />
    </div>
  );
}
