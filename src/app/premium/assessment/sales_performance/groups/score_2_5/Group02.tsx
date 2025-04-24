"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["which_96e79e"]) &&
    answers["which_96e79e"].length > 0 &&
    typeof answers["how_18d03b"] === "string" &&
    typeof answers["what’s_f1fd32"] === "string" &&
    typeof answers["how_86d3d9"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  const tracked = answers["which_96e79e"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: which_96e79e */}
      <MultiSelectQuestion
        question="Which of the following do you track to measure sales performance?"
        options={[
          { value: "win_rates", label: "Win rates" },
          { value: "avg_deal_size", label: "Average deal size" },
          { value: "sales_cycle_length", label: "Sales cycle length" },
          { value: "touchpoints", label: "Touchpoints per deal" },
          { value: "forecast_accuracy", label: "Forecast accuracy" },
          { value: "close_rate_by_stage", label: "Close rate by stage" },
        ]}
        selected={tracked}
        onChange={(val) => onAnswer("which_96e79e", val)}
        maxSelect={6}
      />

      {/* Question 5: how_18d03b */}
      <MultipleChoiceQuestion
        question="How do you coach or develop sales reps or deal owners?"
        options={[
          { value: "no_process", label: "We don’t have a coaching process" },
          { value: "informal_reviews", label: "We do informal deal reviews" },
          { value: "regular_1on1s", label: "We provide regular 1:1s or call feedback" },
          { value: "structured_program", label: "We have a structured coaching and training program" },
        ]}
        value={getStringAnswer(answers["how_18d03b"])}
        onChange={(val) => onAnswer("how_18d03b", val)}
      />

      {/* Question 6: what’s_f1fd32 */}
      <MultipleChoiceQuestion
        question="What’s your process for identifying deals that are stuck or at risk?"
        options={[
          { value: "no_review", label: "We don’t review stuck deals" },
          { value: "manual_flags", label: "Reps flag concerns manually" },
          { value: "aging_or_inactive", label: "We check for deal aging or low activity" },
          { value: "automated_scoring", label: "We use reports and scoring to flag risks automatically" },
        ]}
        value={getStringAnswer(answers["what’s_f1fd32"])}
        onChange={(val) => onAnswer("what’s_f1fd32", val)}
      />

      {/* Question 7: how_86d3d9 */}
      <MultipleChoiceQuestion
        question="How often do you analyze win/loss outcomes or trends?"
        options={[
          { value: "never", label: "Rarely or never" },
          { value: "sometimes", label: "Sometimes when a deal is big" },
          { value: "monthly", label: "Monthly" },
          { value: "built_in", label: "Built into every deal close and team review" },
        ]}
        value={getStringAnswer(answers["how_86d3d9"])}
        onChange={(val) => onAnswer("how_86d3d9", val)}
      />
    </div>
  );
}
