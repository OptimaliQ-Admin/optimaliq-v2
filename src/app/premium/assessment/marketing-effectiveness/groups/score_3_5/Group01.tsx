"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["channel_coordination"] === "string" &&
    typeof answers["ltv_tracking"] === "string" &&
    Array.isArray(answers["lifecycle_stages"]) &&
    answers["lifecycle_stages"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  const selectedStages = answers["lifecycle_stages"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: channel_coordination */}
      <MultipleChoiceQuestion
        question="How are your marketing campaigns coordinated across channels?"
        options={[
          { value: "channels_separate", label: "Channels operate separately" },
          { value: "some_alignment", label: "Channels are aligned on timing, but not message" },
          { value: "campaign_based", label: "Channels follow a shared campaign plan" },
          { value: "fully_integrated", label: "Fully integrated with shared goals, timing, and creative" },
        ]}
        value={getStringAnswer(answers["channel_coordination"])}
        onChange={(val) => onAnswer("channel_coordination", val)}
      />

      {/* Question 2: ltv_tracking */}
      <MultipleChoiceQuestion
        question="How do you track the long-term value of leads or customers (LTV)?"
        options={[
          { value: "no_tracking", label: "We don’t track LTV" },
          { value: "estimates", label: "We estimate based on revenue" },
          { value: "segment_level", label: "We track at a segment or cohort level" },
          { value: "individual_level", label: "We measure at the individual contact level" },
        ]}
        value={getStringAnswer(answers["ltv_tracking"])}
        onChange={(val) => onAnswer("ltv_tracking", val)}
      />

      {/* Question 3: lifecycle_stages */}
      <MultiSelectQuestion
        question="Which customer lifecycle stages do you have defined marketing for?"
        options={[
          { value: "Acquisition", label: "Acquisition" },
          { value: "Onboarding", label: "Onboarding" },
          { value: "Retention", label: "Retention" },
          { value: "Winback", label: "Winback" },
          { value: "Advocacy", label: "Advocacy" },
        ]}
        selected={selectedStages}
        onChange={(val) => onAnswer("lifecycle_stages", val)}
        maxSelect={5}
      />
    </div>
  );
}
