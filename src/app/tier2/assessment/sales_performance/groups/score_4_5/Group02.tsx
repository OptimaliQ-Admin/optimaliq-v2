"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["crm_usage"] === "string" &&
    answers["crm_usage"].trim().length > 0 &&
    typeof answers["team_effectiveness_tracking"] === "string" &&
    answers["team_effectiveness_tracking"].trim().length > 0 &&
    typeof answers["goal_adjustment_process"] === "string" &&
    answers["goal_adjustment_process"].trim().length > 0 &&
    typeof answers["data_role_exec"] === "string" &&
    answers["data_role_exec"].trim().length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: crm_usage */}
      <MultipleChoiceQuestion
        question="How does your CRM or sales system support daily execution?"
        options={[
          { value: "log_only", label: "It’s used for logging activity only" },
          { value: "task_tracking", label: "It helps track tasks and deal flow" },
          { value: "execution_tool", label: "It’s a key tool for execution and prioritization" },
          { value: "ai_enabled", label: "AI suggestions and guided selling built-in" },
        ]}
        value={answers["crm_usage"] || ""}
        onChange={(val) => onAnswer("crm_usage", val)}
      />

      {/* Question 5: team_effectiveness_tracking */}
      <MultipleChoiceQuestion
        question="How do you track and improve team-wide sales effectiveness?"
        options={[
          { value: "no_tracking", label: "We don’t track it systematically" },
          { value: "basic_metrics", label: "Basic metrics like revenue per rep" },
          { value: "coaching_programs", label: "Coaching programs + enablement KPIs" },
          { value: "continuous_insight", label: "Continuous insight loop with coaching and data" },
        ]}
        value={answers["team_effectiveness_tracking"] || ""}
        onChange={(val) => onAnswer("team_effectiveness_tracking", val)}
      />

      {/* Question 6: goal_adjustment_process */}
      <MultipleChoiceQuestion
        question="What’s your process for adjusting goals or territories during the year?"
        options={[
          { value: "rarely_adjust", label: "We rarely change them mid-cycle" },
          { value: "reactive_adjustments", label: "We adjust only when major changes happen" },
          { value: "based_on_signals", label: "We adjust based on pipeline signals and growth" },
          { value: "flexible_planning", label: "We model + forecast dynamic capacity and adjust" },
        ]}
        value={answers["goal_adjustment_process"] || ""}
        onChange={(val) => onAnswer("goal_adjustment_process", val)}
      />

      {/* Question 7: data_role_exec */}
      <MultipleChoiceQuestion
        question="What role does sales data play in your executive decision-making?"
        options={[
          { value: "minimal", label: "Minimal — only top-line revenue" },
          { value: "basic_summary", label: "Basic summaries or trend slides" },
          { value: "exec_reporting", label: "Exec dashboards and monthly planning input" },
          { value: "real_time_decision", label: "Real-time inputs to decisions and resource allocation" },
        ]}
        value={answers["data_role_exec"] || ""}
        onChange={(val) => onAnswer("data_role_exec", val)}
      />
    </div>
  );
}
