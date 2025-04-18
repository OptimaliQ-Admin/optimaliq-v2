"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["exec_alignment"] === "string" &&
    typeof answers["future_investments"] === "string" &&
    typeof answers["dt_priority"] === "string" &&
    answers["dt_priority"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 6: exec_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your executive or leadership team around digital transformation goals?"
        options={[
          { value: "not_aligned", label: "Not at all — we haven’t discussed it" },
          { value: "somewhat_aligned", label: "Somewhat — a few people are championing it" },
          { value: "mostly_aligned", label: "Mostly — leadership is generally on board" },
          { value: "fully_aligned", label: "Fully — it’s a shared top priority" },
        ]}
        value={answers["exec_alignment"] || ""}
        onChange={(val) => onAnswer("exec_alignment", val)}
      />

      {/* Question 7: future_investments */}
      <MultipleChoiceQuestion
        question="What best describes your investment plans in digital transformation?"
        options={[
          { value: "no_plan", label: "We don’t have a defined plan yet" },
          { value: "considering", label: "We’re exploring options for the future" },
          { value: "in_progress", label: "We’re actively investing and implementing" },
          { value: "ongoing", label: "It’s an ongoing and strategic part of our roadmap" },
        ]}
        value={answers["future_investments"] || ""}
        onChange={(val) => onAnswer("future_investments", val)}
      />

      {/* Question 8: dt_priority */}
      <TextAreaQuestion
        question="What is the single most important digital initiative your team should prioritize next?"
        placeholder="E.g., Upgrading CRM, automating marketing, consolidating data..."
        value={answers["dt_priority"] || ""}
        onChange={(val) => onAnswer("dt_priority", val)}
        maxLength={300}
      />
    </div>
  );
}
