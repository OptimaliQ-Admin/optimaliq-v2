"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["feedback_frequency"] === "string" &&
    typeof answers["leadership_scaling_strategy"] === "string" &&
    typeof answers["cross_team_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: feedback_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do your leaders seek structured feedback (surveys, reviews, etc.) from their teams?"
        options={[
          { value: "rarely", label: "Rarely — it's informal and occasional" },
          { value: "annually", label: "Once a year during reviews" },
          { value: "quarterly", label: "Quarterly feedback is standard" },
          { value: "regular_feedback", label: "We use real-time or monthly feedback loops" },
        ]}
        value={getStringAnswer(answers["feedback_frequency"])}
        onChange={(val) => onAnswer("feedback_frequency", val)}
      />

      {/* Question 2: leadership_scaling_strategy */}
      <MultipleChoiceQuestion
        question="How well are your leadership capabilities designed to scale with company growth?"
        options={[
          { value: "inconsistent_scaling", label: "Inconsistently — we rely on individual effort" },
          { value: "basic_scaling", label: "Some processes exist but don’t scale well" },
          { value: "intentional_scaling", label: "We have intentional plans for scaling leadership" },
          { value: "scalable_frameworks", label: "Our leadership development is built to scale" },
        ]}
        value={getStringAnswer(answers["leadership_scaling_strategy"])}
        onChange={(val) => onAnswer("leadership_scaling_strategy", val)}
      />

      {/* Question 3: cross_team_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your teams on company priorities and initiatives?"
        options={[
          { value: "fragmented", label: "Fragmented — each team works independently" },
          { value: "some_alignment", label: "There is some alignment, but it’s inconsistent" },
          { value: "strong_alignment", label: "We align during planning sessions or all-hands" },
          { value: "continuous_alignment", label: "We have structured rituals to maintain alignment" },
        ]}
        value={getStringAnswer(answers["cross_team_alignment"])}
        onChange={(val) => onAnswer("cross_team_alignment", val)}
      />
    </div>
  );
}
