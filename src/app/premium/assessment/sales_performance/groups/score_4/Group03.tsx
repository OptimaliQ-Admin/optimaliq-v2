"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_03fce6"] === "string" &&
    typeof answers["what’s_4c7c04"] === "string" &&
    typeof answers["how_4633fe"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_03fce6 */}
      <MultipleChoiceQuestion
        question="How regularly are win/loss insights shared across teams?"
        options={[
          { value: "rarely", label: "Rarely" },
          { value: "retros", label: "Occasionally in retros" },
          { value: "monthly_leadership", label: "Monthly with leadership" },
          { value: "shared_across_org", label: "Regular insights shared across teams, segments, and channels" },
        ]}
        value={getStringAnswer(answers["how_03fce6"])}
        onChange={(val) => onAnswer("how_03fce6", val)}
      />

      {/* Question 9: what’s_4c7c04 */}
      <TextAreaQuestion
        question="What’s one future GTM capability you’re planning to build?"
        placeholder="E.g., self-serve funnel, ABM, vertical specialization, etc."
        value={getStringAnswer(answers["what’s_4c7c04"])}
        onChange={(val) => onAnswer("what’s_4c7c04", val)}
        maxLength={300}
      />

      {/* Question 10: how_4633fe */}
      <MultipleChoiceQuestion
        question="How well do you understand your sales org’s capacity and coverage model?"
        options={[
          { value: "no_model", label: "We don’t really have one" },
          { value: "rough_model", label: "We use rough territory or ratio models" },
          { value: "defined_model", label: "We have a defined model" },
          { value: "dynamic_modeling", label: "We model capacity dynamically across segments and reps" },
        ]}
        value={getStringAnswer(answers["how_4633fe"])}
        onChange={(val) => onAnswer("how_4633fe", val)}
      />
    </div>
  );
}
