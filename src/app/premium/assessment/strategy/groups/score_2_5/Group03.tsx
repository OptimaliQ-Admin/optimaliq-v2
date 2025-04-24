"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategy_reflection"] === "string" &&
    typeof answers["cross_team_visibility"] === "string" &&
    typeof answers["strategic_confidence"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: strategy_reflection */}
      <MultipleChoiceQuestion
        question="How often does leadership reflect on or revisit the current strategy?"
        options={[
          { value: "rarely", label: "Rarely — we only revisit when something breaks" },
          { value: "periodic", label: "Occasionally — during yearly planning" },
          { value: "regular_review", label: "Regularly — part of our operating rhythm" },
          { value: "continuous", label: "Continuously — strategy is always evolving" },
        ]}
        value={answers["strategy_reflection"] || ""}
        onChange={(val) => onAnswer("strategy_reflection", val)}
      />

      {/* Question 9: cross_team_visibility */}
      <MultipleChoiceQuestion
        question="Do teams understand how their work fits into the bigger strategic picture?"
        options={[
          { value: "no_awareness", label: "Not really — strategy feels siloed" },
          { value: "some_awareness", label: "Somewhat — depends on the team" },
          { value: "general_alignment", label: "Mostly — teams know the strategic goals" },
          { value: "full_alignment", label: "Yes — there's strong cross-team visibility" },
        ]}
        value={answers["cross_team_visibility"] || ""}
        onChange={(val) => onAnswer("cross_team_visibility", val)}
      />

      {/* Question 10: strategic_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your strategy is the right one?"
        options={[
          { value: "not_confident", label: "Not confident — it's mostly guesswork" },
          { value: "somewhat_confident", label: "Somewhat — we’ve made some assumptions" },
          { value: "mostly_confident", label: "Mostly — we’ve validated parts of it" },
          { value: "very_confident", label: "Very — it’s backed by data and tested regularly" },
        ]}
        value={answers["strategic_confidence"] || ""}
        onChange={(val) => onAnswer("strategic_confidence", val)}
      />
    </div>
  );
}
