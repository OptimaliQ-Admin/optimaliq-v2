"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["team_feedback"] === "string" &&
    answers["team_feedback"].trim().length > 0 &&

    typeof answers["improvement_input"] === "string" &&
    answers["improvement_input"].trim().length > 0 &&

    typeof answers["incident_review"] === "string" &&
    answers["incident_review"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};


export default function Group02_PositiScore3_5_Step02oning({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: team_feedback */}
<MultipleChoiceQuestion
  question="How do you collect feedback from your team on whether current processes are effective or frustrating?"
  options={[
    { value: "We don’t", label: "We don’t collect feedback" },
    { value: "ask during 1:1s or meetings", label: "We ask during 1:1s or meetings" },
    { value: "use forms or surveys occasionally", label: "We use forms or surveys occasionally" },
    { value: "structured feedback loops", label: "We have structured feedback loops" },
  ]}
  value={getStringAnswer(answers["team_feedback"])}
  onChange={(val) => onAnswer("team_feedback", val)}
/>

      {/* Question 5: improvement_input */}
      <MultipleChoiceQuestion
  question="How often do your teams suggest improvements to existing workflows?"
  options={[
    { value: "Rarely", label: "Rarely" },
    { value: "Occasionally", label: "Occasionally" },
    { value: "Frequently, but not always implemented", label: "Frequently, but not always implemented" },
    { value: "Frequently, with follow-through", label: "Frequently, with follow-through" },
  ]}
  value={getStringAnswer(answers["improvement_input"])}
  onChange={(val) => onAnswer("improvement_input", val)}
/>


      {/* Question 6: incident_review */}
<MultipleChoiceQuestion
  question="Do you conduct post-mortems or debriefs after major process failures or breakdowns?"
  options={[
    { value: "No", label: "No" },
    { value: "Only after critical issues", label: "Only after critical issues" },
    { value: "Sometimes", label: "Sometimes" },
    { value: "Always", label: "Always — it’s part of our culture" },
  ]}
  value={getStringAnswer(answers["incident_review"])}
  onChange={(val) => onAnswer("incident_review", val)}
/>

    </div>
  );
}
