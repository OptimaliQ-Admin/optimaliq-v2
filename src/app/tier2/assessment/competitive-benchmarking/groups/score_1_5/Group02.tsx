"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_activity"] === "string" &&
    typeof answers["value_proposition_clarity"] === "string" &&
    typeof answers["customer_feedback_frequency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: benchmarking_activity */}
      <MultipleChoiceQuestion
        question="Do you benchmark your business against competitors?"
        options={[
          { value: "never", label: "Never — we don’t think about it" },
          { value: "informal", label: "Occasionally — mostly informal comparisons" },
          { value: "structured", label: "Yes — we do some structured comparisons" },
          { value: "regular", label: "Yes — it’s a regular part of our planning" },
        ]}
        value={answers["benchmarking_activity"] || ""}
        onChange={(val) => onAnswer("benchmarking_activity", val)}
      />

      {/* Question 5: value_proposition_clarity */}
      <MultipleChoiceQuestion
        question="How clear is your value proposition compared to competitors?"
        options={[
          { value: "not_clear", label: "Not clear — we’re not sure what makes us different" },
          { value: "somewhat_clear", label: "Somewhat clear — we have some messaging" },
          { value: "clear", label: "Clear — we highlight key differentiators" },
          { value: "very_clear", label: "Very clear — it’s a major part of our brand strategy" },
        ]}
        value={answers["value_proposition_clarity"] || ""}
        onChange={(val) => onAnswer("value_proposition_clarity", val)}
      />

      {/* Question 6: customer_feedback_frequency */}
      <MultipleChoiceQuestion
        question="How often do you gather and review customer feedback to refine your position?"
        options={[
          { value: "never", label: "Never" },
          { value: "occasionally", label: "Occasionally — a few times a year" },
          { value: "regularly", label: "Regularly — at least quarterly" },
          { value: "ongoing", label: "Ongoing — feedback is built into our process" },
        ]}
        value={answers["customer_feedback_frequency"] || ""}
        onChange={(val) => onAnswer("customer_feedback_frequency", val)}
      />
    </div>
  );
}
