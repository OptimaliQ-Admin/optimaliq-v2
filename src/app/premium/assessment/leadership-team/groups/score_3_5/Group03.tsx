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
    typeof answers["team_empowerment"] === "string" &&
    typeof answers["leadership_scalability"] === "string" &&
    typeof answers["cross_functional_leadership"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: team_empowerment */}
      <MultipleChoiceQuestion
        question="How empowered do team members feel to make decisions and take ownership?"
        options={[
          { value: "not_empowered", label: "Not at all — decisions are top-down" },
          { value: "somewhat_empowered", label: "Somewhat — they have input, but leadership decides" },
          { value: "mostly_empowered", label: "Mostly — teams can act within boundaries" },
          { value: "fully_empowered", label: "Fully — ownership and autonomy are encouraged" },
        ]}
        value={getStringAnswer(answers["team_empowerment"])}
        onChange={(val) => onAnswer("team_empowerment", val)}
      />

      {/* Question 9: leadership_scalability */}
      <MultipleChoiceQuestion
        question="How scalable is your current leadership structure for future growth?"
        options={[
          { value: "not_scalable", label: "Not scalable — it’s already strained" },
          { value: "scalable_with_changes", label: "Somewhat scalable — but will need changes soon" },
          { value: "mostly_scalable", label: "Mostly scalable — ready for moderate growth" },
          { value: "fully_scalable", label: "Fully scalable — built for long-term growth" },
        ]}
        value={getStringAnswer(answers["leadership_scalability"])}
        onChange={(val) => onAnswer("leadership_scalability", val)}
      />

      {/* Question 10: cross_functional_leadership */}
      <MultipleChoiceQuestion
        question="How effective is your cross-functional leadership collaboration?"
        options={[
          { value: "siloed", label: "Siloed — teams rarely work together" },
          { value: "ad_hoc", label: "Ad hoc — some collaboration when needed" },
          { value: "coordinated", label: "Coordinated — teams align regularly" },
          { value: "integrated", label: "Integrated — leadership collaborates on strategy and execution" },
        ]}
        value={getStringAnswer(answers["cross_functional_leadership"])}
        onChange={(val) => onAnswer("cross_functional_leadership", val)}
      />
    </div>
  );
}
