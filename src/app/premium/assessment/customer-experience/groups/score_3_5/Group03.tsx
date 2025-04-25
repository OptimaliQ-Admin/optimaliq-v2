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
    typeof answers["cx_feedback_loops"] === "string" &&
    typeof answers["cx_innovation"] === "string" &&
    typeof answers["cx_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="How are customer feedback loops managed?"
        options={[
          { value: "ad_hoc", label: "Ad hoc or not formally managed" },
          { value: "surveys_only", label: "We use surveys occasionally" },
          { value: "ongoing_cx_loops", label: "We have ongoing feedback loops" },
          { value: "feedback_drives_change", label: "Feedback directly drives roadmap or strategy" },
        ]}
        value={getStringAnswer(answers["cx_feedback_loops"])}
        onChange={(val) => onAnswer("cx_feedback_loops", val)}
      />

      <MultipleChoiceQuestion
        question="How often do you introduce new CX innovations or improvements?"
        options={[
          { value: "rarely", label: "Rarely or only reactively" },
          { value: "sometimes", label: "Sometimes, during planning cycles" },
          { value: "frequently", label: "Frequently — part of experimentation" },
          { value: "cx_innovation_culture", label: "CX innovation is a continuous process" },
        ]}
        value={getStringAnswer(answers["cx_innovation"])}
        onChange={(val) => onAnswer("cx_innovation", val)}
      />

      <MultipleChoiceQuestion
        question="How aligned are your teams around delivering a consistent CX?"
        options={[
          { value: "low_alignment", label: "Teams are siloed or CX isn’t a shared priority" },
          { value: "some_alignment", label: "Some alignment on high-level goals" },
          { value: "cross_functional_support", label: "Cross-functional support for CX" },
          { value: "full_alignment", label: "Everyone is aligned with shared CX goals and metrics" },
        ]}
        value={getStringAnswer(answers["cx_alignment"])}
        onChange={(val) => onAnswer("cx_alignment", val)}
      />
    </div>
  );
}
