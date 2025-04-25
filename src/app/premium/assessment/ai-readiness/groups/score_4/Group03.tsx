"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_scalability"] === "string" &&
    typeof answers["data_interoperability"] === "string" &&
    typeof answers["ai_outcomes"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_scalability */}
      <MultipleChoiceQuestion
        question="How scalable are your current AI systems across teams and business units?"
        options={[
          { value: "not_scalable", label: "Not scalable — one-off implementations" },
          { value: "repeatable_use", label: "Some repeatable use, but limited cross-team alignment" },
          { value: "shared_platform", label: "Shared platforms are emerging" },
          { value: "fully_scalable", label: "Fully scalable architecture across org" },
        ]}
        value={getStringAnswer(answers["ai_scalability"])}
        onChange={(val) => onAnswer("ai_scalability", val)}
      />

      {/* Question 9: data_interoperability */}
      <MultipleChoiceQuestion
        question="How interoperable are the data sources feeding your AI systems?"
        options={[
          { value: "not_interoperable", label: "Not interoperable — siloed data sources" },
          { value: "manually_merged", label: "We manually combine some data" },
          { value: "partial_integration", label: "Partially integrated — some automation" },
          { value: "fully_interoperable", label: "Fully interoperable — real-time flow across systems" },
        ]}
        value={getStringAnswer(answers["data_interoperability"])}
        onChange={(val) => onAnswer("data_interoperability", val)}
      />

      {/* Question 10: ai_outcomes */}
      <MultipleChoiceQuestion
        question="How well do you measure the business outcomes of your AI efforts?"
        options={[
          { value: "not_measured", label: "Not measured at all" },
          { value: "anecdotal", label: "Only anecdotal examples" },
          { value: "basic_kpis", label: "Basic KPIs are tracked occasionally" },
          { value: "measured_and_tracked", label: "We measure and report outcomes consistently" },
        ]}
        value={getStringAnswer(answers["ai_outcomes"])}
        onChange={(val) => onAnswer("ai_outcomes", val)}
      />
    </div>
  );
}
