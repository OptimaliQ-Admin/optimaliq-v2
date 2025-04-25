"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["response_time_expectation"] === "string" &&
    typeof answers["channel_consistency"] === "string" &&
    typeof answers["customer_feedback_use"] === "string" &&
    typeof answers["customer_experience_gap"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How quickly do you typically respond to customer inquiries or issues?"
        options={[
          { value: "takes_days", label: "It can take days" },
          { value: "usually_within_day", label: "Usually within a day" },
          { value: "few_hours", label: "Within a few hours" },
          { value: "real_time", label: "We aim for real-time responses" },
        ]}
        value={getStringAnswer(answers["response_time_expectation"])}
        onChange={(val) => onAnswer("response_time_expectation", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How consistent is your customer experience across channels (email, phone, social, etc.)?"
        options={[
          { value: "not_aligned", label: "Each channel feels different" },
          { value: "mostly_similar", label: "Mostly similar, but with gaps" },
          { value: "very_similar", label: "Very similar, customers feel the same regardless of channel" },
          { value: "fully_integrated", label: "Fully integrated, seamless omnichannel experience" },
        ]}
        value={getStringAnswer(answers["channel_consistency"])}
        onChange={(val) => onAnswer("channel_consistency", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How do you use customer feedback in your business?"
        options={[
          { value: "not_used", label: "We don’t really use it" },
          { value: "informal_input", label: "Used informally when we get it" },
          { value: "some_process", label: "There’s some process to review it" },
          { value: "actively_applied", label: "We regularly use it to improve experiences" },
        ]}
        value={getStringAnswer(answers["customer_feedback_use"])}
        onChange={(val) => onAnswer("customer_feedback_use", val)}
      />

      {/* Question 7 */}
      <TextAreaQuestion
        question="What’s one area of the customer experience that feels the most broken or confusing today?"
        placeholder="E.g., onboarding emails, support handoffs, checkout flow..."
        value={getStringAnswer(answers["customer_experience_gap"])}
        onChange={(val) => onAnswer("customer_experience_gap", val)}
        maxLength={300}
      />
    </div>
  );
}
