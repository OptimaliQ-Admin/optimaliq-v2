"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_0Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["system_documentation"] === "string" &&
    typeof answers["data_redundancy"] === "string" &&
    typeof answers["integration_maturity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: system_documentation */}
      <MultipleChoiceQuestion
        question="Do you have documentation or training for how systems should be used?"
        options={[
          { value: "no_docs", label: "No — people figure it out as they go" },
          { value: "basic_docs", label: "Some basic guides or internal wikis exist" },
          { value: "structured_docs", label: "We maintain structured documentation for key tools" },
          { value: "full_training", label: "Yes — we have full onboarding and training resources" },
        ]}
        value={answers["system_documentation"] || ""}
        onChange={(val) => onAnswer("system_documentation", val)}
      />

      {/* Question 9: data_redundancy */}
      <MultipleChoiceQuestion
        question="Do you have duplicate data living in multiple systems?"
        options={[
          { value: "yes_duplicate", label: "Yes — it’s a major issue" },
          { value: "some_overlap", label: "Some overlap, but we manage it" },
          { value: "mostly_clean", label: "Mostly clean — only a few instances" },
          { value: "single_source", label: "No — we maintain a single source of truth" },
        ]}
        value={answers["data_redundancy"] || ""}
        onChange={(val) => onAnswer("data_redundancy", val)}
      />

      {/* Question 10: integration_maturity */}
      <MultipleChoiceQuestion
        question="How would you describe your current integration strategy?"
        options={[
          { value: "no_integrations", label: "No integrations in place" },
          { value: "manual_workarounds", label: "Manual workarounds or exports/imports" },
          { value: "some_integrations", label: "Some tools are connected with middleware or APIs" },
          { value: "fully_integrated", label: "Fully integrated with real-time data flow" },
        ]}
        value={answers["integration_maturity"] || ""}
        onChange={(val) => onAnswer("integration_maturity", val)}
      />
    </div>
  );
}
