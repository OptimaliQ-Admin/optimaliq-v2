"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["tracking_market_share"] === "string" &&
    typeof answers["brand_perception"] === "string" &&
    typeof answers["internal_vs_external_focus"] === "string" &&
    typeof answers["competitive_research_frequency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: tracking_market_share */}
      <MultipleChoiceQuestion
        question="Do you actively track your market share or position?"
        options={[
          { value: "no_tracking", label: "No — we don’t track it" },
          { value: "rough_estimate", label: "We have a rough estimate" },
          { value: "regular_updates", label: "We review it occasionally" },
          { value: "precise_monitoring", label: "Yes — we track it with specific data sources" },
        ]}
        value={answers["tracking_market_share"] || ""}
        onChange={(val) => onAnswer("tracking_market_share", val)}
      />

      {/* Question 5: brand_perception */}
      <MultipleChoiceQuestion
        question="How do you evaluate brand perception versus competitors?"
        options={[
          { value: "no_feedback", label: "We don’t gather this feedback" },
          { value: "informal_feedback", label: "We rely on informal customer comments" },
          { value: "surveys_reviews", label: "We use surveys or reviews occasionally" },
          { value: "systematic_analysis", label: "We use surveys, sentiment analysis, and regular feedback" },
        ]}
        value={answers["brand_perception"] || ""}
        onChange={(val) => onAnswer("brand_perception", val)}
      />

      {/* Question 6: internal_vs_external_focus */}
      <MultipleChoiceQuestion
        question="How balanced is your internal improvement vs. external benchmarking?"
        options={[
          { value: "internal_only", label: "We mostly focus internally" },
          { value: "some_comparison", label: "We sometimes compare to competitors" },
          { value: "even_balance", label: "We try to balance both" },
          { value: "benchmark_driven", label: "Benchmarking drives much of our improvement" },
        ]}
        value={answers["internal_vs_external_focus"] || ""}
        onChange={(val) => onAnswer("internal_vs_external_focus", val)}
      />

      {/* Question 7: competitive_research_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you conduct competitive research?"
        options={[
          { value: "rarely", label: "Rarely — only when prompted by changes" },
          { value: "quarterly", label: "Quarterly or during planning cycles" },
          { value: "monthly", label: "Monthly or regularly updated" },
          { value: "real_time", label: "Continuously monitored with real-time tools" },
        ]}
        value={answers["competitive_research_frequency"] || ""}
        onChange={(val) => onAnswer("competitive_research_frequency", val)}
      />
    </div>
  );
}
