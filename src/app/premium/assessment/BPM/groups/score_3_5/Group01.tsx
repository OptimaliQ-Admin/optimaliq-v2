"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tool_integration"] === "string" &&
    answers["tool_integration"].trim().length > 0 &&

    typeof answers["metrics_review"] === "string" &&
    answers["metrics_review"].trim().length > 0 &&

    typeof answers["standardization"] === "string" &&
    answers["standardization"].trim().length > 0
  );
}




type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: tool_integration */}
      <MultipleChoiceQuestion
  question="Do your business processes integrate directly with the tools your teams use (e.g. CRM, project management, help desk)?"
  options={[
    { value: "No", label: "No, they’re tracked separately" },
    { value: "Some processes", label: "Some processes integrate with tools" },
    { value: "Most processes", label: "Most processes live inside the tools" },
    { value: "Yes", label: "Yes — fully integrated workflows" },
  ]}
  value={getStringAnswer(answers["tool_integration"])}
  onChange={(val) => onAnswer("tool_integration", val)}
/>




     {/* Question 2: metrics_review */}
<MultipleChoiceQuestion
  question="How often are process performance metrics (like time, cost, error rate) discussed at a leadership or team level?"
  options={[
    { value: "Never", label: "Rarely or never" },
    { value: "Quarterly", label: "Quarterly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly or in real-time" },
  ]}
  value={getStringAnswer(answers["metrics_review"])}
  onChange={(val) => onAnswer("metrics_review", val)}
/>


      {/* Question 3: standardization */}
      <MultipleChoiceQuestion
  question="Are your documented workflows consistent in format and structure across different teams or departments?"
  options={[
    { value: "No", label: "No — every team documents differently" },
    { value: "Some consistency", label: "Some consistency, but not standardized" },
    { value: "Mostly standardized", label: "Mostly standardized" },
    { value: "Fully standardized and enforced", label: "Fully standardized and enforced" },
  ]}
  value={getStringAnswer(answers["standardization"])}
  onChange={(val) => onAnswer("standardization", val)}
/>
    </div>
  );
}
