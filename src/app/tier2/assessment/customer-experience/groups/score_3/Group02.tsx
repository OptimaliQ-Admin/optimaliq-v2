"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_3Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["cx_owner"] === "string" &&
    typeof answers["customer_journey_tracking"] === "string" &&
    typeof answers["cx_metrics_review"] === "string" &&
    typeof answers["employee_enablement"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score3_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">

      <MultipleChoiceQuestion
        question="Who owns the customer experience strategy in your company?"
        options={[
          { value: "no_one", label: "No one — it's not clearly owned" },
          { value: "shared", label: "It's shared across teams" },
          { value: "cx_lead", label: "A CX lead or department" },
          { value: "executive", label: "Executive sponsorship with team support" },
        ]}
        value={answers["cx_owner"] || ""}
        onChange={(val) => onAnswer("cx_owner", val)}
      />

      <MultipleChoiceQuestion
        question="How do you track the customer journey across touchpoints?"
        options={[
          { value: "not_tracked", label: "We don’t track it" },
          { value: "basic_mapping", label: "We have basic journey maps" },
          { value: "platform_enabled", label: "We use a platform to track and measure journeys" },
          { value: "fully_integrated", label: "Tracking is fully integrated across systems" },
        ]}
        value={answers["customer_journey_tracking"] || ""}
        onChange={(val) => onAnswer("customer_journey_tracking", val)}
      />

      <MultipleChoiceQuestion
        question="How often are CX metrics reviewed and used in planning?"
        options={[
          { value: "never", label: "Never — we don’t use CX data" },
          { value: "sometimes", label: "Sometimes — only when there’s a problem" },
          { value: "regularly", label: "Regularly — part of review cycles" },
          { value: "always", label: "Always — CX data drives decisions" },
        ]}
        value={answers["cx_metrics_review"] || ""}
        onChange={(val) => onAnswer("cx_metrics_review", val)}
      />

      <MultipleChoiceQuestion
        question="How empowered are employees to resolve customer issues or improve the experience?"
        options={[
          { value: "not_empowered", label: "Not empowered — limited to scripts or escalations" },
          { value: "some_empowerment", label: "Some empowerment with limited flexibility" },
          { value: "well_trained", label: "Well-trained and supported to help customers" },
          { value: "fully_enabled", label: "Fully enabled — encouraged to take initiative" },
        ]}
        value={answers["employee_enablement"] || ""}
        onChange={(val) => onAnswer("employee_enablement", val)}
      />
    </div>
  );
}
