"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["what’s_719868"] === "string" &&
    typeof answers["what_f078f0"] === "string" &&
    typeof answers["what’s_5927ed"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: what’s_719868 */}
      <MultipleChoiceQuestion
        question="What’s your organization’s posture toward reinvention and future-proofing sales?"
        options={[
          { value: "focused_now", label: "We’re focused on what works now" },
          { value: "slow_action", label: "We discuss the future but act slowly" },
          { value: "exploring_models", label: "We actively explore new models" },
          { value: "reinventing_proactively", label: "We continuously reinvent ahead of market shifts" },
        ]}
        value={getStringAnswer(answers["what’s_719868"])}
        onChange={(val) => onAnswer("what’s_719868", val)}
      />

      {/* Question 9: what_f078f0 */}
      <TextAreaQuestion
        question="What part of your sales engine do you believe gives you a competitive advantage?"
        placeholder="E.g., discovery, product demo, outbound, customer success handoff"
        value={getStringAnswer(answers["what_f078f0"])}
        onChange={(val) => onAnswer("what_f078f0", val)}
        maxLength={300}
      />

      {/* Question 10: what’s_5927ed */}
      <TextAreaQuestion
        question="What’s your vision for how your sales organization will evolve over the next 18–24 months?"
        placeholder="E.g., new verticals, full lifecycle ownership, predictive tooling, etc."
        value={getStringAnswer(answers["what’s_5927ed"])}
        onChange={(val) => onAnswer("what’s_5927ed", val)}
        maxLength={300}
      />
    </div>
  );
}
