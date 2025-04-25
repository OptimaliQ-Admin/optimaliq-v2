"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["campaign_personalization"] === "string" &&
    typeof answers["team_enablement"] === "string" &&
    typeof answers["budget_visibility"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: campaign_personalization */}
      <MultipleChoiceQuestion
        question="How personalized are your campaigns to different customer segments?"
        options={[
          { value: "one_size_fits_all", label: "Not at all — one-size-fits-all" },
          { value: "some_variation", label: "Some variation by channel or product" },
          { value: "basic_segmentation", label: "Yes — we use personas or segment rules" },
          { value: "advanced_personalization", label: "Advanced — we use behavioral data and dynamic content" },
        ]}
        value={getStringAnswer(answers["campaign_personalization"])}
        onChange={(val) => onAnswer("campaign_personalization", val)}
      />

      {/* Question 9: team_enablement */}
      <MultipleChoiceQuestion
        question="How enabled is your team to act on marketing data or insights?"
        options={[
          { value: "no_enablement", label: "They rarely use data in decision making" },
          { value: "some_training", label: "Some training, but it’s not part of the routine" },
          { value: "mostly_enabled", label: "They review and discuss reports regularly" },
          { value: "fully_enabled", label: "They self-serve and use insights to adjust tactics" },
        ]}
        value={getStringAnswer(answers["team_enablement"])}
        onChange={(val) => onAnswer("team_enablement", val)}
      />

      {/* Question 10: budget_visibility */}
      <MultipleChoiceQuestion
        question="How visible is your marketing spend and ROI?"
        options={[
          { value: "not_visible", label: "Not visible — we don’t track it well" },
          { value: "topline_only", label: "We have a rough budget vs spend view" },
          { value: "performance_tracked", label: "Spend and performance are tracked together" },
          { value: "fully_attributed", label: "We use attribution modeling or ROI frameworks" },
        ]}
        value={getStringAnswer(answers["budget_visibility"])}
        onChange={(val) => onAnswer("budget_visibility", val)}
      />
    </div>
  );
}
