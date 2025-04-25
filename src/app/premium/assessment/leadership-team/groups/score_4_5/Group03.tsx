"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["strategy_alignment"] === "string" &&
    typeof answers["innovation_mindset"] === "string" &&
    typeof answers["leadership_scalability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: strategy_alignment */}
      <MultipleChoiceQuestion
        question="How well do leadership goals align with the company's strategy?"
        options={[
          { value: "not_aligned", label: "They often feel disconnected" },
          { value: "somewhat_aligned", label: "They’re somewhat aligned but not clear" },
          { value: "mostly_aligned", label: "Goals are mostly aligned and reviewed" },
          { value: "fully_aligned", label: "There is full alignment and shared ownership" },
        ]}
        value={getStringAnswer(answers["strategy_alignment"])}
        onChange={(val) => onAnswer("strategy_alignment", val)}
      />

      {/* Question 9: innovation_mindset */}
      <MultipleChoiceQuestion
        question="How do leaders foster innovation across the business?"
        options={[
          { value: "not_encouraged", label: "It’s not really encouraged" },
          { value: "some_ideas", label: "Some ideas are welcomed" },
          { value: "structured_support", label: "There are structured ways to propose and test ideas" },
          { value: "innovation_culture", label: "Innovation is a core part of leadership culture" },
        ]}
        value={getStringAnswer(answers["innovation_mindset"])}
        onChange={(val) => onAnswer("innovation_mindset", val)}
      />

      {/* Question 10: leadership_scalability */}
      <MultipleChoiceQuestion
        question="How scalable is your current leadership model?"
        options={[
          { value: "depends_on_people", label: "It depends too much on specific individuals" },
          { value: "partially_scalable", label: "Some functions are scalable, but not consistently" },
          { value: "scalable_with_training", label: "It scales with intentional training and hiring" },
          { value: "fully_scalable_model", label: "We have a fully scalable model with strong succession planning" },
        ]}
        value={getStringAnswer(answers["leadership_scalability"])}
        onChange={(val) => onAnswer("leadership_scalability", val)}
      />
    </div>
  );
}
