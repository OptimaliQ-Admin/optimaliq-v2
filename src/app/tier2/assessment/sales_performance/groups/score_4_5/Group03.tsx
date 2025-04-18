"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["rep_development"] === "string" &&
    answers["rep_development"].trim().length > 0 &&
    typeof answers["valuable_insight"] === "string" &&
    answers["valuable_insight"].trim().length > 0 &&
    typeof answers["scaling_confidence"] === "string" &&
    answers["scaling_confidence"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 8: rep_development */}
      <MultipleChoiceQuestion
        question="How do you ensure sales reps are continuously developing and improving?"
        options={[
          { value: "ad_hoc", label: "Ad hoc feedback or call reviews" },
          { value: "monthly_enablement", label: "Monthly enablement sessions" },
          { value: "individual_plans", label: "Individualized coaching plans" },
          { value: "structured_development", label: "Structured L&D tied to metrics + growth plans" },
        ]}
        value={answers["rep_development"] || ""}
        onChange={(val) => onAnswer("rep_development", val)}
      />

      {/* Question 9: valuable_insight */}
      <TextAreaQuestion
        question="What’s the most valuable insight your sales or ops data revealed in the last quarter?"
        placeholder="E.g., reps winning faster when demo is skipped, churn risk linked to missed onboarding step"
        value={answers["valuable_insight"] || ""}
        onChange={(val) => onAnswer("valuable_insight", val)}
        maxLength={300}
      />

      {/* Question 10: scaling_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your sales org can scale with new segments, reps, or geos?"
        options={[
          { value: "not_confident", label: "Not confident — we’d need major changes" },
          { value: "somewhat_ready", label: "Somewhat — playbook exists but untested" },
          { value: "repeatable_model", label: "We have a repeatable model and early wins" },
          { value: "fully_ready", label: "Fully ready — proven and ready to scale" },
        ]}
        value={answers["scaling_confidence"] || ""}
        onChange={(val) => onAnswer("scaling_confidence", val)}
      />
    </div>
  );
}
