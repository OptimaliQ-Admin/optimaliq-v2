"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["role_modeling"] === "string" &&
    typeof answers["alignment_routines"] === "string" &&
    typeof answers["motivation_strategy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: role_modeling */}
      <MultipleChoiceQuestion
        question="How consistently do leaders role model desired behaviors and values?"
        options={[
          { value: "not_consistent", label: "Not consistently — it varies widely" },
          { value: "in_moments", label: "In specific moments — when issues arise" },
          { value: "generally", label: "Generally — leaders try to set an example" },
          { value: "always", label: "Always — role modeling is a clear expectation" },
        ]}
        value={getStringAnswer(answers["role_modeling"])}
        onChange={(val) => onAnswer("role_modeling", val)}
      />

      {/* Question 9: alignment_routines */}
      <MultipleChoiceQuestion
        question="What routines or practices do you use to keep your team aligned?"
        options={[
          { value: "none", label: "We don’t really have alignment practices" },
          { value: "basic_meetings", label: "We rely on basic meetings or emails" },
          { value: "structured_syncs", label: "We hold structured syncs or huddles" },
          { value: "clear_goals_and_checkins", label: "We use clear goals, metrics, and check-ins" },
        ]}
        value={getStringAnswer(answers["alignment_routines"])}
        onChange={(val) => onAnswer("alignment_routines", val)}
      />

      {/* Question 10: motivation_strategy */}
      <MultipleChoiceQuestion
        question="How do you approach motivating your team?"
        options={[
          { value: "don’t", label: "We don’t have a clear approach" },
          { value: "praise", label: "We give praise when things go well" },
          { value: "incentives", label: "We use performance incentives or goals" },
          { value: "tailored", label: "We tailor motivation to each team member" },
        ]}
        value={getStringAnswer(answers["motivation_strategy"])}
        onChange={(val) => onAnswer("motivation_strategy", val)}
      />
    </div>
  );
}
