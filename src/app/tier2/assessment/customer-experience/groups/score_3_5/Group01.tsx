"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";

export function isScore_3_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["monitoring_progress"] === "string" &&
    Array.isArray(answers["employee_interaction"]) &&
    answers["employee_interaction"].length > 0 &&
    typeof answers["tool_support"] === "string" &&
    answers["tool_support"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_5_Step01({ answers, onAnswer }: Props) {
  const employeeOptions = answers["employee_interaction"] || [];

  return (
    <div className="space-y-10">

      {/* Question 1 */}
      <MultipleChoiceQuestion
        question="How do you monitor progress across your digital initiatives?"
        options={[
          { value: "check_in", label: "We check in during reviews or launches" },
          { value: "track_objectives", label: "We track objectives but not consistently" },
          { value: "kpis_reported", label: "KPIs are regularly reported and reviewed" },
          { value: "real_time_dashboard", label: "Real-time dashboards aligned to strategic goals" }
        ]}
        value={answers["monitoring_progress"] || ""}
        onChange={(val) => onAnswer("monitoring_progress", val)}
      />

      {/* Question 2 */}
      <MultiSelectQuestion
        question="Which of the following describe how employees interact with digital tools?"
        options={[
          { value: "task_specific", label: "They use task-specific apps and tools" },
          { value: "tool_fatigue", label: "They’re overwhelmed or experience tool fatigue" },
          { value: "workflow_embedded", label: "Digital tools are embedded into workflows" },
          { value: "collaboration_stack", label: "We’ve standardized a digital collaboration stack" }
        ]}
        selected={employeeOptions}
        onChange={(val) => onAnswer("employee_interaction", val)}
        maxSelect={4}
      />

      {/* Question 3 */}
      <MultipleChoiceQuestion
        question="How are digital tools supporting your company's agility and responsiveness?"
        options={[
          { value: "reactive", label: "We’re still fairly reactive" },
          { value: "some_adaptability", label: "We can adapt in some areas, but not consistently" },
          { value: "most_adaptable", label: "Most teams can pivot with minimal disruption" },
          { value: "fully_adaptable", label: "We’re highly responsive with digital-first workflows" }
        ]}
        value={answers["tool_support"] || ""}
        onChange={(val) => onAnswer("tool_support", val)}
      />

    </div>
  );
}
