"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";


export function isScore_5Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["bpm_strategy_alignment"] === "string" &&
    answers["bpm_strategy_alignment"].trim().length > 0 &&

    Array.isArray(answers["bpm_scope"]) &&
    answers["bpm_scope"].length > 0 &&

    typeof answers["self_optimizing_processes"] === "string" &&
    answers["self_optimizing_processes"].trim().length > 0
  );
}




type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  const bpm_scope = answers["bpm_scope"] || [];

  return (
  <div className="p-6 max-w-2xl mx-auto">

      {/* Question 1: bpm_strategy_alignment */}
      <TextAreaQuestion
              question="How does BPM influence your company’s competitive positioning or go-to-market strategy?"
              placeholder="E.g.,"
              value={getStringAnswer(answers["bpm_strategy_alignment"])}
              onChange={(val) => onAnswer("bpm_strategy_alignment", val)}
              maxLength={300}
            />




     {/* Question 2: bpm_scope */}
<MultiSelectQuestion
        question="Which of the following are directly tied to your BPM practice today?"
        options={[
          { value: "Customer journey design", label: "Customer journey design" },
          { value: "Product innovation", label: "Product innovation" },
          { value: "ESG or sustainability initiatives", label: "ESG or sustainability initiatives" },
          { value: "AI strategy", label: "AI strategy" },
          { value: "M&A integration", label: "M&A integration" },
          { value: "None", label: "None of these" },
        ]}
        selected={bpm_scope}
              onChange={(val) => onAnswer("bpm_scope", val)}
              maxSelect={5}
            />


      {/* Question 3: self_optimizing_processes */}
      <MultipleChoiceQuestion
  question="Do your processes self-optimize based on real-time performance or customer signals?"
  options={[
    { value: "No — they require manual updates", label: "No — they require manual updates" },
    { value: "Some minor adaptive capabilities", label: "Some minor adaptive capabilities" },
    { value: "Yes — partially self-tuning", label: "Yes — partially self-tuning" },
    { value: "Yes — dynamic and responsive at scale", label: "Yes — dynamic and responsive at scale" },
  ]}
  value={getStringAnswer(answers["self_optimizing_processes"])}
  onChange={(val) => onAnswer("self_optimizing_processes", val)}
/>
    </div>
  );
}
