"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["goal_alignment"] === "string" &&
    typeof answers["feedback_loops"] === "string" &&
    typeof answers["conflict_resolution"] === "string" &&
    typeof answers["leader_accountability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: goal_alignment */}
      <MultipleChoiceQuestion
        question="How well are individual and team goals aligned with the company’s overall objectives?"
        options={[
          { value: "not_aligned", label: "Not really — they’re set in silos" },
          { value: "loosely_aligned", label: "Loosely aligned — we try to connect them after the fact" },
          { value: "mostly_aligned", label: "Mostly aligned — there’s effort to cascade goals" },
          { value: "fully_aligned", label: "Fully aligned — everyone connects their work to company OKRs" },
        ]}
        value={getStringAnswer(answers["goal_alignment"])}
        onChange={(val) => onAnswer("goal_alignment", val)}
      />

      {/* Question 5: feedback_loops */}
      <MultipleChoiceQuestion
        question="How often do you gather and act on feedback from employees?"
        options={[
          { value: "rarely", label: "Rarely — feedback isn’t formally collected" },
          { value: "annually", label: "Annually — during performance reviews" },
          { value: "frequently", label: "Frequently — through surveys and retrospectives" },
          { value: "continuously", label: "Continuously — feedback drives real-time improvements" },
        ]}
        value={getStringAnswer(answers["feedback_loops"])}
        onChange={(val) => onAnswer("feedback_loops", val)}
      />

      {/* Question 6: conflict_resolution */}
      <MultipleChoiceQuestion
        question="How are conflicts typically handled in your organization?"
        options={[
          { value: "avoided", label: "Avoided — they fester or get ignored" },
          { value: "reactive", label: "Reactive — addressed only when urgent" },
          { value: "structured", label: "Structured — through mediation or HR" },
          { value: "proactive", label: "Proactive — through open dialogue and team norms" },
        ]}
        value={getStringAnswer(answers["conflict_resolution"])}
        onChange={(val) => onAnswer("conflict_resolution", val)}
      />

      {/* Question 7: leader_accountability */}
      <MultipleChoiceQuestion
        question="How is leadership held accountable for their impact?"
        options={[
          { value: "not_held", label: "They’re not — it’s based on trust" },
          { value: "basic", label: "Basic — they review progress in 1:1s or reviews" },
          { value: "clear_metrics", label: "Clear metrics — leadership is evaluated on KPIs" },
          { value: "multi_layered", label: "Multi-layered — including peer, team, and outcome feedback" },
        ]}
        value={getStringAnswer(answers["leader_accountability"])}
        onChange={(val) => onAnswer("leader_accountability", val)}
      />
    </div>
  );
}
