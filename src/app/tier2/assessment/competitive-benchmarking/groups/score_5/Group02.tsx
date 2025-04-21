"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5_0Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_regular_reporting"] === "string" &&
    typeof answers["benchmarking_insights_action"] === "string" &&
    typeof answers["competitive_tooling"] === "string" &&
    typeof answers["competitive_trend_tracking"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: benchmarking_regular_reporting */}
      <MultipleChoiceQuestion
        question="How frequently do you share benchmarking insights across the company?"
        options={[
          { value: "rarely", label: "Rarely or never" },
          { value: "quarterly", label: "Quarterly or in planning cycles" },
          { value: "monthly", label: "Monthly or tied to KPIs" },
          { value: "real_time", label: "Real-time dashboards and executive summaries" },
        ]}
        value={answers["benchmarking_regular_reporting"] || ""}
        onChange={(val) => onAnswer("benchmarking_regular_reporting", val)}
      />

      {/* Question 5: benchmarking_insights_action */}
      <MultipleChoiceQuestion
        question="How often do benchmarking insights drive changes in your offerings, campaigns, or strategy?"
        options={[
          { value: "not_much", label: "Not much — mostly informative" },
          { value: "sometimes", label: "Sometimes we act on them" },
          { value: "often", label: "Often — they lead to adjustments" },
          { value: "always", label: "Always — they shape our go-to-market motion" },
        ]}
        value={answers["benchmarking_insights_action"] || ""}
        onChange={(val) => onAnswer("benchmarking_insights_action", val)}
      />

      {/* Question 6: competitive_tooling */}
      <MultipleChoiceQuestion
        question="Which best describes your use of tools to support competitive benchmarking?"
        options={[
          { value: "manual", label: "Mostly manual or ad hoc research" },
          { value: "some_tools", label: "Some competitive tools or analyst reports" },
          { value: "platforms", label: "Dedicated platforms with dashboards" },
          { value: "integrated", label: "Fully integrated into BI and planning tools" },
        ]}
        value={answers["competitive_tooling"] || ""}
        onChange={(val) => onAnswer("competitive_tooling", val)}
      />

      {/* Question 7: competitive_trend_tracking */}
      <MultipleChoiceQuestion
        question="How do you track competitor moves or market shifts?"
        options={[
          { value: "not_tracked", label: "We don’t track them systematically" },
          { value: "ad_hoc", label: "Ad hoc monitoring by individuals" },
          { value: "weekly_review", label: "Weekly or monthly review process" },
          { value: "real_time_signals", label: "Real-time signal tracking and alerts" },
        ]}
        value={answers["competitive_trend_tracking"] || ""}
        onChange={(val) => onAnswer("competitive_trend_tracking", val)}
      />
    </div>
  );
}
