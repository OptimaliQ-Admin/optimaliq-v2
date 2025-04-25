"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2Group1Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["how_64a8d1"] === "string" &&
    answers["how_64a8d1"].trim().length > 0 &&
    typeof answers["how_7d8dcb"] === "string" &&
    answers["how_7d8dcb"].trim().length > 0 &&
    typeof answers["how_0fa447"] === "string" &&
    answers["how_0fa447"].trim().length > 0
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_Step01({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 1: how_64a8d1 */}
      <MultipleChoiceQuestion
        question="How clearly are your sales stages defined (e.g. discovery, demo, proposal, negotiation)?"
        options={[
          { value: "Not defined", label: "Not defined" },
          { value: "Some stages are loosely defined", label: "Some stages are loosely defined" },
          { value: "Defined, but not consistently used", label: "Defined, but not consistently used" },
          { value: "Clearly documented and used for tracking", label: "Clearly documented and used for tracking" },
        ]}
        value={getStringAnswer(answers["how_64a8d1"])}
        onChange={(val) => onAnswer("how_64a8d1", val)}
      />

      {/* Question 2: how_7d8dcb */}
      <MultipleChoiceQuestion
        question="How confident are you in the accuracy of your current pipeline data?"
        options={[
          { value: "Not accurate at all", label: "Not accurate at all" },
          { value: "Somewhat accurate", label: "Somewhat accurate" },
          { value: "Mostly accurate, with occasional cleanups", label: "Mostly accurate, with occasional cleanups" },
          { value: "Very accurate and regularly maintained", label: "Very accurate and regularly maintained" },
        ]}
        value={getStringAnswer(answers["how_7d8dcb"])}
        onChange={(val) => onAnswer("how_7d8dcb", val)}
      />

      {/* Question 3: how_0fa447 */}
      <MultipleChoiceQuestion
        question="How do you prioritize leads or accounts in your pipeline?"
        options={[
          { value: "We work whatever is most recent", label: "We work whatever is most recent" },
          { value: "We prioritize based on gut feel", label: "We prioritize based on gut feel" },
          { value: "We prioritize based on deal size or engagement", label: "We prioritize based on deal size or engagement" },
          { value: "We use scoring or qualification criteria", label: "We use scoring or qualification criteria" },
        ]}
        value={getStringAnswer(answers["how_0fa447"])}
        onChange={(val) => onAnswer("how_0fa447", val)}
      />
    </div>
  );
}
