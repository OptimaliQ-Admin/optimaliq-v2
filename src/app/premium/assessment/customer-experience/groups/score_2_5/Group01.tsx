"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_2_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["touchpoint_clarity"] === "string" &&
    typeof answers["ownership_clarity"] === "string" &&
    typeof answers["tracking_consistency"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 1: touchpoint_clarity */}
      <MultipleChoiceQuestion
        question="How clearly defined are the customer touchpoints across your journey?"
        options={[
          { value: "unclear", label: "Unclear — varies by team or channel" },
          { value: "basic_list", label: "Basic list — we know main points but not all" },
          { value: "documented", label: "Documented — we’ve mapped the journey" },
          { value: "optimized_map", label: "Optimized — clear touchpoints aligned to lifecycle" },
        ]}
        value={answers["touchpoint_clarity"] || ""}
        onChange={(val) => onAnswer("touchpoint_clarity", val)}
      />

      {/* Question 2: ownership_clarity */}
      <MultipleChoiceQuestion
        question="Who owns the experience at each major stage (e.g., acquisition, onboarding, support)?"
        options={[
          { value: "no_one", label: "No one — it’s unclear or unassigned" },
          { value: "team_shared", label: "Shared — team handles it collectively" },
          { value: "individuals", label: "Assigned — individuals own certain steps" },
          { value: "role_based", label: "Role-based — clearly defined ownership by role" },
        ]}
        value={answers["ownership_clarity"] || ""}
        onChange={(val) => onAnswer("ownership_clarity", val)}
      />

      {/* Question 3: tracking_consistency */}
      <MultipleChoiceQuestion
        question="How consistently do you track and measure customer interactions across touchpoints?"
        options={[
          { value: "not_tracked", label: "Not really tracked" },
          { value: "partial_tracking", label: "Some tracking by teams" },
          { value: "standard_metrics", label: "Standard metrics in place" },
          { value: "integrated_tracking", label: "Fully integrated tracking system" },
        ]}
        value={answers["tracking_consistency"] || ""}
        onChange={(val) => onAnswer("tracking_consistency", val)}
      />
    </div>
  );
}
