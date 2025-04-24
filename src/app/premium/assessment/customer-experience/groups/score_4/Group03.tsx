"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_cross_team_execution"] === "string" &&
    typeof answers["cx_scalability"] === "string" &&
    typeof answers["cx_predictive_capabilities"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_0_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 8: cx_cross_team_execution */}
      <MultipleChoiceQuestion
        question="How coordinated are your CX efforts across teams (marketing, support, product, etc.)?"
        options={[
          { value: "siloed_efforts", label: "Teams work in silos with little coordination" },
          { value: "some_alignment", label: "Some alignment but efforts are fragmented" },
          { value: "collaborative_initiatives", label: "We run some joint CX initiatives" },
          { value: "fully_coordinated", label: "Efforts are fully coordinated and shared" },
        ]}
        value={answers["cx_cross_team_execution"] || ""}
        onChange={(val) => onAnswer("cx_cross_team_execution", val)}
      />

      {/* Question 9: cx_scalability */}
      <MultipleChoiceQuestion
        question="How scalable is your current CX strategy as your business grows?"
        options={[
          { value: "not_scalable", label: "Not scalable — we’re reinventing constantly" },
          { value: "some_scalability", label: "Somewhat scalable — with effort" },
          { value: "scalable_frameworks", label: "We’ve built repeatable frameworks" },
          { value: "scales_freely", label: "Highly scalable — it evolves as we grow" },
        ]}
        value={answers["cx_scalability"] || ""}
        onChange={(val) => onAnswer("cx_scalability", val)}
      />

      {/* Question 10: cx_predictive_capabilities */}
      <MultipleChoiceQuestion
        question="Do you use predictive analytics to anticipate customer behavior or needs?"
        options={[
          { value: "no_usage", label: "No — we rely on past data only" },
          { value: "basic_predictions", label: "Basic predictions in some campaigns" },
          { value: "integrated_predictions", label: "Predictions are integrated into strategy" },
          { value: "real_time_adaptation", label: "Real-time predictions drive CX decisions" },
        ]}
        value={answers["cx_predictive_capabilities"] || ""}
        onChange={(val) => onAnswer("cx_predictive_capabilities", val)}
      />
    </div>
  );
}
