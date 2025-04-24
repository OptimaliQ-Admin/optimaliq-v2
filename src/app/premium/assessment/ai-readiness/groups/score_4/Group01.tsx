"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_strategy_alignment"] === "string" &&
    typeof answers["ai_governance_model"] === "string" &&
    typeof answers["ai_experimentation_process"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your AI strategy with your overall business goals?"
        options={[
          { value: "unclear_alignment", label: "It’s not clearly defined or connected" },
          { value: "loosely_aligned", label: "It’s somewhat aligned but loosely governed" },
          { value: "mostly_aligned", label: "It’s mostly aligned with key initiatives" },
          { value: "fully_integrated", label: "It’s fully integrated into strategic planning" },
        ]}
        value={getStringAnswer(answers["ai_strategy_alignment"])}
        onChange={(val) => onAnswer("ai_strategy_alignment", val)}
      />

      {/* Question 2: ai_governance_model */}
      <MultipleChoiceQuestion
        question="Do you have a governance model for AI usage across departments?"
        options={[
          { value: "no_governance", label: "No formal governance yet" },
          { value: "basic_guidelines", label: "Basic guidelines for AI usage exist" },
          { value: "clear_policies", label: "Clear policies and accountability exist" },
          { value: "mature_governance", label: "Robust governance with cross-functional oversight" },
        ]}
        value={getStringAnswer(answers["ai_governance_model"])}
        onChange={(val) => onAnswer("ai_governance_model", val)}
      />

      {/* Question 3: ai_experimentation_process */}
      <MultipleChoiceQuestion
        question="How do you manage AI experimentation and prototyping?"
        options={[
          { value: "ad_hoc_projects", label: "Ad hoc projects by individual teams" },
          { value: "some_structure", label: "Some structured testing, but not consistent" },
          { value: "documented_process", label: "We follow a documented process" },
          { value: "formal_lifecycle", label: "We have a formal lifecycle for AI experiments" },
        ]}
        value={getStringAnswer(answers["ai_experimentation_process"])}
        onChange={(val) => onAnswer("ai_experimentation_process", val)}
      />
    </div>
  );
}
