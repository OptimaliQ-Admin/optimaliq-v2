"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_retention_focus"] === "string" &&
    typeof answers["loyalty_initiatives"] === "string" &&
    typeof answers["cx_success_definition"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: customer_retention_focus */}
      <MultipleChoiceQuestion
        question="How much of your strategy is focused on customer retention?"
        options={[
          { value: "none", label: "None — mostly focused on new acquisition" },
          { value: "basic_efforts", label: "Some — we do occasional retention campaigns" },
          { value: "consistent", label: "Consistent retention efforts exist" },
          { value: "strategic_priority", label: "Retention is a strategic priority with clear KPIs" },
        ]}
        value={getStringAnswer(answers["customer_retention_focus"])}
        onChange={(val) => onAnswer("customer_retention_focus", val)}
      />

      {/* Question 9: loyalty_initiatives */}
      <MultipleChoiceQuestion
        question="Do you have any programs or initiatives to drive customer loyalty?"
        options={[
          { value: "no_programs", label: "No — not currently" },
          { value: "basic_discounts", label: "Yes — basic discounts or rewards" },
          { value: "tiered_programs", label: "Yes — we have a tiered or gamified program" },
          { value: "fully_integrated", label: "Yes — loyalty is deeply integrated with the brand" },
        ]}
        value={getStringAnswer(answers["loyalty_initiatives"])}
        onChange={(val) => onAnswer("loyalty_initiatives", val)}
      />

      {/* Question 10: cx_success_definition */}
      <MultipleChoiceQuestion
        question="How do you define success in your customer experience efforts?"
        options={[
          { value: "undefined", label: "It’s not clearly defined" },
          { value: "general_sentiment", label: "Based on general satisfaction or gut feel" },
          { value: "survey_scores", label: "Driven by NPS or CSAT scores" },
          { value: "kpi_driven", label: "Clearly defined KPIs aligned to growth and retention" },
        ]}
        value={getStringAnswer(answers["cx_success_definition"])}
        onChange={(val) => onAnswer("cx_success_definition", val)}
      />
    </div>
  );
}
