"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_1_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["competitor_monitoring"] === "string" &&
    typeof answers["brand_positioning_clarity"] === "string" &&
    typeof answers["category_differentiation"] === "string" &&
    typeof answers["positioning_priority"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 7: competitor_monitoring */}
      <MultipleChoiceQuestion
        question="How often do you monitor competitor marketing or positioning?"
        options={[
          { value: "never", label: "Never — we don’t track them" },
          { value: "rarely", label: "Rarely — only when something major happens" },
          { value: "monthly", label: "Monthly — part of regular review" },
          { value: "continuous", label: "Continuously — it’s a core part of our insights" },
        ]}
        value={answers["competitor_monitoring"] || ""}
        onChange={(val) => onAnswer("competitor_monitoring", val)}
      />

      {/* Question 8: brand_positioning_clarity */}
      <MultipleChoiceQuestion
        question="How well do your customers understand your positioning?"
        options={[
          { value: "confused", label: "They’re often confused or unsure" },
          { value: "somewhat_understand", label: "Somewhat — they get the gist" },
          { value: "clear", label: "Clear — they can articulate our key value" },
          { value: "aligned", label: "Fully aligned — they repeat it back to us" },
        ]}
        value={answers["brand_positioning_clarity"] || ""}
        onChange={(val) => onAnswer("brand_positioning_clarity", val)}
      />

      {/* Question 9: category_differentiation */}
      <MultipleChoiceQuestion
        question="How clearly are you differentiated from others in your category?"
        options={[
          { value: "not_differentiated", label: "We’re not really differentiated" },
          { value: "a_little", label: "A little — we have a few talking points" },
          { value: "moderately", label: "Moderately — we can explain our edge" },
          { value: "very", label: "Very — our position is clear and unique" },
        ]}
        value={answers["category_differentiation"] || ""}
        onChange={(val) => onAnswer("category_differentiation", val)}
      />

      {/* Question 10: positioning_priority */}
      <MultipleChoiceQuestion
        question="How important is positioning and differentiation in your strategy today?"
        options={[
          { value: "not_priority", label: "It’s not a priority for us" },
          { value: "minor_focus", label: "It’s a minor focus" },
          { value: "important", label: "It’s important, but not top priority" },
          { value: "core_focus", label: "It’s a core part of our growth plan" },
        ]}
        value={answers["positioning_priority"] || ""}
        onChange={(val) => onAnswer("positioning_priority", val)}
      />
    </div>
  );
}
