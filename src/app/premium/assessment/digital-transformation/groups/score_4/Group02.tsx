"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["department_alignment"] === "string" &&
    typeof answers["data_flow_integration"] === "string" &&
    typeof answers["innovation_process"] === "string" &&
    typeof answers["investment_impact_review"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4 */}
      <MultipleChoiceQuestion
        question="How well are departments aligned when executing digital initiatives?"
        options={[
          { value: "not_aligned", label: "They’re not — each runs independently" },
          { value: "basic_collaboration", label: "Basic collaboration during implementation" },
          { value: "cross_dept_planning", label: "Joint planning and coordination is common" },
          { value: "fully_integrated", label: "Fully aligned with cross-functional ownership" },
        ]}
        value={getStringAnswer(answers["department_alignment"])}
        onChange={(val) => onAnswer("department_alignment", val)}
      />

      {/* Question 5 */}
      <MultipleChoiceQuestion
        question="How would you describe your internal data flow across platforms and teams?"
        options={[
          { value: "manual_or_fragmented", label: "Mostly manual or fragmented" },
          { value: "some_integrations", label: "Some integrations between key systems" },
          { value: "central_data_layer", label: "We have a central data layer or warehouse" },
          { value: "real_time_flow", label: "Data flows automatically across all core systems" },
        ]}
        value={getStringAnswer(answers["data_flow_integration"])}
        onChange={(val) => onAnswer("data_flow_integration", val)}
      />

      {/* Question 6 */}
      <MultipleChoiceQuestion
        question="How do you approach innovation within your digital transformation efforts?"
        options={[
          { value: "ad_hoc_experiments", label: "Ad hoc — mostly pilot programs" },
          { value: "structured_initiatives", label: "Structured initiatives within teams" },
          { value: "innovation_labs", label: "Dedicated innovation lab or task force" },
          { value: "embedded_in_teams", label: "Innovation is embedded in day-to-day execution" },
        ]}
        value={getStringAnswer(answers["innovation_process"])}
        onChange={(val) => onAnswer("innovation_process", val)}
      />

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How often do you review the ROI or impact of your digital investments?"
        options={[
          { value: "rarely_review", label: "Rarely or never" },
          { value: "only_big_projects", label: "Only for major projects or tools" },
          { value: "scheduled_reviews", label: "We have scheduled ROI reviews" },
          { value: "real_time_tracking", label: "ROI is monitored in real time" },
        ]}
        value={getStringAnswer(answers["investment_impact_review"])}
        onChange={(val) => onAnswer("investment_impact_review", val)}
      />
    </div>
  );
}
