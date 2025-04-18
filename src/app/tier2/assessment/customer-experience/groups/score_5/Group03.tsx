"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["tech_stack_alignment"] === "string" &&
    typeof answers["future_positioning"] === "string" &&
    typeof answers["transformation_north_star"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">
      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How well is your technology stack aligned to your business model and future growth?"
        options={[
          { value: "legacy_disconnected", label: "Mostly legacy systems with limited integration" },
          { value: "basic_alignment", label: "Some alignment to current business needs" },
          { value: "strong_alignment", label: "Strong support for current and future needs" },
          { value: "fully_aligned", label: "Purpose-built to enable innovation and agility" }
        ]}
        value={answers["tech_stack_alignment"] || ""}
        onChange={(val) => onAnswer("tech_stack_alignment", val)}
      />

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="What best describes how your digital capabilities position you for the next 3–5 years?"
        options={[
          { value: "behind", label: "We’re behind peers and risk falling further" },
          { value: "competitive", label: "We’re competitive but need to keep pace" },
          { value: "ahead", label: "We’re ahead in key areas of capability" },
          { value: "pioneering", label: "We’re redefining the standard in our industry" }
        ]}
        value={answers["future_positioning"] || ""}
        onChange={(val) => onAnswer("future_positioning", val)}
      />

      {/* Question 9 */}
      <TextAreaQuestion
        question="What’s your digital transformation North Star for the next 12–24 months?"
        placeholder="E.g., Become a fully connected and data-driven organization."
        value={answers["transformation_north_star"] || ""}
        onChange={(val) => onAnswer("transformation_north_star", val)}
        maxLength={300}
      />
    </div>
  );
}
