"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["remote_visibility"] === "string" &&
    answers["remote_visibility"].trim().length > 0 &&

    typeof answers["coe_structure"] === "string" &&
    answers["coe_structure"].trim().length > 0 &&

    typeof answers["scalability_confidence"] === "string" &&
    answers["scalability_confidence"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: remote_visibility */}
<MultipleChoiceQuestion
  question="How do you monitor adherence to processes across remote, hybrid, or distributed teams?"
  options={[
    { value: "No formal monitoring", label: "No formal monitoring" },
    { value: "Manual oversight or reviews", label: "Manual oversight or reviews" },
    { value: "Digital compliance and reporting", label: "Digital compliance and reporting" },
    { value: "Real-time dashboards and alerts", label: "Real-time dashboards and alerts" },
  ]}
  value={getStringAnswer(answers["remote_visibility"])}
  onChange={(val) => onAnswer("remote_visibility", val)}
/>

      {/* Question 5: coe_structure */}
      <MultipleChoiceQuestion
  question="Do you have a cross-functional BPM steering group or center of excellence (CoE)?"
  options={[
    { value: "No", label: "No" },
    { value: "discussed it", label: "We’ve discussed it" },
    { value: "newly formed", label: "Yes — newly formed" },
    { value: "active and well-established", label: "Yes — active and well-established" },
  ]}
  value={getStringAnswer(answers["coe_structure"])}
  onChange={(val) => onAnswer("coe_structure", val)}
/>


      {/* Question 6: scalability_confidence */}
<MultipleChoiceQuestion
  question="How confident are you in your ability to scale processes across new markets, teams, or business models without loss of quality?"
  options={[
    { value: "Not confident", label: "Not confident" },
    { value: "Somewhat", label: "Somewhat confident" },
    { value: "Mostly", label: "Mostly confident" },
    { value: "Fully confident", label: "Fully confident — proven track record" },
  ]}
  value={getStringAnswer(answers["scalability_confidence"])}
  onChange={(val) => onAnswer("scalability_confidence", val)}
/>

    </div>
  );
}
