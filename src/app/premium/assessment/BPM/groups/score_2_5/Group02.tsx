"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["role_clarity"] === "string" &&
    answers["role_clarity"].trim().length > 0 &&

    typeof answers["workflow_disruption"] === "string" &&
    answers["workflow_disruption"].trim().length > 0 &&

    typeof answers["friction"] === "string" &&
    answers["friction"].trim().length > 0 &&

    typeof answers["resiliency"] === "string" &&
    answers["resiliency"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: role_clarity */}
<MultipleChoiceQuestion
  question="How clearly are roles and responsibilities defined in your core workflows?"
  options={[
    { value: "Unclear", label: "Unclear — people figure it out" },
    { value: "Somewhat", label: "Somewhat — there’s rough understanding" },
    { value: "Mostly", label: "Mostly — key roles are documented" },
    { value: "Very clearly", label: "Very clearly — with RACI or equivalent models" },
  ]}
  value={getStringAnswer(answers["role_clarity"])}
  onChange={(val) => onAnswer("role_clarity", val)}
/>

      {/* Question 5: workflow_disruption */}
      <MultipleChoiceQuestion
  question="How often are your workflows disrupted by unclear ownership or steps?"
  options={[
    { value: "Frequently", label: "Frequently" },
    { value: "Occasionally", label: "Occasionally" },
    { value: "Rarely", label: "Rarely" },
    { value: "Almost never", label: "Almost never" },
  ]}
  value={getStringAnswer(answers["workflow_disruption"])}
  onChange={(val) => onAnswer("workflow_disruption", val)}
/>


      {/* Question 6: friction */}
      <TextAreaQuestion
  question="What would you say is the biggest source of friction in your current operational processes?"
  placeholder="E.g., documentation."
  value={getStringAnswer(answers["friction"])}
  onChange={(val) => onAnswer("friction", val)}
  maxLength={300}
/>

{/* Question 7: resiliency */}
<MultipleChoiceQuestion
  question="When a team member is unavailable (vacation, turnover), how easy is it for someone else to take over their tasks?"
  options={[
    { value: "Very difficult", label: "Very difficult — we rely on that person" },
    { value: "Somewhat", label: "Somewhat difficult without guidance" },
    { value: "Mostly", label: "Mostly manageable with instructions" },
    { value: "Easy", label: "Easy — the process is documented and repeatable" },
  ]}
  value={getStringAnswer(answers["resiliency"])}
  onChange={(val) => onAnswer("resiliency", val)}
/>
    </div>
  );
}
