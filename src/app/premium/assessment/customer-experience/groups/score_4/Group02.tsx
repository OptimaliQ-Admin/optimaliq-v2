"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_feedback_channels"] === "string" &&
    typeof answers["cx_adaptation"] === "string" &&
    typeof answers["cx_leadership_alignment"] === "string" &&
    typeof answers["cx_success_criteria"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_0_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      {/* Question 4: cx_feedback_channels */}
      <MultipleChoiceQuestion
        question="How do you collect and act on customer feedback?"
        options={[
          { value: "no_feedback", label: "We don’t have formal feedback channels" },
          { value: "basic_channels", label: "We collect feedback through basic surveys" },
          { value: "analyzed_periodically", label: "We analyze feedback and review it periodically" },
          { value: "real_time_loops", label: "We use real-time feedback loops to guide action" },
        ]}
        value={getStringAnswer(answers["cx_feedback_channels"])}
        onChange={(val) => onAnswer("cx_feedback_channels", val)}
      />

      {/* Question 5: cx_adaptation */}
      <MultipleChoiceQuestion
        question="How quickly does your organization adapt based on customer insights?"
        options={[
          { value: "rarely_act", label: "We rarely act on insights" },
          { value: "occasional_changes", label: "Occasionally, if there’s a clear need" },
          { value: "moderately_fast", label: "Moderately fast — a few weeks" },
          { value: "very_fast", label: "Very fast — days or real-time changes" },
        ]}
        value={getStringAnswer(answers["cx_adaptation"])}
        onChange={(val) => onAnswer("cx_adaptation", val)}
      />

      {/* Question 6: cx_leadership_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is leadership around CX as a business priority?"
        options={[
          { value: "not_discussed", label: "It’s not a major discussion topic" },
          { value: "some_support", label: "Some leaders advocate for it" },
          { value: "active_support", label: "It’s actively supported by leadership" },
          { value: "executive_ownership", label: "It has executive sponsorship and clear goals" },
        ]}
        value={getStringAnswer(answers["cx_leadership_alignment"])}
        onChange={(val) => onAnswer("cx_leadership_alignment", val)}
      />

      {/* Question 7: cx_success_criteria */}
      <MultipleChoiceQuestion
        question="What success criteria do you use to evaluate CX initiatives?"
        options={[
          { value: "gut_feel", label: "We rely on gut feel or anecdotal wins" },
          { value: "basic_engagement", label: "Basic engagement metrics (clicks, opens)" },
          { value: "retention_and_loyalty", label: "Retention, NPS, or loyalty indicators" },
          { value: "roi_and_impact", label: "ROI, growth impact, and customer lifetime value" },
        ]}
        value={getStringAnswer(answers["cx_success_criteria"])}
        onChange={(val) => onAnswer("cx_success_criteria", val)}
      />
    </div>
  );
}
