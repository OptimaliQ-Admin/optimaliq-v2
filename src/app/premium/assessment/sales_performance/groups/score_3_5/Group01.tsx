"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_4d1ff3"] === "string" &&
    typeof answers["how_fe4a96"] === "string" &&
    Array.isArray(answers["which_d1a7ce"]) &&
    answers["which_d1a7ce"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  const selectedMetrics = answers["which_d1a7ce"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_4d1ff3 */}
      <MultipleChoiceQuestion
        question="How do you measure forecast accuracy across teams or reps?"
        options={[
          { value: "not_tracked", label: "We don’t track forecast accuracy" },
          { value: "manual_comparison", label: "We compare forecast to close manually" },
          { value: "in_reporting", label: "It’s reviewed in performance reporting" },
          { value: "rep_stage_level", label: "We track accuracy at rep and stage level" },
        ]}
        value={getStringAnswer(answers["how_4d1ff3"])}
        onChange={(val) => onAnswer("how_4d1ff3", val)}
      />

      {/* Question 2: how_fe4a96 */}
      <MultipleChoiceQuestion
        question="How is sales enablement delivered across your team today?"
        options={[
          { value: "shared_docs", label: "Shared docs or onboarding decks" },
          { value: "occasional_training", label: "Occasional training sessions" },
          { value: "structured_quarterly", label: "Structured onboarding + quarterly enablement" },
          { value: "ongoing_enablement", label: "Ongoing enablement with tools, metrics, and coaching" },
        ]}
        value={getStringAnswer(answers["how_fe4a96"])}
        onChange={(val) => onAnswer("how_fe4a96", val)}
      />

      {/* Question 3: which_d1a7ce */}
      <MultiSelectQuestion
        question="Which of the following are built into your sales performance reviews?"
        options={[
          { value: "win_loss", label: "Win/loss insights" },
          { value: "stage_conversion", label: "Stage conversion analysis" },
          { value: "forecast_accuracy", label: "Forecast vs. quota accuracy" },
          { value: "deal_quality", label: "Deal quality or size trends" },
          { value: "rep_coaching", label: "Rep coaching plans" },
        ]}
        selected={Array.isArray(getArrayAnswer(selectedMetrics)) ? getArrayAnswer(selectedMetrics) : []}
        onChange={(val) => onAnswer("which_d1a7ce", val)}
        maxSelect={5}
      />
    </div>
  );
}
