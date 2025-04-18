"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["platform_ownership"] === "string" &&
    typeof answers["change_tracking"] === "string" &&
    typeof answers["workflow_efficiency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="Who owns or governs your core technology stack?"
        options={[
          { value: "individual_departments", label: "Each department manages its own tools" },
          { value: "central_ops", label: "We have a centralized ops or IT team for core systems" },
          { value: "cross_team", label: "It’s shared between operations, IT, and business teams" },
          { value: "co_governance", label: "We follow a co-governance model with clear decision rights" }
        ]}
        value={answers["platform_ownership"] || ""}
        onChange={(val) => onAnswer("platform_ownership", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How do you track changes or improvements made to your digital infrastructure?"
        options={[
          { value: "no_tracking", label: "We don’t track this formally" },
          { value: "informal_notes", label: "It’s captured in tickets or internal notes" },
          { value: "versioned", label: "We use versioning or release logs" },
          { value: "audit_ready", label: "Changes are tracked with full documentation and auditability" }
        ]}
        value={answers["change_tracking"] || ""}
        onChange={(val) => onAnswer("change_tracking", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How well do your current systems support streamlined, automated workflows?"
        options={[
          { value: "disconnected", label: "They’re mostly disconnected or manual" },
          { value: "partially_automated", label: "Some key workflows are automated" },
          { value: "coordinated", label: "Workflows are automated and coordinated across platforms" },
          { value: "continuously_improving", label: "We continuously optimize workflows with automation and analytics" }
        ]}
        value={answers["workflow_efficiency"] || ""}
        onChange={(val) => onAnswer("workflow_efficiency", val)}
      />

    </div>
  );
}
