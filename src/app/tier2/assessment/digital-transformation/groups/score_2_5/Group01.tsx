"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["dx_definition"] === "string" &&
    typeof answers["dx_urgency"] === "string" &&
    typeof answers["system_sync"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: dx_definition */}
      <MultipleChoiceQuestion
        question="How clearly is 'digital transformation' defined in your business?"
        options={[
          { value: "no_definition", label: "It’s not clearly defined or discussed" },
          { value: "vague", label: "We’ve discussed it, but it’s still vague" },
          { value: "some_definition", label: "There’s a working definition in place" },
          { value: "clear_definition", label: "It’s clearly defined and used to guide decisions" },
        ]}
        value={answers["dx_definition"] || ""}
        onChange={(val) => onAnswer("dx_definition", val)}
      />

      {/* Question 2: dx_urgency */}
      <MultipleChoiceQuestion
        question="How urgent is digital transformation viewed across the organization?"
        options={[
          { value: "not_urgent", label: "Not very — it's not a priority right now" },
          { value: "somewhat_urgent", label: "Somewhat — we're watching the market" },
          { value: "important", label: "Important — it's on our near-term roadmap" },
          { value: "very_urgent", label: "Very — we're actively prioritizing transformation" },
        ]}
        value={answers["dx_urgency"] || ""}
        onChange={(val) => onAnswer("dx_urgency", val)}
      />

      {/* Question 3: system_sync */}
      <MultipleChoiceQuestion
        question="How well do your systems, tools, and platforms work together?"
        options={[
          { value: "disconnected", label: "They are mostly disconnected and siloed" },
          { value: "somewhat_integrated", label: "Some are integrated, but there are major gaps" },
          { value: "mostly_integrated", label: "Most are integrated and sync reliably" },
          { value: "fully_integrated", label: "Everything is connected and flows seamlessly" },
        ]}
        value={answers["system_sync"] || ""}
        onChange={(val) => onAnswer("system_sync", val)}
      />
    </div>
  );
}
