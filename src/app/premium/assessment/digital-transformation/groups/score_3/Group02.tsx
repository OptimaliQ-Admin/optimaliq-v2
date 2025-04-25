"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["kpi_review"] === "string" &&
    typeof answers["impact"] === "string" &&
    Array.isArray(answers["integrated_systems"]) &&
    answers["integrated_systems"].length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">

      {/* Question 4: kpi_review */}
      <MultipleChoiceQuestion
        question="How often do you revisit your digital transformation KPIs and targets?"
        options={[
          { value: "rarely", label: "Rarely — we don’t have formal KPIs" },
          { value: "annually", label: "Annually — as part of strategy reviews" },
          { value: "quarterly", label: "Quarterly — tied to business reviews" },
          { value: "monthly", label: "Monthly or more — as part of operations" },
        ]}
        value={getStringAnswer(answers["kpi_review"])}
        onChange={(val) => onAnswer("kpi_review", val)}
      />

      {/* Question 5: impact */}
      <MultipleChoiceQuestion
        question="How do digital initiatives influence your customer experience today?"
        options={[
          { value: "no_impact", label: "They don’t have much impact" },
          { value: "reduce_frustration", label: "They reduce friction or frustration" },
          { value: "enable_convenience", label: "They enable new conveniences or self-service" },
          { value: "transform_journey", label: "They transform the customer journey" },
        ]}
        value={getStringAnswer(answers["impact"])}
        onChange={(val) => onAnswer("impact", val)}
      />

      {/* Question 6: integrated_systems */}
      <MultiSelectQuestion
        question="What systems are integrated to support real-time visibility and automation?"
        options={[
          { value: "crm_marketing", label: "CRM and marketing platforms" },
          { value: "inventory_erp", label: "Inventory and ERP systems" },
          { value: "analytics_bi", label: "Analytics and business intelligence tools" },
          { value: "ecommerce", label: "E-commerce and fulfillment software" },
        ]}
        selected={Array.isArray(getArrayAnswer(answers["integrated_systems"] || [])) ? getArrayAnswer(answers["integrated_systems"] || []) : []}
        onChange={(val) => onAnswer("integrated_systems", val)}
        maxSelect={4}
      />
    </div>
  );
}
