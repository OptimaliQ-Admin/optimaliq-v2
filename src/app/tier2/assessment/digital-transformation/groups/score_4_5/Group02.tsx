"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["data_strategy"] === "string" &&
    typeof answers["ai_initiatives"] === "string" &&
    typeof answers["change_enablement"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How would you describe your data and analytics strategy?"
        options={[
          { value: "no_strategy", label: "We have no real strategy" },
          { value: "operational_metrics", label: "We track basic KPIs and operational metrics" },
          { value: "integrated_reporting", label: "We use integrated dashboards across functions" },
          { value: "real_time_insights", label: "We use real-time, predictive insights for decision-making" }
        ]}
        value={answers["data_strategy"] || ""}
        onChange={(val) => onAnswer("data_strategy", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="Which best describes your use of AI or ML in your business today?"
        options={[
          { value: "not_using", label: "We’re not using it" },
          { value: "basic_experiments", label: "We’re experimenting with basic use cases" },
          { value: "integrated_in_workflows", label: "It’s integrated into a few workflows" },
          { value: "core_to_strategy", label: "It’s a core part of our competitive advantage" }
        ]}
        value={answers["ai_initiatives"] || ""}
        onChange={(val) => onAnswer("ai_initiatives", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How do you enable change management for digital initiatives?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — depends on who is leading the change" },
          { value: "basic_training", label: "We do basic communications and training" },
          { value: "formal_process", label: "We have a formal process for onboarding new tools" },
          { value: "integrated_program", label: "We run integrated change enablement programs tied to business impact" }
        ]}
        value={answers["change_enablement"] || ""}
        onChange={(val) => onAnswer("change_enablement", val)}
      />
    </div>
  );
}
