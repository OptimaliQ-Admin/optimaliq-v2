"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["pipeline_cleanliness"] === "string" &&
    answers["pipeline_cleanliness"].trim().length > 0 &&
    typeof answers["rep_performance_insight"] === "string" &&
    answers["rep_performance_insight"].trim().length > 0 &&
    typeof answers["deal_review_process"] === "string" &&
    answers["deal_review_process"].trim().length > 0 &&
    typeof answers["playbook_update"] === "string" &&
    answers["playbook_update"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: pipeline_cleanliness */}
      <MultipleChoiceQuestion
        question="How do you keep your pipeline clean and up to date?"
        options={[
          { value: "manual_cleaning", label: "We clean it manually before reviews" },
          { value: "rep_discretion", label: "Reps update as they go (not consistently)" },
          { value: "update_expectations", label: "We have clear expectations and review updates" },
          { value: "auto_sync", label: "Pipeline updates are synced from activity automatically" },
        ]}
        value={answers["pipeline_cleanliness"] || ""}
        onChange={(val) => onAnswer("pipeline_cleanliness", val)}
      />

      {/* Question 5: rep_performance_insight */}
      <MultipleChoiceQuestion
        question="How do you identify top-performing reps or sales behaviors?"
        options={[
          { value: "revenue_only", label: "Based on revenue only" },
          { value: "quota_attainment", label: "Based on quota attainment + rep notes" },
          { value: "kpi_comparison", label: "Based on activity + stage-level conversion rates" },
          { value: "comprehensive_insight", label: "Based on dashboards + qualitative feedback" },
        ]}
        value={answers["rep_performance_insight"] || ""}
        onChange={(val) => onAnswer("rep_performance_insight", val)}
      />

      {/* Question 6: deal_review_process */}
      <MultipleChoiceQuestion
        question="What is your current process for deal reviews or pipeline coaching?"
        options={[
          { value: "ad_hoc", label: "Ad hoc or only for big deals" },
          { value: "weekly_1_1", label: "Weekly 1:1s with pipeline inspection" },
          { value: "structured_reviews", label: "Structured deal reviews by stage/value" },
          { value: "scalable_system", label: "Scalable system + collaborative tools" },
        ]}
        value={answers["deal_review_process"] || ""}
        onChange={(val) => onAnswer("deal_review_process", val)}
      />

      {/* Question 7: playbook_update */}
      <MultipleChoiceQuestion
        question="How often do you update sales playbooks or enablement materials?"
        options={[
          { value: "no_playbook", label: "We don’t have a playbook" },
          { value: "reactive_updates", label: "Only during major changes or launches" },
          { value: "quarterly_review", label: "Quarterly review and updates" },
          { value: "continuous_update", label: "Continuously updated with feedback loops" },
        ]}
        value={answers["playbook_update"] || ""}
        onChange={(val) => onAnswer("playbook_update", val)}
      />
    </div>
  );
}
