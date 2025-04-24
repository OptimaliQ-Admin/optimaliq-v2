"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ecosystem_partnerships"] === "string" &&
    typeof answers["tech_risk_management"] === "string" &&
    typeof answers["digital_impact"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="What role do ecosystem partnerships (vendors, integrators, platforms) play in your transformation strategy?"
        options={[
          { value: "minimal_role", label: "Minimal — we handle things in-house" },
          { value: "selective_use", label: "We use a few providers for niche needs" },
          { value: "strategic_partnerships", label: "We have strategic partnerships in place" },
          { value: "ecosystem_driven", label: "We rely on a robust ecosystem to drive innovation and scale" },
        ]}
        value={getStringAnswer(answers["ecosystem_partnerships"])}
        onChange={(val) => onAnswer("ecosystem_partnerships", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How do you manage risks related to new technologies?"
        options={[
          { value: "reactive", label: "We address risks after they happen" },
          { value: "basic_controls", label: "We have basic controls or approvals in place" },
          { value: "risk_framework", label: "We use a formal risk framework for new tech" },
          { value: "proactive_management", label: "Risks are proactively assessed and mitigated before adoption" },
        ]}
        value={getStringAnswer(answers["tech_risk_management"])}
        onChange={(val) => onAnswer("tech_risk_management", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How do you measure the impact of your digital transformation efforts?"
        options={[
          { value: "no_tracking", label: "We don’t track it" },
          { value: "project_level", label: "Only at the project or team level" },
          { value: "business_outcomes", label: "We track high-level business outcomes" },
          { value: "roi_and_efficiency", label: "We use clear KPIs, ROI, and efficiency gains" },
        ]}
        value={getStringAnswer(answers["digital_impact"])}
        onChange={(val) => onAnswer("digital_impact", val)}
      />
    </div>
  );
}
