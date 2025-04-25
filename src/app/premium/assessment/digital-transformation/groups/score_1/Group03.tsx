"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_confidence"] === "string" &&
    typeof answers["change_resistance"] === "string" &&
    typeof answers["digital_goals_clarity"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How confident are you in making decisions about which technology to adopt?"
        options={[
          { value: "guessing", label: "We’re guessing or going with trends" },
          { value: "basic_research", label: "We do basic research and hope for the best" },
          { value: "evaluated_decisions", label: "We evaluate based on needs and fit" },
          { value: "strategic_alignment", label: "Tech choices are aligned with strategy and vetted" },
        ]}
        value={getStringAnswer(answers["tech_confidence"])}
        onChange={(val) => onAnswer("tech_confidence", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How would you describe your company’s mindset toward digital change?"
        options={[
          { value: "avoidance", label: "Avoidant — change is met with resistance" },
          { value: "cautious", label: "Cautious — people need convincing" },
          { value: "open", label: "Open — willing to try new things if justified" },
          { value: "embracing", label: "Embracing — innovation is part of the culture" },
        ]}
        value={getStringAnswer(answers["change_resistance"])}
        onChange={(val) => onAnswer("change_resistance", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="Do you have clear goals for how digital efforts should impact the business?"
        options={[
          { value: "no_goals", label: "No — we’re just trying different things" },
          { value: "broad_goals", label: "Yes, but they’re broad or vague" },
          { value: "defined_goals", label: "Yes — we’ve defined objectives for most projects" },
          { value: "measurable_goals", label: "Yes — we have measurable goals and track them" },
        ]}
        value={getStringAnswer(answers["digital_goals_clarity"])}
        onChange={(val) => onAnswer("digital_goals_clarity", val)}
      />
    </div>
  );
}
