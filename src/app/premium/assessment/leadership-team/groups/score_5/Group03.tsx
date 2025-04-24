"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["innovation_support"] === "string" &&
    typeof answers["leadership_development"] === "string" &&
    typeof answers["crisis_response"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      
      {/* Question 8: innovation_support */}
      <MultipleChoiceQuestion
        question="How do leaders support innovation within your organization?"
        options={[
          { value: "not_supported", label: "It’s not really encouraged or supported" },
          { value: "some_encouragement", label: "Encouraged, but not structured" },
          { value: "structured_programs", label: "We have programs or time allocated for innovation" },
          { value: "embedded_in_strategy", label: "Innovation is a core pillar of leadership strategy" },
        ]}
        value={getStringAnswer(answers["innovation_support"])}
        onChange={(val) => onAnswer("innovation_support", val)}
      />

      {/* Question 9: leadership_development */}
      <MultipleChoiceQuestion
        question="How does the company invest in developing future leaders?"
        options={[
          { value: "no_investment", label: "We don’t have a formal approach" },
          { value: "individual_training", label: "Individuals seek training on their own" },
          { value: "internal_programs", label: "We provide internal training or mentorship" },
          { value: "structured_pathways", label: "We have structured development pathways and succession planning" },
        ]}
        value={getStringAnswer(answers["leadership_development"])}
        onChange={(val) => onAnswer("leadership_development", val)}
      />

      {/* Question 10: crisis_response */}
      <MultipleChoiceQuestion
        question="How do leaders respond during times of crisis or disruption?"
        options={[
          { value: "reactive", label: "Reactively, with limited communication" },
          { value: "communicate_after", label: "Communicate after decisions are made" },
          { value: "transparent_guidance", label: "Provide transparent guidance and next steps" },
          { value: "proactive_and_unifying", label: "Lead with calm, proactivity, and alignment across teams" },
        ]}
        value={getStringAnswer(answers["crisis_response"])}
        onChange={(val) => onAnswer("crisis_response", val)}
      />
    </div>
  );
}
