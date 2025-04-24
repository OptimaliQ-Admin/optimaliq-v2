"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["automated_journeys"] === "string" &&
    typeof answers["sales_alignment"] === "string" &&
    typeof answers["lead_quality"] === "string" &&
    typeof answers["lead_nurture_strategy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: automated_journeys */}
      <MultipleChoiceQuestion
        question="Do you have automated workflows or nurture journeys set up?"
        options={[
          { value: "No automation in place", label: "No automation in place" },
          { value: "Basic welcome or follow-up emails", label: "Basic welcome or follow-up emails" },
          { value: "Segmented nurture tracks based on behaviors", label: "Segmented nurture tracks based on behaviors" },
          { value: "Advanced journeys triggered by real-time data", label: "Advanced journeys triggered by real-time data" },
        ]}
        value={getStringAnswer(answers["automated_journeys"])}
        onChange={(val) => onAnswer("automated_journeys", val)}
      />

      {/* Question 5: sales_alignment */}
      <MultipleChoiceQuestion
        question="How are marketing and sales currently aligned in your business?"
        options={[
          { value: "They operate independently", label: "They operate independently" },
          { value: "They share leads and updates", label: "They share leads and updates" },
          { value: "They review funnel and performance together", label: "They review funnel and performance together" },
          { value: "They collaborate deeply on goals and messaging", label: "They collaborate deeply on goals and messaging" },
        ]}
        value={getStringAnswer(answers["sales_alignment"])}
        onChange={(val) => onAnswer("sales_alignment", val)}
      />

      {/* Question 6: lead_quality */}
      <MultipleChoiceQuestion
        question="How confident are you in the quality of leads passed from marketing to sales?"
        options={[
          { value: "Not confident", label: "Not confident" },
          { value: "Mixed results", label: "Mixed results" },
          { value: "Mostly good quality", label: "Mostly good quality" },
          { value: "Very confident", label: "Very confident" },
        ]}
        value={getStringAnswer(answers["lead_quality"])}
        onChange={(val) => onAnswer("lead_quality", val)}
      />

      {/* Question 7: lead_nurture_strategy */}
      <MultipleChoiceQuestion
        question="Which of the following best describes your lead nurture strategy?"
        options={[
          { value: "We don’t nurture leads", label: "We don’t nurture leads" },
          { value: "We send occasional emails or newsletters", label: "We send occasional emails or newsletters" },
          { value: "We have a nurture strategy but it’s not consistent", label: "We have a nurture strategy but it’s not consistent" },
          { value: "We have a documented, consistent nurture strategy", label: "We have a documented, consistent nurture strategy" },
        ]}
        value={getStringAnswer(answers["lead_nurture_strategy"])}
        onChange={(val) => onAnswer("lead_nurture_strategy", val)}
      />
    </div>
  );
}
