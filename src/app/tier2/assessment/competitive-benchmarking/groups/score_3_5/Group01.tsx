"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategic_market_data"] === "string" &&
    typeof answers["competitive_positioning_review"] === "string" &&
    typeof answers["pricing_insights_quality"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: strategic_market_data */}
      <MultipleChoiceQuestion
        question="How would you rate the strategic value of the market data your team receives?"
        options={[
          { value: "infrequent_and_basic", label: "Infrequent and basic" },
          { value: "useful_but_not_actionable", label: "Useful but not always actionable" },
          { value: "detailed_and_timely", label: "Detailed and mostly timely" },
          { value: "real_time_and_targeted", label: "Real-time and targeted to strategy" },
        ]}
        value={answers["strategic_market_data"] || ""}
        onChange={(val) => onAnswer("strategic_market_data", val)}
      />

      {/* Question 2: competitive_positioning_review */}
      <MultipleChoiceQuestion
        question="How often do you review your competitive positioning or unique value proposition?"
        options={[
          { value: "rarely", label: "Rarely or only during big planning cycles" },
          { value: "once_per_year", label: "Once per year or less" },
          { value: "multiple_times_per_year", label: "Multiple times per year" },
          { value: "integrated_into_strategy", label: "It’s integrated into ongoing strategy work" },
        ]}
        value={answers["competitive_positioning_review"] || ""}
        onChange={(val) => onAnswer("competitive_positioning_review", val)}
      />

      {/* Question 3: pricing_insights_quality */}
      <MultipleChoiceQuestion
        question="How strong is your visibility into competitor pricing or customer willingness to pay?"
        options={[
          { value: "limited", label: "Very limited" },
          { value: "rough_benchmarks", label: "Rough benchmarks only" },
          { value: "backed_by_surveys", label: "Some data from surveys or research" },
          { value: "deep_analysis", label: "Deep, ongoing pricing analysis" },
        ]}
        value={answers["pricing_insights_quality"] || ""}
        onChange={(val) => onAnswer("pricing_insights_quality", val)}
      />
    </div>
  );
}
