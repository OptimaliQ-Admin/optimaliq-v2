"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["leadership_alignment"] === "string" &&
    typeof answers["employee_sentiment_strategy"] === "string" &&
    typeof answers["cross_functional_enablement"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: leadership_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your leaders on company vision and goals?"
        options={[
          { value: "misaligned", label: "Misaligned — goals differ widely" },
          { value: "somewhat_aligned", label: "Somewhat aligned but not clearly communicated" },
          { value: "aligned_top_down", label: "Generally aligned through top-down planning" },
          { value: "fully_aligned", label: "Fully aligned with shared understanding and buy-in" },
        ]}
        value={getStringAnswer(answers["leadership_alignment"])}
        onChange={(val) => onAnswer("leadership_alignment", val)}
      />

      {/* Question 9: employee_sentiment_strategy */}
      <MultipleChoiceQuestion
        question="How often does employee sentiment inform leadership strategy?"
        options={[
          { value: "rarely_considered", label: "Rarely — strategy is separate" },
          { value: "sometimes_referenced", label: "Sometimes referenced in planning" },
          { value: "regularly_reviewed", label: "Regularly reviewed during leadership meetings" },
          { value: "embedded_feedback_loop", label: "Embedded — it drives leadership focus" },
        ]}
        value={getStringAnswer(answers["employee_sentiment_strategy"])}
        onChange={(val) => onAnswer("employee_sentiment_strategy", val)}
      />

      {/* Question 10: cross_functional_enablement */}
      <MultipleChoiceQuestion
        question="How well do leaders enable collaboration across departments?"
        options={[
          { value: "siloed", label: "Poorly — silos are common" },
          { value: "informal_coordination", label: "There is informal coordination" },
          { value: "process_based", label: "Some cross-functional processes exist" },
          { value: "proactively_enabled", label: "Proactively enabled through shared goals and incentives" },
        ]}
        value={getStringAnswer(answers["cross_functional_enablement"])}
        onChange={(val) => onAnswer("cross_functional_enablement", val)}
      />
    </div>
  );
}
