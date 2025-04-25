"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_dcff82"] === "string" &&
    typeof answers["how_9d44c5"] === "string" &&
    typeof answers["what_cdbbe6"] === "string" &&
    typeof answers["how_3d4d34"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: how_dcff82 */}
      <MultipleChoiceQuestion
        question="How do you keep your pipeline clean and up to date?"
        options={[
          { value: "manual", label: "We clean it manually before reviews" },
          { value: "rep_updates", label: "Reps update it as needed" },
          { value: "manager_audit", label: "Managers audit and review weekly" },
          { value: "automation", label: "We use automation, alerts, and scheduled check-ins" },
        ]}
        value={getStringAnswer(answers["how_dcff82"])}
        onChange={(val) => onAnswer("how_dcff82", val)}
      />

      {/* Question 5: how_9d44c5 */}
      <MultipleChoiceQuestion
        question="How do you identify top-performing reps or sales behaviors?"
        options={[
          { value: "revenue_only", label: "Based on revenue only" },
          { value: "quota_attainment", label: "Based on quota attainment" },
          { value: "multi_kpi", label: "Based on multiple KPIs" },
          { value: "insights", label: "Using dashboards, benchmarks, and insights" },
        ]}
        value={getStringAnswer(answers["how_9d44c5"])}
        onChange={(val) => onAnswer("how_9d44c5", val)}
      />

      {/* Question 6: what_cdbbe6 */}
      <MultipleChoiceQuestion
        question="What is your current process for deal reviews and pipeline management?"
        options={[
          { value: "ad_hoc", label: "Ad hoc or only for big deals" },
          { value: "weekly_checkins", label: "Weekly 1:1s or check-ins" },
          { value: "structured_reviews", label: "Structured pipeline reviews" },
          { value: "combo", label: "Combination of 1:1s, team reviews, and deal desk" },
        ]}
        value={getStringAnswer(answers["what_cdbbe6"])}
        onChange={(val) => onAnswer("what_cdbbe6", val)}
      />

      {/* Question 7: how_3d4d34 */}
      <MultipleChoiceQuestion
        question="How often do you update sales playbooks or enablement materials?"
        options={[
          { value: "no_playbook", label: "We don’t have a playbook" },
          { value: "onboarding_only", label: "Only during onboarding" },
          { value: "semiannual", label: "Every 6–12 months" },
          { value: "continuous", label: "Regularly based on data, feedback, or win/loss" },
        ]}
        value={getStringAnswer(answers["how_3d4d34"])}
        onChange={(val) => onAnswer("how_3d4d34", val)}
      />
    </div>
  );
}
