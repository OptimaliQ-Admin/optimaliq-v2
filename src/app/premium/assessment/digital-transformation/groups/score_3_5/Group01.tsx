"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_stack_confidence"] === "string" &&
    typeof answers["system_redundancy"] === "string" &&
    typeof answers["data_unification"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: tech_stack_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you in the tools and platforms that make up your current tech stack?"
        options={[
          { value: "not_confident", label: "Not confident — we’re due for an overhaul" },
          { value: "somewhat_confident", label: "Somewhat confident — some gaps, but it works" },
          { value: "mostly_confident", label: "Mostly confident — we’ve vetted our tools" },
          { value: "very_confident", label: "Very confident — our stack is strategic and robust" },
        ]}
        value={getStringAnswer(answers["tech_stack_confidence"])}
        onChange={(val) => onAnswer("tech_stack_confidence", val)}
      />

      {/* Question 2: system_redundancy */}
      <MultipleChoiceQuestion
        question="Do you have duplicate or overlapping tools doing similar things?"
        options={[
          { value: "no_visibility", label: "No idea — we don’t track that" },
          { value: "lots_overlap", label: "Yes — we have lots of overlap" },
          { value: "some_overlap", label: "Some tools overlap but we’re managing it" },
          { value: "fully_streamlined", label: "No — we’ve streamlined everything" },
        ]}
        value={getStringAnswer(answers["system_redundancy"])}
        onChange={(val) => onAnswer("system_redundancy", val)}
      />

      {/* Question 3: data_unification */}
      <MultipleChoiceQuestion
        question="How unified is your customer or operational data across platforms?"
        options={[
          { value: "not_at_all", label: "Not at all — every tool has its own data silo" },
          { value: "some_syncing", label: "Some syncing — but we still do lots of manual work" },
          { value: "mostly_unified", label: "Mostly unified — just a few gaps" },
          { value: "fully_unified", label: "Fully unified — our data works across systems" },
        ]}
        value={getStringAnswer(answers["data_unification"])}
        onChange={(val) => onAnswer("data_unification", val)}
      />
    </div>
  );
}
