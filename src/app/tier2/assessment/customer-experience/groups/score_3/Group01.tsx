"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["alignment"] === "string" &&
    typeof answers["enablement"] === "string" &&
    Array.isArray(answers["departments"]) && answers["departments"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 1: alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your digital transformation roadmap with overall business goals?"
        options={[
          { value: "lightly_aligned", label: "Lightly aligned — priorities are set separately" },
          { value: "somewhat_aligned", label: "Somewhat aligned — leadership syncs occasionally" },
          { value: "mostly_aligned", label: "Mostly aligned — reviewed together in planning" },
          { value: "fully_aligned", label: "Fully aligned — roadmap is integral to company goals" },
        ]}
        value={answers["alignment"] || ""}
        onChange={(val) => onAnswer("alignment", val)}
      />

      {/* Question 2: enablement */}
      <MultipleChoiceQuestion
        question="How do you ensure new digital tools are successfully adopted by the team?"
        options={[
          { value: "self_learn", label: "We give access and let teams self-learn" },
          { value: "minimal_training", label: "We provide minimal training or onboarding" },
          { value: "structured_onboarding", label: "We offer structured onboarding and support" },
          { value: "change_management", label: "We use change management frameworks" },
        ]}
        value={answers["enablement"] || ""}
        onChange={(val) => onAnswer("enablement", val)}
      />

      {/* Question 3: departments */}
      <MultiSelectQuestion
        question="Which departments are most involved in shaping your digital roadmap?"
        options={[
          { value: "marketing", label: "Marketing or sales" },
          { value: "operations", label: "Operations or logistics" },
          { value: "finance", label: "Finance or accounting" },
          { value: "product_it", label: "Product or IT" },
        ]}
        selected={answers["departments"] || []}
        onChange={(val) => onAnswer("departments", val)}
        maxSelect={4}
      />
    </div>
  );
}
