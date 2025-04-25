"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["culture_alignment"] === "string" &&
    answers["culture_alignment"].trim().length > 0 &&

    typeof answers["compliance_integration"] === "string" &&
    answers["compliance_integration"].trim().length > 0 &&

    typeof answers["recent_innovation"] === "string" &&
    answers["recent_innovation"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: culture_alignment */}
<MultipleChoiceQuestion
  question="How is BPM embedded in your leadership development and company culture?"
  options={[
    { value: "Not really embedded", label: "Not really embedded" },
    { value: "Included in some leadership discussions", label: "Included in some leadership discussions" },
    { value: "Core part of operational training", label: "Core part of operational training" },
    { value: "Baked into cultural values and rituals", label: "Baked into cultural values and rituals" },
  ]}
  value={getStringAnswer(answers["culture_alignment"])}
  onChange={(val) => onAnswer("culture_alignment", val)}
/>

      {/* Question 5: compliance_integration */}
      <MultipleChoiceQuestion
  question="What role does your BPM system play in risk mitigation and regulatory compliance?"
  options={[
    { value: "Not connected", label: "Not connected" },
    { value: "Light oversight only", label: "Light oversight only" },
    { value: "Integrated with audits/reviews", label: "Integrated with audits/reviews" },
    { value: "Drives automated compliance enforcement", label: "Drives automated compliance enforcement" },
  ]}
  value={getStringAnswer(answers["compliance_integration"])}
  onChange={(val) => onAnswer("compliance_integration", val)}
/>


      {/* Question 6: recent_innovation */}
<TextAreaQuestion
        question="What is the biggest process innovation your organization has implemented in the last 12 months?"
        placeholder="E.g.,"
        value={getStringAnswer(answers["recent_innovation"])}
        onChange={(val) => onAnswer("recent_innovation", val)}
        maxLength={300}
      />

    </div>
  );
}
