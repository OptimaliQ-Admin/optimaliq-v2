"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["understand_customer_needs"] === "string" &&
    typeof answers["customer_feedback_frequency"] === "string" &&
    typeof answers["consistent_experience"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How well do you understand your customers' needs and expectations?"
        options={[
          { value: "guesswork", label: "It’s mostly guesswork" },
          { value: "some_feedback", label: "We gather some feedback but don’t analyze it" },
          { value: "general_idea", label: "We have a general idea based on interactions" },
          { value: "deep_insight", label: "We actively collect and analyze customer feedback" },
        ]}
        value={getStringAnswer(answers["understand_customer_needs"])}
        onChange={(val) => onAnswer("understand_customer_needs", val)}
      />

      {/* Question 2 */}
      <MultipleChoiceQuestion
        question="How often do you collect feedback from customers?"
        options={[
          { value: "never", label: "We don’t collect customer feedback" },
          { value: "rarely", label: "Occasionally, when there’s a problem" },
          { value: "sometimes", label: "We collect it from time to time" },
          { value: "regularly", label: "We collect feedback regularly and systematically" },
        ]}
        value={getStringAnswer(answers["customer_feedback_frequency"])}
        onChange={(val) => onAnswer("customer_feedback_frequency", val)}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="Do customers receive a consistent experience across your business?"
        options={[
          { value: "not_consistent", label: "No — it varies widely" },
          { value: "somewhat_consistent", label: "Somewhat — it depends on the team or day" },
          { value: "mostly_consistent", label: "Mostly — we aim for consistency" },
          { value: "very_consistent", label: "Yes — we’ve built consistent service standards" },
        ]}
        value={getStringAnswer(answers["consistent_experience"])}
        onChange={(val) => onAnswer("consistent_experience", val)}
      />
    </div>
  );
}
