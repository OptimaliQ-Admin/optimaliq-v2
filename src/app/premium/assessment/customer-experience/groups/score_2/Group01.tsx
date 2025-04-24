import { getStringAnswer } from "@/lib/types/AssessmentAnswers";
"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["customer_feedback_loop"] === "string" &&
    typeof answers["data_centralization"] === "string" &&
    typeof answers["cx_reporting"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score_2_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: customer_feedback_loop */}
      <MultipleChoiceQuestion
        question="How do you gather feedback from your customers?"
        options={[
          { value: "not_collected", label: "We don’t actively collect feedback" },
          { value: "ad_hoc", label: "Ad hoc or occasional surveys" },
          { value: "regular_surveys", label: "Regular surveys or feedback forms" },
          { value: "integrated_feedback_loop", label: "Integrated feedback loop across touchpoints" },
        ]}
        value={getStringAnswer(answers["customer_feedback_loop"])}
        onChange={(val) => onAnswer("customer_feedback_loop", val)}
      />

      {/* Question 2: data_centralization */}
      <MultipleChoiceQuestion
        question="How centralized is your customer data today?"
        options={[
          { value: "scattered", label: "Scattered across different platforms" },
          { value: "partially_connected", label: "Partially connected through exports or workarounds" },
          { value: "mostly_centralized", label: "Mostly centralized in a single tool or database" },
          { value: "fully_integrated", label: "Fully integrated and available to teams in real time" },
        ]}
        value={getStringAnswer(answers["data_centralization"])}
        onChange={(val) => onAnswer("data_centralization", val)}
      />

      {/* Question 3: cx_reporting */}
      <MultipleChoiceQuestion
        question="What kind of reporting or metrics do you have around customer experience?"
        options={[
          { value: "none", label: "None — we don’t track this yet" },
          { value: "basic", label: "Basic — we track things like NPS or reviews manually" },
          { value: "standardized", label: "Standardized CX metrics reported regularly" },
          { value: "real_time_reporting", label: "Real-time dashboards with CX insights" },
        ]}
        value={getStringAnswer(answers["cx_reporting"])}
        onChange={(val) => onAnswer("cx_reporting", val)}
      />
    </div>
  );
}
