"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_61a52a"] === "string" &&
    typeof answers["how_9e698a"] === "string" &&
    typeof answers["how_e2391b"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_b5793e */}
      <MultipleChoiceQuestion
        question="How are you currently tracking sales activities and next steps?"
        options={[
          { value: "no_tracking", label: "No one tracks them" },
          { value: "emails_notes", label: "They're tracked in emails or notes" },
          { value: "spreadsheet_tool", label: "We track them in a spreadsheet or tool" },
          { value: "crm_guided", label: "We use a CRM that guides next steps" },
        ]}
        value={getStringAnswer(answers["how_b5793e"])}
        onChange={(val) => onAnswer("how_b5793e", val)}
      />

      {/* Question 2: how_140f94 */}
      <MultipleChoiceQuestion
        question="How do you handle sales targets and goals?"
        options={[
          { value: "no_targets", label: "We don't have targets" },
          { value: "rep_tracked", label: "Each rep tracks their own goals" },
          { value: "set_not_reviewed", label: "We set goals but don't review them often" },
          { value: "tracked_reviewed", label: "We track and review goals regularly" },
        ]}
        value={getStringAnswer(answers["how_140f94"])}
        onChange={(val) => onAnswer("how_140f94", val)}
      />

      {/* Question 3: how_3a6376 */}
      <MultipleChoiceQuestion
        question="How do you handle sales reporting and metrics?"
        options={[
          { value: "no_reporting", label: "No reporting" },
          { value: "basic_reports", label: "We have basic reports" },
          { value: "weekly_metrics", label: "We track key metrics weekly" },
          { value: "real_time", label: "We have real-time dashboards" },
        ]}
        value={getStringAnswer(answers["how_3a6376"])}
        onChange={(val) => onAnswer("how_3a6376", val)}
      />
    </div>
  );
}
