"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["data_governance"] === "string" &&
    typeof answers["ai_infrastructure"] === "string" &&
    typeof answers["customer_centricity"] === "string" &&
    typeof answers["scalability_maturity"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How mature is your data governance and stewardship program?"
        options={[
          { value: "none", label: "We don’t have one" },
          { value: "ad_hoc", label: "Ad hoc — handled as issues arise" },
          { value: "formalized", label: "We have formalized governance processes" },
          { value: "advanced_governance", label: "It’s embedded in operations with defined owners and policies" },
        ]}
        value={answers["data_governance"] || ""}
        onChange={(val) => onAnswer("data_governance", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="What best describes your infrastructure to support AI and automation?"
        options={[
          { value: "no_infra", label: "We haven’t explored it yet" },
          { value: "pilots", label: "We’ve run pilots or used third-party tools" },
          { value: "integrated", label: "We have integrated some automation and AI" },
          { value: "core_capability", label: "It’s a core capability built into our architecture" },
        ]}
        value={answers["ai_infrastructure"] || ""}
        onChange={(val) => onAnswer("ai_infrastructure", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How do you ensure that digital transformation aligns with customer needs?"
        options={[
          { value: "internal_only", label: "We focus mostly on internal operations" },
          { value: "some_feedback", label: "We occasionally use customer feedback" },
          { value: "journey_mapping", label: "We use journey mapping and feedback loops" },
          { value: "cx_design", label: "Customer experience is at the center of every initiative" },
        ]}
        value={answers["customer_centricity"] || ""}
        onChange={(val) => onAnswer("customer_centricity", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How scalable is your digital infrastructure for future growth?"
        options={[
          { value: "not_scalable", label: "Not scalable — it’s already stretched" },
          { value: "limited_scalability", label: "Somewhat scalable — it needs frequent upgrades" },
          { value: "scalable_with_effort", label: "Scalable with effort — we’ve planned for growth" },
          { value: "highly_scalable", label: "Highly scalable — designed with flexibility and scale in mind" },
        ]}
        value={answers["scalability_maturity"] || ""}
        onChange={(val) => onAnswer("scalability_maturity", val)}
      />
    </div>
  );
}
