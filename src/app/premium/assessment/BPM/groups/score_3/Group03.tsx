//src/app/tier2/assessment/BPM/groups/score_3/Group03.tsx
"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isScore_3Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["adaptability"] === "string" &&
    answers["adaptability"].trim().length > 0 &&

    typeof answers["process_visibility"] === "string" &&
    answers["process_visibility"].trim().length > 0 &&

    typeof answers["optimization_opportunity"] === "string" &&
    answers["optimization_opportunity"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step03({ answers, onAnswer }: Props) {

  return (
    <div className="space-y-10">

    
      {/* Question 8: adaptability */}
      <MultipleChoiceQuestion
        question="Do your processes adapt when your business model, customer expectations, or tech stack changes?"
        options={[
          { value: "No", label: "No — they often fall behind" },
          { value: "Slowly", label: "Slowly and reactively" },
          { value: "within a few months", label: "Usually within a few months" },
          { value: "Yes", label: "Yes — we’re proactive and flexible" },
        ]}
        value={answers["adaptability"] || ""}
        onChange={(val) => onAnswer("adaptability", val)}
      />

      {/* Question 9: process_visibility */}
      <MultipleChoiceQuestion
        question="How would you describe your overall visibility into how well your processes are functioning?"
        options={[
          { value: "Very limited", label: "Very limited — we rely on gut feel" },
          { value: "Some visibility", label: "Some visibility in certain areas" },
          { value: "track performance in most areas", label: "We track performance in most areas" },
          { value: "full visibility with clear KPIs", label: "We have full visibility with clear KPIs" },
        ]}
        value={answers["process_visibility"] || ""}
        onChange={(val) => onAnswer("process_visibility", val)}
      />



      {/* Question 10: optimization_opportunity */}
      <TextAreaQuestion
        question="What’s one process that could benefit most from a formal review or redesign this quarter?"
        placeholder="E.g.,"
        value={answers["optimization_opportunity"] || ""}
        onChange={(val) => onAnswer("optimization_opportunity", val)}
        maxLength={300}
      />

    </div>
  );
}
