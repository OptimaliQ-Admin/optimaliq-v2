"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["budgeting"] === "string" &&
    typeof answers["tech_scalability"] === "string" &&
    typeof answers["transformation_priority"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 7: budgeting */}
      <MultipleChoiceQuestion
        question="How are digital tools and transformation efforts budgeted?"
        options={[
          { value: "ad_hoc", label: "Ad hoc, when something breaks or is needed" },
          { value: "project_based", label: "Only as part of specific projects" },
          { value: "annual", label: "Annually, as part of planning cycles" },
          { value: "ongoing", label: "We have ongoing investment in digital capabilities" },
        ]}
        value={answers["budgeting"] || ""}
        onChange={(val) => onAnswer("budgeting", val)}
      />

      {/* Question 8: tech_scalability */}
      <MultipleChoiceQuestion
        question="How confident are you that your current technology can scale with your business?"
        options={[
          { value: "not_confident", label: "Not confident at all" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "mostly_confident", label: "Mostly confident" },
          { value: "fully_confident", label: "Fully confident" },
        ]}
        value={answers["tech_scalability"] || ""}
        onChange={(val) => onAnswer("tech_scalability", val)}
      />

      {/* Question 9: transformation_priority */}
      <MultipleChoiceQuestion
        question="Where does digital transformation rank as a company priority?"
        options={[
          { value: "not_on_radar", label: "It’s not really on our radar" },
          { value: "talked_about", label: "We’ve talked about it, but haven’t started" },
          { value: "in_progress", label: "We’re taking steps in certain areas" },
          { value: "high_priority", label: "It’s a top priority across the company" },
        ]}
        value={answers["transformation_priority"] || ""}
        onChange={(val) => onAnswer("transformation_priority", val)}
      />
    </div>
  );
}
