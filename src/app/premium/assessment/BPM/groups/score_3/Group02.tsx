//src/app/tier2/assessment/BPM/groups/score_3/Group02.tsx
"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["handoffs"] === "string" &&
    answers["handoffs"].trim().length > 0 &&

    typeof answers["alerts"] === "string" &&
    answers["alerts"].trim().length > 0 &&

    typeof answers["success_measurement"] === "string" &&
    answers["success_measurement"].trim().length > 0 &&

    typeof answers["change_management"] === "string" &&
    answers["change_management"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">


      {/* Question 4: handoffs */}
<MultipleChoiceQuestion
  question="How clearly are handoffs between teams or departments documented in your workflows?"
  options={[
    { value: "Not documented", label: "Not documented" },
    { value: "Vaguely", label: "Vaguely defined" },
    { value: "Mostly", label: "Mostly documented" },
    { value: "Clearly defined", label: "Clearly defined with owners and SLAs" },
  ]}
  value={getStringAnswer(answers["handoffs"])}
  onChange={(val) => onAnswer("handoffs", val)}
/>

      {/* Question 5: alerts */}
      <MultipleChoiceQuestion
  question="Do you have performance triggers or alerts when a process is delayed or blocked?"
  options={[
    { value: "No", label: "No — we only notice after the fact" },
    { value: "Sometimes", label: "Sometimes — based on manual checks" },
    { value: "Yes — we have alert systems", label: "Yes — we have alert systems in place" },
    { value: "Yes — alerts are automated", label: "Yes — alerts are automated and acted on" },
  ]}
  value={getStringAnswer(answers["alerts"])}
  onChange={(val) => onAnswer("alerts", val)}
/>


      {/* Question 6: success_measurement */}
<TextAreaQuestion
  question="How do you measure the success of a process (beyond just “it got done”) today?"
  placeholder="E.g., "
  value={getStringAnswer(answers["success_measurement"])}
  onChange={(val) => onAnswer("success_measurement", val)}
  maxLength={300}
/>

{/* Question 7: change_management */}
<MultipleChoiceQuestion
  question="How do you handle updates to a process that spans multiple teams?"
  options={[
    { value: "one team makes the change", label: "Usually one team makes the change" },
    { value: "informally communicate updates", label: "We informally communicate updates" },
    { value: "hold coordination meetings", label: "We hold coordination meetings" },
    { value: "formal review with all stakeholders", label: "Changes go through formal review with all stakeholders" },
  ]}
  value={getStringAnswer(answers["change_management"])}
  onChange={(val) => onAnswer("change_management", val)}
/>
    </div>
  );
}
