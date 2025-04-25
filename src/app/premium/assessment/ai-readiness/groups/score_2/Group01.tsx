"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_strategy_alignment"] === "string" &&
    typeof answers["data_availability"] === "string" &&
    typeof answers["automation_scope"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_strategy_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your AI or automation initiative with your overall business strategy?"
        options={[
          { value: "no_alignment", label: "Not aligned — AI is ad hoc or experimental" },
          { value: "emerging_alignment", label: "Somewhat aligned — we’re trying to tie efforts to outcomes" },
          { value: "moderate_alignment", label: "Moderately aligned — AI supports select business priorities" },
          { value: "strong_alignment", label: "Strongly aligned — AI is core to our business roadmap" },
        ]}
        value={getStringAnswer(answers["ai_strategy_alignment"])}
        onChange={(val) => onAnswer("ai_strategy_alignment", val)}
      />

      {/* Question 2: data_availability */}
      <MultipleChoiceQuestion
        question="What is the current state of your business data needed for AI or automation?"
        options={[
          { value: "scattered", label: "Scattered and siloed across teams" },
          { value: "somewhat_accessible", label: "Somewhat accessible with effort" },
          { value: "centralized_reporting", label: "Centralized for reporting, not automation" },
          { value: "structured", label: "Structured, unified, and ready for AI use cases" },
        ]}
        value={getStringAnswer(answers["data_availability"])}
        onChange={(val) => onAnswer("data_availability", val)}
      />

      {/* Question 3: automation_scope */}
      <MultipleChoiceQuestion
        question="How would you describe the scope of automation in your business today?"
        options={[
          { value: "basic_tasks", label: "Only basic tasks (e.g., notifications, reminders)" },
          { value: "some_repetitive_work", label: "Some repetitive work is automated" },
          { value: "departmental", label: "Departmental-level workflows automated" },
          { value: "cross_functional", label: "Cross-functional automation across systems" },
        ]}
        value={getStringAnswer(answers["automation_scope"])}
        onChange={(val) => onAnswer("automation_scope", val)}
      />
    </div>
  );
}
