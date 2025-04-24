"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["benchmarking_team_structure"] === "string" &&
    typeof answers["competitive_alerts"] === "string" &&
    typeof answers["market_positioning_review"] === "string" &&
    typeof answers["benchmarking_success_use"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_4_9_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: benchmarking_team_structure */}
      <MultipleChoiceQuestion
        question="Who is responsible for managing competitive benchmarking?"
        options={[
          { value: "no_one", label: "No one — it's not a defined responsibility" },
          { value: "shared_across_teams", label: "Shared across marketing and sales" },
          { value: "dedicated_person", label: "One person owns it as part of their role" },
          { value: "dedicated_team", label: "We have a dedicated competitive intelligence function" },
        ]}
        value={answers["benchmarking_team_structure"] || ""}
        onChange={(val) => onAnswer("benchmarking_team_structure", val)}
      />

      {/* Question 5: competitive_alerts */}
      <MultipleChoiceQuestion
        question="How do you stay aware of changes in your competitors’ strategies?"
        options={[
          { value: "manual_checking", label: "We manually check from time to time" },
          { value: "news_alerts", label: "We have Google alerts or newsletters" },
          { value: "platform_monitoring", label: "We use platforms that track this for us" },
          { value: "realtime_signals", label: "We monitor real-time digital signals and market shifts" },
        ]}
        value={answers["competitive_alerts"] || ""}
        onChange={(val) => onAnswer("competitive_alerts", val)}
      />

      {/* Question 6: market_positioning_review */}
      <MultipleChoiceQuestion
        question="How often do you review and update your positioning relative to competitors?"
        options={[
          { value: "rarely", label: "Rarely — we mostly stick with what we have" },
          { value: "annually", label: "Annually or during planning cycles" },
          { value: "quarterly", label: "Quarterly — as part of GTM optimization" },
          { value: "ongoing", label: "Ongoing — we continuously evolve positioning" },
        ]}
        value={answers["market_positioning_review"] || ""}
        onChange={(val) => onAnswer("market_positioning_review", val)}
      />

      {/* Question 7: benchmarking_success_use */}
      <MultipleChoiceQuestion
        question="How do you use benchmarking insights to shape business success?"
        options={[
          { value: "rarely_used", label: "We rarely use them" },
          { value: "reference_only", label: "We reference them in GTM decks or meetings" },
          { value: "optimize_tactics", label: "We use them to optimize campaigns or messaging" },
          { value: "shape_strategy", label: "They help shape our broader product and growth strategy" },
        ]}
        value={answers["benchmarking_success_use"] || ""}
        onChange={(val) => onAnswer("benchmarking_success_use", val)}
      />
    </div>
  );
}
