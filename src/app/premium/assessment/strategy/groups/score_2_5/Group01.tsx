"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategic_alignment"] === "string" &&
    typeof answers["initiative_planning"] === "string" &&
    typeof answers["cross_functional_roadmap"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: strategic_alignment */}
      <MultipleChoiceQuestion
        question="How well is your strategy aligned across departments?"
        options={[
          { value: "inconsistent", label: "Inconsistent — every team has their own priorities" },
          { value: "loose_alignment", label: "Loose alignment — we try to align, but it's informal" },
          { value: "mostly_aligned", label: "Mostly aligned — our goals are generally consistent" },
          { value: "fully_aligned", label: "Fully aligned — strategy drives cross-functional focus" },
        ]}
        value={getStringAnswer(answers["strategic_alignment"])}
        onChange={(val) => onAnswer("strategic_alignment", val)}
      />

      {/* Question 2: initiative_planning */}
      <MultipleChoiceQuestion
        question="How do you prioritize initiatives to support your strategic goals?"
        options={[
          { value: "based_on_requests", label: "Based on who's asking or urgency" },
          { value: "department_level", label: "Each team decides their own" },
          { value: "aligned_with_goals", label: "We prioritize based on goal alignment" },
          { value: "prioritized_framework", label: "We use a formal prioritization framework" },
        ]}
        value={getStringAnswer(answers["initiative_planning"])}
        onChange={(val) => onAnswer("initiative_planning", val)}
      />

      {/* Question 3: cross_functional_roadmap */}
      <MultipleChoiceQuestion
        question="Do you maintain a cross-functional roadmap for strategic initiatives?"
        options={[
          { value: "no_roadmap", label: "No — it’s hard to track across teams" },
          { value: "partial_view", label: "We have a partial view of key projects" },
          { value: "team_based_roadmaps", label: "Each team maintains its own roadmap" },
          { value: "shared_roadmap", label: "Yes — we maintain a shared, strategic roadmap" },
        ]}
        value={getStringAnswer(answers["cross_functional_roadmap"])}
        onChange={(val) => onAnswer("cross_functional_roadmap", val)}
      />
    </div>
  );
}
