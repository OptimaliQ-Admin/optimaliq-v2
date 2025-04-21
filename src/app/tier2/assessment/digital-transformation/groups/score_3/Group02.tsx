"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["kpi_review"] === "string" &&
    typeof answers["impact"] === "string" &&
    Array.isArray(answers["integrated_systems"]) &&
    answers["integrated_systems"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
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
        value={answers["kpi_review"] || ""}
        onChange={(val) => onAnswer("kpi_review", val)}
      />"use client";

      import React from "react";
      import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
      
      export function isScore_3_0Group2Complete(answers: Record<string, any>): boolean {
        return (
          typeof answers["performance_metrics"] === "string" &&
          typeof answers["team_enablement"] === "string" &&
          typeof answers["data_accessibility"] === "string" &&
          typeof answers["innovation_culture"] === "string"
        );
      }
      
      type Props = {
        answers: Record<string, any>;
        onAnswer: (key: string, value: any) => void;
      };
      
      export default function Score3_0_Step02({ answers, onAnswer }: Props) {
        return (
          <div className="p-6 max-w-2xl mx-auto space-y-8">
            
            {/* Question 4: performance_metrics */}
            <MultipleChoiceQuestion
              question="How frequently do you review digital performance metrics (e.g. engagement, uptime, conversion)?"
              options={[
                { value: "rarely", label: "Rarely — only when there’s an issue" },
                { value: "monthly", label: "Monthly" },
                { value: "weekly", label: "Weekly" },
                { value: "real_time", label: "Real-time dashboards and alerts" },
              ]}
              value={answers["performance_metrics"] || ""}
              onChange={(val) => onAnswer("performance_metrics", val)}
            />
      
            {/* Question 5: team_enablement */}
            <MultipleChoiceQuestion
              question="How well-equipped are your teams to adopt and use new technology?"
              options={[
                { value: "resistant", label: "Not well — adoption is a major challenge" },
                { value: "training_needed", label: "Basic enablement — we need more training" },
                { value: "proficient", label: "Proficient — teams are trained and supported" },
                { value: "self_driven", label: "Very well — teams actively seek new tools" },
              ]}
              value={answers["team_enablement"] || ""}
              onChange={(val) => onAnswer("team_enablement", val)}
            />
      
            {/* Question 6: data_accessibility */}
            <MultipleChoiceQuestion
              question="Can stakeholders easily access the data they need to make decisions?"
              options={[
                { value: "data_silos", label: "No — data is siloed or difficult to retrieve" },
                { value: "basic_reports", label: "We have basic reports, but they’re limited" },
                { value: "self_service", label: "Yes — users can pull what they need" },
                { value: "integrated_insights", label: "Yes — insights are pushed to the right people automatically" },
              ]}
              value={answers["data_accessibility"] || ""}
              onChange={(val) => onAnswer("data_accessibility", val)}
            />
      
            {/* Question 7: innovation_culture */}
            <MultipleChoiceQuestion
              question="How would you describe your organization's culture around digital innovation?"
              options={[
                { value: "risk_averse", label: "Risk-averse — we rarely try new things" },
                { value: "neutral", label: "Neutral — we try new tools when necessary" },
                { value: "progressive", label: "Progressive — we actively test and adopt new solutions" },
                { value: "trailblazing", label: "Trailblazing — we are a digital innovation leader" },
              ]}
              value={answers["innovation_culture"] || ""}
              onChange={(val) => onAnswer("innovation_culture", val)}
            />
          </div>
        );
      }
      

      {/* Question 5: impact */}
      <MultipleChoiceQuestion
        question="How do digital initiatives influence your customer experience today?"
        options={[
          { value: "no_impact", label: "They don’t have much impact" },
          { value: "reduce_frustration", label: "They reduce friction or frustration" },
          { value: "enable_convenience", label: "They enable new conveniences or self-service" },
          { value: "transform_journey", label: "They transform the customer journey" },
        ]}
        value={answers["impact"] || ""}
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
        selected={answers["integrated_systems"] || []}
        onChange={(val) => onAnswer("integrated_systems", val)}
        maxSelect={4}
      />
    </div>
  );
}
