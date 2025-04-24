"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion";

export function isScore_5Group1Complete(answers: Record<string, any>): boolean {
  return (
    typeof answers["marketing_influence"] === "string" &&
    Array.isArray(answers["lead_sources"]) &&
    answers["lead_sources"].length > 0 &&
    typeof answers["performance_visibility"] === "string"
  );
}

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};

export default function Score5_Step01({ answers, onAnswer }: Props) {
  const sources = answers["lead_sources"] || [];

  return (
    <div className="space-y-10 p-6 max-w-2xl mx-auto">
      {/* Question 1: marketing_influence */}
      <MultipleChoiceQuestion
        question="How would you describe the influence marketing has on company growth?"
        options={[
          { value: "support_function", label: "Support function with tactical influence" },
          { value: "aligned", label: "Aligned with growth, but not a primary driver" },
          { value: "co_driver", label: "Co-driver alongside sales and product" },
          { value: "primary_growth_engine", label: "Primary engine of predictable, scalable growth" }
        ]}
        value={answers["marketing_influence"] || ""}
        onChange={(val) => onAnswer("marketing_influence", val)}
      />

      {/* Question 2: lead_sources */}
      <MultiSelectQuestion
        question="Which sources currently drive the majority of your qualified leads?"
        options={[
          { value: "inbound_content", label: "Inbound content (SEO, blogs, webinars, etc.)" },
          { value: "paid_ads", label: "Paid ads or demand generation" },
          { value: "product_or_website", label: "Product-led or website conversion" },
          { value: "partner_referrals", label: "Partner referrals or reseller network" },
          { value: "sales_outreach", label: "Sales outbound / prospecting" }
        ]}
        selected={sources}
        onChange={(val) => onAnswer("lead_sources", val)}
        maxSelect={5}
      />

      {/* Question 3: performance_visibility */}
      <MultipleChoiceQuestion
        question="How clearly can you see the performance of each stage in your marketing funnel?"
        options={[
          { value: "high_level", label: "Only at a high level (leads, MQLs)" },
          { value: "some_clarity", label: "We have visibility into mid-funnel conversion" },
          { value: "connected_data", label: "Most funnel stages are tracked and connected" },
          { value: "real_time_attribution", label: "Full-funnel performance with real-time attribution" }
        ]}
        value={answers["performance_visibility"] || ""}
        onChange={(val) => onAnswer("performance_visibility", val)}
      />
    </div>
  );
}
