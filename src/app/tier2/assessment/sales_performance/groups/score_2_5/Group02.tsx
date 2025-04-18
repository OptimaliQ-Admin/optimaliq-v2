"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_2_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    Array.isArray(answers["sales_metrics_tracked"]) &&
    answers["sales_metrics_tracked"].length > 0 &&
    typeof answers["rep_coaching"] === "string" &&
    answers["rep_coaching"].trim().length > 0 &&
    typeof answers["stuck_deals"] === "string" &&
    answers["stuck_deals"].trim().length > 0 &&
    typeof answers["win_loss_analysis"] === "string" &&
    answers["win_loss_analysis"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  const tracked = answers["sales_metrics_tracked"] || [];

  return (
    <div className="space-y-8">

      {/* Question 4: sales_metrics_tracked */}
      <MultiSelectQuestion
        question="Which of the following do you track to measure sales performance?"
        options={[
          { value: "win_rates", label: "Win rates" },
          { value: "avg_deal_size", label: "Average deal size" },
          { value: "sales_cycle", label: "Sales cycle length" },
          { value: "conversion_rate", label: "Lead to close conversion rate" },
          { value: "quota_attainment", label: "Quota attainment per rep" },
          { value: "none", label: "None of these" },
        ]}
        selected={tracked}
        onChange={(val) => onAnswer("sales_metrics_tracked", val)}
        maxSelect={6}
      />

      {/* Question 5: rep_coaching */}
      <MultipleChoiceQuestion
        question="How do you coach or develop sales reps or deal execution?"
        options={[
          { value: "no_coaching", label: "We don’t have a coaching process" },
          { value: "basic_feedback", label: "We give informal feedback occasionally" },
          { value: "structured_coaching", label: "We have structured coaching sessions" },
          { value: "ongoing_development", label: "We use scorecards and ongoing development plans" },
        ]}
        value={answers["rep_coaching"] || ""}
        onChange={(val) => onAnswer("rep_coaching", val)}
      />

      {/* Question 6: stuck_deals */}
      <MultipleChoiceQuestion
        question="What’s your process for identifying deals that are stuck or unlikely to close?"
        options={[
          { value: "no_review", label: "We don’t review stuck deals" },
          { value: "flagged_by_rep", label: "Reps flag them during 1:1s" },
          { value: "report_review", label: "We review reports and pipeline aging" },
          { value: "systematic_alerts", label: "We use CRM logic and alerts to flag them" },
        ]}
        value={answers["stuck_deals"] || ""}
        onChange={(val) => onAnswer("stuck_deals", val)}
      />

      {/* Question 7: win_loss_analysis */}
      <MultipleChoiceQuestion
        question="How often do you analyze win/loss outcomes or customer feedback?"
        options={[
          { value: "rarely", label: "Rarely or never" },
          { value: "sometimes", label: "Sometimes when a deal is lost" },
          { value: "routine", label: "Routinely during reviews" },
          { value: "formal_process", label: "We have a formal win/loss review process" },
        ]}
        value={answers["win_loss_analysis"] || ""}
        onChange={(val) => onAnswer("win_loss_analysis", val)}
      />
    </div>
  );
}
