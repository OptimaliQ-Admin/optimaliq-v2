"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["data_utilization"] === "string" &&
    typeof answers["project_prioritization"] === "string" &&
    typeof answers["tool_evaluation"] === "string" &&
    typeof answers["tech_training"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: data_utilization */}
      <MultipleChoiceQuestion
        question="How do you use data to support digital initiatives?"
        options={[
          { value: "we_dont_use_data", label: "We don’t really use data" },
          { value: "basic_reporting", label: "Basic reporting or gut-based decisions" },
          { value: "insights_for_optimization", label: "We use insights to adjust or improve" },
          { value: "real_time_analytics", label: "We use real-time data to drive changes" },
        ]}
        value={getStringAnswer(answers["data_utilization"])}
        onChange={(val) => onAnswer("data_utilization", val)}
      />

      {/* Question 5: project_prioritization */}
      <MultipleChoiceQuestion
        question="How do you decide which digital projects or improvements to pursue?"
        options={[
          { value: "reactionary", label: "It’s reactive — we fix what breaks" },
          { value: "internal_requests", label: "Based on internal requests or intuition" },
          { value: "value_alignment", label: "Based on value alignment or potential impact" },
          { value: "formal_frameworks", label: "We use a scoring or prioritization framework" },
        ]}
        value={getStringAnswer(answers["project_prioritization"])}
        onChange={(val) => onAnswer("project_prioritization", val)}
      />

      {/* Question 6: tool_evaluation */}
      <MultipleChoiceQuestion
        question="How often do you evaluate whether your tools still meet your needs?"
        options={[
          { value: "rarely", label: "Rarely — we keep using what we have" },
          { value: "when_needed", label: "Only when something major breaks or changes" },
          { value: "annual_review", label: "We review tools at least annually" },
          { value: "continuous_improvement", label: "We continuously evaluate and optimize our stack" },
        ]}
        value={getStringAnswer(answers["tool_evaluation"])}
        onChange={(val) => onAnswer("tool_evaluation", val)}
      />

      {/* Question 7: tech_training */}
      <MultipleChoiceQuestion
        question="What training or enablement do you offer for new tools or systems?"
        options={[
          { value: "none", label: "None — people are expected to figure it out" },
          { value: "basic_training", label: "We provide basic onboarding or demos" },
          { value: "guided_learning", label: "We offer guided training and documentation" },
          { value: "continuous_learning", label: "We provide continuous enablement and certifications" },
        ]}
        value={getStringAnswer(answers["tech_training"])}
        onChange={(val) => onAnswer("tech_training", val)}
      />
    </div>
  );
}
