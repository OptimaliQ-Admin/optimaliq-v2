"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["ai_infrastructure"] === "string" &&
    typeof answers["data_governance"] === "string" &&
    typeof answers["success_metrics"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: ai_infrastructure */}
      <MultipleChoiceQuestion
        question="How would you describe your infrastructure for experimenting with or deploying AI?"
        options={[
          { value: "none_yet", label: "None — we rely on vendors or off-the-shelf tools" },
          { value: "basic_access", label: "We have access to some AI tools or APIs" },
          { value: "centralized_platform", label: "We have a centralized platform or workflow" },
          { value: "custom_pipelines", label: "We’ve built internal pipelines or systems" },
        ]}
        value={getStringAnswer(answers["ai_infrastructure"])}
        onChange={(val) => onAnswer("ai_infrastructure", val)}
      />

      {/* Question 9: data_governance */}
      <MultipleChoiceQuestion
        question="What level of data governance is in place for AI usage?"
        options={[
          { value: "none", label: "None — anyone can use anything" },
          { value: "some_guidelines", label: "Some informal rules or recommendations" },
          { value: "team_policies", label: "Each team has rules for responsible use" },
          { value: "centralized_policies", label: "We have centralized, org-wide AI governance" },
        ]}
        value={getStringAnswer(answers["data_governance"])}
        onChange={(val) => onAnswer("data_governance", val)}
      />

      {/* Question 10: success_metrics */}
      <MultipleChoiceQuestion
        question="How do you measure the success of AI initiatives?"
        options={[
          { value: "we_dont", label: "We don’t really measure it" },
          { value: "efficiency_only", label: "We track efficiency or time savings" },
          { value: "business_impact", label: "We measure business impact and ROI" },
          { value: "kpis_tracked", label: "We tie success directly to strategic KPIs" },
        ]}
        value={getStringAnswer(answers["success_metrics"])}
        onChange={(val) => onAnswer("success_metrics", val)}
      />
    </div>
  );
}
