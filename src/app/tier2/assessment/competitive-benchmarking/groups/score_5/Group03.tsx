"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["insight_frequency"] === "string" &&
    typeof answers["future_trends"] === "string" &&
    typeof answers["competitive_edge"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: insight_frequency */}
      <MultipleChoiceQuestion
        question="How often are competitive or benchmark insights refreshed or updated?"
        options={[
          { value: "rarely_updated", label: "Rarely or only when requested" },
          { value: "quarterly", label: "Quarterly or during planning cycles" },
          { value: "monthly", label: "Monthly" },
          { value: "real_time", label: "Continuously updated or real-time feeds" },
        ]}
        value={answers["insight_frequency"] || ""}
        onChange={(val) => onAnswer("insight_frequency", val)}
      />

      {/* Question 9: future_trends */}
      <MultipleChoiceQuestion
        question="Do you use benchmarking to anticipate future shifts or market trends?"
        options={[
          { value: "no_forward_use", label: "No — mostly reactive insights" },
          { value: "basic_signals", label: "Sometimes — we use basic signals" },
          { value: "regular_trend_analysis", label: "Yes — we analyze trends and adjust quarterly" },
          { value: "proactive_shift_planning", label: "Yes — trend signals inform major initiatives" },
        ]}
        value={answers["future_trends"] || ""}
        onChange={(val) => onAnswer("future_trends", val)}
      />

      {/* Question 10: competitive_edge */}
      <TextAreaQuestion
        question="What’s one way your company uses benchmarking to drive a competitive edge?"
        placeholder="E.g., adjusting pricing, redefining category messaging, etc."
        value={answers["competitive_edge"] || ""}
        onChange={(val) => onAnswer("competitive_edge", val)}
        maxLength={300}
      />
    </div>
  );
}
