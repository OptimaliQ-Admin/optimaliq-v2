"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_visibility"] === "string" &&
    typeof answers["internal_collaboration"] === "string" &&
    typeof answers["tool_overlap"] === "string" &&
    typeof answers["digital_leadership"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: customer_visibility */}
      <MultipleChoiceQuestion
        question="Do you have a unified view of your customer across systems?"
        options={[
          { value: "no_customer_view", label: "No — customer data is siloed" },
          { value: "partial_customer_view", label: "Some data is connected, but incomplete" },
          { value: "mostly_connected", label: "We mostly have unified customer profiles" },
          { value: "fully_connected", label: "Yes — all customer data is integrated and accessible" },
        ]}
        value={getStringAnswer(answers["customer_visibility"])}
        onChange={(val) => onAnswer("customer_visibility", val)}
      />

      {/* Question 5: internal_collaboration */}
      <MultipleChoiceQuestion
        question="How do teams collaborate on digital projects or changes?"
        options={[
          { value: "no_process", label: "There’s no formal collaboration process" },
          { value: "ad_hoc_meetings", label: "Occasional ad hoc meetings" },
          { value: "cross_team_initiatives", label: "We run cross-team initiatives regularly" },
          { value: "structured_governance", label: "We have structured governance and alignment" },
        ]}
        value={getStringAnswer(answers["internal_collaboration"])}
        onChange={(val) => onAnswer("internal_collaboration", val)}
      />

      {/* Question 6: tool_overlap */}
      <MultipleChoiceQuestion
        question="How often do you encounter overlapping or redundant tools?"
        options={[
          { value: "constantly", label: "Constantly — we have tool sprawl" },
          { value: "occasionally", label: "Occasionally — it’s a known issue" },
          { value: "rarely", label: "Rarely — tools are mostly distinct" },
          { value: "never", label: "Never — we have clear tool ownership" },
        ]}
        value={getStringAnswer(answers["tool_overlap"])}
        onChange={(val) => onAnswer("tool_overlap", val)}
      />

      {/* Question 7: digital_leadership */}
      <MultipleChoiceQuestion
        question="Who leads digital transformation efforts in your business?"
        options={[
          { value: "no_owner", label: "No one owns it" },
          { value: "part_time_owner", label: "Someone handles it part-time" },
          { value: "shared_ownership", label: "It’s shared across departments" },
          { value: "dedicated_leader", label: "We have a dedicated digital leader or team" },
        ]}
        value={getStringAnswer(answers["digital_leadership"])}
        onChange={(val) => onAnswer("digital_leadership", val)}
      />
    </div>
  );
}
