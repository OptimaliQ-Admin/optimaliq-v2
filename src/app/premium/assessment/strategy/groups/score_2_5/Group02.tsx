"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["goal_tracking"] === "string" &&
    typeof answers["strategic_reporting"] === "string" &&
    typeof answers["adjustment_process"] === "string" &&
    typeof answers["project_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: goal_tracking */}
      <MultipleChoiceQuestion
        question="How are strategic goals tracked and reviewed?"
        options={[
          { value: "not_tracked", label: "They’re not actively tracked" },
          { value: "informal_updates", label: "We do informal updates in meetings" },
          { value: "dashboard_visibility", label: "We track them on a dashboard" },
          { value: "formal_review_cycle", label: "We review them on a formal cadence" },
        ]}
        value={getStringAnswer(answers["goal_tracking"])}
        onChange={(val) => onAnswer("goal_tracking", val)}
      />

      {/* Question 5: strategic_reporting */}
      <MultipleChoiceQuestion
        question="How do you report on progress against your strategic priorities?"
        options={[
          { value: "ad_hoc", label: "Ad hoc — when someone asks" },
          { value: "team_meetings", label: "Occasional updates in team meetings" },
          { value: "exec_summary", label: "We publish executive summaries regularly" },
          { value: "integrated_reporting", label: "We use structured reporting across levels" },
        ]}
        value={getStringAnswer(answers["strategic_reporting"])}
        onChange={(val) => onAnswer("strategic_reporting", val)}
      />

      {/* Question 6: adjustment_process */}
      <MultipleChoiceQuestion
        question="What happens when a strategic plan isn’t working?"
        options={[
          { value: "stick_to_plan", label: "We stick with it and hope for the best" },
          { value: "adjust_ad_hoc", label: "We adjust as needed — but reactively" },
          { value: "review_lessons", label: "We review and learn what went wrong" },
          { value: "structured_pivot", label: "We use structured criteria to revise plans" },
        ]}
        value={getStringAnswer(answers["adjustment_process"])}
        onChange={(val) => onAnswer("adjustment_process", val)}
      />

      {/* Question 7: project_alignment */}
      <MultipleChoiceQuestion
        question="Do your team’s day-to-day activities tie back to strategic goals?"
        options={[
          { value: "no_connection", label: "No — they often feel disconnected" },
          { value: "some_alignment", label: "Some — we try to align loosely" },
          { value: "mostly_aligned", label: "Yes — most work is aligned" },
          { value: "fully_aligned", label: "Yes — it’s clear how daily work supports strategy" },
        ]}
        value={getStringAnswer(answers["project_alignment"])}
        onChange={(val) => onAnswer("project_alignment", val)}
      />
    </div>
  );
}
