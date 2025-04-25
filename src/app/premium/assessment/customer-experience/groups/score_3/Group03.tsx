"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_tools_alignment"] === "string" &&
    typeof answers["customer_feedback_channels"] === "string" &&
    typeof answers["experience_evolution"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="How well are your CX tools (surveys, CRM, support) aligned with business goals?"
        options={[
          { value: "not_aligned", label: "Not aligned — disconnected from goals" },
          { value: "loosely_aligned", label: "Loosely aligned — used for reporting only" },
          { value: "mostly_aligned", label: "Mostly aligned — insights inform some actions" },
          { value: "fully_aligned", label: "Fully aligned — drives strategy and improvements" },
        ]}
        value={getStringAnswer(answers["cx_tools_alignment"])}
        onChange={(val) => onAnswer("cx_tools_alignment", val)}
      />

      <MultipleChoiceQuestion
        question="How do customers provide feedback or share issues?"
        options={[
          { value: "no_process", label: "No formal process — only when customers complain" },
          { value: "basic_forms", label: "Basic surveys or forms" },
          { value: "proactive_requests", label: "We proactively request and analyze feedback" },
          { value: "omnichannel_feedback", label: "Omnichannel feedback integrated into systems" },
        ]}
        value={getStringAnswer(answers["customer_feedback_channels"])}
        onChange={(val) => onAnswer("customer_feedback_channels", val)}
      />

      <MultipleChoiceQuestion
        question="How often do you revisit and evolve your customer experience strategy?"
        options={[
          { value: "never_updated", label: "Never — it hasn’t changed in years" },
          { value: "annually", label: "Annually — part of our planning cycle" },
          { value: "quarterly", label: "Quarterly or after major feedback" },
          { value: "continuous", label: "Continuously — part of ongoing improvement" },
        ]}
        value={getStringAnswer(answers["experience_evolution"])}
        onChange={(val) => onAnswer("experience_evolution", val)}
      />
    </div>
  );
}
