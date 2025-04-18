"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["forecast_accuracy_team"] === "string" &&
    answers["forecast_accuracy_team"].trim().length > 0 &&
    typeof answers["enablement_delivery"] === "string" &&
    answers["enablement_delivery"].trim().length > 0 &&
    Array.isArray(answers["embedded_metrics"]) &&
    answers["embedded_metrics"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  const selectedMetrics = answers["embedded_metrics"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: forecast_accuracy_team */}
      <MultipleChoiceQuestion
        question="How do you measure forecast accuracy across teams or segments?"
        options={[
          { value: "no_tracking", label: "We don’t track forecast accuracy" },
          { value: "historical_only", label: "We compare historicals only" },
          { value: "deal_stage_accuracy", label: "We use stage-based or rep-level metrics" },
          { value: "accurate_and_reviewed", label: "We review forecast accuracy weekly with leadership" },
        ]}
        value={answers["forecast_accuracy_team"] || ""}
        onChange={(val) => onAnswer("forecast_accuracy_team", val)}
      />

      {/* Question 2: enablement_delivery */}
      <MultipleChoiceQuestion
        question="How is sales enablement delivered across your org?"
        options={[
          { value: "docs_or_decks", label: "Shared docs or onboarding decks" },
          { value: "occasional_sessions", label: "Occasional live sessions or trainings" },
          { value: "onboarding_and_ongoing", label: "Part of onboarding and ongoing learning" },
          { value: "integrated_enablement", label: "Fully integrated with coaching and CRM guidance" },
        ]}
        value={answers["enablement_delivery"] || ""}
        onChange={(val) => onAnswer("enablement_delivery", val)}
      />

      {/* Question 3: embedded_metrics */}
      <MultiSelectQuestion
        question="Which of the following are built into your sales process and systems?"
        options={[
          { value: "win_loss", label: "Win/loss insights" },
          { value: "stage_conversion", label: "Stage conversion analysis" },
          { value: "rep_benchmarking", label: "Rep benchmarking dashboards" },
          { value: "ai_scoring", label: "AI-powered deal scoring or recommendations" },
          { value: "none", label: "None of these yet" },
        ]}
        selected={selectedMetrics}
        onChange={(val) => onAnswer("embedded_metrics", val)}
        maxSelect={5}
      />
    </div>
  );
}
