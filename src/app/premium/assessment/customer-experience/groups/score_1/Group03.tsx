"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_journey_understanding"] === "string" &&
    typeof answers["cx_success_definition"] === "string" &&
    typeof answers["customer_success_ownership"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How well do you understand the journey your customers take from awareness to repeat purchase?"
        options={[
          { value: "not_mapped", label: "We haven’t mapped it" },
          { value: "basic_understanding", label: "We have a basic idea" },
          { value: "mapped", label: "We’ve mapped it, but not fully optimized it" },
          { value: "clear_and_optimized", label: "It’s clear and continuously optimized" },
        ]}
        value={getStringAnswer(answers["customer_journey_understanding"])}
        onChange={(val) => onAnswer("customer_journey_understanding", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How do you define and measure customer success or satisfaction?"
        options={[
          { value: "dont_define", label: "We don’t really define or measure it" },
          { value: "gut_feel", label: "We go by gut feel or ad hoc feedback" },
          { value: "some_metrics", label: "We use basic metrics like NPS or reviews" },
          { value: "data_driven", label: "We use data and track CX performance regularly" },
        ]}
        value={getStringAnswer(answers["cx_success_definition"])}
        onChange={(val) => onAnswer("cx_success_definition", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="Who owns the customer experience in your organization?"
        options={[
          { value: "no_owner", label: "No one specifically" },
          { value: "shared_informally", label: "It’s shared across teams informally" },
          { value: "cx_leader", label: "We have someone focused on it part-time or as part of a larger role" },
          { value: "dedicated_team", label: "We have a dedicated CX leader or team" },
        ]}
        value={getStringAnswer(answers["customer_success_ownership"])}
        onChange={(val) => onAnswer("customer_success_ownership", val)}
      />
    </div>
  );
}
