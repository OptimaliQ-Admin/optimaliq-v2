"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["tech_stack_alignment"] === "string" &&
    typeof answers["organization_rhythm"] === "string" &&
    typeof answers["adoption_monitoring"] === "string" &&
    typeof answers["most_valuable_tool"] === "string" &&
    answers["most_valuable_tool"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 7: tech_stack_alignment */}
      <MultipleChoiceQuestion
        question="How well does your current tech stack support your transformation goals?"
        options={[
          { value: "not_aligned", label: "Not aligned — we’re using legacy or fragmented tools" },
          { value: "somewhat", label: "Somewhat aligned — a few key platforms are connected" },
          { value: "mostly", label: "Mostly aligned — our core platforms are integrated" },
          { value: "fully_aligned", label: "Fully aligned — designed to support our transformation" },
        ]}
        value={answers["tech_stack_alignment"] || ""}
        onChange={(val) => onAnswer("tech_stack_alignment", val)}
      />

      {/* Question 8: organization_rhythm */}
      <MultipleChoiceQuestion
        question="What best describes your company’s digital operating rhythm?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — digital work happens as needed" },
          { value: "project_based", label: "Project-based — limited to certain teams" },
          { value: "cross_functional", label: "Cross-functional — consistent but not company-wide" },
          { value: "institutionalized", label: "Institutionalized — built into how we operate" },
        ]}
        value={answers["organization_rhythm"] || ""}
        onChange={(val) => onAnswer("organization_rhythm", val)}
      />

      {/* Question 9: adoption_monitoring */}
      <MultipleChoiceQuestion
        question="How do you monitor whether employees adopt and use new digital tools?"
        options={[
          { value: "we_dont", label: "We don’t track adoption" },
          { value: "manual_feedback", label: "We gather feedback informally" },
          { value: "usage_reports", label: "We use usage reports or dashboards" },
          { value: "training_metrics", label: "We track adoption and provide training/metrics" },
        ]}
        value={answers["adoption_monitoring"] || ""}
        onChange={(val) => onAnswer("adoption_monitoring", val)}
      />

      {/* Question 10: most_valuable_tool */}
      <TextAreaQuestion
        question="Which tool or platform currently provides the most value to your digital transformation efforts?"
        placeholder="E.g., Salesforce, Shopify, Power BI, etc."
        value={answers["most_valuable_tool"] || ""}
        onChange={(val) => onAnswer("most_valuable_tool", val)}
        maxLength={300}
      />
    </div>
  );
}
