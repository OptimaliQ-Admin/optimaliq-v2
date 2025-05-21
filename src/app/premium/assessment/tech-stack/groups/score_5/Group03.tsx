"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["future_vision"] === "string" &&
    typeof answers["tech_leadership"] === "string" &&
    typeof answers["innovation_ecosystem"] === "string"
  );
}

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you envision the future of technology?"
        options={[
          { value: "reactive", label: "Reactive — adapting to change" },
          { value: "proactive", label: "Proactive — anticipating change" },
          { value: "visionary", label: "Visionary — creating change" },
          { value: "transformative", label: "Transformative — redefining the future" },
        ]}
        value={getStringAnswer(answers["future_vision"])}
        onChange={(val) => onAnswer("future_vision", val)}
      />

      <MultipleChoiceQuestion
        question="How do you demonstrate technology leadership?"
        options={[
          { value: "follower", label: "Follower — adopting best practices" },
          { value: "leader", label: "Leader — setting standards" },
          { value: "pioneer", label: "Pioneer — creating new paradigms" },
          { value: "visionary", label: "Visionary — defining the future" },
        ]}
        value={getStringAnswer(answers["tech_leadership"])}
        onChange={(val) => onAnswer("tech_leadership", val)}
      />

      <MultipleChoiceQuestion
        question="How do you build your innovation ecosystem?"
        options={[
          { value: "basic", label: "Basic — internal innovation" },
          { value: "advanced", label: "Advanced — partner innovation" },
          { value: "sophisticated", label: "Sophisticated — ecosystem innovation" },
          { value: "transformative", label: "Transformative — industry innovation" },
        ]}
        value={getStringAnswer(answers["innovation_ecosystem"])}
        onChange={(val) => onAnswer("innovation_ecosystem", val)}
      />
    </div>
  );
} 