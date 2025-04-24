"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["customer_insight_methods"] === "string" &&
    typeof answers["support_channel_consistency"] === "string" &&
    typeof answers["touchpoint_visibility"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score_1_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: customer_insight_methods */}
      <MultipleChoiceQuestion
        question="How do you typically gather insights about your customers’ experiences?"
        options={[
          { value: "no_formal_method", label: "We don’t have a formal method" },
          { value: "anecdotal_feedback", label: "Anecdotal feedback or complaints" },
          { value: "occasional_surveys", label: "Occasional surveys or reviews" },
          { value: "structured_feedback", label: "Structured feedback collection across touchpoints" },
        ]}
        value={answers["customer_insight_methods"] || ""}
        onChange={(val) => onAnswer("customer_insight_methods", val)}
      />

      {/* Question 2: support_channel_consistency */}
      <MultipleChoiceQuestion
        question="How consistent is your support experience across different channels (e.g. email, chat, phone)?"
        options={[
          { value: "not_consistent", label: "Not consistent — it varies by channel or agent" },
          { value: "basic_guidelines", label: "We have basic guidelines, but no enforcement" },
          { value: "mostly_consistent", label: "Mostly consistent with some gaps" },
          { value: "very_consistent", label: "Very consistent — supported by processes or training" },
        ]}
        value={answers["support_channel_consistency"] || ""}
        onChange={(val) => onAnswer("support_channel_consistency", val)}
      />

      {/* Question 3: touchpoint_visibility */}
      <MultipleChoiceQuestion
        question="How well can you see a customer’s experience across different touchpoints (e.g. marketing, sales, support)?"
        options={[
          { value: "no_visibility", label: "We don’t have any visibility" },
          { value: "fragmented", label: "We can see some touchpoints but not all" },
          { value: "mostly_tracked", label: "Most interactions are tracked in some system" },
          { value: "fully_visible", label: "We have a full, unified view of the customer journey" },
        ]}
        value={answers["touchpoint_visibility"] || ""}
        onChange={(val) => onAnswer("touchpoint_visibility", val)}
      />
    </div>
  );
}
