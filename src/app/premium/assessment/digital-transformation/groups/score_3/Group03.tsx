"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["technology_ownership"] === "string" &&
    typeof answers["digital_strategy_alignment"] === "string" &&
    typeof answers["governance_model"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: technology_ownership */}
      <MultipleChoiceQuestion
        question="Who is primarily responsible for driving digital transformation?"
        options={[
          { value: "no_clear_owner", label: "No one — it’s not clearly owned" },
          { value: "shared_ownership", label: "Shared between departments" },
          { value: "it_owned", label: "Mostly IT or a tech leader" },
          { value: "dedicated_owner", label: "A dedicated digital or transformation leader" },
        ]}
        value={getStringAnswer(answers["technology_ownership"])}
        onChange={(val) => onAnswer("technology_ownership", val)}
      />

      {/* Question 9: digital_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How well does your digital strategy align with overall business goals?"
        options={[
          { value: "no_alignment", label: "Not at all — we just try things" },
          { value: "some_alignment", label: "Somewhat aligned — but not fully integrated" },
          { value: "mostly_aligned", label: "Mostly aligned with major initiatives" },
          { value: "fully_aligned", label: "Fully aligned — digital is a business driver" },
        ]}
        value={getStringAnswer(answers["digital_strategy_alignment"])}
        onChange={(val) => onAnswer("digital_strategy_alignment", val)}
      />

      {/* Question 10: governance_model */}
      <MultipleChoiceQuestion
        question="Do you have a governance model for digital initiatives?"
        options={[
          { value: "none", label: "No — decisions are made ad hoc" },
          { value: "some_review", label: "Some review, but inconsistent" },
          { value: "formal_model", label: "Formal governance for major initiatives" },
          { value: "mature_model", label: "Yes — with clear criteria, roles, and reporting" },
        ]}
        value={getStringAnswer(answers["governance_model"])}
        onChange={(val) => onAnswer("governance_model", val)}
      />
    </div>
  );
}
