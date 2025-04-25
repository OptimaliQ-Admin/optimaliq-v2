"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_communication"] === "string" &&
    typeof answers["data_usage"] === "string" &&
    typeof answers["success_measurement"] === "string" &&
    typeof answers["strategic_meetings"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      <MultipleChoiceQuestion
        question="How is strategy communicated across your business?"
        options={[
          { value: "not_communicated", label: "It isn’t — we haven’t shared a strategy yet" },
          { value: "one_time_announcement", label: "Shared once in a presentation or email" },
          { value: "sometimes_discussed", label: "Discussed in planning sessions or team meetings" },
          { value: "ongoing_narrative", label: "It’s an ongoing story reinforced by leadership" },
        ]}
        value={getStringAnswer(answers["strategy_communication"])}
        onChange={(val) => onAnswer("strategy_communication", val)}
      />

      <MultipleChoiceQuestion
        question="How do you use data to guide strategy?"
        options={[
          { value: "not_used", label: "We don’t — decisions are made by intuition or urgency" },
          { value: "basic_metrics", label: "We look at basic metrics or trends" },
          { value: "some_analysis", label: "We use reports or dashboards to guide major decisions" },
          { value: "data_driven", label: "Strategy is built around insights and clear signals" },
        ]}
        value={getStringAnswer(answers["data_usage"])}
        onChange={(val) => onAnswer("data_usage", val)}
      />

      <MultipleChoiceQuestion
        question="How do you know if your strategy is working?"
        options={[
          { value: "we_dont_know", label: "We don’t — there’s no real tracking" },
          { value: "based_on_revenue", label: "We base it on high-level revenue or goals" },
          { value: "key_metrics", label: "We use specific KPIs tied to initiatives" },
          { value: "performance_feedback", label: "We track KPIs and gather feedback regularly" },
        ]}
        value={getStringAnswer(answers["success_measurement"])}
        onChange={(val) => onAnswer("success_measurement", val)}
      />

      <MultipleChoiceQuestion
        question="How often do leaders meet to align on strategy?"
        options={[
          { value: "rarely", label: "Rarely — only when there’s a problem" },
          { value: "occasionally", label: "Occasionally — during planning cycles" },
          { value: "regularly", label: "Regularly — every quarter or month" },
          { value: "frequently", label: "Frequently — we have a cadence to check alignment" },
        ]}
        value={getStringAnswer(answers["strategic_meetings"])}
        onChange={(val) => onAnswer("strategic_meetings", val)}
      />
    </div>
  );
}
