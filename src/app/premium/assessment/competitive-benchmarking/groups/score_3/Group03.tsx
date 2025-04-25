"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["competitive_positioning"] === "string" &&
    typeof answers["market_differentiation"] === "string" &&
    typeof answers["kpi_comparison"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8: competitive_positioning */}
      <MultipleChoiceQuestion
        question="How would you describe your current competitive positioning?"
        options={[
          { value: "not_defined", label: "We don’t really have one defined" },
          { value: "basic", label: "It’s based on pricing or availability" },
          { value: "moderate", label: "We have some differentiation but it’s not well known" },
          { value: "clear_position", label: "We’re clearly positioned and known for something specific" },
        ]}
        value={getStringAnswer(answers["competitive_positioning"])}
        onChange={(val) => onAnswer("competitive_positioning", val)}
      />

      {/* Question 9: market_differentiation */}
      <MultipleChoiceQuestion
        question="What makes your brand or business stand out in your category?"
        options={[
          { value: "nothing", label: "Honestly, not much" },
          { value: "basic_value", label: "We compete mostly on price, speed, or convenience" },
          { value: "unique_product", label: "Our product or brand experience is noticeably different" },
          { value: "deep_loyalty", label: "We offer a unique promise that creates deep loyalty" },
        ]}
        value={getStringAnswer(answers["market_differentiation"])}
        onChange={(val) => onAnswer("market_differentiation", val)}
      />

      {/* Question 10: kpi_comparison */}
      <MultipleChoiceQuestion
        question="Do you know how your performance compares to top competitors in your space?"
        options={[
          { value: "no_comparison", label: "No — we have no visibility" },
          { value: "some_comparison", label: "Some — only for top-line metrics" },
          { value: "infrequent", label: "We’ve done competitive analysis once or twice" },
          { value: "regular_comparison", label: "Yes — we review it regularly and adjust strategy" },
        ]}
        value={getStringAnswer(answers["kpi_comparison"])}
        onChange={(val) => onAnswer("kpi_comparison", val)}
      />
    </div>
  );
}
