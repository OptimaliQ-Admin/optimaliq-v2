"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["tech_confidence"] === "string" &&
    typeof answers["change_resistance"] === "string" &&
    typeof answers["digital_goals_clarity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 7: tech_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in making decisions about which technology to adopt?"
        options={[
          { value: "guessing", label: "We’re guessing or going with trends" },
          { value: "basic_research", label: "We do basic research and hope for the best" },
          { value: "evaluated_decisions", label: "We evaluate based on needs and fit" },
          { value: "strategic_alignment", label: "Tech choices are aligned with strategy and vetted" },
        ]}
        value={answers["tech_confidence"] || ""}
        onChange={(val) => onAnswer("tech_confidence", val)}
      />

      {/* Question 8: change_resistance */}
      <MultipleChoiceQuestion
        question="How would you describe your company’s mindset toward digital change?"
        options={[
          { value: "avoidance", label: "Avoidant — change is met with resistance" },
          { value: "cautious", label: "Cautious — people need convincing" },
          { value: "open", label: "Open — willing to try new things if justified" },
          { value: "embracing", label: "Embracing — innovation is part of the culture" },
        ]}
        value={answers["change_resistance"] || ""}
        onChange={(val) => onAnswer("change_resistance", val)}
      />

      {/* Question 9: digital_goals_clarity */}
      <MultipleChoiceQuestion
        question="Do you have clear goals for how digital efforts should impact the business?"
        options={[
          { value: "no_goals", label: "No — we’re just trying different things" },
          { value: "broad_goals", label: "Yes, but they’re broad or vague" },
          { value: "defined_goals", label: "Yes — we’ve defined objectives for most projects" },
          { value: "measurable_goals", label: "Yes — we have measurable goals and track them" },
        ]}
        value={answers["digital_goals_clarity"] || ""}
        onChange={(val) => onAnswer("digital_goals_clarity", val)}
      />
    </div>
  );
}
