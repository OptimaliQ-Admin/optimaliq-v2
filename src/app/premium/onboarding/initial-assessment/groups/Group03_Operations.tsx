//src/app/tier2/onboarding/Page2_Initial_Assessment/Page1/groups/Group03_Operations.tsx
"use client";

import React from "react";
import MultiSelectQuestion from "@/components/questions/MultiSelectQuestion";
import MultipleChoiceQuestion from "@/components/questions/MultipleChoiceQuestion"; 
import {
  getStringAnswer,
  type AssessmentAnswers,
  type AssessmentAnswerValue,
} from "@/lib/types/AssessmentAnswers";
import DragSortQuestion from "@/components/questions/DragSortQuestion";
import TextAreaQuestion from "@/components/questions/TextAreaQuestion";


export function isGroup03Complete(answers: AssessmentAnswers): boolean {
  return (
    Array.isArray(answers["tech_stack"]) && answers["tech_stack"].length > 0 &&

    Array.isArray(answers["business_priorities"]) && answers["business_priorities"].length > 0 &&

    typeof answers["process_discipline"] === "string" && answers["process_discipline"].trim().length > 0
  );
}


type Props = {
  answers: AssessmentAnswers;
  onAnswer: (key: string, value: AssessmentAnswerValue) => void;
};

export default function Group03_Operations({ answers, onAnswer }: Props) {
  const techSelected = answers["tech_stack"] || [];

  return (
    <div className="space-y-10">

      {/* Question 1: Tech Stack Overview */}
<MultiSelectQuestion
  question="What platforms or tools are central to your operations?"
  description="Select the platforms you actively use (you can add more later)."
  options={[
    { value: "Salesforce", label: "Salesforce (CRM)" },
    { value: "HubSpot", label: "HubSpot (CRM)" },
    { value: "Zoho", label: "Zoho (CRM)" },
    { value: "Mailchimp", label: "Mailchimp (Marketing)" },
    { value: "Klaviyo", label: "Klaviyo (Marketing)" },
    { value: "Emarsys", label: "Emarsys (Marketing)" },
    { value: "Shopify", label: "Shopify (Ecommerce)" },
    { value: "WooCommerce", label: "WooCommerce (Ecommerce)" },
    { value: "Asana", label: "Asana (Project Mgmt)" },
    { value: "Trello", label: "Trello (Project Mgmt)" },
    { value: "NetSuite", label: "NetSuite (Finance/ERP)" },
    { value: "QuickBooks", label: "QuickBooks (Finance)" },
    { value: "GA4", label: "Google Analytics (Analytics)" },
    { value: "Looker", label: "Looker (Analytics)" },
    { value: "Zendesk", label: "Zendesk (Support)" },
    { value: "Intercom", label: "Intercom (Support)" },
    { value: "Other", label: "Other (please describe)" },
  ]}
  selected={Array.isArray(answers["tech_stack"]) ? answers["tech_stack"] : []}
  onChange={(val) => onAnswer("tech_stack", val)}
  maxSelect={10}
/>

{/* Conditionally show "Other" field */}
{Array.isArray(answers["tech_stack"]) && answers["tech_stack"].includes("Other") && (
  <TextAreaQuestion
    question="Please describe the other platforms or tools that are central to your operations"
    placeholder="Describe any additional platforms or tools used..."
    value={getStringAnswer(answers["tech_stack_other"])}
    onChange={(val) => onAnswer("tech_stack_other", val)}
    maxLength={50}
  />
)}

{/* Question 2: Rank Business Priorities */}
<DragSortQuestion
  question="Rank the following priorities from most to least important to your business right now."
  description="Drag to reorder. Top = most important."
  items={
    Array.isArray(answers["business_priorities"])
      ? answers["business_priorities"]
      : ["Growth", "Profitability", "Efficiency", "Innovation", "Brand Equity"]
  }
  onChange={(val) => onAnswer("business_priorities", val)}
/>


      {/* Question 3: Process Maturity */}
      <MultipleChoiceQuestion
        question="Describe your internal process discipline."
        description="Select the statement that best reflects your company today."
        options={[
          { value: "1", label: "Everything is ad hoc" },
          { value: "2", label: "Some structure, but mostly reactive" },
          { value: "3", label: "We have defined processes, but they’re not consistently followed" },
          { value: "4", label: "Most departments follow documented processes" },
          { value: "5", label: "Processes are standardized, automated, and continuously optimized" },
        ]}
        value={getStringAnswer(answers["process_discipline"])}
        onChange={(val) => onAnswer("process_discipline", val)}
      />

    </div>
  );
}
