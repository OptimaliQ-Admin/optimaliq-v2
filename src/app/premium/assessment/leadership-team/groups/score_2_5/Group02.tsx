"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cross_team_collaboration"] === "string" &&
    typeof answers["feedback_frequency"] === "string" &&
    typeof answers["employee_development"] === "string" &&
    typeof answers["leadership_metrics"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: cross_team_collaboration */}
      <MultipleChoiceQuestion
        question="How well do teams collaborate across departments?"
        options={[
          { value: "rarely_collaborate", label: "Rarely collaborate" },
          { value: "ad_hoc", label: "Collaboration is ad hoc and inconsistent" },
          { value: "encouraged", label: "Encouraged but not always followed" },
          { value: "strong_cross_team", label: "Strong cross-team alignment and workflows" },
        ]}
        value={getStringAnswer(answers["cross_team_collaboration"])}
        onChange={(val) => onAnswer("cross_team_collaboration", val)}
      />

      {/* Question 5: feedback_frequency */}
      <MultipleChoiceQuestion
        question="How often is performance or feedback discussed?"
        options={[
          { value: "yearly_reviews", label: "Only during yearly reviews" },
          { value: "when_needed", label: "When needed or during issues" },
          { value: "quarterly_checkins", label: "Quarterly check-ins or surveys" },
          { value: "ongoing_feedback", label: "Ongoing feedback is part of the culture" },
        ]}
        value={getStringAnswer(answers["feedback_frequency"])}
        onChange={(val) => onAnswer("feedback_frequency", val)}
      />

      {/* Question 6: employee_development */}
      <MultipleChoiceQuestion
        question="How do you support employee development?"
        options={[
          { value: "left_to_employees", label: "Left to employees to manage on their own" },
          { value: "some_guidance", label: "Some guidance from managers" },
          { value: "formal_plans", label: "Formal growth plans and check-ins" },
          { value: "embedded_in_processes", label: "Embedded into HR processes and systems" },
        ]}
        value={getStringAnswer(answers["employee_development"])}
        onChange={(val) => onAnswer("employee_development", val)}
      />

      {/* Question 7: leadership_metrics */}
      <MultipleChoiceQuestion
        question="Do you track leadership or management effectiveness with metrics?"
        options={[
          { value: "no_tracking", label: "No, we don’t track this" },
          { value: "some_feedback", label: "Some occasional feedback or surveys" },
          { value: "basic_metrics", label: "We track a few basic metrics" },
          { value: "formal_leadership_kpis", label: "We have formal KPIs and reviews" },
        ]}
        value={getStringAnswer(answers["leadership_metrics"])}
        onChange={(val) => onAnswer("leadership_metrics", val)}
      />
    </div>
  );
}
