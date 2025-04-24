"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_reporting"] === "string" &&
    typeof answers["feedback_channel_diversity"] === "string" &&
    typeof answers["employee_training"] === "string" &&
    typeof answers["cx_adjustments"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: cx_reporting */}
      <MultipleChoiceQuestion
        question="How often is customer experience performance reported and reviewed?"
        options={[
          { value: "rarely", label: "Rarely — only when something goes wrong" },
          { value: "quarterly", label: "Quarterly or ad hoc reports" },
          { value: "monthly", label: "Monthly team-level dashboards" },
          { value: "real_time", label: "Real-time metrics and regular reviews" },
        ]}
        value={answers["cx_reporting"] || ""}
        onChange={(val) => onAnswer("cx_reporting", val)}
      />

      {/* Question 5: feedback_channel_diversity */}
      <MultipleChoiceQuestion
        question="How many feedback channels do you currently monitor?"
        options={[
          { value: "none", label: "None — we don’t track formal feedback" },
          { value: "one_channel", label: "One channel (e.g. survey or support)" },
          { value: "few_channels", label: "2–3 channels across lifecycle" },
          { value: "many_channels", label: "4+ channels (e.g. survey, NPS, social, reviews)" },
        ]}
        value={answers["feedback_channel_diversity"] || ""}
        onChange={(val) => onAnswer("feedback_channel_diversity", val)}
      />

      {/* Question 6: employee_training */}
      <MultipleChoiceQuestion
        question="How well are employees trained to handle customer experience moments?"
        options={[
          { value: "no_training", label: "No formal training" },
          { value: "basic_guidelines", label: "Some guidelines shared" },
          { value: "role_based_training", label: "Role-based training exists" },
          { value: "cx_certified", label: "All teams are CX-certified or trained regularly" },
        ]}
        value={answers["employee_training"] || ""}
        onChange={(val) => onAnswer("employee_training", val)}
      />

      {/* Question 7: cx_adjustments */}
      <MultipleChoiceQuestion
        question="When feedback reveals a problem, how fast can you adjust the experience?"
        options={[
          { value: "very_slow", label: "Very slow — months or more" },
          { value: "slow", label: "Slow — requires multiple approvals" },
          { value: "moderate", label: "Moderate — we fix things within weeks" },
          { value: "fast_response", label: "Fast — we update experiences in days" },
        ]}
        value={answers["cx_adjustments"] || ""}
        onChange={(val) => onAnswer("cx_adjustments", val)}
      />
    </div>
  );
}
