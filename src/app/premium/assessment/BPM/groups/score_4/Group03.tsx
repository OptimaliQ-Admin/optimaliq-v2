"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isScore_4Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["knowledge_sharing"]) &&
    answers["knowledge_sharing"].length > 0 &&

    typeof answers["strategic_alignment"] === "string" &&
    answers["strategic_alignment"].trim().length > 0 &&

    typeof answers["goal_focus"] === "string" &&
    answers["goal_focus"].trim().length > 0 &&

    typeof answers["process_gap"] === "string" &&
    answers["process_gap"].trim().length > 0
  );
}



type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  const knowledge_sharing = answers["knowledge_sharing"] || [];

  return (
    <div className="space-y-10">

      {/* Question 7: knowledge_sharing */}
      <MultiSelectQuestion
        question="How is knowledge about processes shared and maintained across your organization?"
        options={[
          { value: "Word of mouth or informal sharing", label: "Word of mouth or informal sharing" },
          { value: "Internal wikis or SOP libraries", label: "Internal wikis or SOP libraries" },
          { value: "CRM or ERP software", label: "CRM or ERP software" },
          { value: "Structured onboarding and documentation", label: "Structured onboarding and documentation" },
          { value: "Embedded in daily systems and training", label: "Embedded in daily systems and training" },
        ]}
        selected={Array.isArray(getArrayAnswer(knowledge_sharing)) ? getArrayAnswer(knowledge_sharing) : []}
              onChange={(val) => onAnswer("knowledge_sharing", val)}
              maxSelect={5}
            />


      {/* Question 8: strategic_alignment */}
      <MultipleChoiceQuestion
        question="How confident are you in your current process stack supporting your company’s long-term strategic goals?"
        options={[
          { value: "Not confident", label: "Not confident" },
          { value: "Somewhat aligned", label: "Somewhat aligned" },
          { value: "Mostly aligned", label: "Mostly aligned" },
          { value: "Fully aligned and designed with strategy in mind", label: "Fully aligned and designed with strategy in mind" },
        ]}
        value={getStringAnswer(answers["strategic_alignment"])}
        onChange={(val) => onAnswer("strategic_alignment", val)}
      />

      {/* Question 9: goal_focus */}
      <MultipleChoiceQuestion
        question="What is the primary goal of your process improvement efforts today?"
        options={[
          { value: "Reduce costs", label: "Reduce costs" },
          { value: "Increase speed or throughput", label: "Increase speed or throughput" },
          { value: "Improve experience", label: "Improve experience (customer or team)" },
          { value: "Enable scale or innovation", label: "Enable scale or innovation" },
        ]}
        value={getStringAnswer(answers["goal_focus"])}
        onChange={(val) => onAnswer("goal_focus", val)}
      />



      {/* Question 10: process_gap */}
      <TextAreaQuestion
        question="What’s one area where your process still feels “manual” or outdated — even at your current maturity?"
        placeholder="E.g.,"
        value={getStringAnswer(answers["process_gap"])}
        onChange={(val) => onAnswer("process_gap", val)}
        maxLength={300}
      />


    </div>
  );
}
