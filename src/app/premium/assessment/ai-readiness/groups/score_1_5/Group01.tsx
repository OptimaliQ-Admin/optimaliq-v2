"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["ai_priority"] === "string" &&
    typeof answers["ai_motivation"] === "string" &&
    typeof answers["ai_approach"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_priority */}
      <MultipleChoiceQuestion
        question="Where does AI or automation rank as a strategic priority for your company?"
        options={[
          { value: "not_on_radar", label: "It’s not really on our radar yet" },
          { value: "low_priority", label: "We’ve acknowledged it but it’s not urgent" },
          { value: "moderate_priority", label: "It’s something we want to act on soon" },
          { value: "top_priority", label: "It’s a top priority with budget or leadership backing" },
        ]}
        value={answers["ai_priority"] || ""}
        onChange={(val) => onAnswer("ai_priority", val)}
      />

      {/* Question 2: ai_motivation */}
      <MultipleChoiceQuestion
        question="What’s your primary motivation for exploring AI or automation?"
        options={[
          { value: "not_clearly_defined", label: "It’s not clearly defined yet" },
          { value: "productivity", label: "To improve productivity or reduce repetitive tasks" },
          { value: "growth_scalability", label: "To support growth or scale operations" },
          { value: "competitive_edge", label: "To create a competitive edge or strategic capability" },
        ]}
        value={answers["ai_motivation"] || ""}
        onChange={(val) => onAnswer("ai_motivation", val)}
      />

      {/* Question 3: ai_approach */}
      <MultipleChoiceQuestion
        question="How would you describe your approach to implementing new technology?"
        options={[
          { value: "reactive", label: "Reactive — we adopt tools as needed" },
          { value: "slow_and_careful", label: "Slow and careful — we wait for clear ROI" },
          { value: "informed", label: "Informed — we explore emerging tools and trends" },
          { value: "proactive", label: "Proactive — we test and pilot regularly" },
        ]}
        value={answers["ai_approach"] || ""}
        onChange={(val) => onAnswer("ai_approach", val)}
      />
    </div>
  );
}
