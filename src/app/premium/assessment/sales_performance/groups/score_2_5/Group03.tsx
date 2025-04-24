"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_d30c39"] === "string" &&
    typeof answers["what’s_9266fd"] === "string" &&
    typeof answers["how_4a7d74"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: how_d30c39 */}
      <MultipleChoiceQuestion
        question="How confident are you that your team is pursuing the highest-value opportunities?"
        options={[
          { value: "not_confident", label: "Not confident — we chase everything" },
          { value: "somewhat", label: "Somewhat — we focus on hot leads" },
          { value: "mostly", label: "Mostly — we use criteria or scoring" },
          { value: "very", label: "Very — we rigorously prioritize our pipeline" },
        ]}
        value={getStringAnswer(answers["how_d30c39"])}
        onChange={(val) => onAnswer("how_d30c39", val)}
      />

      {/* Question 9: what’s_9266fd */}
      <TextAreaQuestion
        question="What’s one sales behavior or process you’d want your team to do more consistently?"
        placeholder="E.g., follow-ups, demo delivery, deal qualification"
        value={getStringAnswer(answers["what’s_9266fd"])}
        onChange={(val) => onAnswer("what’s_9266fd", val)}
        maxLength={300}
      />

      {/* Question 10: how_4a7d74 */}
      <MultipleChoiceQuestion
        question="How scalable is your current sales process if you doubled your deal volume tomorrow?"
        options={[
          { value: "not_scalable", label: "Not scalable — we’d break down" },
          { value: "challenging", label: "It would be a challenge" },
          { value: "mostly_scalable", label: "Mostly scalable with adjustments" },
          { value: "fully_scalable", label: "Fully scalable — we’re built to grow" },
        ]}
        value={getStringAnswer(answers["how_4a7d74"])}
        onChange={(val) => onAnswer("how_4a7d74", val)}
      />
    </div>
  );
}
