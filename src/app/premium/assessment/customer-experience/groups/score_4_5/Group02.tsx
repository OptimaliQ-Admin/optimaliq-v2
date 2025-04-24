"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_multichannel_vs_omnichannel"] === "string" &&
    typeof answers["cx_data_consolidation"] === "string" &&
    typeof answers["cx_proactive_support"] === "string" &&
    typeof answers["cx_kpis_measured"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: cx_multichannel_vs_omnichannel */}
      <MultipleChoiceQuestion
        question="How would you describe your multichannel or omnichannel experience?"
        options={[
          { value: "basic_multichannel", label: "Basic multichannel — different teams own different channels" },
          { value: "partially_integrated", label: "Partially integrated — some data is shared between channels" },
          { value: "unified_experience", label: "Unified experience across most touchpoints" },
          { value: "seamless_omnichannel", label: "Seamless omnichannel experience — consistent and connected" },
        ]}
        value={getStringAnswer(answers["cx_multichannel_vs_omnichannel"])}
        onChange={(val) => onAnswer("cx_multichannel_vs_omnichannel", val)}
      />

      {/* Question 5: cx_data_consolidation */}
      <MultipleChoiceQuestion
        question="How well is your customer data unified across platforms?"
        options={[
          { value: "completely_disparate", label: "Completely disparate systems" },
          { value: "some_connections", label: "Some systems are integrated" },
          { value: "centralized_customer_view", label: "We have a centralized customer view" },
          { value: "customer_data_platform", label: "CDP or equivalent consolidates and activates data" },
        ]}
        value={getStringAnswer(answers["cx_data_consolidation"])}
        onChange={(val) => onAnswer("cx_data_consolidation", val)}
      />

      {/* Question 6: cx_proactive_support */}
      <MultipleChoiceQuestion
        question="Do you proactively reach out to customers based on behavior or signals?"
        options={[
          { value: "no_proactive_outreach", label: "No — we wait for them to contact us" },
          { value: "basic_follow_up", label: "Some basic follow-up or win-back campaigns" },
          { value: "automated_triggers", label: "We use triggers to re-engage based on behaviors" },
          { value: "proactive_and_predictive", label: "Yes — predictive outreach to improve experience" },
        ]}
        value={getStringAnswer(answers["cx_proactive_support"])}
        onChange={(val) => onAnswer("cx_proactive_support", val)}
      />

      {/* Question 7: cx_kpis_measured */}
      <MultipleChoiceQuestion
        question="How do you measure the effectiveness of your customer experience strategy?"
        options={[
          { value: "no_kpis", label: "We don’t measure CX effectiveness" },
          { value: "basic_kpis", label: "We track basic KPIs (e.g., NPS, CSAT)" },
          { value: "multiple_metrics", label: "We use multiple metrics across channels" },
          { value: "cx_scorecard", label: "We track against a unified CX scorecard tied to revenue" },
        ]}
        value={getStringAnswer(answers["cx_kpis_measured"])}
        onChange={(val) => onAnswer("cx_kpis_measured", val)}
      />
    </div>
  );
}
