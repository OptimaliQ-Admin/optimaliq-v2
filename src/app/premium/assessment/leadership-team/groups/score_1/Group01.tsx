"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["alignment_visibility"] === "string" &&
    typeof answers["strategy_consistency"] === "string" &&
    typeof answers["team_direction"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: alignment_visibility */}
      <MultipleChoiceQuestion
        question="How visible is your leadership team’s alignment on strategic priorities?"
        options={[
          { value: "no_visibility", label: "Not at all — priorities seem disconnected" },
          { value: "some_alignment", label: "Some alignment — varies by leader" },
          { value: "moderate_visibility", label: "Mostly aligned, but not always communicated" },
          { value: "high_alignment", label: "Fully aligned and clearly communicated" },
        ]}
        value={getStringAnswer(answers["alignment_visibility"])}
        onChange={(val) => onAnswer("alignment_visibility", val)}
      />

      {/* Question 2: strategy_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is execution across departments or teams?"
        options={[
          { value: "very_inconsistent", label: "Very inconsistent — everyone works differently" },
          { value: "somewhat_inconsistent", label: "Somewhat inconsistent — varies by team" },
          { value: "mostly_consistent", label: "Mostly consistent with shared practices" },
          { value: "fully_consistent", label: "Fully consistent — we operate from the same playbook" },
        ]}
        value={getStringAnswer(answers["strategy_consistency"])}
        onChange={(val) => onAnswer("strategy_consistency", val)}
      />

      {/* Question 3: team_direction */}
      <MultipleChoiceQuestion
        question="How well does your team understand how their work connects to business goals?"
        options={[
          { value: "not_at_all", label: "Not at all — goals feel disconnected from day-to-day work" },
          { value: "rough_understanding", label: "They have a rough understanding" },
          { value: "clear_for_some", label: "Clear for some roles or teams" },
          { value: "fully_aligned", label: "Fully aligned — everyone understands the connection" },
        ]}
        value={getStringAnswer(answers["team_direction"])}
        onChange={(val) => onAnswer("team_direction", val)}
      />
    </div>
  );
}
