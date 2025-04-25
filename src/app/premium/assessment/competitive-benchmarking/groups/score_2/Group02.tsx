"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["benchmark_frequency"] === "string" &&
    typeof answers["stakeholder_visibility"] === "string" &&
    typeof answers["competitive_reaction"] === "string" &&
    typeof answers["differentiation_strategy"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: benchmark_frequency */}
      <MultipleChoiceQuestion
        question="How often do you review or update your competitive benchmarks?"
        options={[
          { value: "never", label: "Never" },
          { value: "annually", label: "Once a year" },
          { value: "quarterly", label: "Quarterly" },
          { value: "continuous", label: "Continuously or as needed" },
        ]}
        value={getStringAnswer(answers["benchmark_frequency"])}
        onChange={(val) => onAnswer("benchmark_frequency", val)}
      />

      {/* Question 5: stakeholder_visibility */}
      <MultipleChoiceQuestion
        question="Who in your organization has visibility into your competitive insights?"
        options={[
          { value: "no_one", label: "No one — it’s not shared" },
          { value: "a_few", label: "A few people or leaders" },
          { value: "some_teams", label: "Some teams reference it occasionally" },
          { value: "widely_shared", label: "It’s widely shared and referenced regularly" },
        ]}
        value={getStringAnswer(answers["stakeholder_visibility"])}
        onChange={(val) => onAnswer("stakeholder_visibility", val)}
      />

      {/* Question 6: competitive_reaction */}
      <MultipleChoiceQuestion
        question="How do you typically respond when a competitor changes their strategy?"
        options={[
          { value: "no_reaction", label: "We don’t react or monitor closely" },
          { value: "observe_only", label: "We take note but don’t act" },
          { value: "adjust_positioning", label: "We adjust our messaging or campaigns" },
          { value: "strategic_response", label: "We adapt strategically with cross-functional input" },
        ]}
        value={getStringAnswer(answers["competitive_reaction"])}
        onChange={(val) => onAnswer("competitive_reaction", val)}
      />

      {/* Question 7: differentiation_strategy */}
      <MultipleChoiceQuestion
        question="Do you have a clearly defined differentiation strategy vs. competitors?"
        options={[
          { value: "none", label: "No, we don’t have one" },
          { value: "vague", label: "We mention it, but it’s vague" },
          { value: "defined_but_static", label: "Yes — but it’s not consistently applied" },
          { value: "strategic_and_tracked", label: "Yes — it’s strategic, defined, and tracked" },
        ]}
        value={getStringAnswer(answers["differentiation_strategy"])}
        onChange={(val) => onAnswer("differentiation_strategy", val)}
      />
    </div>
  );
}
