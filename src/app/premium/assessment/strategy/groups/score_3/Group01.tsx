"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_alignment"] === "string" &&
    typeof answers["goal_visibility"] === "string" &&
    typeof answers["decision_framework"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How well is your marketing strategy aligned with business goals?"
        options={[
          { value: "not_aligned", label: "Not really aligned — mostly guesswork" },
          { value: "somewhat_aligned", label: "Somewhat — we align after campaigns launch" },
          { value: "aligned", label: "Aligned — we collaborate during planning" },
          { value: "fully_aligned", label: "Fully aligned — strategy drives marketing goals" },
        ]}
        value={getStringAnswer(answers["strategy_alignment"])}
        onChange={(val) => onAnswer("strategy_alignment", val)}
      />

      <MultipleChoiceQuestion
        question="How visible are your marketing goals to the broader team?"
        options={[
          { value: "not_shared", label: "Not shared — only marketing knows" },
          { value: "mentioned", label: "Mentioned occasionally in meetings" },
          { value: "visible", label: "Goals are visible across teams" },
          { value: "fully_integrated", label: "Integrated into company-wide planning" },
        ]}
        value={getStringAnswer(answers["goal_visibility"])}
        onChange={(val) => onAnswer("goal_visibility", val)}
      />

      <MultipleChoiceQuestion
        question="What drives your marketing decisions?"
        options={[
          { value: "gut_feeling", label: "Gut feeling or industry trends" },
          { value: "past_results", label: "Past campaign performance" },
          { value: "team_input", label: "Team input and metrics" },
          { value: "strategic_framework", label: "Defined decision framework" },
        ]}
        value={getStringAnswer(answers["decision_framework"])}
        onChange={(val) => onAnswer("decision_framework", val)}
      />
    </div>
  );
}
