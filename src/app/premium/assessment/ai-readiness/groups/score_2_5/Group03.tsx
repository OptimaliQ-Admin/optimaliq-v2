"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_skill_depth"] === "string" &&
    typeof answers["ai_experimentation"] === "string" &&
    typeof answers["ops_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_skill_depth */}
      <MultipleChoiceQuestion
        question="How deep is your internal AI or machine learning skill set?"
        options={[
          { value: "none", label: "None — no relevant skills on staff" },
          { value: "basic", label: "Basic — 1-2 people with introductory experience" },
          { value: "functional", label: "Functional — can build and test simple models" },
          { value: "specialized", label: "Specialized — deep expertise on staff or via partners" },
        ]}
        value={getStringAnswer(answers["ai_skill_depth"])}
        onChange={(val) => onAnswer("ai_skill_depth", val)}
      />

      {/* Question 9: ai_experimentation */}
      <MultipleChoiceQuestion
        question="Are you actively experimenting with AI in any part of your business?"
        options={[
          { value: "no_tests", label: "No — we’re not testing anything yet" },
          { value: "limited_tests", label: "Limited tests in isolated use cases" },
          { value: "multiple_pilots", label: "Multiple pilots across teams" },
          { value: "ongoing_experiments", label: "Ongoing experiments tied to business goals" },
        ]}
        value={getStringAnswer(answers["ai_experimentation"])}
        onChange={(val) => onAnswer("ai_experimentation", val)}
      />

      {/* Question 10: ops_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your AI efforts with your broader operations or strategy?"
        options={[
          { value: "not_aligned", label: "Not aligned — disconnected or ad hoc" },
          { value: "partial_alignment", label: "Somewhat aligned — individual teams experimenting" },
          { value: "mostly_aligned", label: "Mostly aligned — most use cases tie into operations" },
          { value: "fully_aligned", label: "Fully aligned — AI supports core strategy and goals" },
        ]}
        value={getStringAnswer(answers["ops_alignment"])}
        onChange={(val) => onAnswer("ops_alignment", val)}
      />
    </div>
  );
}
