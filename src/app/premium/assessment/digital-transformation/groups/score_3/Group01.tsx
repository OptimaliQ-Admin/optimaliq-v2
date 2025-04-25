"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_3Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["integration_depth"] === "string" &&
    typeof answers["governance_process"] === "string" &&
    typeof answers["system_usability"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score3_0_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: integration_depth */}
      <MultipleChoiceQuestion
        question="How deeply are your systems integrated (e.g. CRM, ERP, CMS)?"
        options={[
          { value: "standalone_tools", label: "Mostly standalone tools — we export/import manually" },
          { value: "limited_integration", label: "Limited integration — a few key data flows exist" },
          { value: "connected_workflows", label: "Connected workflows across multiple systems" },
          { value: "fully_integrated", label: "Fully integrated — data flows seamlessly across tools" },
        ]}
        value={getStringAnswer(answers["integration_depth"])}
        onChange={(val) => onAnswer("integration_depth", val)}
      />

      {/* Question 2: governance_process */}
      <MultipleChoiceQuestion
        question="Do you have a formal governance process for technology or digital decisions?"
        options={[
          { value: "no_process", label: "No — decisions are made ad hoc" },
          { value: "informal_alignment", label: "Some informal alignment among teams" },
          { value: "defined_roles", label: "Yes — roles and decision-making are defined" },
          { value: "cross_functional_review", label: "Yes — includes cross-functional review and accountability" },
        ]}
        value={getStringAnswer(answers["governance_process"])}
        onChange={(val) => onAnswer("governance_process", val)}
      />

      {/* Question 3: system_usability */}
      <MultipleChoiceQuestion
        question="How would you rate the usability of your current systems and tools?"
        options={[
          { value: "frustrating", label: "Frustrating — people avoid them when possible" },
          { value: "acceptable", label: "Acceptable — people make it work" },
          { value: "user_friendly", label: "User-friendly — most find them easy to use" },
          { value: "delightful", label: "Delightful — systems are intuitive and boost productivity" },
        ]}
        value={getStringAnswer(answers["system_usability"])}
        onChange={(val) => onAnswer("system_usability", val)}
      />
    </div>
  );
}
