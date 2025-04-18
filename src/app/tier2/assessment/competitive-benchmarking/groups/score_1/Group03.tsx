"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["customer_distinction"] === "string" &&
    typeof answers["competitor_strength"] === "string" &&
    typeof answers["growth_thinking"] === "string" &&
    typeof answers["comparison_priority"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 7: customer_distinction */}
      <TextAreaQuestion
        question="How would your customers describe what makes your business different or better?"
        value={answers["customer_distinction"] || ""}
        onChange={(val) => onAnswer("customer_distinction", val)}
        maxLength={300}
      />

      {/* Question 8: competitor_strength */}
      <TextAreaQuestion
        question="What’s one thing a competitor does well that you wish your business did too?"
        value={answers["competitor_strength"] || ""}
        onChange={(val) => onAnswer("competitor_strength", val)}
        maxLength={300}
      />

      {/* Question 9: growth_thinking */}
      <TextAreaQuestion
        question="If you had to double your market share this year, where would you focus first?"
        value={answers["growth_thinking"] || ""}
        onChange={(val) => onAnswer("growth_thinking", val)}
        maxLength={300}
      />

      {/* Question 10: comparison_priority */}
      <MultipleChoiceQuestion
        question="What’s your top priority when comparing yourself to competitors?"
        options={[
          { value: "Price", label: "Price" },
          { value: "Features or capabilities", label: "Features or capabilities" },
          { value: "Customer experience", label: "Customer experience" },
          { value: "Brand reputation", label: "Brand reputation" },
        ]}
        value={answers["comparison_priority"] || ""}
        onChange={(val) => onAnswer("comparison_priority", val)}
      />
    </div>
  );
}
