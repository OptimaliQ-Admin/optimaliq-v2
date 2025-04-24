"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import { getStringAnswer } from "@/lib/utils/validateAnswer";

export function isScore_1Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_expectations"] === "string" &&
    typeof answers["ai_timeframe"] === "string" &&
    typeof answers["ai_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_expectations */}
      <MultipleChoiceQuestion
        question="What’s your current expectation of what AI could do for your business?"
        options={[
          { value: "Not sure", label: "Not sure — it’s all a bit confusing" },
          { value: "Save time or reduce costs", label: "Help us save time or reduce costs" },
          { value: "Improve decisions", label: "Help us make smarter business decisions" },
          { value: "Transform our business model", label: "Transform our business model" },
        ]}
        value={getStringAnswer(answers["ai_expectations"])}
        onChange={(val) => onAnswer("ai_expectations", val)}
      />

      {/* Question 9: ai_timeframe */}
      <MultipleChoiceQuestion
        question="What’s your realistic timeframe for implementing AI or automation?"
        options={[
          { value: "Not thinking about it yet", label: "Not thinking about it yet" },
          { value: "6-12 months", label: "6–12 months" },
          { value: "3-6 months", label: "3–6 months" },
          { value: "Next 90 days", label: "Next 90 days" },
        ]}
        value={getStringAnswer(answers["ai_timeframe"])}
        onChange={(val) => onAnswer("ai_timeframe", val)}
      />

      {/* Question 10: ai_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your team around AI and automation goals?"
        options={[
          { value: "No alignment", label: "No alignment — people aren’t talking about it" },
          { value: "Loose ideas", label: "We’ve had a few ideas or conversations" },
          { value: "Some agreement", label: "Some agreement on where to start" },
          { value: "Clear shared vision", label: "We have a clear, shared vision and roadmap" },
        ]}
        value={getStringAnswer(answers["ai_alignment"])}
        onChange={(val) => onAnswer("ai_alignment", val)}
      />
    </div>
  );
}
