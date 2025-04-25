"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cx_roiexpectations"] === "string" &&
    typeof answers["cx_ethics_privacy"] === "string" &&
    typeof answers["cx_leadership_alignment"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 8: cx_roiexpectations */}
      <MultipleChoiceQuestion
        question="How clearly is the ROI of CX initiatives defined and measured?"
        options={[
          { value: "not_defined", label: "Not defined — CX is considered a soft investment" },
          { value: "loosely_estimated", label: "We loosely estimate impact from anecdotal outcomes" },
          { value: "measured_against_goals", label: "We measure impact against customer and business goals" },
          { value: "modeled_and_tracked", label: "ROI is modeled and tracked across key CX metrics" },
        ]}
        value={getStringAnswer(answers["cx_roiexpectations"])}
        onChange={(val) => onAnswer("cx_roiexpectations", val)}
      />

      {/* Question 9: cx_ethics_privacy */}
      <MultipleChoiceQuestion
        question="How do you incorporate ethics, accessibility, or privacy into your CX strategy?"
        options={[
          { value: "not_considered", label: "Not actively considered" },
          { value: "basic_compliance", label: "We ensure basic compliance (e.g., GDPR, ADA)" },
          { value: "included_in_design", label: "It’s part of design and content guidelines" },
          { value: "core_principle", label: "It’s a core principle in our CX design and messaging" },
        ]}
        value={getStringAnswer(answers["cx_ethics_privacy"])}
        onChange={(val) => onAnswer("cx_ethics_privacy", val)}
      />

      {/* Question 10: cx_leadership_alignment */}
      <MultipleChoiceQuestion
        question="How aligned is your leadership team on the value of customer experience?"
        options={[
          { value: "misaligned", label: "Not aligned — viewed as a cost center" },
          { value: "some_alignment", label: "Some alignment, but not consistent across functions" },
          { value: "broad_alignment", label: "Broad alignment with CX viewed as a growth lever" },
          { value: "full_alignment", label: "Full alignment — CX is part of strategic planning" },
        ]}
        value={getStringAnswer(answers["cx_leadership_alignment"])}
        onChange={(val) => onAnswer("cx_leadership_alignment", val)}
      />
    </div>
  );
}
