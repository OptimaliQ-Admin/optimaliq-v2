"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategic_review_frequency"] === "string" &&
    typeof answers["decision_framework_usage"] === "string" &&
    typeof answers["team_objectives_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: strategic_review_frequency */}
      <MultipleChoiceQuestion
        question="How often does your leadership team formally review business strategy?"
        options={[
          { value: "rarely", label: "Rarely — we revisit only during crises" },
          { value: "annually", label: "Annually during planning cycles" },
          { value: "semi_annually", label: "Semi-annually or quarterly" },
          { value: "frequently", label: "Frequently — we continuously adapt" },
        ]}
        value={answers["strategic_review_frequency"] || ""}
        onChange={(val) => onAnswer("strategic_review_frequency", val)}
      />

      {/* Question 2: decision_framework_usage */}
      <MultipleChoiceQuestion
        question="To what extent do you use a decision-making framework to prioritize initiatives?"
        options={[
          { value: "none", label: "We don’t use any frameworks" },
          { value: "basic", label: "We use simple criteria like effort vs. impact" },
          { value: "consistent", label: "We use a consistent scoring system or playbook" },
          { value: "robust", label: "We use robust frameworks tied to business goals" },
        ]}
        value={answers["decision_framework_usage"] || ""}
        onChange={(val) => onAnswer("decision_framework_usage", val)}
      />

      {/* Question 3: team_objectives_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your team’s objectives with your broader business strategy?"
        options={[
          { value: "not_aligned", label: "They’re mostly independent" },
          { value: "loosely_aligned", label: "Some teams are aligned" },
          { value: "mostly_aligned", label: "Most team goals map to strategy" },
          { value: "fully_aligned", label: "Every team’s goals are fully aligned" },
        ]}
        value={answers["team_objectives_alignment"] || ""}
        onChange={(val) => onAnswer("team_objectives_alignment", val)}
      />
    </div>
  );
}
