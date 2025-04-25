"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; import {
  getStringAnswer,
  getArrayAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
export function isScore_5Group2Complete(answers: AssessmentAnswers): boolean {
  return (
    typeof answers["cross_functional_alignment"] === "string" &&
    typeof answers["strategic_vision_cascading"] === "string" &&
    typeof answers["data_driven_decisions"] === "string" &&
    typeof answers["employee_retention_focus"] === "string"
  );
}

type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Score5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">
      
      {/* Question 4: cross_functional_alignment */}
      <MultipleChoiceQuestion
        question="How aligned are your leadership teams across departments?"
        options={[
          { value: "rarely_aligned", label: "Rarely — each team works in a silo" },
          { value: "periodically_aligned", label: "We align periodically for planning" },
          { value: "regular_meetings", label: "We have regular cross-functional meetings" },
          { value: "fully_integrated", label: "Teams are fully integrated with shared goals and KPIs" },
        ]}
        value={getStringAnswer(answers["cross_functional_alignment"])}
        onChange={(val) => onAnswer("cross_functional_alignment", val)}
      />

      {/* Question 5: strategic_vision_cascading */}
      <MultipleChoiceQuestion
        question="How does strategic vision cascade from the leadership team?"
        options={[
          { value: "not_shared", label: "It’s not clearly shared" },
          { value: "announced_once", label: "Shared during planning cycles or town halls" },
          { value: "shared_and_measured", label: "Shared and measured across levels" },
          { value: "embedded_in_teams", label: "Cascaded effectively and embedded into team goals" },
        ]}
        value={getStringAnswer(answers["strategic_vision_cascading"])}
        onChange={(val) => onAnswer("strategic_vision_cascading", val)}
      />

      {/* Question 6: data_driven_decisions */}
      <MultipleChoiceQuestion
        question="To what extent do leaders use data to drive decisions?"
        options={[
          { value: "limited_use", label: "Minimal — mostly intuition-based decisions" },
          { value: "some_data", label: "Some decisions use available reports" },
          { value: "frequent_data_use", label: "Frequent use of dashboards and KPIs" },
          { value: "real_time_insights", label: "Leaders use real-time insights to adjust strategy" },
        ]}
        value={getStringAnswer(answers["data_driven_decisions"])}
        onChange={(val) => onAnswer("data_driven_decisions", val)}
      />

      {/* Question 7: employee_retention_focus */}
      <MultipleChoiceQuestion
        question="What role does leadership play in employee retention?"
        options={[
          { value: "not_prioritized", label: "Not a focus area" },
          { value: "exit_interview_focus", label: "Discussed only during exit interviews" },
          { value: "recognized_as_issue", label: "Recognized and occasionally discussed" },
          { value: "proactively_owned", label: "Owned by leadership with proactive initiatives" },
        ]}
        value={getStringAnswer(answers["employee_retention_focus"])}
        onChange={(val) => onAnswer("employee_retention_focus", val)}
      />
    </div>
  );
}
