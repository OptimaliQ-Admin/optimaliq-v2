"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["governance_oversight"] === "string" &&
    typeof answers["digital_metrics"] === "string" &&
    typeof answers["visibility_issues"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How is digital oversight and governance handled today?"
        options={[
          { value: "no_consistency", label: "There’s little consistency across teams" },
          { value: "some_reviews", label: "We do ad hoc reviews or initiatives" },
          { value: "steering_committee", label: "A digital steering committee exists" },
          { value: "executive_leadership", label: "Executive leadership has clear ownership" }
        ]}
        value={answers["governance_oversight"] || ""}
        onChange={(val) => onAnswer("governance_oversight", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="What kind of metrics do you use to measure digital progress?"
        options={[
          { value: "lagging", label: "Mostly lagging KPIs (e.g. revenue, traffic)" },
          { value: "tactical", label: "Tactical metrics (e.g. campaigns launched)" },
          { value: "operational", label: "Operational metrics tied to outcomes" },
          { value: "leading", label: "Leading indicators of impact (e.g. time-to-launch, CSAT)" }
        ]}
        value={answers["digital_metrics"] || ""}
        onChange={(val) => onAnswer("digital_metrics", val)}
      />

      {/* Question 6 */}
      <TextAreaQuestion
        question="Where do you feel the biggest digital gaps or visibility challenges exist?"
        placeholder="e.g., We don’t know how certain tools are performing..."
        value={answers["visibility_issues"] || ""}
        onChange={(val) => onAnswer("visibility_issues", val)}
        maxLength={400}
      />

    </div>
  );
}
