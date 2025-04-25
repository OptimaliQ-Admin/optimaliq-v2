//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group05_Clarity.tsx
"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

export function isGroup05Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["decision_bottlenecks"] === "string" &&
    answers["decision_bottlenecks"].trim().length > 0 &&

    typeof answers["team_alignment"] === "string" &&
    answers["team_alignment"].trim().length > 0 &&

    typeof answers["future_success"] === "string" &&
    answers["future_success"].trim().length > 0
  );
}


type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group05_Clarity({ answers, onAnswer }: Props) {
  const teamSelected = answers["team_alignment"] || [];
  return (
    <div className="space-y-10">
      {/* Question 13: Decision Bottlenecks */}
      <TextAreaQuestion
        question="What kind of business decisions are hardest for you to make right now?"
        description="Hiring? Prioritization? Marketing spend? Pricing? Something else?"
        placeholder="Be honest. What’s slowing you down the most right now?"
        value={getStringAnswer(answers["decision_bottlenecks"])}
        onChange={(val) => onAnswer("decision_bottlenecks", val)}
        maxLength={300}
      />

      {/* Question 14: Team Alignment */}
<MultipleChoiceQuestion
  question="How aligned is your team on company goals and direction?"
  options={[
    { value: "fully_aligned", label: "Fully aligned and collaborative" },
    { value: "mostly_aligned", label: "Mostly aligned, occasional friction" },
    { value: "some_misalignment", label: "Some misalignment across departments" },
    { value: "not_aligned", label: "No clear alignment — teams are working in silos" },
    { value: "other", label: "Other (please describe)" },
  ]}
  value={typeof teamSelected === "string" ? teamSelected : ""}
  onChange={(val) => onAnswer("team_alignment", val)}
/>

{/* Conditionally show "Other" field */}
{typeof teamSelected === "string" && teamSelected.includes("other") && (
  <TextAreaQuestion
    question="Please describe the alignment of your team"
    placeholder="Describe the alignment of your team..."
    value={getStringAnswer(answers["team_alignment_other"])}
    onChange={(val) => onAnswer("team_alignment_other", val)}
    maxLength={50}
  />
      )}

      {/* Question 15: Future State */}
      <TextAreaQuestion
        question="What would a wildly successful next 12 months look like for your business?"
        description="Revenue, people, customers, product—describe your future state vividly."
        placeholder="Paint the picture: What does success look like in 12 months?"
        value={getStringAnswer(answers["future_success"])}
        onChange={(val) => onAnswer("future_success", val)}
        maxLength={300}
      />
    </div>
  );
}
