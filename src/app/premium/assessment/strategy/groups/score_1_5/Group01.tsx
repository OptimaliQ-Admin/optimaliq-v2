"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_visibility"] === "string" &&
    typeof answers["team_understanding"] === "string" &&
    typeof answers["priority_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="How visible is your company’s overall strategy?"
        options={[
          { value: "no_visibility", label: "It’s not written down or communicated" },
          { value: "informal", label: "Shared informally or discussed occasionally" },
          { value: "visible_in_some_places", label: "It’s in presentations or documents" },
          { value: "actively_referenced", label: "It’s visible and referenced often by leadership" },
        ]}
        value={getStringAnswer(answers["strategy_visibility"])}
        onChange={(val) => onAnswer("strategy_visibility", val)}
      />

      <MultipleChoiceQuestion
        question="How well do your teams understand the company’s direction?"
        options={[
          { value: "no_clue", label: "They don’t — it’s unclear to most" },
          { value: "vague", label: "They have a general idea" },
          { value: "somewhat_clear", label: "It’s mostly clear, but not specific" },
          { value: "very_clear", label: "Very clear — people understand how their work connects" },
        ]}
        value={getStringAnswer(answers["team_understanding"])}
        onChange={(val) => onAnswer("team_understanding", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned are your initiatives and projects with your strategic priorities?"
        options={[
          { value: "no_alignment", label: "There’s no real alignment" },
          { value: "some_alignment", label: "Some projects loosely align with strategy" },
          { value: "mostly_aligned", label: "Most major workstreams align with strategic goals" },
          { value: "fully_aligned", label: "Everything is driven by strategic priorities" },
        ]}
        value={getStringAnswer(answers["priority_alignment"])}
        onChange={(val) => onAnswer("priority_alignment", val)}
      />
    </div>
  );
}
