"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_course_correction"] === "string" &&
    typeof answers["market_signal_tracking"] === "string" &&
    typeof answers["vision_buy_in"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      <MultipleChoiceQuestion
        question="How does your organization respond when a strategic assumption proves wrong?"
        options={[
          { value: "rarely_adjusts", label: "We rarely adjust unless forced to" },
          { value: "event_driven", label: "We make changes in response to major events" },
          { value: "review_cycle", label: "We adjust during regular review cycles" },
          { value: "proactive_pivot", label: "We proactively course-correct using metrics and insights" },
        ]}
        value={getStringAnswer(answers["strategy_course_correction"])}
        onChange={(val) => onAnswer("strategy_course_correction", val)}
      />

      <MultipleChoiceQuestion
        question="Do you actively track signals from the market to inform strategy?"
        options={[
          { value: "no", label: "No — we react when competitors make moves" },
          { value: "occasionally", label: "Occasionally — informal observations" },
          { value: "trends_and_feedback", label: "Yes — we gather trends and customer feedback" },
          { value: "structured_monitoring", label: "Yes — through structured competitive and market monitoring" },
        ]}
        value={getStringAnswer(answers["market_signal_tracking"])}
        onChange={(val) => onAnswer("market_signal_tracking", val)}
      />

      <MultipleChoiceQuestion
        question="How well do employees understand and support your strategic direction?"
        options={[
          { value: "not_aligned", label: "Not aligned — there’s a gap in understanding" },
          { value: "basic_awareness", label: "Basic awareness — most know the high-level plan" },
          { value: "alignment_in_most_teams", label: "Alignment in most teams — they understand how they contribute" },
          { value: "fully_embedded", label: "Fully embedded — strategy drives day-to-day decisions" },
        ]}
        value={getStringAnswer(answers["vision_buy_in"])}
        onChange={(val) => onAnswer("vision_buy_in", val)}
      />
    </div>
  );
}
