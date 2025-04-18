"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["platform_architecture"] === "string" &&
    typeof answers["integration_management"] === "string" &&
    typeof answers["governance_model"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="Which best describes your current digital platform architecture?"
        options={[
          { value: "standalone", label: "Standalone systems or manual tools" },
          { value: "partially_connected", label: "Some connected systems, but data is fragmented" },
          { value: "integrated_platforms", label: "Most tools are connected via APIs or automation" },
          { value: "modular_flexible", label: "Modular, API-first platform that supports fast integration and flexibility" }
        ]}
        value={answers["platform_architecture"] || ""}
        onChange={(val) => onAnswer("platform_architecture", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How do you manage integrations and dependencies across systems?"
        options={[
          { value: "not_managed", label: "They’re not really managed" },
          { value: "manual_updates", label: "We handle updates manually as issues come up" },
          { value: "coordination_team", label: "We coordinate system updates via IT or RevOps" },
          { value: "central_framework", label: "We have a central integration strategy and frameworks in place" }
        ]}
        value={answers["integration_management"] || ""}
        onChange={(val) => onAnswer("integration_management", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="Which best describes your governance model for digital platforms?"
        options={[
          { value: "no_governance", label: "We don’t really have governance processes" },
          { value: "basic_access_controls", label: "Basic access controls and admin rules" },
          { value: "shared_responsibility", label: "Shared ownership between business and tech teams" },
          { value: "mature_governance", label: "Clear roles, rules, and enforcement for all tools and data" }
        ]}
        value={answers["governance_model"] || ""}
        onChange={(val) => onAnswer("governance_model", val)}
      />
    </div>
  );
}
