"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_consistency"] === "string" &&
    typeof answers["benchmarking_metrics"] === "string" &&
    typeof answers["competitive_positioning"] === "string" &&
    typeof answers["industry_trends"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: benchmarking_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is your approach to benchmarking performance?"
        options={[
          { value: "no_benchmarking", label: "We don’t do any benchmarking" },
          { value: "ad_hoc", label: "It’s ad hoc or irregular" },
          { value: "some_structure", label: "We have some structure or regularity" },
          { value: "formalized", label: "It’s formalized and repeatable" },
        ]}
        value={answers["benchmarking_consistency"] || ""}
        onChange={(val) => onAnswer("benchmarking_consistency", val)}
      />

      {/* Question 2: benchmarking_metrics */}
      <MultipleChoiceQuestion
        question="Which types of metrics do you use for benchmarking?"
        options={[
          { value: "none", label: "We don’t use metrics for comparison" },
          { value: "vanity", label: "Vanity metrics (e.g. followers, traffic)" },
          { value: "operational", label: "Operational metrics (e.g. revenue, churn, CAC)" },
          { value: "comprehensive", label: "A comprehensive mix aligned to strategy" },
        ]}
        value={answers["benchmarking_metrics"] || ""}
        onChange={(val) => onAnswer("benchmarking_metrics", val)}
      />

      {/* Question 3: competitive_positioning */}
      <MultipleChoiceQuestion
        question="How well do you understand your competitive positioning?"
        options={[
          { value: "no_clue", label: "Not really — it’s a guess" },
          { value: "somewhat", label: "Somewhat — we have basic ideas" },
          { value: "moderately", label: "Moderately — we have data but don’t act on it" },
          { value: "clearly_defined", label: "Clearly — it informs our GTM and messaging" },
        ]}
        value={answers["competitive_positioning"] || ""}
        onChange={(val) => onAnswer("competitive_positioning", val)}
      />

      {/* Question 4: industry_trends */}
      <MultipleChoiceQuestion
        question="How often do you review market or industry trends?"
        options={[
          { value: "never", label: "Never" },
          { value: "occasionally", label: "Occasionally — when something big happens" },
          { value: "monthly", label: "Monthly or during planning" },
          { value: "real_time", label: "Continuously — we stay informed weekly" },
        ]}
        value={answers["industry_trends"] || ""}
        onChange={(val) => onAnswer("industry_trends", val)}
      />
    </div>
  );
}
