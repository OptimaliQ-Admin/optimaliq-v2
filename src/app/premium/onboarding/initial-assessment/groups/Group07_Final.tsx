//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group07_Final.tsx
"use client";

import React from "react";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isGroup07Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["unresolved_issue"] === "string" &&
    answers["unresolved_issue"].trim().length > 0 &&

    typeof answers["final_confirmation"] === "string" &&
    answers["final_confirmation"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group07_Final({ answers, onAnswer }: Props) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Question 19: Unresolved Issue */}
      <EnhancedTextAreaQuestion
        question="What&apos;s one thing you know you need to fix—but haven&apos;t yet?"
        description="Be honest. What&apos;s been nagging at you that keeps getting deprioritized?"
        placeholder="Example: We know our onboarding process is hurting retention, but haven&apos;t made time to redesign it."
        value={getStringAnswer(answers["unresolved_issue"])}
        onChange={(val) => onAnswer("unresolved_issue", val)}
        maxLength={300}
        rows={4}
      />

      {/* Question 20: Final Confirmation */}
      <EnhancedMultipleChoiceQuestion
        question="Are You Ready to Commit?"
        description="Ready to level up? This path is built for ambitious businesses willing to do the work. Are you in?"
        options={[
          { value: "yes_ready", label: "✅ Yes — I&apos;m ready to grow.", description: "I&apos;m committed to taking action and growing my business." },
          { value: "no_not_ready", label: "❌ No — not at this time.", description: "I&apos;m not ready to commit right now." },
        ]}
        value={getStringAnswer(answers["final_confirmation"])}
        onChange={(val) => onAnswer("final_confirmation", val)}
        variant="cards"
      />
    </div>
  );
}
