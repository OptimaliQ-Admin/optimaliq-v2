"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitive_position"] === "string" &&
    typeof answers["market_awareness"] === "string" &&
    typeof answers["competitive_confidence"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: competitive_position */}
      <MultipleChoiceQuestion
        question="How would you describe your current position in the market?"
        options={[
          { value: "no_clear_position", label: "We don’t have a clear position" },
          { value: "early_stage", label: "We’re still figuring out where we fit" },
          { value: "niche_or_known", label: "We’re known in a niche or local area" },
          { value: "well_established", label: "We’re well-established and differentiated" },
        ]}
        value={answers["competitive_position"] || ""}
        onChange={(val) => onAnswer("competitive_position", val)}
      />

      {/* Question 2: market_awareness */}
      <MultipleChoiceQuestion
        question="How well do you understand what your competitors are doing?"
        options={[
          { value: "no_idea", label: "No idea — we don’t really track them" },
          { value: "some_awareness", label: "Some awareness from casual observation" },
          { value: "moderate_tracking", label: "We track them periodically" },
          { value: "high_awareness", label: "We closely monitor their moves and strategy" },
        ]}
        value={answers["market_awareness"] || ""}
        onChange={(val) => onAnswer("market_awareness", val)}
      />

      {/* Question 3: competitive_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in your ability to stay competitive in your market?"
        options={[
          { value: "not_confident", label: "Not confident at all" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "mostly_confident", label: "Mostly confident" },
          { value: "very_confident", label: "Very confident — we lead the way" },
        ]}
        value={answers["competitive_confidence"] || ""}
        onChange={(val) => onAnswer("competitive_confidence", val)}
      />
    </div>
  );
}
