"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["goals_linked_to_tech"] === "string" &&
    typeof answers["change_readiness"] === "string" &&
    typeof answers["integration_visibility"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: goals_linked_to_tech */}
      <MultipleChoiceQuestion
        question="Are your digital transformation goals linked to specific technology outcomes?"
        options={[
          { value: "not_linked", label: "No — they are general or aspirational" },
          { value: "somewhat_linked", label: "Somewhat — a few projects are tech-aligned" },
          { value: "mostly_linked", label: "Mostly — most initiatives have tech KPIs" },
          { value: "fully_linked", label: "Yes — every project has aligned metrics and tech outcomes" },
        ]}
        value={getStringAnswer(answers["goals_linked_to_tech"])}
        onChange={(val) => onAnswer("goals_linked_to_tech", val)}
      />

      {/* Question 2: change_readiness */}
      <MultipleChoiceQuestion
        question="How ready is your team for process and technology change?"
        options={[
          { value: "resistant", label: "Resistant — we avoid big changes" },
          { value: "open_with_issues", label: "Open — but change usually causes disruption" },
          { value: "some_preparedness", label: "Some preparedness — we provide training or support" },
          { value: "proactive", label: "Proactive — change is expected and planned for" },
        ]}
        value={getStringAnswer(answers["change_readiness"])}
        onChange={(val) => onAnswer("change_readiness", val)}
      />

      {/* Question 3: integration_visibility */}
      <MultipleChoiceQuestion
        question="Do you know which systems are integrated and how data flows across them?"
        options={[
          { value: "no_awareness", label: "No — we don’t have that visibility" },
          { value: "partial_awareness", label: "Partial — we know some basic flows" },
          { value: "clear_visibility", label: "Yes — we know how data moves between tools" },
          { value: "documented_maps", label: "Yes — we have documentation and process maps" },
        ]}
        value={getStringAnswer(answers["integration_visibility"])}
        onChange={(val) => onAnswer("integration_visibility", val)}
      />
    </div>
  );
}
