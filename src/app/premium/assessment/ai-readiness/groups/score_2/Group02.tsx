"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_sponsorship"] === "string" &&
    typeof answers["data_integration"] === "string" &&
    typeof answers["ai_use_cases"] === "string" &&
    typeof answers["change_management"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: ai_sponsorship */}
      <MultipleChoiceQuestion
        question="Who is sponsoring or championing AI efforts in your organization?"
        options={[
          { value: "no_clear_owner", label: "No clear owner — it’s informal" },
          { value: "individual_teams", label: "An individual team or function" },
          { value: "cross_functional", label: "A cross-functional working group" },
          { value: "executive_sponsor", label: "An executive sponsor or leadership team" },
        ]}
        value={getStringAnswer(answers["ai_sponsorship"])}
        onChange={(val) => onAnswer("ai_sponsorship", val)}
      />

      {/* Question 5: data_integration */}
      <MultipleChoiceQuestion
        question="How integrated are your data sources (CRM, ERP, web, etc.)?"
        options={[
          { value: "not_integrated", label: "Not integrated — we use exports or manual merges" },
          { value: "some_integrations", label: "Some integrations via basic APIs" },
          { value: "etl_pipelines", label: "ETL pipelines feed our reporting system" },
          { value: "real_time", label: "Real-time data sync across platforms" },
        ]}
        value={getStringAnswer(answers["data_integration"])}
        onChange={(val) => onAnswer("data_integration", val)}
      />

      {/* Question 6: ai_use_cases */}
      <MultipleChoiceQuestion
        question="How clear is your understanding of where AI could deliver business value?"
        options={[
          { value: "no_roadmap", label: "We have no real roadmap or prioritization" },
          { value: "ad_hoc_exploration", label: "We’re exploring a few ad hoc ideas" },
          { value: "prioritized_list", label: "We’ve identified and prioritized use cases" },
          { value: "deep_alignment", label: "AI opportunities are tied to core KPIs" },
        ]}
        value={getStringAnswer(answers["ai_use_cases"])}
        onChange={(val) => onAnswer("ai_use_cases", val)}
      />

      {/* Question 7: change_management */}
      <MultipleChoiceQuestion
        question="How prepared is your team for adopting new AI tools or workflows?"
        options={[
          { value: "not_prepared", label: "Not prepared — there’s a lot of resistance" },
          { value: "some_concerns", label: "Some concerns, but interest exists" },
          { value: "supportive", label: "Generally supportive with the right enablement" },
          { value: "proactive", label: "Proactively seeking new AI capabilities" },
        ]}
        value={getStringAnswer(answers["change_management"])}
        onChange={(val) => onAnswer("change_management", val)}
      />
    </div>
  );
}
