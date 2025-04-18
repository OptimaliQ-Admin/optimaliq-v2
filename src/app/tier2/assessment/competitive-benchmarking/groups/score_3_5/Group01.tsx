"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3_5_3Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmark_frequency"] === "string" &&
    typeof answers["data_accuracy"] === "string" &&
    typeof answers["tracking_kpis"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: benchmark_frequency */}
      <MultipleChoiceQuestion
        question="How often do you benchmark your business performance against competitors or industry standards?"
        options={[
          { value: "never", label: "Never" },
          { value: "rarely", label: "Rarely — only when asked or prompted" },
          { value: "quarterly", label: "Quarterly or during planning" },
          { value: "ongoing", label: "Ongoing — part of regular performance reviews" },
        ]}
        value={answers["benchmark_frequency"] || ""}
        onChange={(val) => onAnswer("benchmark_frequency", val)}
      />

      {/* Question 2: data_accuracy */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy of your benchmark data?"
        options={[
          { value: "not_confident", label: "Not confident — we just guess or rely on assumptions" },
          { value: "somewhat_confident", label: "Somewhat — data is anecdotal or incomplete" },
          { value: "mostly_confident", label: "Mostly — we have solid numbers in key areas" },
          { value: "very_confident", label: "Very — our data is verified and reliable" },
        ]}
        value={answers["data_accuracy"] || ""}
        onChange={(val) => onAnswer("data_accuracy", val)}
      />

      {/* Question 3: tracking_kpis */}
      <MultipleChoiceQuestion
        question="How do you typically track key performance indicators (KPIs) across your business?"
        options={[
          { value: "no_kpis", label: "We don’t actively track KPIs" },
          { value: "basic_tracking", label: "We track some KPIs manually or in spreadsheets" },
          { value: "dashboards", label: "We use dashboards or tools for regular KPI tracking" },
          { value: "kpi_reviews", label: "We review KPIs consistently to inform decisions" },
        ]}
        value={answers["tracking_kpis"] || ""}
        onChange={(val) => onAnswer("tracking_kpis", val)}
      />
    </div>
  );
}
