"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["stakeholder_engagement"] === "string" &&
    typeof answers["confidence_in_insights"] === "string" &&
    typeof answers["competitive_awareness"] === "string" &&
    typeof answers["decision_alignment"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 7: stakeholder_engagement */}
      <MultipleChoiceQuestion
        question="How involved are your stakeholders in benchmarking discussions?"
        options={[
          { value: "not_involved", label: "They’re not involved at all" },
          { value: "informed", label: "We share updates, but they don’t participate" },
          { value: "participating", label: "They help interpret or apply the insights" },
          { value: "active_collaboration", label: "They actively help shape benchmarks and strategy" },
        ]}
        value={answers["stakeholder_engagement"] || ""}
        onChange={(val) => onAnswer("stakeholder_engagement", val)}
      />

      {/* Question 8: confidence_in_insights */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy and relevance of your benchmarking data?"
        options={[
          { value: "not_confident", label: "Not confident — it’s mostly gut feel" },
          { value: "somewhat_confident", label: "Somewhat confident — it varies by source" },
          { value: "generally_confident", label: "Generally confident in the data we collect" },
          { value: "fully_confident", label: "Fully confident — we trust it to guide decisions" },
        ]}
        value={answers["confidence_in_insights"] || ""}
        onChange={(val) => onAnswer("confidence_in_insights", val)}
      />

      {/* Question 9: competitive_awareness */}
      <MultipleChoiceQuestion
        question="How well does your team understand your competitors’ positioning and strategy?"
        options={[
          { value: "no_awareness", label: "We’re not sure who our main competitors even are" },
          { value: "basic_awareness", label: "We know the basics — pricing, channels, etc." },
          { value: "solid_understanding", label: "We understand their messaging and differentiation" },
          { value: "deep_insight", label: "We study them closely and track their movements" },
        ]}
        value={answers["competitive_awareness"] || ""}
        onChange={(val) => onAnswer("competitive_awareness", val)}
      />

      {/* Question 10: decision_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your decisions with the insights from benchmarking?"
        options={[
          { value: "not_aligned", label: "They rarely influence our decisions" },
          { value: "loosely_aligned", label: "Sometimes they factor in, but not directly" },
          { value: "regularly_considered", label: "We try to incorporate them where possible" },
          { value: "fully_integrated", label: "They are fully integrated into our decision process" },
        ]}
        value={answers["decision_alignment"] || ""}
        onChange={(val) => onAnswer("decision_alignment", val)}
      />
    </div>
  );
}
