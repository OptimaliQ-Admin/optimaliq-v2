"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export function isScore_3Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cloud_operations"] === "string" &&
    typeof answers["observability"] === "string" &&
    typeof answers["cloud_security"] === "string"
  );
}

export default function Score3_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      <MultipleChoiceQuestion
        question="How do you manage cloud operations?"
        options={[
          { value: "manual", label: "Manual — traditional operations" },
          { value: "automated", label: "Automated — basic automation" },
          { value: "cloud_ops", label: "Cloud Ops — cloud-native tools" },
          { value: "gitops", label: "GitOps — infrastructure as code" },
        ]}
        value={getStringAnswer(answers["cloud_operations"])}
        onChange={(val) => onAnswer("cloud_operations", val)}
      />

      <MultipleChoiceQuestion
        question="How comprehensive is your observability?"
        options={[
          { value: "basic", label: "Basic — essential monitoring" },
          { value: "standard", label: "Standard — comprehensive monitoring" },
          { value: "advanced", label: "Advanced — full observability" },
          { value: "predictive", label: "Predictive — AI-driven insights" },
        ]}
        value={getStringAnswer(answers["observability"])}
        onChange={(val) => onAnswer("observability", val)}
      />

      <MultipleChoiceQuestion
        question="How do you approach cloud security?"
        options={[
          { value: "traditional", label: "Traditional — perimeter security" },
          { value: "cloud_aware", label: "Cloud-aware — basic cloud security" },
          { value: "cloud_native", label: "Cloud-native — integrated security" },
          { value: "zero_trust", label: "Zero Trust — advanced security" },
        ]}
        value={getStringAnswer(answers["cloud_security"])}
        onChange={(val) => onAnswer("cloud_security", val)}
      />
    </div>
  );
} 