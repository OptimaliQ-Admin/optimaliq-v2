"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_2_5Group3Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["clarity_of_mission"] === "string" &&
    typeof answers["decision_making_involvement"] === "string" &&
    typeof answers["recognition_practices"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score2_5_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      {/* Question 8: clarity_of_mission */}
      <MultipleChoiceQuestion
        question="How clearly is your company's mission and vision understood by employees?"
        options={[
          { value: "not_clear", label: "Not clear — most aren’t familiar with it" },
          { value: "somewhat_clear", label: "Somewhat clear — it’s mentioned occasionally" },
          { value: "generally_clear", label: "Generally clear — it’s discussed at meetings" },
          { value: "very_clear", label: "Very clear — it's embedded in daily operations" },
        ]}
        value={getStringAnswer(answers["clarity_of_mission"])}
        onChange={(val) => onAnswer("clarity_of_mission", val)}
      />

      {/* Question 9: decision_making_involvement */}
      <MultipleChoiceQuestion
        question="How are employees involved in decision-making?"
        options={[
          { value: "not_involved", label: "Not really involved in most decisions" },
          { value: "consulted", label: "Sometimes consulted for input" },
          { value: "informed", label: "Often informed and encouraged to speak up" },
          { value: "collaborative", label: "Collaborative — teams contribute to decisions" },
        ]}
        value={getStringAnswer(answers["decision_making_involvement"])}
        onChange={(val) => onAnswer("decision_making_involvement", val)}
      />

      {/* Question 10: recognition_practices */}
      <MultipleChoiceQuestion
        question="How are individual or team achievements recognized?"
        options={[
          { value: "not_formalized", label: "There’s no formal recognition process" },
          { value: "ad_hoc", label: "Recognition happens occasionally or informally" },
          { value: "some_structure", label: "Some structure like awards or bonuses" },
          { value: "systematic", label: "Systematic — part of our management practices" },
        ]}
        value={getStringAnswer(answers["recognition_practices"])}
        onChange={(val) => onAnswer("recognition_practices", val)}
      />
    </div>
  );
}
