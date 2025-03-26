"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Group05_Clarity({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 13: Decision Bottlenecks */}
      <TextAreaQuestion
        question="What kind of business decisions are hardest for you to make right now?"
        description="Hiring? Prioritization? Marketing spend? Pricing? Something else?"
        placeholder="Be honest. What’s slowing you down the most right now?"
        value={answers["decision_bottlenecks"] || ""}
        onChange={(val) => onAnswer("decision_bottlenecks", val)}
        maxLength={300}
      />

      {/* Question 14: Team Alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your team on company goals and direction?"
        options={[
          { value: "fully_aligned", label: "Fully aligned and collaborative" },
          { value: "mostly_aligned", label: "Mostly aligned, occasional friction" },
          { value: "some_misalignment", label: "Some misalignment across departments" },
          { value: "not_aligned", label: "No clear alignment — teams are working in silos" },
          { value: "other", label: "Other (please describe)" },
        ]}
        value={answers["team_alignment"] || ""}
        onChange={(val) => onAnswer("team_alignment", val)}
      />

      {/* Question 15: Future State */}
      <TextAreaQuestion
        question="What would a wildly successful next 12 months look like for your business?"
        description="Revenue, people, customers, product—describe your future state vividly."
        placeholder="Paint the picture: What does success look like in 12 months?"
        value={answers["future_success"] || ""}
        onChange={(val) => onAnswer("future_success", val)}
        maxLength={300}
      />
    </div>
  );
}
