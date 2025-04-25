"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["scaling_strategy"] === "string" &&
    typeof answers["platform_consolidation"] === "string" &&
    typeof answers["emerging_tech_adoption"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="What’s your current strategy for scaling digital capabilities across the organization?"
        options={[
          { value: "no_clear_plan", label: "No clear plan — each team acts independently" },
          { value: "playbooks_exist", label: "Playbooks or best practices exist, but adoption varies" },
          { value: "coordinated_scaling", label: "We coordinate across teams during scale-up" },
          { value: "enterprise_scaling", label: "We scale enterprise-wide with dedicated rollout teams" },
        ]}
        value={getStringAnswer(answers["scaling_strategy"])}
        onChange={(val) => onAnswer("scaling_strategy", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="Do you have a formal strategy for consolidating or phasing out redundant tech platforms?"
        options={[
          { value: "no_strategy", label: "No strategy — tools are added but not reviewed" },
          { value: "basic_review", label: "Occasionally reviewed when problems arise" },
          { value: "scheduled_audits", label: "Audits or reviews happen on a scheduled basis" },
          { value: "consolidation_goals", label: "Yes — we proactively consolidate based on goals" },
        ]}
        value={getStringAnswer(answers["platform_consolidation"])}
        onChange={(val) => onAnswer("platform_consolidation", val)}
      />

      {/* Question 10 */}
      <MultipleChoiceQuestion
        question="How do you evaluate and adopt emerging technologies (AI, automation, etc.)?"
        options={[
          { value: "wait_and_see", label: "We wait until it’s proven in our industry" },
          { value: "adopt_when_necessary", label: "We adopt when a clear use case emerges" },
          { value: "proactively_explore", label: "We proactively explore and test new tech" },
          { value: "strategic_initiative", label: "It’s part of our core innovation strategy" },
        ]}
        value={getStringAnswer(answers["emerging_tech_adoption"])}
        onChange={(val) => onAnswer("emerging_tech_adoption", val)}
      />
    </div>
  );
}
