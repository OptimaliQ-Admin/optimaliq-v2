"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_familiarity"] === "string" &&
    typeof answers["current_ai_usage"] === "string" &&
    typeof answers["ai_hesitation"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: ai_familiarity */}
      <MultipleChoiceQuestion
        question="How familiar are you with the concept of AI and automation?"
        options={[
          { value: "Not at all", label: "Not at all" },
          { value: "I've heard of it", label: "I've heard of it" },
          { value: "Somewhat familiar", label: "Somewhat familiar" },
          { value: "Very familiar or experienced", label: "Very familiar or experienced" },
        ]}
        value={getStringAnswer(answers["ai_familiarity"])}
        onChange={(val) => onAnswer("ai_familiarity", val)}
      />

      {/* Question 2: current_ai_usage */}
      <MultipleChoiceQuestion
        question="Are you currently using any AI or automation tools in your business?"
        options={[
          { value: "No", label: "No" },
          { value: "Not sure", label: "Not sure" },
          { value: "We’re experimenting with some", label: "We’re experimenting with some" },
          { value: "Yes — they’re part of our daily operations", label: "Yes — they’re part of our daily operations" },
        ]}
        value={getStringAnswer(answers["current_ai_usage"])}
        onChange={(val) => onAnswer("current_ai_usage", val)}
      />

      {/* Question 3: ai_hesitation */}
      <MultipleChoiceQuestion
        question="What’s your biggest hesitation when it comes to using AI?"
        options={[
          { value: "Too complex", label: "Too complex" },
          { value: "Too expensive", label: "Too expensive" },
          { value: "Not sure where to start", label: "Not sure where to start" },
          { value: "Security or data concerns", label: "Security or data concerns" },
        ]}
        value={getStringAnswer(answers["ai_hesitation"])}
        onChange={(val) => onAnswer("ai_hesitation", val)}
      />
    </div>
  );
}
