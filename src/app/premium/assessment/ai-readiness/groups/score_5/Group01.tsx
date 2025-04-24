"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_governance_maturity"] === "string" &&
    typeof answers["ai_scalability"] === "string" &&
    typeof answers["ai_org_design"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_governance_maturity */}
      <MultipleChoiceQuestion
        question="How would you describe the maturity of your AI governance framework?"
        options={[
          { value: "informal", label: "Informal — AI practices vary by team" },
          { value: "basic_guidelines", label: "We have basic guidelines in place" },
          { value: "cross_functional", label: "Cross-functional policies and controls are established" },
          { value: "enterprise_governance", label: "We have enterprise-level governance integrated into strategy" },
        ]}
        value={answers["ai_governance_maturity"] || ""}
        onChange={(val) => onAnswer("ai_governance_maturity", val)}
      />

      {/* Question 2: ai_scalability */}
      <MultipleChoiceQuestion
        question="How scalable is your AI infrastructure across departments or geographies?"
        options={[
          { value: "not_scalable", label: "Not scalable — custom solutions per team" },
          { value: "repeatable_components", label: "We have some repeatable components or patterns" },
          { value: "shared_infrastructure", label: "Shared infrastructure is in place for multiple teams" },
          { value: "fully_scalable", label: "AI is deployed at scale with centralized services and global reach" },
        ]}
        value={answers["ai_scalability"] || ""}
        onChange={(val) => onAnswer("ai_scalability", val)}
      />

      {/* Question 3: ai_org_design */}
      <MultipleChoiceQuestion
        question="How has your organization adapted structurally to support AI adoption?"
        options={[
          { value: "no_structural_change", label: "No structural changes have been made yet" },
          { value: "ai_champions", label: "We’ve identified AI champions across teams" },
          { value: "dedicated_roles", label: "We’ve created dedicated AI roles or teams" },
          { value: "ai_embedded_org", label: "AI is embedded throughout our org design and decision-making" },
        ]}
        value={answers["ai_org_design"] || ""}
        onChange={(val) => onAnswer("ai_org_design", val)}
      />
    </div>
  );
}
