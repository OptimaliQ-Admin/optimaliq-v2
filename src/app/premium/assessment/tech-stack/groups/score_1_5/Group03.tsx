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

export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["innovation_capability"] === "string" &&
    typeof answers["scalability_planning"] === "string" &&
    typeof answers["future_tech_strategy"] === "string"
  );
}

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How would you describe your innovation capability?"
        options={[
          { value: "reactive", label: "Reactive — respond to market changes" },
          { value: "experimental", label: "Experimental — try new technologies" },
          { value: "proactive", label: "Proactive — actively innovate" },
          { value: "leading", label: "Leading — drive industry innovation" },
        ]}
        value={getStringAnswer(answers["innovation_capability"])}
        onChange={(val) => onAnswer("innovation_capability", val)}
      />

      <MultipleChoiceQuestion
        question="How do you plan for technology scalability?"
        options={[
          { value: "reactive", label: "Reactive — scale when needed" },
          { value: "planned", label: "Planned — regular capacity planning" },
          { value: "proactive", label: "Proactive — anticipate growth" },
          { value: "strategic", label: "Strategic — built for scale" },
        ]}
        value={getStringAnswer(answers["scalability_planning"])}
        onChange={(val) => onAnswer("scalability_planning", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach future technology strategy?"
        options={[
          { value: "tactical", label: "Tactical — focus on immediate needs" },
          { value: "planned", label: "Planned — regular technology reviews" },
          { value: "strategic", label: "Strategic — long-term technology roadmap" },
          { value: "visionary", label: "Visionary — shape future technology" },
        ]}
        value={getStringAnswer(answers["future_tech_strategy"])}
        onChange={(val) => onAnswer("future_tech_strategy", val)}
      />
    </div>
  );
} 