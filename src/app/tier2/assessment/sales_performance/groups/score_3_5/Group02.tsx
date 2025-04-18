"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["pipeline_gap_identification"] === "string" &&
    answers["pipeline_gap_identification"].trim().length > 0 &&
    typeof answers["deal_quality_tracking"] === "string" &&
    answers["deal_quality_tracking"].trim().length > 0 &&
    typeof answers["behavior_consistency"] === "string" &&
    answers["behavior_consistency"].trim().length > 0 &&
    typeof answers["forecast_review_cadence"] === "string" &&
    answers["forecast_review_cadence"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: pipeline_gap_identification */}
      <MultipleChoiceQuestion
        question="How do you identify pipeline coverage gaps before it’s too late?"
        options={[
          { value: "too_late", label: "We don’t look until it’s too late" },
          { value: "manual_calculation", label: "We manually calculate monthly coverage" },
          { value: "forecast_ratio", label: "We look at pipeline-to-forecast ratios" },
          { value: "automated_monitoring", label: "We use tools to monitor and alert on gaps" },
        ]}
        value={answers["pipeline_gap_identification"] || ""}
        onChange={(val) => onAnswer("pipeline_gap_identification", val)}
      />

      {/* Question 5: deal_quality_tracking */}
      <MultipleChoiceQuestion
        question="How do you track deal quality (fit, velocity, and win probability)?"
        options={[
          { value: "gut", label: "We rely on gut feel or notes" },
          { value: "conversion_rates", label: "We look at conversion rates across stages" },
          { value: "scorecard_or_notes", label: "We use a scorecard or call notes" },
          { value: "quantitative_metrics", label: "We track multiple quantitative quality indicators" },
        ]}
        value={answers["deal_quality_tracking"] || ""}
        onChange={(val) => onAnswer("deal_quality_tracking", val)}
      />

      {/* Question 6: behavior_consistency */}
      <MultipleChoiceQuestion
        question="How are your most successful sales behaviors shared across the team?"
        options={[
          { value: "not_shared", label: "They’re not — it varies by rep" },
          { value: "informal", label: "We highlight top reps occasionally" },
          { value: "team_meetings", label: "We share behaviors during team meetings" },
          { value: "enablement", label: "They’re documented and trained consistently" },
        ]}
        value={answers["behavior_consistency"] || ""}
        onChange={(val) => onAnswer("behavior_consistency", val)}
      />

      {/* Question 7: forecast_review_cadence */}
      <MultipleChoiceQuestion
        question="How often do you run sales pipeline or forecast reviews?"
        options={[
          { value: "occasionally", label: "Occasionally or when things slow down" },
          { value: "monthly", label: "Monthly across the org" },
          { value: "weekly_team", label: "Weekly by team with leadership roll-up" },
          { value: "real_time", label: "Live dashboards and real-time reviews" },
        ]}
        value={answers["forecast_review_cadence"] || ""}
        onChange={(val) => onAnswer("forecast_review_cadence", val)}
      />
    </div>
  );
}
