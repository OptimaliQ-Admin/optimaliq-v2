"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_1Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["market_awareness"] === "string" &&
    typeof answers["competitive_tracking"] === "string" &&
    typeof answers["differentiation_clarity"] === "string" &&
    typeof answers["market_share_insight"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: market_awareness */}
      <MultipleChoiceQuestion
        question="How would you describe your awareness of market trends or shifts?"
        options={[
          { value: "no_awareness", label: "We don’t actively track market trends" },
          { value: "occasionally", label: "We occasionally read about them" },
          { value: "somewhat_informed", label: "We stay somewhat informed through industry news" },
          { value: "actively_monitored", label: "We actively monitor market and competitor signals" },
        ]}
        value={answers["market_awareness"] || ""}
        onChange={(val) => onAnswer("market_awareness", val)}
      />

      {/* Question 5: competitive_tracking */}
      <MultipleChoiceQuestion
        question="How do you currently track or monitor your competitors?"
        options={[
          { value: "dont_track", label: "We don’t track competitors" },
          { value: "manual_research", label: "We do some manual research or occasional analysis" },
          { value: "ad_hoc_tools", label: "We use tools for ad hoc tracking" },
          { value: "dedicated_system", label: "We have a dedicated system or process for it" },
        ]}
        value={answers["competitive_tracking"] || ""}
        onChange={(val) => onAnswer("competitive_tracking", val)}
      />

      {/* Question 6: differentiation_clarity */}
      <MultipleChoiceQuestion
        question="How clear is your value proposition compared to competitors?"
        options={[
          { value: "not_clear", label: "It’s not clearly defined" },
          { value: "basic", label: "We have a basic idea, but it’s not well-articulated" },
          { value: "somewhat_clear", label: "Somewhat clear — we communicate it internally" },
          { value: "very_clear", label: "Very clear — we lead with it in marketing and sales" },
        ]}
        value={answers["differentiation_clarity"] || ""}
        onChange={(val) => onAnswer("differentiation_clarity", val)}
      />

      {/* Question 7: market_share_insight */}
      <MultipleChoiceQuestion
        question="Do you know what share of the market you hold or could hold?"
        options={[
          { value: "no_clue", label: "No clue — we don’t think about market share" },
          { value: "rough_estimate", label: "We have a rough estimate or guess" },
          { value: "calculated_once", label: "We’ve calculated it once or twice" },
          { value: "actively_tracked", label: "Yes — we track and optimize against it" },
        ]}
        value={answers["market_share_insight"] || ""}
        onChange={(val) => onAnswer("market_share_insight", val)}
      />
    </div>
  );
}
