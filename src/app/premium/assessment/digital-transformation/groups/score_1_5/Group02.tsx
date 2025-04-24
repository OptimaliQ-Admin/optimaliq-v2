"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["team_skill_gap"] === "string" &&
    typeof answers["data_accessibility"] === "string" &&
    typeof answers["integration_quality"] === "string" &&
    typeof answers["data_governance"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: team_skill_gap */}
      <MultipleChoiceQuestion
        question="How would you rate your team’s readiness to work with modern digital tools and processes?"
        options={[
          { value: "not_ready", label: "Not ready — major skill gaps exist" },
          { value: "learning", label: "Learning — we’re upskilling slowly" },
          { value: "mostly_ready", label: "Mostly ready — basic proficiency exists" },
          { value: "fully_capable", label: "Fully capable — we’re confident and capable" },
        ]}
        value={answers["team_skill_gap"] || ""}
        onChange={(val) => onAnswer("team_skill_gap", val)}
      />

      {/* Question 5: data_accessibility */}
      <MultipleChoiceQuestion
        question="How easily can teams access the data they need from your systems?"
        options={[
          { value: "hard_to_access", label: "It’s hard to access or scattered" },
          { value: "somewhat_accessible", label: "Some data is centralized, some isn’t" },
          { value: "mostly_accessible", label: "Most data is accessible with effort" },
          { value: "fully_accessible", label: "Fully accessible via integrated platforms or dashboards" },
        ]}
        value={answers["data_accessibility"] || ""}
        onChange={(val) => onAnswer("data_accessibility", val)}
      />

      {/* Question 6: integration_quality */}
      <MultipleChoiceQuestion
        question="How well do your tools and platforms integrate with each other?"
        options={[
          { value: "no_integration", label: "They don’t — everything is siloed" },
          { value: "basic_integrations", label: "Basic integrations exist, but they break often" },
          { value: "working_well", label: "They mostly work well together" },
          { value: "seamless", label: "Seamlessly integrated with real-time syncing" },
        ]}
        value={answers["integration_quality"] || ""}
        onChange={(val) => onAnswer("integration_quality", val)}
      />

      {/* Question 7: data_governance */}
      <MultipleChoiceQuestion
        question="Do you have clear processes or roles for managing your data (quality, security, access)?"
        options={[
          { value: "no_governance", label: "No — data is unmanaged" },
          { value: "some_process", label: "Some informal processes exist" },
          { value: "documented_roles", label: "We have documented roles and rules" },
          { value: "formal_governance", label: "Yes — full governance model in place" },
        ]}
        value={answers["data_governance"] || ""}
        onChange={(val) => onAnswer("data_governance", val)}
      />
    </div>
  );
}
