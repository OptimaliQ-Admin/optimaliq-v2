"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["digital_vision"] === "string" &&
    typeof answers["tech_stack_consideration"] === "string" &&
    typeof answers["biggest_barrier"] === "string" &&
    answers["biggest_barrier"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 7: digital_vision */}
      <MultipleChoiceQuestion
        question="How would you describe your vision for digital transformation?"
        options={[
          { value: "no_vision", label: "We haven’t really discussed it" },
          { value: "basic_vision", label: "We have a general idea, but it’s not clear" },
          { value: "emerging_plan", label: "We’ve started developing a plan" },
          { value: "clear_roadmap", label: "We have a clear roadmap and goals" },
        ]}
        value={answers["digital_vision"] || ""}
        onChange={(val) => onAnswer("digital_vision", val)}
      />

      {/* Question 8: tech_stack_consideration */}
      <MultipleChoiceQuestion
        question="When choosing new tools or systems, how much do you consider long-term scalability or integration?"
        options={[
          { value: "no_consideration", label: "We don’t really think about that" },
          { value: "some_consideration", label: "It’s one factor, but not a priority" },
          { value: "important_consideration", label: "It’s an important part of our evaluation" },
          { value: "critical_consideration", label: "It’s a top priority for every decision" },
        ]}
        value={answers["tech_stack_consideration"] || ""}
        onChange={(val) => onAnswer("tech_stack_consideration", val)}
      />

      {/* Question 9: biggest_barrier */}
      <TextAreaQuestion
        question="What’s the biggest barrier holding you back from making better use of digital tools?"
        placeholder="E.g., Budget, skills, time, lack of clarity, etc."
        value={answers["biggest_barrier"] || ""}
        onChange={(val) => onAnswer("biggest_barrier", val)}
        maxLength={300}
      />
    </div>
  );
}
