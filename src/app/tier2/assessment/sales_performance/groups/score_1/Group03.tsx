"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["pricing_approach"] === "string" &&
    answers["pricing_approach"].trim().length > 0 &&
    typeof answers["biggest_obstacle"] === "string" &&
    answers["biggest_obstacle"].trim().length > 0 &&
    typeof answers["sales_improvement_area"] === "string" &&
    answers["sales_improvement_area"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: pricing_approach */}
      <MultipleChoiceQuestion
        question="How would you describe your current approach to pricing?"
        options={[
          { value: "make_it_up", label: "We make up pricing as we go" },
          { value: "rough_pricing", label: "We have a price list or rough idea" },
          { value: "standard_prices", label: "We have standard prices and discounts" },
          { value: "formal_strategy", label: "We use a formal pricing strategy" },
        ]}
        value={answers["pricing_approach"] || ""}
        onChange={(val) => onAnswer("pricing_approach", val)}
      />

      {/* Question 9: biggest_obstacle */}
      <TextAreaQuestion
        question="What’s the biggest obstacle you face when trying to grow sales?"
        placeholder="E.g., lack of leads, poor follow-up, unclear value prop"
        value={answers["biggest_obstacle"] || ""}
        onChange={(val) => onAnswer("biggest_obstacle", val)}
        maxLength={300}
      />

      {/* Question 10: sales_improvement_area */}
      <TextAreaQuestion
        question="If you could improve one part of your sales process right now, what would it be?"
        placeholder="E.g., sales tracking, qualification, lead nurturing"
        value={answers["sales_improvement_area"] || ""}
        onChange={(val) => onAnswer("sales_improvement_area", val)}
        maxLength={300}
      />
    </div>
  );
}
