"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5_0Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_leadership_alignment"] === "string" &&
    typeof answers["ai_global_scalability"] === "string" &&
    typeof answers["ai_future_outlook"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_leadership_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your leadership team on the role of AI in your company’s future?"
        options={[
          { value: "not_discussed", label: "It hasn’t really been discussed" },
          { value: "occasional_mentions", label: "It comes up occasionally" },
          { value: "strategic_focus", label: "AI is a key part of our strategic roadmap" },
          { value: "core_foundation", label: "AI is considered foundational to our future success" },
        ]}
        value={answers["ai_leadership_alignment"] || ""}
        onChange={(val) => onAnswer("ai_leadership_alignment", val)}
      />

      {/* Question 9: ai_global_scalability */}
      <MultipleChoiceQuestion
        question="How scalable are your current AI systems across business units or regions?"
        options={[
          { value: "not_scalable", label: "They’re not scalable — very siloed" },
          { value: "partially_replicable", label: "Some systems can be replicated" },
          { value: "scalable_with_effort", label: "They are scalable with some effort" },
          { value: "highly_scalable", label: "Our AI systems are designed to scale enterprise-wide" },
        ]}
        value={answers["ai_global_scalability"] || ""}
        onChange={(val) => onAnswer("ai_global_scalability", val)}
      />

      {/* Question 10: ai_future_outlook */}
      <MultipleChoiceQuestion
        question="How prepared is your company to adapt to emerging AI technologies and use cases?"
        options={[
          { value: "slow_to_adopt", label: "We’re slow to adopt anything new" },
          { value: "wait_and_see", label: "We wait for others to validate new approaches" },
          { value: "proactive", label: "We actively explore and experiment with new AI tools" },
          { value: "pioneer", label: "We aim to be early adopters or pioneers in AI innovation" },
        ]}
        value={answers["ai_future_outlook"] || ""}
        onChange={(val) => onAnswer("ai_future_outlook", val)}
      />
    </div>
  );
}
