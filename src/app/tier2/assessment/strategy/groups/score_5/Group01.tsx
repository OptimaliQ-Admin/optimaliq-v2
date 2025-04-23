"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["strategy_evolution"] === "string" &&
    typeof answers["market_responsiveness"] === "string" &&
    typeof answers["vision_cascade"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How frequently does your business revisit and evolve its core strategy?"
        options={[
          { value: "rarely", label: "Rarely — it's mostly static year to year" },
          { value: "when_needed", label: "We make changes when needed" },
          { value: "regularly", label: "Regularly, with data and input" },
          { value: "continuously", label: "Continuously — it’s part of our DNA" },
        ]}
        value={answers["strategy_evolution"] || ""}
        onChange={(val) => onAnswer("strategy_evolution", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How well does your strategy respond to emerging trends and market signals?"
        options={[
          { value: "mostly_lagging", label: "We’re mostly lagging" },
          { value: "somewhat_reactive", label: "We react to big changes only" },
          { value: "actively_scan", label: "We actively scan and adapt" },
          { value: "proactively_shape", label: "We proactively shape and lead" },
        ]}
        value={answers["market_responsiveness"] || ""}
        onChange={(val) => onAnswer("market_responsiveness", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How well is your long-term vision cascaded into team goals and activities?"
        options={[
          { value: "unclear", label: "It’s not clear" },
          { value: "somewhat_aligned", label: "Somewhat — broad alignment exists" },
          { value: "aligned_with_metrics", label: "It’s aligned and tied to key metrics" },
          { value: "deeply_embedded", label: "It’s deeply embedded in how we operate" },
        ]}
        value={answers["vision_cascade"] || ""}
        onChange={(val) => onAnswer("vision_cascade", val)}
      />
    </div>
  );
}
