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

export function isScore_3_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["intelligent_systems"] === "string" &&
    typeof answers["ai_automation"] === "string" &&
    typeof answers["cognitive_services"] === "string"
  );
}

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you implement intelligent systems?"
        options={[
          { value: "basic", label: "Basic — rule-based systems" },
          { value: "learning", label: "Learning — adaptive systems" },
          { value: "intelligent", label: "Intelligent — cognitive systems" },
          { value: "autonomous", label: "Autonomous — self-learning systems" },
        ]}
        value={getStringAnswer(answers["intelligent_systems"])}
        onChange={(val) => onAnswer("intelligent_systems", val)}
      />

      <MultipleChoiceQuestion
        question="How do you use AI for automation?"
        options={[
          { value: "manual", label: "Manual — basic automation" },
          { value: "automated", label: "Automated — task automation" },
          { value: "intelligent", label: "Intelligent — process automation" },
          { value: "autonomous", label: "Autonomous — end-to-end automation" },
        ]}
        value={getStringAnswer(answers["ai_automation"])}
        onChange={(val) => onAnswer("ai_automation", val)}
      />

      <MultipleChoiceQuestion
        question="How do you leverage cognitive services?"
        options={[
          { value: "none", label: "None — no cognitive services" },
          { value: "basic", label: "Basic — essential services" },
          { value: "integrated", label: "Integrated — multiple services" },
          { value: "advanced", label: "Advanced — custom cognitive services" },
        ]}
        value={getStringAnswer(answers["cognitive_services"])}
        onChange={(val) => onAnswer("cognitive_services", val)}
      />
    </div>
  );
} 