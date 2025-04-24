"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["post_engagement_action"] === "string" &&
    Array.isArray(answers["marketing_assets"]) && answers["marketing_assets"].length > 0 &&
    typeof answers["performance_review_frequency"] === "string" &&
    typeof answers["alignment_with_sales"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  const selectedAssets = answers["marketing_assets"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: post_engagement_action */}
      <MultipleChoiceQuestion
        question="What happens after someone engages with your marketing (e.g. clicks, signs up)?"
        options={[
          { value: "Nothing", label: "Nothing really — it’s not tracked" },
          { value: "Manual", label: "Someone follows up manually" },
          { value: "Partial", label: "Some leads go to sales or email nurturing" },
          { value: "Automated", label: "We have a defined, automated follow-up process" },
        ]}
        value={answers["post_engagement_action"] || ""}
        onChange={(val) => onAnswer("post_engagement_action", val)}
      />

      {/* Question 5: marketing_assets */}
      <MultiSelectQuestion
        question="Which of the following do you currently use in your marketing strategy?"
        options={[
          { value: "Customer personas", label: "Customer personas" },
          { value: "Campaign calendar", label: "Campaign calendar" },
          { value: "Email automation", label: "Email automation" },
          { value: "Ad creatives or templates", label: "Ad creatives or templates" },
          { value: "Nothing documented", label: "Nothing documented" },
        ]}
        selected={selectedAssets}
        onChange={(val) => onAnswer("marketing_assets", val)}
        maxSelect={5}
      />

      {/* Question 6: performance_review_frequency */}
      <MultipleChoiceQuestion
        question="How frequently do you review what’s working vs. what’s not in your marketing?"
        options={[
          { value: "Rarely", label: "Rarely" },
          { value: "Occasionally", label: "Occasionally, when things feel off" },
          { value: "Monthly", label: "Monthly or during campaigns" },
          { value: "Regularly", label: "Regularly with data and reports" },
        ]}
        value={answers["performance_review_frequency"] || ""}
        onChange={(val) => onAnswer("performance_review_frequency", val)}
      />

      {/* Question 7: alignment_with_sales */}
      <MultipleChoiceQuestion
        question="How are your marketing efforts tied to your sales or revenue goals?"
        options={[
          { value: "Not tied", label: "They’re not tied together" },
          { value: "Hopeful", label: "We hope marketing creates sales" },
          { value: "Occasionally coordinated", label: "We occasionally coordinate with sales" },
          { value: "Aligned", label: "They’re aligned with shared goals and metrics" },
        ]}
        value={answers["alignment_with_sales"] || ""}
        onChange={(val) => onAnswer("alignment_with_sales", val)}
      />
    </div>
  );
}
