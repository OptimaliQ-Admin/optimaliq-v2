"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["reengagement_strategy"] === "string" &&
    Array.isArray(answers["measurement_dashboards"]) &&
    answers["measurement_dashboards"].length > 0 &&
    typeof answers["mql_definition"] === "string" &&
    typeof answers["creative_testing"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  const selectedDashboards = answers["measurement_dashboards"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 4: reengagement_strategy */}
      <MultipleChoiceQuestion
        question="What is your strategy for re-engaging inactive leads or customers?"
        options={[
          { value: "no_strategy", label: "We don’t really have one" },
          { value: "occasional_promos", label: "We send occasional promos" },
          { value: "automated_winback", label: "We have automated winback or retargeting flows" },
          { value: "personalized_reactivation", label: "We use behavior-based, personalized reactivation strategies" },
        ]}
        value={getStringAnswer(answers["reengagement_strategy"])}
        onChange={(val) => onAnswer("reengagement_strategy", val)}
      />

      {/* Question 5: measurement_dashboards */}
      <MultiSelectQuestion
        question="What types of dashboards or reports do you currently use?"
        options={[
          { value: "open_rate", label: "Email open or click-through rates" },
          { value: "lead_volume", label: "Lead volume and conversion rate" },
          { value: "roi", label: "Campaign ROI or customer acquisition cost" },
          { value: "lifetime_value", label: "Customer lifetime value (LTV)" },
          { value: "none", label: "We don’t currently use dashboards" },
        ]}
        selected={selectedDashboards}
        onChange={(val) => onAnswer("measurement_dashboards", val)}
        maxSelect={5}
      />

      {/* Question 6: mql_definition */}
      <MultipleChoiceQuestion
        question="Do you have a clear definition of a Marketing Qualified Lead (MQL)?"
        options={[
          { value: "no_definition", label: "No, it’s not clearly defined" },
          { value: "based_on_lead_score", label: "It’s based on lead score or behavior" },
          { value: "mql_sla", label: "We have a defined MQL with an SLA to sales" },
          { value: "mql_qc_review", label: "We use a QA or qualification review before handoff" },
        ]}
        value={getStringAnswer(answers["mql_definition"])}
        onChange={(val) => onAnswer("mql_definition", val)}
      />

      {/* Question 7: creative_testing */}
      <MultipleChoiceQuestion
        question="How often do you test creative or content variations?"
        options={[
          { value: "never", label: "We don’t test creative" },
          { value: "occasionally", label: "We test occasionally" },
          { value: "frequent_testing", label: "We run frequent A/B tests" },
          { value: "systematic_testing", label: "We have a systematic testing process" },
        ]}
        value={getStringAnswer(answers["creative_testing"])}
        onChange={(val) => onAnswer("creative_testing", val)}
      />
    </div>
  );
}
