"use client";

import React from "react";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";

type Props = {
  answers: Record<string, any>;
  onAnswer: (key: string, value: any) => void;
};


export default function Group02_Positioning({ answers, onAnswer }: Props) {
  return (
    <div className="space-y-8">
      {/* Question 4: Differentiator */}
      <TextAreaQuestion
        question="What makes your business hard to compete with?"
        description="What do you do better, faster, or differently than others in your space? Be specific."
        placeholder="E.g., We own a proprietary data model that predicts churn 90 days in advance..."
        value={answers["differentiator"] || ""}
        onChange={(val) => onAnswer("differentiator", val)}
        maxLength={300}
      />

      {/* Question 5: Tech Stack */}
      <MultiSelectQuestion
        question="What platforms or tools are central to your operations?"
        description="Select all that apply across departments."
        options={[
          { value: "salesforce", label: "Salesforce" },
          { value: "hubspot", label: "HubSpot" },
          { value: "zoho", label: "Zoho" },
          { value: "mailchimp", label: "Mailchimp" },
          { value: "klaviyo", label: "Klaviyo" },
          { value: "emarsys", label: "Emarsys" },
          { value: "shopify", label: "Shopify" },
          { value: "woocommerce", label: "WooCommerce" },
          { value: "monday", label: "Monday.com" },
          { value: "asana", label: "Asana" },
          { value: "netsuite", label: "NetSuite" },
          { value: "quickbooks", label: "QuickBooks" },
          { value: "tableau", label: "Tableau" },
          { value: "ga4", label: "Google Analytics 4" },
          { value: "zendesk", label: "Zendesk" },
          { value: "intercom", label: "Intercom" },
          { value: "custom", label: "Other (please describe)" },
        ]}
        selected={answers["tech_stack"] || []}
        onChange={(val) => onAnswer("tech_stack", val)}
        maxSelect={10}
      />

      {/* Question 6: Priorities */}
      <TextAreaQuestion
        question="Rank your top 3 priorities right now."
        description="Growth, Profitability, Efficiency, Innovation, Brand Equity — list in order and explain why."
        placeholder="E.g., 1) Profitability – we're managing cashflow closely; 2) Efficiency – streamlining fulfillment; 3) Innovation – launching a new AI-based product"
        value={answers["priorities_rank"] || ""}
        onChange={(val) => onAnswer("priorities_rank", val)}
        maxLength={300}
      />
    </div>
  );
}
