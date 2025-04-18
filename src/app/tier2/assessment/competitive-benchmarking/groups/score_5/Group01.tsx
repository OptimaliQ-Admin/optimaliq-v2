"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitive_usage"] === "string" &&
    Array.isArray(answers["benchmark_targets"]) &&
    typeof answers["refresh_frequency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  const selected = answers["benchmark_targets"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: competitive_usage */}
      <MultipleChoiceQuestion
        question="How does your organization use competitive intelligence today?"
        options={[
          { value: "dont_use", label: "We don’t use it proactively" },
          { value: "share_articles", label: "We share articles and competitor updates internally" },
          { value: "reference_in_strategy", label: "We reference it during planning or reviews" },
          { value: "integrated", label: "It’s integrated into GTM, product, or sales decisions" },
        ]}
        value={answers["competitive_usage"] || ""}
        onChange={(val) => onAnswer("competitive_usage", val)}
      />

      {/* Question 2: benchmark_targets */}
      <MultiSelectQuestion
        question="Which of the following do you benchmark against regularly?"
        options={[
          { value: "nps_csat", label: "Customer satisfaction (NPS, CSAT)" },
          { value: "conversion", label: "Conversion or close rates" },
          { value: "cost_per_acquisition", label: "Cost per acquisition" },
          { value: "retention_ltv", label: "Retention or lifetime value" },
          { value: "revenue_per_user", label: "Revenue per user or account" },
        ]}
        selected={selected}
        onChange={(val) => onAnswer("benchmark_targets", val)}
        maxSelect={5}
      />

      {/* Question 3: refresh_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you refresh or revisit your benchmarking data?"
        options={[
          { value: "rarely", label: "Rarely — only when something major changes" },
          { value: "annually", label: "Annually during planning" },
          { value: "quarterly", label: "Quarterly" },
          { value: "monthly", label: "Monthly or more often" },
        ]}
        value={answers["refresh_frequency"] || ""}
        onChange={(val) => onAnswer("refresh_frequency", val)}
      />
    </div>
  );
}
