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
    typeof answers["benchmark_kpis"] === "string" &&
    typeof answers["competitor_tracking"] === "string" &&
    typeof answers["data_sources"] === "string" &&
    typeof answers["performance_alerts"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: benchmark_kpis */}
      <MultipleChoiceQuestion
        question="Which KPIs do you benchmark against competitors or market data?"
        options={[
          { value: "none", label: "We don’t benchmark KPIs" },
          { value: "basic_kpis", label: "Just basic KPIs like revenue or followers" },
          { value: "moderate_kpis", label: "KPIs like engagement rate, LTV, churn" },
          { value: "advanced_kpis", label: "Advanced metrics like CAC, CLTV, ROAS by channel" },
        ]}
        value={getStringAnswer(answers["benchmark_kpis"])}
        onChange={(val) => onAnswer("benchmark_kpis", val)}
      />

      {/* Question 5: competitor_tracking */}
      <MultipleChoiceQuestion
        question="Do you regularly track what your top 3 competitors are doing?"
        options={[
          { value: "never", label: "No, not at all" },
          { value: "sometimes", label: "Sometimes, but it’s not consistent" },
          { value: "informally", label: "Yes, we keep informal tabs" },
          { value: "formally", label: "Yes, we have a formal competitive tracking process" },
        ]}
        value={getStringAnswer(answers["competitor_tracking"])}
        onChange={(val) => onAnswer("competitor_tracking", val)}
      />

      {/* Question 6: data_sources */}
      <MultipleChoiceQuestion
        question="How do you collect competitive or market data?"
        options={[
          { value: "no_sources", label: "We don’t really collect any" },
          { value: "free_tools", label: "We use free tools or occasional web searches" },
          { value: "third_party", label: "We use third-party tools or subscriptions" },
          { value: "custom_research", label: "We run custom research or use multiple reliable sources" },
        ]}
        value={getStringAnswer(answers["data_sources"])}
        onChange={(val) => onAnswer("data_sources", val)}
      />

      {/* Question 7: performance_alerts */}
      <MultipleChoiceQuestion
        question="Do you get alerts or early signals when a competitor gains momentum or launches something new?"
        options={[
          { value: "never", label: "No, we usually hear late" },
          { value: "sometimes", label: "Sometimes, through team awareness" },
          { value: "manual_checks", label: "We manually check for competitor updates" },
          { value: "automated_alerts", label: "Yes, we get automated alerts or intel" },
        ]}
        value={getStringAnswer(answers["performance_alerts"])}
        onChange={(val) => onAnswer("performance_alerts", val)}
      />
    </div>
  );
}
