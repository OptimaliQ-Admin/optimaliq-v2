"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["territory_insight"] === "string" &&
    answers["territory_insight"].trim().length > 0 &&
    typeof answers["gtm_alignment"] === "string" &&
    answers["gtm_alignment"].trim().length > 0 &&
    typeof answers["sales_data_usage"] === "string" &&
    answers["sales_data_usage"].trim().length > 0 &&
    typeof answers["planning_cadence"] === "string" &&
    answers["planning_cadence"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: territory_insight */}
      <MultipleChoiceQuestion
        question="How do you identify when a territory, segment, or product line needs more focus?"
        options={[
          { value: "obvious_only", label: "We wait until it’s obvious" },
          { value: "manager_instinct", label: "Managers call it out when performance dips" },
          { value: "quarterly_reviews", label: "We review coverage quarterly using reports" },
          { value: "proactive_modeling", label: "We proactively model territory performance and risk" },
        ]}
        value={answers["territory_insight"] || ""}
        onChange={(val) => onAnswer("territory_insight", val)}
      />

      {/* Question 5: gtm_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your sales, marketing, and customer success functions?"
        options={[
          { value: "uncoordinated", label: "Totally separate and uncoordinated" },
          { value: "review_leads", label: "We review lead flow and handoffs occasionally" },
          { value: "aligned_goals", label: "We set shared goals and work together on strategy" },
          { value: "integrated_go_to_market", label: "Fully integrated go-to-market motion" },
        ]}
        value={answers["gtm_alignment"] || ""}
        onChange={(val) => onAnswer("gtm_alignment", val)}
      />

      {/* Question 6: sales_data_usage */}
      <MultipleChoiceQuestion
        question="How are you using sales data to influence future growth strategy?"
        options={[
          { value: "not_strategic", label: "We aren’t using it strategically" },
          { value: "basic_trend_analysis", label: "Sales leaders review it for trends" },
          { value: "informs_product", label: "It helps inform product or market prioritization" },
          { value: "deeply_integrated", label: "It’s a critical input into future planning" },
        ]}
        value={answers["sales_data_usage"] || ""}
        onChange={(val) => onAnswer("sales_data_usage", val)}
      />

      {/* Question 7: planning_cadence */}
      <MultipleChoiceQuestion
        question="What’s your approach to running sales planning or target setting?"
        options={[
          { value: "hope_and_goals", label: "We set goals and hope for the best" },
          { value: "manual", label: "Leadership does it manually each year" },
          { value: "data_informed", label: "We use tools and data for informed decisions" },
          { value: "cross_functional", label: "We run a structured, cross-functional process" },
        ]}
        value={answers["planning_cadence"] || ""}
        onChange={(val) => onAnswer("planning_cadence", val)}
      />
    </div>
  );
}
