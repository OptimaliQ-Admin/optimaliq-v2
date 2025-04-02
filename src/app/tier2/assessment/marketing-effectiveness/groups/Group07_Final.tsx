"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";


export function isGroup07Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["unresolved_issue"] === "string" &&
    answers["unresolved_issue"].trim().length > 0 &&

    typeof answers["final_confirmation"] === "string" &&
    answers["final_confirmation"].trim().length > 0
  );
}


type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group07_Final({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 19: Unresolved Issue */}
      <TextAreaQuestion
        question="What’s one thing you know you need to fix—but haven’t yet?"
        description="Be honest. What’s been nagging at you that keeps getting deprioritized?"
        placeholder="Example: We know our onboarding process is hurting retention, but haven’t made time to redesign it."
        value={answers["unresolved_issue"] || ""}
        onChange={(val) => onAnswer("unresolved_issue", val)}
        maxLength={300}
      />

      {/* Question 20: Final Confirmation */}
      <MultipleChoiceQuestion
  question="Are You Ready to Commit?"
  description="Ready to level up? This path is built for ambitious businesses willing to do the work. Are you in?"
  options={[
    { value: "yes_ready", label: "✅ Yes — I’m ready to grow." },
    { value: "no_not_ready", label: "❌ No — not at this time." },
  ]}
  value={answers["final_confirmation"] || ""}
  onChange={(val) => onAnswer("final_confirmation", val)}
/>
    </div>
  );
}
