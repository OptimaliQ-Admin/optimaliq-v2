"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_metrics_leadership"] === "string" &&
    typeof answers["cx_decision_framework"] === "string" &&
    typeof answers["cx_journey_optimization"] === "string" &&
    typeof answers["cx_technology_scaling"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: cx_metrics_leadership */}
      <MultipleChoiceQuestion
        question="How often are CX metrics discussed at the leadership level?"
        options={[
          { value: "rarely_discussed", label: "Rarely or never" },
          { value: "periodically", label: "Periodically (quarterly or ad hoc)" },
          { value: "regular_checkins", label: "Regular check-ins (monthly or OKRs)" },
          { value: "embedded_in_strategy", label: "CX metrics are embedded in strategic reviews" },
        ]}
        value={answers["cx_metrics_leadership"] || ""}
        onChange={(val) => onAnswer("cx_metrics_leadership", val)}
      />

      {/* Question 5: cx_decision_framework */}
      <MultipleChoiceQuestion
        question="Do you use a formal framework to prioritize CX initiatives?"
        options={[
          { value: "no_framework", label: "No — it’s based on gut or urgency" },
          { value: "basic_prioritization", label: "Basic prioritization using time/cost/impact" },
          { value: "formal_framework", label: "We use a formal framework to score ideas" },
          { value: "data_driven_prioritization", label: "We use data, models, and CX value scores" },
        ]}
        value={answers["cx_decision_framework"] || ""}
        onChange={(val) => onAnswer("cx_decision_framework", val)}
      />

      {/* Question 6: cx_journey_optimization */}
      <MultipleChoiceQuestion
        question="How do you optimize customer journeys across channels?"
        options={[
          { value: "siloed_channels", label: "Channels operate independently" },
          { value: "basic_coordination", label: "Basic coordination of key touchpoints" },
          { value: "journey_maps", label: "We use journey maps and integrated reporting" },
          { value: "cross_channel_ai", label: "Cross-channel orchestration with AI optimization" },
        ]}
        value={answers["cx_journey_optimization"] || ""}
        onChange={(val) => onAnswer("cx_journey_optimization", val)}
      />

      {/* Question 7: cx_technology_scaling */}
      <MultipleChoiceQuestion
        question="What best describes your technology for delivering customer experience at scale?"
        options={[
          { value: "fragmented_tools", label: "Fragmented tools, mostly manual" },
          { value: "some_automation", label: "Some automation and integrations" },
          { value: "cx_platforms", label: "Integrated platforms for CX delivery" },
          { value: "ai_and_platforms", label: "AI-enabled platforms powering real-time CX" },
        ]}
        value={answers["cx_technology_scaling"] || ""}
        onChange={(val) => onAnswer("cx_technology_scaling", val)}
      />
    </div>
  );
}
