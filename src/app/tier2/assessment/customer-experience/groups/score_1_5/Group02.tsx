"use client";

import React from "react";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

export function isScore_1_5Group2Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["integration_level"] === "string" &&
    typeof answers["manual_process_impact"] === "string" &&
    Array.isArray(answers["tools_used"]) &&
    answers["tools_used"].length > 0
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score1_5_Step02({ answers, onAnswer }: Props) {
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8">

      {/* Question 4: integration_level */}
      <MultipleChoiceQuestion
        question="How integrated are the systems and tools you use across departments?"
        options={[
          { value: "not_integrated", label: "Not integrated — everything is siloed" },
          { value: "partially_integrated", label: "Some systems talk to each other" },
          { value: "mostly_integrated", label: "Most data flows between systems" },
          { value: "fully_integrated", label: "Fully integrated — we have a centralized view" },
        ]}
        value={answers["integration_level"] || ""}
        onChange={(val) => onAnswer("integration_level", val)}
      />

      {/* Question 5: manual_process_impact */}
      <MultipleChoiceQuestion
        question="How do manual processes impact your team’s productivity?"
        options={[
          { value: "heavily_slowing", label: "They slow us down significantly" },
          { value: "some_impact", label: "They cause some delays or inefficiencies" },
          { value: "minor_impact", label: "Minor inconvenience but manageable" },
          { value: "no_impact", label: "No major impact — most processes are automated" },
        ]}
        value={answers["manual_process_impact"] || ""}
        onChange={(val) => onAnswer("manual_process_impact", val)}
      />

      {/* Question 6: tools_used */}
      <MultiSelectQuestion
        question="Which tools or platforms does your business currently use?"
        options={[
          { value: "email", label: "Email marketing (e.g. Mailchimp)" },
          { value: "crm", label: "CRM (e.g. Salesforce, HubSpot)" },
          { value: "ecommerce", label: "Ecommerce platform (e.g. Shopify)" },
          { value: "erp", label: "ERP or inventory system" },
          { value: "analytics", label: "Analytics or BI tools (e.g. GA4, Looker)" },
          { value: "none", label: "None of the above" },
        ]}
        selected={answers["tools_used"] || []}
        onChange={(val) => onAnswer("tools_used", val)}
        maxSelect={5}
      />
    </div>
  );
}
