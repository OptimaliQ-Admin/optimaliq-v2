"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group3Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["platform_auditing"] === "string" &&
    typeof answers["roadmap_alignment"] === "string" &&
    typeof answers["evolution_speed"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step03({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-10">

      {/* Question 7 */}
      <MultipleChoiceQuestion
        question="How do you monitor the health and performance of your digital systems?"
        options={[
          { value: "manual_reviews", label: "Manual reviews or anecdotal reports" },
          { value: "some_monitoring", label: "Some systems have dashboards or alerts" },
          { value: "central_reporting", label: "We have centralized reporting and health checks" },
          { value: "real_time_analytics", label: "We use real-time analytics and system-wide observability tools" }
        ]}
        value={answers["platform_auditing"] || ""}
        onChange={(val) => onAnswer("platform_auditing", val)}
      />

      {/* Question 8 */}
      <MultipleChoiceQuestion
        question="How aligned is your tech roadmap with your broader business strategy?"
        options={[
          { value: "not_aligned", label: "We don’t really have a roadmap" },
          { value: "loosely_aligned", label: "Tech projects are approved based on immediate needs" },
          { value: "some_alignment", label: "There’s some coordination between tech and business" },
          { value: "fully_integrated", label: "The roadmap is fully integrated with strategic goals and timelines" }
        ]}
        value={answers["roadmap_alignment"] || ""}
        onChange={(val) => onAnswer("roadmap_alignment", val)}
      />

      {/* Question 9 */}
      <MultipleChoiceQuestion
        question="How quickly can you adapt your systems or processes to support a new business model or opportunity?"
        options={[
          { value: "slow", label: "It would require major rework" },
          { value: "weeks", label: "It would take weeks of planning and execution" },
          { value: "flexible", label: "We can adapt with moderate planning" },
          { value: "agile_flexible", label: "We’re agile and can pivot within days if needed" }
        ]}
        value={answers["evolution_speed"] || ""}
        onChange={(val) => onAnswer("evolution_speed", val)}
      />

    </div>
  );
}
