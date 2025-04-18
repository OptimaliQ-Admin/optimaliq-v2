"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["insight_distribution"] === "string" &&
    typeof answers["benchmark_alignment"] === "string" &&
    typeof answers["category_differentiation"] === "string" &&
    typeof answers["exec_visibility"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: insight_distribution */}
      <MultipleChoiceQuestion
        question="How are benchmarking insights typically shared or distributed internally?"
        options={[
          { value: "not_shared", label: "They’re not really shared" },
          { value: "slack_or_meetings", label: "Shared via Slack or meetings" },
          { value: "dashboards", label: "We have benchmarking dashboards or reports" },
          { value: "tailored_insights", label: "Insights are tailored by team/function" },
        ]}
        value={answers["insight_distribution"] || ""}
        onChange={(val) => onAnswer("insight_distribution", val)}
      />

      {/* Question 5: benchmark_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your strategic goals with your benchmarking targets?"
        options={[
          { value: "not_linked", label: "They’re not really linked" },
          { value: "occasionally_considered", label: "Occasionally considered during planning" },
          { value: "used_for_targeting", label: "Benchmarks help define goals and targets" },
          { value: "deeply_aligned", label: "Strategic goals are deeply aligned to benchmark performance" },
        ]}
        value={answers["benchmark_alignment"] || ""}
        onChange={(val) => onAnswer("benchmark_alignment", val)}
      />

      {/* Question 6: category_differentiation */}
      <MultipleChoiceQuestion
        question="How do you evaluate your competitive position within your category?"
        options={[
          { value: "gut_feel", label: "We rely on gut feel or team opinions" },
          { value: "customer_feedback", label: "We ask customers or analyze reviews" },
          { value: "win_loss", label: "We run win/loss or market research" },
          { value: "quantified_model", label: "We track a quantified category or differentiation model" },
        ]}
        value={answers["category_differentiation"] || ""}
        onChange={(val) => onAnswer("category_differentiation", val)}
      />

      {/* Question 7: exec_visibility */}
      <MultipleChoiceQuestion
        question="How visible are competitive or benchmarking insights to leadership?"
        options={[
          { value: "not_visible", label: "They’re not visible" },
          { value: "ad_hoc", label: "Shared ad hoc when requested" },
          { value: "in_review_meetings", label: "Included in planning or review meetings" },
          { value: "part_of_decisions", label: "They’re part of ongoing executive decisions" },
        ]}
        value={answers["exec_visibility"] || ""}
        onChange={(val) => onAnswer("exec_visibility", val)}
      />
    </div>
  );
}
