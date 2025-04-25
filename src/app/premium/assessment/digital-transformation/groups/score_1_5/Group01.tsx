"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["digital_leadership"] === "string" &&
    typeof answers["tech_stack_review"] === "string" &&
    typeof answers["digital_baseline"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: digital_leadership */}
      <MultipleChoiceQuestion
        question="Who is responsible for driving digital transformation in your organization?"
        options={[
          { value: "no_one", label: "No one owns it" },
          { value: "part_time", label: "Someone owns it as a part-time focus" },
          { value: "internal_owner", label: "There’s a clear internal owner" },
          { value: "dedicated_team", label: "There’s a dedicated digital or innovation team" },
        ]}
        value={getStringAnswer(answers["digital_leadership"])}
        onChange={(val) => onAnswer("digital_leadership", val)}
      />

      {/* Question 2: tech_stack_review */}
      <MultipleChoiceQuestion
        question="When was the last time your tech stack or toolset was evaluated for alignment with goals?"
        options={[
          { value: "never", label: "Never — we’re using what we’ve always had" },
          { value: "couple_years", label: "A few years ago" },
          { value: "within_year", label: "Within the past year" },
          { value: "ongoing", label: "We review it regularly or continuously" },
        ]}
        value={getStringAnswer(answers["tech_stack_review"])}
        onChange={(val) => onAnswer("tech_stack_review", val)}
      />

      {/* Question 3: digital_baseline */}
      <MultipleChoiceQuestion
        question="Do you have a clear baseline of how digital transformation is currently impacting your business?"
        options={[
          { value: "no_baseline", label: "No baseline — we haven’t measured anything" },
          { value: "some_data", label: "We have a few metrics or benchmarks" },
          { value: "basic_snapshot", label: "We’ve captured a basic snapshot of key areas" },
          { value: "full_baseline", label: "Yes — we track and compare it over time" },
        ]}
        value={getStringAnswer(answers["digital_baseline"])}
        onChange={(val) => onAnswer("digital_baseline", val)}
      />
    </div>
  );
}
