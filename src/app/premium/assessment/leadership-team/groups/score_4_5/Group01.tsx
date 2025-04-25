"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["leader_alignment"] === "string" &&
    typeof answers["culture_catalyst"] === "string" &&
    typeof answers["cross_functional_influence"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: leader_alignment */}
      <MultipleChoiceQuestion
        question="How well are senior leaders aligned on the vision for the company?"
        options={[
          { value: "occasional_conflict", label: "We occasionally have conflicting goals" },
          { value: "mostly_aligned", label: "We’re mostly aligned but not always consistent" },
          { value: "aligned_shared_narrative", label: "We’re aligned and have a shared narrative" },
          { value: "fully_synced", label: "We’re fully synced with strategic clarity and buy-in" },
        ]}
        value={getStringAnswer(answers["leader_alignment"])}
        onChange={(val) => onAnswer("leader_alignment", val)}
      />

      {/* Question 2: culture_catalyst */}
      <MultipleChoiceQuestion
        question="What role does leadership play in shaping company culture?"
        options={[
          { value: "reactionary", label: "We react to culture issues as they arise" },
          { value: "encouraging", label: "We try to encourage positive culture" },
          { value: "intentional", label: "We intentionally model and reinforce our values" },
          { value: "strategic_driver", label: "Leadership is a catalyst — culture is a strategic driver" },
        ]}
        value={getStringAnswer(answers["culture_catalyst"])}
        onChange={(val) => onAnswer("culture_catalyst", val)}
      />

      {/* Question 3: cross_functional_influence */}
      <MultipleChoiceQuestion
        question="How influential is leadership across functions?"
        options={[
          { value: "siloed", label: "Each department mostly runs its own show" },
          { value: "some_coordination", label: "We coordinate on major initiatives" },
          { value: "strong_presence", label: "Leaders have a strong presence across teams" },
          { value: "orchestrated", label: "Leadership orchestrates collaboration and alignment" },
        ]}
        value={getStringAnswer(answers["cross_functional_influence"])}
        onChange={(val) => onAnswer("cross_functional_influence", val)}
      />
    </div>
  );
}
