"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_229086"] === "string" &&
    typeof answers["what’s_30c935"] === "string" &&
    typeof answers["how_a07904"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_229086 */}
      <MultipleChoiceQuestion
        question="How do you ensure sales reps are continuously learning and improving?"
        options={[
          { value: "ad_hoc_feedback", label: "Ad hoc feedback or call reviews" },
          { value: "monthly_training", label: "Monthly enablement or training" },
          { value: "structured_plans", label: "Structured coaching and development plans" },
          { value: "kpi_tied_enablement", label: "Performance-based enablement tied to KPIs and growth goals" },
        ]}
        value={getStringAnswer(answers["how_229086"])}
        onChange={(val) => onAnswer("how_229086", val)}
      />

      {/* Question 9: what’s_30c935 */}
      <TextAreaQuestion
        question="What’s the most valuable insight your sales org has uncovered in the past quarter?"
        placeholder="E.g., reps winning faster when demo is skipped, churn risk linked to missed onboarding step"
        value={getStringAnswer(answers["what’s_30c935"])}
        onChange={(val) => onAnswer("what’s_30c935", val)}
        maxLength={300}
      />

      {/* Question 10: how_a07904 */}
      <MultipleChoiceQuestion
        question="How confident are you that your sales org can hit a 20–30% stretch goal next year with current systems?"
        options={[
          { value: "not_confident", label: "Not confident — we’d need major changes" },
          { value: "somewhat", label: "Somewhat — we’d need better support or hiring" },
          { value: "mostly", label: "Mostly — we’re building toward it" },
          { value: "very_confident", label: "Very confident — our system is ready for that level of growth" },
        ]}
        value={getStringAnswer(answers["how_a07904"])}
        onChange={(val) => onAnswer("how_a07904", val)}
      />
    </div>
  );
}
