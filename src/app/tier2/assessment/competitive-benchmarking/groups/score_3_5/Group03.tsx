"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["analyst_use"] === "string" &&
    typeof answers["tool_effectiveness"] === "string" &&
    typeof answers["forecasting_maturity"] === "string" &&
    typeof answers["bonus_question"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 7: analyst_use */}
      <MultipleChoiceQuestion
        question="Do you have dedicated analysts or data-savvy team members supporting your marketing or sales reporting?"
        options={[
          { value: "none", label: "No — no one is dedicated to this" },
          { value: "partial", label: "Somewhat — a few team members analyze when needed" },
          { value: "dedicated", label: "Yes — we have dedicated analysts or resources" },
          { value: "embedded", label: "Yes — analysts are embedded across departments" },
        ]}
        value={answers["analyst_use"] || ""}
        onChange={(val) => onAnswer("analyst_use", val)}
      />

      {/* Question 8: tool_effectiveness */}
      <MultipleChoiceQuestion
        question="How would you rate the effectiveness of your reporting tools or dashboards?"
        options={[
          { value: "ineffective", label: "Ineffective — slow, confusing, or incomplete" },
          { value: "basic", label: "Basic — we get the job done but it’s clunky" },
          { value: "reliable", label: "Reliable — it’s pretty easy to get what we need" },
          { value: "excellent", label: "Excellent — our tools are easy, fast, and insightful" },
        ]}
        value={answers["tool_effectiveness"] || ""}
        onChange={(val) => onAnswer("tool_effectiveness", val)}
      />

      {/* Question 9: forecasting_maturity */}
      <MultipleChoiceQuestion
        question="How would you describe your ability to forecast future performance (e.g., revenue, leads, traffic)?"
        options={[
          { value: "no_forecast", label: "We don’t forecast — it’s all reactive" },
          { value: "basic_estimates", label: "We make basic estimates" },
          { value: "data_driven", label: "We use past data to build projections" },
          { value: "proactive_modeling", label: "We model scenarios and plan proactively" },
        ]}
        value={answers["forecasting_maturity"] || ""}
        onChange={(val) => onAnswer("forecasting_maturity", val)}
      />

      {/* Question 10: bonus_question */}
      <TextAreaQuestion
        question="What’s the most important insight you wish your analytics could deliver today?"
        placeholder="E.g., customer lifetime value by channel, ROI by campaign..."
        value={answers["bonus_question"] || ""}
        onChange={(val) => onAnswer("bonus_question", val)}
        maxLength={300}
      />
    </div>
  );
}
