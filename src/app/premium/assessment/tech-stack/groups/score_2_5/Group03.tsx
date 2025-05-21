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

export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["emerging_tech"] === "string" &&
    typeof answers["innovation_culture"] === "string" &&
    typeof answers["future_vision"] === "string"
  );
}

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you approach emerging technologies?"
        options={[
          { value: "monitoring", label: "Monitoring — track new technologies" },
          { value: "experimenting", label: "Experimenting — pilot new solutions" },
          { value: "adopting", label: "Adopting — implement proven technologies" },
          { value: "pioneering", label: "Pioneering — develop new technologies" },
        ]}
        value={getStringAnswer(answers["emerging_tech"])}
        onChange={(val) => onAnswer("emerging_tech", val)}
      />

      <MultipleChoiceQuestion
        question="How would you describe your innovation culture?"
        options={[
          { value: "traditional", label: "Traditional — focused on stability" },
          { value: "balanced", label: "Balanced — stability and innovation" },
          { value: "innovative", label: "Innovative — encourage new ideas" },
          { value: "transformative", label: "Transformative — drive change" },
        ]}
        value={getStringAnswer(answers["innovation_culture"])}
        onChange={(val) => onAnswer("innovation_culture", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach future technology vision?"
        options={[
          { value: "reactive", label: "Reactive — respond to market changes" },
          { value: "proactive", label: "Proactive — anticipate changes" },
          { value: "strategic", label: "Strategic — shape future direction" },
          { value: "visionary", label: "Visionary — define future state" },
        ]}
        value={getStringAnswer(answers["future_vision"])}
        onChange={(val) => onAnswer("future_vision", val)}
      />
    </div>
  );
} 