"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_initiative_ownership"] === "string" &&
    typeof answers["governance_maturity"] === "string" &&
    typeof answers["ai_visibility"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_initiative_ownership */}
      <MultipleChoiceQuestion
        question="Who is responsible for driving AI initiatives in your business?"
        options={[
          { value: "no_clear_owner", label: "No one — it’s not clear who owns it" },
          { value: "shared_responsibility", label: "Shared across different teams" },
          { value: "single_owner", label: "One clear owner or team" },
          { value: "centralized_leadership", label: "A centralized AI or innovation team" },
        ]}
        value={getStringAnswer(answers["ai_initiative_ownership"])}
        onChange={(val) => onAnswer("ai_initiative_ownership", val)}
      />

      {/* Question 2: governance_maturity */}
      <MultipleChoiceQuestion
        question="How mature is your approach to data and AI governance (e.g. policies, oversight)?"
        options={[
          { value: "none", label: "None — we don’t have any governance yet" },
          { value: "basic_guidelines", label: "Basic guidelines but not enforced" },
          { value: "formal_policies", label: "Formal policies are in place" },
          { value: "proactive_governance", label: "Proactive governance with regular updates" },
        ]}
        value={getStringAnswer(answers["governance_maturity"])}
        onChange={(val) => onAnswer("governance_maturity", val)}
      />

      {/* Question 3: ai_visibility */}
      <MultipleChoiceQuestion
        question="How visible is your AI work to executive leadership or decision-makers?"
        options={[
          { value: "not_visible", label: "Not at all — no visibility" },
          { value: "mentioned_in_meetings", label: "Mentioned occasionally in meetings" },
          { value: "tracked_as_projects", label: "Tracked as part of formal initiatives" },
          { value: "central_to_strategy", label: "It’s central to strategic planning" },
        ]}
        value={getStringAnswer(answers["ai_visibility"])}
        onChange={(val) => onAnswer("ai_visibility", val)}
      />
    </div>
  );
}
