"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["win_loss_insight_cadence"] === "string" &&
    answers["win_loss_insight_cadence"].trim().length > 0 &&
    typeof answers["future_gtm_capability"] === "string" &&
    answers["future_gtm_capability"].trim().length > 0 &&
    typeof answers["sales_capacity_clarity"] === "string" &&
    answers["sales_capacity_clarity"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: win_loss_insight_cadence */}
      <MultipleChoiceQuestion
        question="How regularly are win/loss insights shared across the business?"
        options={[
          { value: "rarely", label: "Rarely" },
          { value: "occasional_retros", label: "Occasionally in retros" },
          { value: "monthly_review", label: "Monthly review across sales + product" },
          { value: "integrated_loop", label: "Integrated into a closed-loop feedback process" },
        ]}
        value={answers["win_loss_insight_cadence"] || ""}
        onChange={(val) => onAnswer("win_loss_insight_cadence", val)}
      />

      {/* Question 9: future_gtm_capability */}
      <TextAreaQuestion
        question="What’s one future GTM capability you’re planning to invest in?"
        placeholder="E.g., self-serve funnel, ABM, vertical specialization, etc."
        value={answers["future_gtm_capability"] || ""}
        onChange={(val) => onAnswer("future_gtm_capability", val)}
        maxLength={300}
      />

      {/* Question 10: sales_capacity_clarity */}
      <MultipleChoiceQuestion
        question="How well do you understand your sales org’s capacity and workload?"
        options={[
          { value: "no_clarity", label: "We don’t really have one" },
          { value: "rough_estimates", label: "We use rough headcount + quota math" },
          { value: "segment_level_modeling", label: "We model it by segment or rep cohort" },
          { value: "fully_modeled_capacity", label: "Fully modeled capacity and coverage plans" },
        ]}
        value={answers["sales_capacity_clarity"] || ""}
        onChange={(val) => onAnswer("sales_capacity_clarity", val)}
      />
    </div>
  );
}
