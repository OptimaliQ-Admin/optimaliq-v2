"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import {
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type ToolOption = {
  value: string;
  label: string;
};

type Props = {
  categoryKey: string;
  question: string;
  description: string;
  options: ToolOption[];
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function ToolSelectorGroup({
  categoryKey,
  question,
  description,
  options,
  answers,
  onAnswer,
}: Props) {
  return (
    <MultiSelectQuestion
      question={question}
      description={description}
      options={options}
      selected={Array.isArray(getArrayAnswer(answers[categoryKey])) ? getArrayAnswer(answers[categoryKey]) : []}
      onChange={(val) => onAnswer(categoryKey, val)}
    />
  );
} 