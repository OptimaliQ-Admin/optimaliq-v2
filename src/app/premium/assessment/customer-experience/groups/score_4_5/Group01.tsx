"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_real_time_orchestration"] === "string" &&
    typeof answers["cx_feedback_system"] === "string" &&
    typeof answers["cx_customer_memory"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 1: cx_real_time_orchestration */}
      <MultipleChoiceQuestion
        question="How real-time is your customer experience orchestration?"
        options={[
          { value: "batch_or_manual", label: "Mostly batch-driven or manual" },
          { value: "delayed_automations", label: "Automated but with delayed execution" },
          { value: "triggered_in_real_time", label: "Real-time triggers in some flows" },
          { value: "fully_real_time", label: "Fully real-time and context-aware" },
        ]}
        value={getStringAnswer(answers["cx_real_time_orchestration"])}
        onChange={(val) => onAnswer("cx_real_time_orchestration", val)}
      />

      {/* Question 2: cx_feedback_system */}
      <MultipleChoiceQuestion
        question="How do you capture and act on customer feedback?"
        options={[
          { value: "infrequent_surveys", label: "Occasional surveys with limited follow-up" },
          { value: "feedback_collected_but_unstructured", label: "We collect feedback but lack structure" },
          { value: "structured_feedback_loops", label: "Structured feedback loops with improvements" },
          { value: "closed_loop_feedback", label: "Closed-loop systems with CX performance tracking" },
        ]}
        value={getStringAnswer(answers["cx_feedback_system"])}
        onChange={(val) => onAnswer("cx_feedback_system", val)}
      />

      {/* Question 3: cx_customer_memory */}
      <MultipleChoiceQuestion
        question="Does your system recognize customers and personalize based on history?"
        options={[
          { value: "no_memory", label: "No — every interaction is treated as new" },
          { value: "some_personalization", label: "Some history-based personalization" },
          { value: "persistent_profiles", label: "Persistent profiles used in multiple channels" },
          { value: "omnichannel_memory", label: "Omnichannel memory drives seamless CX" },
        ]}
        value={getStringAnswer(answers["cx_customer_memory"])}
        onChange={(val) => onAnswer("cx_customer_memory", val)}
      />
    </div>
  );
}
