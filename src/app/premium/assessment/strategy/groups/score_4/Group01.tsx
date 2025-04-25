"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["long_term_strategy"] === "string" &&
    typeof answers["team_alignment"] === "string" &&
    typeof answers["visibility"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      <MultipleChoiceQuestion
        question="How well does your long-term strategy guide short-term decisions?"
        options={[
          { value: "not_aligned", label: "It doesn’t — teams do their own thing" },
          { value: "loosely_aligned", label: "Loosely — we try to align where we can" },
          { value: "mostly_aligned", label: "Mostly — short-term decisions ladder up" },
          { value: "fully_aligned", label: "Fully — strategy informs all decisions" },
        ]}
        value={getStringAnswer(answers["long_term_strategy"])}
        onChange={(val) => onAnswer("long_term_strategy", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned is your team around the company’s strategic priorities?"
        options={[
          { value: "not_aligned", label: "Everyone is working in silos" },
          { value: "somewhat_aligned", label: "Some shared understanding" },
          { value: "mostly_aligned", label: "Mostly aligned with clear direction" },
          { value: "fully_aligned", label: "Fully aligned and communicating regularly" },
        ]}
        value={getStringAnswer(answers["team_alignment"])}
        onChange={(val) => onAnswer("team_alignment", val)}
      />

      <MultipleChoiceQuestion
        question="How visible are strategic goals across the organization?"
        options={[
          { value: "not_visible", label: "They’re not widely shared" },
          { value: "shared_occasionally", label: "Shared occasionally in meetings or updates" },
          { value: "regular_updates", label: "Regular updates are provided" },
          { value: "transparent_dashboard", label: "Visible in dashboards or OKR tools" },
        ]}
        value={getStringAnswer(answers["visibility"])}
        onChange={(val) => onAnswer("visibility", val)}
      />
    </div>
  );
}
