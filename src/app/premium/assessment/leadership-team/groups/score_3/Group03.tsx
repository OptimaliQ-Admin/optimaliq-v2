"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["performance_reviews"] === "string" &&
    typeof answers["employee_recognition"] === "string" &&
    typeof answers["decision_making_style"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How structured are your performance reviews?"
        options={[
          { value: "no_reviews", label: "We don’t do performance reviews" },
          { value: "informal", label: "They’re informal and inconsistent" },
          { value: "some_structure", label: "Some structure, not always followed" },
          { value: "consistent_reviews", label: "Consistent and tied to expectations and development" },
        ]}
        value={answers["performance_reviews"] || ""}
        onChange={(val) => onAnswer("performance_reviews", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How do you recognize or reward strong performance?"
        options={[
          { value: "not_formalized", label: "It’s not formalized" },
          { value: "ad_hoc", label: "Occasional shout-outs or bonuses" },
          { value: "structured", label: "Structured programs (bonuses, awards, etc.)" },
          { value: "embedded", label: "Embedded in culture — part of how we operate" },
        ]}
        value={answers["employee_recognition"] || ""}
        onChange={(val) => onAnswer("employee_recognition", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How would you describe the leadership decision-making style?"
        options={[
          { value: "top_down", label: "Top-down — decisions made by a few leaders" },
          { value: "some_input", label: "Some input from managers or teams" },
          { value: "collaborative", label: "Collaborative with shared ownership" },
          { value: "data_and_insight_driven", label: "Data- and insight-driven with cross-team alignment" },
        ]}
        value={answers["decision_making_style"] || ""}
        onChange={(val) => onAnswer("decision_making_style", val)}
      />
    </div>
  );
}
