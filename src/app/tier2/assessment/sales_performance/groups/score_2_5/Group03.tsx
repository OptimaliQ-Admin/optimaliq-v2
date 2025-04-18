"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["deal_focus_confidence"] === "string" &&
    answers["deal_focus_confidence"].trim().length > 0 &&
    typeof answers["improvement_opportunity"] === "string" &&
    answers["improvement_opportunity"].trim().length > 0 &&
    typeof answers["scalability"] === "string" &&
    answers["scalability"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: deal_focus_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your team is pursuing the right deals?"
        options={[
          { value: "not_confident", label: "Not confident — we chase everything" },
          { value: "somewhat", label: "Somewhat — we try to focus but it’s messy" },
          { value: "clear_criteria", label: "We use clear criteria to focus our time" },
          { value: "ruthless", label: "We’re ruthless about fit and focus" },
        ]}
        value={answers["deal_focus_confidence"] || ""}
        onChange={(val) => onAnswer("deal_focus_confidence", val)}
      />

      {/* Question 9: improvement_opportunity */}
      <TextAreaQuestion
        question="What’s one sales behavior or process you’d want your team to improve this quarter?"
        placeholder="E.g., follow-ups, demo delivery, deal qualification"
        value={answers["improvement_opportunity"] || ""}
        onChange={(val) => onAnswer("improvement_opportunity", val)}
        maxLength={300}
      />

      {/* Question 10: scalability */}
      <MultipleChoiceQuestion
        question="How scalable is your current sales process if you doubled your pipeline?"
        options={[
          { value: "not_scalable", label: "Not scalable — we’d break down" },
          { value: "somewhat_scalable", label: "Somewhat — with a lot of effort" },
          { value: "mostly_scalable", label: "Mostly — with some adjustments" },
          { value: "fully_scalable", label: "Fully scalable — bring it on" },
        ]}
        value={answers["scalability"] || ""}
        onChange={(val) => onAnswer("scalability", val)}
      />
    </div>
  );
}
