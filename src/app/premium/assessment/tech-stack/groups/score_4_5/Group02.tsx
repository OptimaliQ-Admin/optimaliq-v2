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

export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["disruptive_tech"] === "string" &&
    typeof answers["market_leadership"] === "string" &&
    typeof answers["tech_ecosystem"] === "string"
  );
}

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you implement disruptive technologies?"
        options={[
          { value: "basic", label: "Basic — technology adoption" },
          { value: "advanced", label: "Advanced — technology innovation" },
          { value: "sophisticated", label: "Sophisticated — technology disruption" },
          { value: "cutting_edge", label: "Cutting-edge — technology creation" },
        ]}
        value={getStringAnswer(answers["disruptive_tech"])}
        onChange={(val) => onAnswer("disruptive_tech", val)}
      />

      <MultipleChoiceQuestion
        question="How do you maintain market leadership?"
        options={[
          { value: "follower", label: "Follower — market adaptation" },
          { value: "leader", label: "Leader — market innovation" },
          { value: "pioneer", label: "Pioneer — market disruption" },
          { value: "visionary", label: "Visionary — market creation" },
        ]}
        value={getStringAnswer(answers["market_leadership"])}
        onChange={(val) => onAnswer("market_leadership", val)}
      />

      <MultipleChoiceQuestion
        question="How do you build your technology ecosystem?"
        options={[
          { value: "basic", label: "Basic — technology partnerships" },
          { value: "advanced", label: "Advanced — technology alliances" },
          { value: "sophisticated", label: "Sophisticated — technology networks" },
          { value: "cutting_edge", label: "Cutting-edge — technology platforms" },
        ]}
        value={getStringAnswer(answers["tech_ecosystem"])}
        onChange={(val) => onAnswer("tech_ecosystem", val)}
      />
    </div>
  );
} 