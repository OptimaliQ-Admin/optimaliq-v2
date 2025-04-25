"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; 
import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_1Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["task_automation"] === "string" &&
    typeof answers["ai_data_sources"] === "string" &&
    typeof answers["internal_ai_experience"] === "string" &&
    typeof answers["ai_initiative_owner"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score1_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 4: task_automation */}
      <MultipleChoiceQuestion
        question="Are there any manual tasks in your business that you think could be automated?"
        options={[
          { value: "Not sure", label: "Not sure" },
          { value: "A few, but we manage", label: "A few, but we manage" },
          { value: "Yes — we’ve started identifying them", label: "Yes — we’ve started identifying them" },
          { value: "Yes — we have a clear automation plan", label: "Yes — we have a clear automation plan" },
        ]}
        value={getStringAnswer(answers["task_automation"])}
        onChange={(val) => onAnswer("task_automation", val)}
      />

      {/* Question 5: ai_data_sources */}
      <MultipleChoiceQuestion
        question="Do you know what data sources you could use for AI or automation?"
        options={[
          { value: "No idea", label: "No idea" },
          { value: "Some rough ideas", label: "Some rough ideas" },
          { value: "Yes — we’ve identified some sources", label: "Yes — we’ve identified some sources" },
          { value: "Yes — our data is already organized and accessible", label: "Yes — our data is already organized and accessible" },
        ]}
        value={getStringAnswer(answers["ai_data_sources"])}
        onChange={(val) => onAnswer("ai_data_sources", val)}
      />

      {/* Question 6: internal_ai_experience */}
      <MultipleChoiceQuestion
        question="Does anyone on your team have experience with AI, automation, or data analysis?"
        options={[
          { value: "None at all", label: "None at all" },
          { value: "Not sure", label: "Not sure" },
          { value: "Some experience", label: "Some experience" },
          { value: "Yes — we have in-house expertise", label: "Yes — we have in-house expertise" },
        ]}
        value={getStringAnswer(answers["internal_ai_experience"])}
        onChange={(val) => onAnswer("internal_ai_experience", val)}
      />

      {/* Question 7: ai_initiative_owner */}
      <MultipleChoiceQuestion
        question="Who is responsible for exploring or implementing AI in your business?"
        options={[
          { value: "No one", label: "No one" },
          { value: "Leadership is thinking about it", label: "Leadership is thinking about it" },
          { value: "We’ve assigned someone to research it", label: "We’ve assigned someone to research it" },
          { value: "We have a dedicated owner or team", label: "We have a dedicated owner or team" },
        ]}
        value={getStringAnswer(answers["ai_initiative_owner"])}
        onChange={(val) => onAnswer("ai_initiative_owner", val)}
      />
    </div>
  );
}
