"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["lifecycle_personalization"] === "string" &&
    Array.isArray(answers["team_model"]) &&
    answers["team_model"].length > 0 &&
    typeof answers["budget_optimization"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  const teamModel = answers["team_model"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 4: lifecycle_personalization */}
      <MultipleChoiceQuestion
        question="How personalized are your customer lifecycle campaigns?"
        options={[
          { value: "basic_segmenting", label: "Basic segmenting by stage (e.g., onboarding vs retention)" },
          { value: "event_triggered", label: "Event-triggered with some branching logic" },
          { value: "persona_personalized", label: "Personalized by persona, behavior, and timing" },
          { value: "ai_optimized", label: "AI-optimized for channel, time, and message" }
        ]}
        value={answers["lifecycle_personalization"] || ""}
        onChange={(val) => onAnswer("lifecycle_personalization", val)}
      />

      {/* Question 5: team_model */}
      <MultiSelectQuestion
        question="What roles or functions are represented on your marketing team?"
        options={[
          { value: "demand_gen", label: "Demand generation or growth marketing" },
          { value: "content", label: "Content or brand marketing" },
          { value: "ops_analytics", label: "Marketing operations / analytics" },
          { value: "product_marketing", label: "Product marketing" },
          { value: "creative", label: "Creative / design" },
          { value: "none", label: "None of these today" }
        ]}
        selected={teamModel}
        onChange={(val) => onAnswer("team_model", val)}
        maxSelect={6}
      />

      {/* Question 6: budget_optimization */}
      <MultipleChoiceQuestion
        question="How well are your marketing resources allocated toward your highest-performing efforts?"
        options={[
          { value: "unclear_roi", label: "Unclear — we don’t have good ROI tracking" },
          { value: "some_optimizing", label: "We’ve started optimizing toward top programs" },
          { value: "performance_based", label: "Resources shift based on performance" },
          { value: "fully_optimized", label: "We reallocate budget in near real-time based on impact" }
        ]}
        value={answers["budget_optimization"] || ""}
        onChange={(val) => onAnswer("budget_optimization", val)}
      />
    </div>
  );
}
