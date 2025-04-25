"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_resilience"] === "string" &&
    typeof answers["innovation_alignment"] === "string" &&
    typeof answers["external_positioning"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How prepared is your strategy to adapt to sudden disruptions or market shifts?"
        options={[
          { value: "reactionary", label: "We react when things happen" },
          { value: "recovery_focused", label: "We focus on recovering quickly" },
          { value: "proactive_playbooks", label: "We have proactive playbooks in place" },
          { value: "resilience_embedded", label: "Resilience is embedded in strategy design" },
        ]}
        value={getStringAnswer(answers["strategic_resilience"] || "")}
        onChange={(val) => onAnswer("strategic_resilience", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How aligned is your innovation roadmap with your long-term strategic plan?"
        options={[
          { value: "no_clear_link", label: "There’s no clear link" },
          { value: "loosely_related", label: "Some initiatives relate loosely" },
          { value: "aligned_investments", label: "We fund aligned innovation projects" },
          { value: "fully_synchronized", label: "Fully synchronized with strategic outcomes" },
        ]}
        value={getStringAnswer(answers["innovation_alignment"] || "")}
        onChange={(val) => onAnswer("innovation_alignment", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How would you describe your competitive positioning strategy?"
        options={[
          { value: "undefined", label: "We haven’t defined one" },
          { value: "generic", label: "It’s mostly based on price or availability" },
          { value: "differentiated", label: "We differentiate through value or experience" },
          { value: "market_leadership", label: "We’re aiming to shape or lead the category" },
        ]}
        value={getStringAnswer(answers["external_positioning"] || "")}
        onChange={(val) => onAnswer("external_positioning", val)}
      />
    </div>
  );
}
