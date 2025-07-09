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
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Unresolved Issue */}
      <EnhancedTextAreaQuestion
        question="What's one thing you know you need to fix—but haven't yet?"
        description="Be honest. What's been nagging at you that keeps getting deprioritized? This helps us identify immediate opportunities."
        placeholder="Example: We know our onboarding process is hurting retention, but haven't made time to redesign it. Or: Our pricing strategy needs work but we keep putting it off..."
        value={getStringAnswer(answers["unresolved_issue"])}
        onChange={(val) => onAnswer("unresolved_issue", val)}
        maxLength={400}
        rows={4}
      />

      {/* Question 2: Final Confirmation */}
      <EnhancedMultipleChoiceQuestion
        question="Are You Ready to Commit?"
        description="Ready to level up? This path is built for ambitious businesses willing to do the work. Are you in?"
        options={[
          { 
            value: "yes_ready", 
            label: "✅ Yes — I'm ready to grow.", 
            description: "I'm committed to implementing the strategies and insights from this assessment" 
          },
          { 
            value: "no_not_ready", 
            label: "❌ No — not at this time.", 
            description: "I need more time to consider or prepare for this commitment" 
          },
        ]}
        value={getStringAnswer(answers["final_confirmation"])}
        onChange={(val) => onAnswer("final_confirmation", val)}
        variant="cards"
      />
    </div>
  );
}
