//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group03_Operations.tsx
"use client";

import React from "react";
import EnhancedTechStackSelector from "@/components/questions/EnhancedTechStackSelector";
import EnhancedMultipleChoiceQuestion from "@/components/questions/EnhancedMultipleChoiceQuestion"; 
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import EnhancedTextAreaQuestion from "@/components/questions/EnhancedTextAreaQuestion";

export function isGroup03Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["tech_stack"]) && answers["tech_stack"].length > 0 &&
    Array.isArray(answers["business_priorities"]) && answers["business_priorities"].length > 0 &&
    typeof answers["process_discipline"] === "string" && answers["process_discipline"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group03_Operations({ answers, onAnswer }: Props) {
  const techSelected = answers["tech_stack"] || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Question 1: Tech Stack Overview */}
      <EnhancedTechStackSelector
        question="What platforms or tools are central to your operations?"
        description="Select the tools you actively use across different categories. This helps us understand your current tech ecosystem and identify integration opportunities."
        selected={Array.isArray(answers["tech_stack"]) ? answers["tech_stack"] : []}
        onChange={(val) => onAnswer("tech_stack", val)}
        maxSelect={15}
      />

      {/* Conditionally show "Other" field */}
      {Array.isArray(answers["tech_stack"]) && answers["tech_stack"].includes("other") && (
        <EnhancedTextAreaQuestion
          question="Please describe any other platforms or tools that are central to your operations"
          description="Tell us about any custom or industry-specific tools that aren't in our standard list."
          placeholder="Describe any additional platforms or tools used..."
          value={getStringAnswer(answers["tech_stack_other"])}
          onChange={(val) => onAnswer("tech_stack_other", val)}
          maxLength={200}
          rows={3}
        />
      )}

      {/* Question 2: Rank Business Priorities */}
      <DragSortQuestion
        question="Rank the following priorities from most to least important to your business right now."
        description="Drag to reorder. Top = most important. This helps us understand your current strategic focus and resource allocation."
        items={
          Array.isArray(answers["business_priorities"])
            ? answers["business_priorities"]
            : ["Growth", "Profitability", "Efficiency", "Innovation", "Brand Equity"]
        }
        onChange={(val) => onAnswer("business_priorities", val)}
      />

      {/* Question 3: Process Maturity */}
      <EnhancedMultipleChoiceQuestion
        question="Describe your internal process discipline."
        description="Select the statement that best reflects your company's current operational maturity level."
        options={[
          { 
            value: "1", 
            label: "Everything is ad hoc", 
            description: "No formal processes, decisions made on the fly" 
          },
          { 
            value: "2", 
            label: "Some structure, but mostly reactive", 
            description: "Basic processes exist but are inconsistently applied" 
          },
          { 
            value: "3", 
            label: "We have defined processes, but they're not consistently followed", 
            description: "Processes are documented but execution varies" 
          },
          { 
            value: "4", 
            label: "Most departments follow documented processes", 
            description: "Consistent process execution across most areas" 
          },
          { 
            value: "5", 
            label: "Processes are standardized, automated, and continuously optimized", 
            description: "Mature process discipline with continuous improvement" 
          },
        ]}
        value={getStringAnswer(answers["process_discipline"])}
        onChange={(val) => onAnswer("process_discipline", val)}
        variant="cards"
      />
    </div>
  );
}
