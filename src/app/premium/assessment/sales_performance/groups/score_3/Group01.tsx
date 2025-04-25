"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_c7b9f7"] === "string" &&
    typeof answers["what_84c5f2"] === "string" &&
    Array.isArray(answers["which_e20c5f"]) &&
    answers["which_e20c5f"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step01({ answers, onAnswer }: Props) {
  const reviewed = answers["which_e20c5f"] || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_c7b9f7 */}
      <MultipleChoiceQuestion
        question="How do you monitor and improve sales velocity (time to close)?"
        options={[
          { value: "not_tracked", label: "We don’t track it" },
          { value: "review_aging", label: "We review deal aging occasionally" },
          { value: "track_by_stage", label: "We track time per stage" },
          { value: "optimize_with_reports", label: "We optimize funnel speed with reports and benchmarks" },
        ]}
        value={getStringAnswer(answers["how_c7b9f7"])}
        onChange={(val) => onAnswer("how_c7b9f7", val)}
      />

      {/* Question 2: what_84c5f2 */}
      <MultipleChoiceQuestion
        question="What level of consistency do you see in how different reps work the same stages?"
        options={[
          { value: "all_different", label: "Everyone does it differently" },
          { value: "basic_following", label: "Most reps follow the basics" },
          { value: "trained", label: "We train and document best practices" },
          { value: "standardized", label: "We have standardized playbooks and sales enablement" },
        ]}
        value={getStringAnswer(answers["what_84c5f2"])}
        onChange={(val) => onAnswer("what_84c5f2", val)}
      />

      {/* Question 3: which_e20c5f */}
      <MultiSelectQuestion
        question="Which of the following metrics do you review regularly to optimize sales performance?"
        options={[
          { value: "pipeline_coverage", label: "Pipeline coverage" },
          { value: "deal_velocity", label: "Deal velocity" },
          { value: "conversion_by_stage", label: "Conversion rates by stage" },
          { value: "call_to_meeting", label: "Call-to-meeting ratio" },
          { value: "forecast_accuracy", label: "Forecast vs. actual" },
          { value: "rep_capacity", label: "Rep capacity" },
        ]}
        selected={Array.isArray(getArrayAnswer(reviewed)) ? getArrayAnswer(reviewed) : []}
        onChange={(val) => onAnswer("which_e20c5f", val)}
        maxSelect={6}
      />
    </div>
  );
}
