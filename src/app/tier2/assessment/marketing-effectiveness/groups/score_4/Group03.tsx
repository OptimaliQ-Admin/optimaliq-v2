"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_4Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["kpi_health_monitoring"] === "string" &&
    typeof answers["scalability_confidence"] === "string" &&
    typeof answers["marketing_innovation_idea"] === "string" &&
    answers["marketing_innovation_idea"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 7: kpi_health_monitoring */}
      <MultipleChoiceQuestion
        question="How do you track the health of your top KPIs across channels and segments?"
        options={[
          { value: "weekly_snapshot", label: "Weekly snapshot reports" },
          { value: "segment_differentiation", label: "Differentiated by segment/channel" },
          { value: "automated_dashboards", label: "Automated dashboards with alerts" },
          { value: "real_time_forecasting", label: "Real-time and forecasting models" }
        ]}
        value={answers["kpi_health_monitoring"] || ""}
        onChange={(val) => onAnswer("kpi_health_monitoring", val)}
      />

      {/* Question 8: scalability_confidence */}
      <MultipleChoiceQuestion
        question="How confident are you that your marketing engine can scale 2–3x?"
        options={[
          { value: "not_confident", label: "Not confident" },
          { value: "somewhat_confident", label: "Somewhat confident" },
          { value: "confident_with_investment", label: "Confident with additional investment" },
          { value: "fully_confident", label: "Fully confident — it’s already designed for scale" }
        ]}
        value={answers["scalability_confidence"] || ""}
        onChange={(val) => onAnswer("scalability_confidence", val)}
      />

      {/* Question 9: marketing_innovation_idea */}
      <TextAreaQuestion
        question="What’s one experiment or innovative idea you’d love to try in your marketing but haven’t yet?"
        placeholder="E.g., Launch a viral TikTok campaign, implement a predictive lead scoring model..."
        value={answers["marketing_innovation_idea"] || ""}
        onChange={(val) => onAnswer("marketing_innovation_idea", val)}
        maxLength={500}
      />
    </div>
  );
}
