"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["tech_stack_evaluation"] === "string" &&
    typeof answers["platform_utilization"] === "string" &&
    typeof answers["cross_team_adoption"] === "string" &&
    typeof answers["internal_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: tech_stack_evaluation */}
      <MultipleChoiceQuestion
        question="How frequently do you evaluate or update your tech stack?"
        options={[
          { value: "rarely", label: "Rarely — we don’t formally review tools" },
          { value: "occasionally", label: "Occasionally — during major changes or renewals" },
          { value: "annually", label: "Annually — part of a regular review cycle" },
          { value: "quarterly", label: "Quarterly or more often — we stay proactive" },
        ]}
        value={getStringAnswer(answers["tech_stack_evaluation"])}
        onChange={(val) => onAnswer("tech_stack_evaluation", val)}
      />

      {/* Question 5: platform_utilization */}
      <MultipleChoiceQuestion
        question="How well are you using the capabilities of your current platforms?"
        options={[
          { value: "barely_used", label: "Barely using them — most features go unused" },
          { value: "basic_usage", label: "Basic usage — just scratching the surface" },
          { value: "well_utilized", label: "Well utilized — we take advantage of key features" },
          { value: "fully_maximized", label: "Fully maximized — tools are deeply embedded in operations" },
        ]}
        value={getStringAnswer(answers["platform_utilization"])}
        onChange={(val) => onAnswer("platform_utilization", val)}
      />

      {/* Question 6: cross_team_adoption */}
      <MultipleChoiceQuestion
        question="How well are your tools adopted across departments or teams?"
        options={[
          { value: "ad_hoc_usage", label: "Ad hoc — usage depends on the team" },
          { value: "some_consistency", label: "Some consistency — a few shared tools" },
          { value: "broad_adoption", label: "Broad adoption — most teams use the same core stack" },
          { value: "full_alignment", label: "Full alignment — tools support seamless collaboration" },
        ]}
        value={getStringAnswer(answers["cross_team_adoption"])}
        onChange={(val) => onAnswer("cross_team_adoption", val)}
      />

      {/* Question 7: internal_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your technology approach with business goals?"
        options={[
          { value: "not_aligned", label: "Not aligned — tech decisions are reactive" },
          { value: "some_alignment", label: "Some alignment — we try to tie tech to outcomes" },
          { value: "aligned", label: "Aligned — we make tech choices with strategy in mind" },
          { value: "fully_aligned", label: "Fully aligned — technology is a key growth enabler" },
        ]}
        value={getStringAnswer(answers["internal_alignment"])}
        onChange={(val) => onAnswer("internal_alignment", val)}
      />
    </div>
  );
}
