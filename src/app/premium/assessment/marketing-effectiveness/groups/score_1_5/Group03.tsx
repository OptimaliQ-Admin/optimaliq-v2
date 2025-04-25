"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["intentionality"] === "string" &&
    typeof answers["what_performs_best"] === "string" &&
    typeof answers["if_more_budget_or_time"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 8: intentionality */}
      <MultipleChoiceQuestion
        question="What percentage of your marketing feels intentional (vs. reactive or last-minute)?"
        options={[
          { value: "Mostly reactive", label: "Mostly reactive" },
          { value: "About half and half", label: "About half and half" },
          { value: "Mostly intentional", label: "Mostly intentional" },
          { value: "Very intentional with clear strategy", label: "Very intentional with clear strategy" },
        ]}
        value={getStringAnswer(answers["intentionality"])}
        onChange={(val) => onAnswer("intentionality", val)}
      />

      {/* Question 9: what_performs_best */}
      <TextAreaQuestion
        question="What type of content or campaigns do you feel perform best?"
        placeholder="Describe formats, offers, or tactics that tend to work well."
        value={getStringAnswer(answers["what_performs_best"])}
        onChange={(val) => onAnswer("what_performs_best", val)}
        maxLength={300}
      />

      {/* Question 10: if_more_budget_or_time */}
      <TextAreaQuestion
        question="If you had 20% more budget or time for marketing, how would you use it?"
        placeholder="Describe where you’d invest your extra resources."
        value={getStringAnswer(answers["if_more_budget_or_time"])}
        onChange={(val) => onAnswer("if_more_budget_or_time", val)}
        maxLength={300}
      />
    </div>
  );
}
