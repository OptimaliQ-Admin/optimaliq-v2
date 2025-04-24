"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isScore_2_5Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["standardization"] === "string" &&
    answers["standardization"].trim().length > 0 &&

    typeof answers["success_criteria"] === "string" &&
    answers["success_criteria"].trim().length > 0 &&

    typeof answers["consistency_enforcement"] === "string" &&
    answers["consistency_enforcement"].trim().length > 0
  );
}



type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {

  return (
    <div className="space-y-10">

      {/* Question 8: standardization */}
      <MultipleChoiceQuestion
        question="Do you have a standard template or format for documenting processes?"
        options={[
          { value: "No", label: "No — everyone documents differently" },
          { value: "Some do some don't", label: "Some use a common format, others don’t" },
          { value: "standard template", label: "We have a standard template" },
          { value: "Yes", label: "Yes — all teams follow the same structure" },
        ]}
        value={answers["standardization"] || ""}
        onChange={(val) => onAnswer("standardization", val)}
      />

      {/* Question 9: success_criteria */}
      <MultipleChoiceQuestion
        question="Do you include measurable outcomes or success criteria in your process definitions?"
        options={[
          { value: "Not at all", label: "Not at all" },
          { value: "Sometimes", label: "Sometimes" },
          { value: "Usually", label: "Usually" },
          { value: "Always", label: "Always" },
        ]}
        value={answers["success_criteria"] || ""}
        onChange={(val) => onAnswer("success_criteria", val)}
      />



      {/* Question 10: consistency_enforcement */}
      <MultipleChoiceQuestion
        question="How confident are you that processes are followed the same way regardless of who is doing the work?"
        options={[
          { value: "Not confident", label: "Not confident" },
          { value: "Somewhat confident", label: "Somewhat confident" },
          { value: "Mostly confident", label: "Mostly confident" },
          { value: "Fully confident", label: "Fully confident" },
        ]}
        value={answers["consistency_enforcement"] || ""}
        onChange={(val) => onAnswer("consistency_enforcement", val)}
      />

    </div>
  );
}
