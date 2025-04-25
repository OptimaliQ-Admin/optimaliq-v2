"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["vision_alignment"] === "string" &&
    typeof answers["roles_clarity"] === "string" &&
    typeof answers["team_feedback_frequency"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: vision_alignment */}
      <MultipleChoiceQuestion
        question="How well does your team understand the company’s vision and priorities?"
        options={[
          { value: "not_clear", label: "It’s unclear or rarely discussed" },
          { value: "somewhat_clear", label: "Some team members understand it" },
          { value: "mostly_clear", label: "It’s mostly clear and communicated" },
          { value: "very_clear", label: "It’s very clear and regularly reinforced" },
        ]}
        value={getStringAnswer(answers["vision_alignment"])}
        onChange={(val) => onAnswer("vision_alignment", val)}
      />

      {/* Question 2: roles_clarity */}
      <MultipleChoiceQuestion
        question="How clearly defined are roles and responsibilities within your team?"
        options={[
          { value: "very_unclear", label: "Very unclear — lots of overlap and confusion" },
          { value: "somewhat_clear", label: "Somewhat clear — but gaps still exist" },
          { value: "mostly_clear", label: "Mostly clear — roles are generally understood" },
          { value: "very_clear", label: "Very clear — everyone knows their scope and boundaries" },
        ]}
        value={getStringAnswer(answers["roles_clarity"])}
        onChange={(val) => onAnswer("roles_clarity", val)}
      />

      {/* Question 3: team_feedback_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you give or receive feedback as a team?"
        options={[
          { value: "rarely", label: "Rarely — only during annual reviews" },
          { value: "occasionally", label: "Occasionally — during team meetings or projects" },
          { value: "regularly", label: "Regularly — we encourage ongoing feedback" },
          { value: "always", label: "Always — it’s embedded in our team culture" },
        ]}
        value={getStringAnswer(answers["team_feedback_frequency"])}
        onChange={(val) => onAnswer("team_feedback_frequency", val)}
      />
    </div>
  );
}
