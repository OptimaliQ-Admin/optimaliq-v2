"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["platform_consistency"] === "string" &&
    typeof answers["digital_success_criteria"] === "string" &&
    typeof answers["adaptability_to_change"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: platform_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is the experience across your digital platforms (e.g. website, mobile, customer portal)?"
        options={[
          { value: "very_inconsistent", label: "Very inconsistent — each looks/feels different" },
          { value: "somewhat_consistent", label: "Somewhat consistent — we try to align them" },
          { value: "mostly_consistent", label: "Mostly consistent — same branding and layout" },
          { value: "fully_unified", label: "Fully unified — seamless across all platforms" },
        ]}
        value={getStringAnswer(answers["platform_consistency"])}
        onChange={(val) => onAnswer("platform_consistency", val)}
      />

      {/* Question 9: digital_success_criteria */}
      <MultipleChoiceQuestion
        question="Do you define success metrics for your digital transformation efforts?"
        options={[
          { value: "no_criteria", label: "No — we’re not sure how to measure it" },
          { value: "broad_metrics", label: "We use broad or general metrics" },
          { value: "defined_kpis", label: "We have defined KPIs for most efforts" },
          { value: "clear_roi", label: "Yes — each initiative has clear goals and ROI metrics" },
        ]}
        value={getStringAnswer(answers["digital_success_criteria"])}
        onChange={(val) => onAnswer("digital_success_criteria", val)}
      />

      {/* Question 10: adaptability_to_change */}
      <MultipleChoiceQuestion
        question="How well can your organization pivot in response to new digital trends or customer behaviors?"
        options={[
          { value: "slow_response", label: "Slow — it takes a long time to adapt" },
          { value: "inconsistent", label: "Inconsistent — depends on the team or situation" },
          { value: "moderately_agile", label: "Moderately agile — we can shift direction with effort" },
          { value: "very_agile", label: "Very agile — we adapt quickly and proactively" },
        ]}
        value={getStringAnswer(answers["adaptability_to_change"])}
        onChange={(val) => onAnswer("adaptability_to_change", val)}
      />
    </div>
  );
}
