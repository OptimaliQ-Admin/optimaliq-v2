"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_alignment"] === "string" &&
    typeof answers["data_interoperability"] === "string" &&
    typeof answers["accessibility"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How aligned are your digital systems and workflows with AI/automation readiness?"
        options={[
          { value: "not_considered", label: "AI/automation hasn’t been considered" },
          { value: "exploring_use_cases", label: "We’re exploring a few use cases" },
          { value: "intentional_design", label: "Processes are being intentionally designed with AI in mind" },
          { value: "ai_native", label: "Workflows are AI-native or deeply integrated" }
        ]}
        value={answers["ai_alignment"] || ""}
        onChange={(val) => onAnswer("ai_alignment", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How well do your tools, systems, and data work together across departments?"
        options={[
          { value: "fragmented", label: "Data is fragmented and stored in silos" },
          { value: "integrated_ops", label: "Some integration between core tools or functions" },
          { value: "unified_layer", label: "We use a unified data layer or central platform" },
          { value: "seamless_visibility", label: "All departments share a real-time view of critical data" }
        ]}
        value={answers["data_interoperability"] || ""}
        onChange={(val) => onAnswer("data_interoperability", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="Can your teams securely access the data, tools, or insights they need from anywhere?"
        options={[
          { value: "mostly_on_prem", label: "Mostly on-premise or physically restricted" },
          { value: "limited_remote", label: "Some cloud-based access but limited control" },
          { value: "secure_cloud", label: "Most tools are accessible with secure cloud-based authentication" },
          { value: "zero_trust", label: "We use zero-trust models and device-agnostic access" }
        ]}
        value={answers["accessibility"] || ""}
        onChange={(val) => onAnswer("accessibility", val)}
      />

    </div>
  );
}
