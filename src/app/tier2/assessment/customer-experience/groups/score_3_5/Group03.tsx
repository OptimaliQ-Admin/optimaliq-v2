"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["integration_quality"] === "string" &&
    typeof answers["execution_speed"] === "string" &&
    typeof answers["platform_strategy"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How well integrated are your digital systems and platforms?"
        options={[
          { value: "manual", label: "We copy/paste or manually move data" },
          { value: "some_automation", label: "Some automation or point integrations exist" },
          { value: "moderate_sync", label: "Most tools sync regularly with shared data" },
          { value: "full_integration", label: "Systems are unified with strong data governance" }
        ]}
        value={answers["integration_quality"] || ""}
        onChange={(val) => onAnswer("integration_quality", val)}
      />

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How quickly can you launch, update, or scale digital initiatives?"
        options={[
          { value: "months", label: "It takes months due to dependencies and bottlenecks" },
          { value: "weeks", label: "Weeks — we can move with some agility" },
          { value: "sprint_based", label: "Initiatives run in defined sprints or project plans" },
          { value: "continuous", label: "We operate in a continuous delivery model" }
        ]}
        value={answers["execution_speed"] || ""}
        onChange={(val) => onAnswer("execution_speed", val)}
      />

      {/* Question 9 */}
      <TextAreaQuestion
        question="What’s one thing that would make your digital platform or tech stack more scalable or future-ready?"
        placeholder="e.g., More modular systems, less legacy..."
        value={answers["platform_strategy"] || ""}
        onChange={(val) => onAnswer("platform_strategy", val)}
        maxLength={400}
      />

    </div>
  );
}
