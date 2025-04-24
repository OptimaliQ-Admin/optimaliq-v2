"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_4Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["how_671b3b"] === "string" &&
    typeof answers["how_27f529"] === "string" &&
    typeof answers["how_0f6cf0"] === "string" &&
    typeof answers["what’s_b04f69"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score4_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      {/* Question 4: how_671b3b */}
      <MultipleChoiceQuestion
        question="How do you identify when a territory, segment, or rep is over/under-performing?"
        options={[
          { value: "wait_until_obvious", label: "We wait until it’s obvious" },
          { value: "manual_review", label: "Managers manually review reports" },
          { value: "dashboards_and_kpis", label: "We use dashboards and KPIs" },
          { value: "auto_detection", label: "Our systems surface performance deviations automatically" },
        ]}
        value={answers["how_671b3b"] || ""}
        onChange={(val) => onAnswer("how_671b3b", val)}
      />

      {/* Question 5: how_27f529 */}
      <MultipleChoiceQuestion
        question="How aligned are your sales, marketing, and customer success KPIs?"
        options={[
          { value: "uncoordinated", label: "Totally separate and uncoordinated" },
          { value: "reviewed_occasionally", label: "Reviewed occasionally" },
          { value: "partially_aligned", label: "Partially aligned for handoff or funnel goals" },
          { value: "fully_aligned", label: "Fully aligned and measured across the customer lifecycle" },
        ]}
        value={answers["how_27f529"] || ""}
        onChange={(val) => onAnswer("how_27f529", val)}
      />

      {/* Question 6: how_0f6cf0 */}
      <MultipleChoiceQuestion
        question="How are you using sales data to influence future GTM decisions (e.g. pricing, packaging, ICP)?"
        options={[
          { value: "not_strategic", label: "We aren’t using it strategically" },
          { value: "feedback_in_meetings", label: "Sales shares feedback in meetings" },
          { value: "quarterly_review", label: "GTM teams review data together quarterly" },
          { value: "core_driver", label: "Sales data is a core driver of GTM evolution" },
        ]}
        value={answers["how_0f6cf0"] || ""}
        onChange={(val) => onAnswer("how_0f6cf0", val)}
      />

      {/* Question 7: what’s_b04f69 */}
      <MultipleChoiceQuestion
        question="What’s your approach to running sales planning for new quarters or years?"
        options={[
          { value: "set_goals_and_hope", label: "We set goals and hope for the best" },
          { value: "top_down", label: "Leadership sets targets and pushes them down" },
          { value: "bottom_up", label: "Reps contribute to bottom-up planning" },
          { value: "full_cycle", label: "We run a full-cycle planning process across roles and data" },
        ]}
        value={answers["what’s_b04f69"] || ""}
        onChange={(val) => onAnswer("what’s_b04f69", val)}
      />
    </div>
  );
}
